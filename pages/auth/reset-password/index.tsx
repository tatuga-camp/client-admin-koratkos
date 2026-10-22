import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "react-aria-components";
import { LuCheckCircle2, LuEye, LuEyeOff, LuLoader2 } from "react-icons/lu";
import { ResetPasswordService } from "../../../services/auth";
import { useRouter } from "next/router";
import AuthLayout from "../../../layouts/authLayout";

type PasswordToggleProps = {
  shown: boolean;
  onToggle: () => void;
};

function PasswordToggle({ shown, onToggle }: PasswordToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={shown ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
      aria-pressed={shown}
      className="btn btn-ghost btn-sm absolute right-1 top-1 w-8 px-0"
    >
      {shown ? (
        <LuEyeOff aria-hidden="true" className="size-4" />
      ) : (
        <LuEye aria-hidden="true" className="size-4" />
      )}
    </button>
  );
}

const Index = () => {
  const [resetPasswordData, setResetPasswordData] = useState<{
    password?: string;
    confirmPassword?: string;
  }>();
  const [triggerShowPassword, setTriggerShowPassword] =
    useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isReset, setIsReset] = useState(false);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const router = useRouter();

  // The form unmounts on success, so land keyboard and screen-reader users on the result.
  useEffect(() => {
    if (isReset) successHeadingRef.current?.focus();
  }, [isReset]);

  const handleSummitResetPasswordPassword = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setErrorMessage(null);
    if (resetPasswordData?.password !== resetPasswordData?.confirmPassword) {
      setErrorMessage("รหัสผ่านไม่ตรงกัน");
      return;
    }
    setSubmitting(true);
    try {
      await ResetPasswordService({
        newPassword: resetPasswordData?.password as string,
        passwordResetToken: router.query.passwordResetToken as string,
      });
      setIsReset(true);
    } catch (error: any) {
      const message = error?.message;
      setErrorMessage(
        (Array.isArray(message) ? message.join(" ") : message) ??
          "ตั้งรหัสผ่านใหม่ไม่สำเร็จ กรุณาลองอีกครั้ง",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangeResetPasswordData = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setResetPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <AuthLayout
      title="ตั้งรหัสผ่านใหม่"
      description="กำหนดรหัสผ่านใหม่สำหรับบัญชีของท่าน อย่างน้อย 8 ตัวอักษร"
    >
      <Head>
        <title>ตั้งรหัสผ่านใหม่ | Korat KOS</title>
      </Head>

      <div role="status">
        {isReset && (
          <div className="flex gap-3 rounded-lg border border-main-color/30 bg-main-color/10 px-4 py-3 text-sm">
            <LuCheckCircle2
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-main-color"
            />
            <div className="min-w-0">
              <h2
                ref={successHeadingRef}
                tabIndex={-1}
                className="font-semibold focus:outline-none"
              >
                ตั้งรหัสผ่านใหม่เรียบร้อยแล้ว
              </h2>
              <p className="mt-1 text-super-main-color/80">
                ใช้รหัสผ่านใหม่เพื่อเข้าสู่ระบบได้ทันที
              </p>
            </div>
          </div>
        )}
      </div>

      {isReset ? (
        <Link
          href="/auth/sign-in"
          className="btn btn-primary mt-6 h-11 w-full text-base"
        >
          เข้าสู่ระบบ
        </Link>
      ) : (
        <Form
          onSubmit={handleSummitResetPasswordPassword}
          className="flex flex-col gap-5"
        >
          {errorMessage && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {errorMessage}
            </div>
          )}

          <TextField
            name="password"
            type={triggerShowPassword ? "text" : "password"}
            isRequired
            minLength={8}
            className="flex flex-col gap-1.5"
          >
            <Label className="label">รหัสผ่านใหม่</Label>
            <div className="relative">
              <Input
                onChange={handleChangeResetPasswordData}
                autoComplete="new-password"
                className="input pr-11"
              />
              <PasswordToggle
                shown={triggerShowPassword}
                onToggle={() => setTriggerShowPassword((prev) => !prev)}
              />
            </div>
            <FieldError className="field-error" />
          </TextField>

          <TextField
            name="confirmPassword"
            type={triggerShowPassword ? "text" : "password"}
            isRequired
            minLength={8}
            validate={(value) =>
              value && value !== resetPasswordData?.password
                ? "รหัสผ่านไม่ตรงกัน"
                : null
            }
            className="flex flex-col gap-1.5"
          >
            <Label className="label">ยืนยันรหัสผ่านใหม่</Label>
            <div className="relative">
              <Input
                onChange={handleChangeResetPasswordData}
                autoComplete="new-password"
                className="input pr-11"
              />
              <PasswordToggle
                shown={triggerShowPassword}
                onToggle={() => setTriggerShowPassword((prev) => !prev)}
              />
            </div>
            <FieldError className="field-error" />
          </TextField>

          <Button
            type="submit"
            isDisabled={submitting}
            className="btn btn-primary mt-2 h-11 w-full text-base"
          >
            {submitting && (
              <LuLoader2 aria-hidden="true" className="size-5 motion-safe:animate-spin" />
            )}
            {submitting ? "กำลังบันทึกรหัสผ่าน" : "ตั้งรหัสผ่านใหม่"}
          </Button>
        </Form>
      )}
    </AuthLayout>
  );
};

export default Index;
