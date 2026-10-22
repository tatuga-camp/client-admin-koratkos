import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "react-aria-components";
import { setCookie } from "nookies";
import { useRouter } from "next/router";
import { LuEye, LuEyeOff, LuLoader2 } from "react-icons/lu";
import { SignInService } from "../../../services/auth";
import AuthLayout from "../../../layouts/authLayout";

type SignInData = {
  email?: string;
  password?: string;
};

const Index = () => {
  const route = useRouter();

  const [SingInData, setSignInData] = useState<SignInData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChangeSingInForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setSignInData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmitSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);
    try {
      const signIn = await SignInService({
        email: SingInData.email as string,
        password: SingInData.password as string,
      });

      setCookie(null, "access_token", signIn.access_token, {
        maxAge: 2 * 24 * 60 * 60, // Cookie expiration time in seconds (e.g., 30 days)
        path: "/", // Cookie path
      });

      // Keep the button busy until the dashboard has loaded.
      await route.push("/");
    } catch (error: any) {
      setErrorMessage(error?.message ?? "เข้าสู่ระบบไม่สำเร็จ กรุณาลองอีกครั้ง");
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="เข้าสู่ระบบผู้ประเมิน"
      description="ใช้อีเมลและรหัสผ่านที่ลงทะเบียนไว้กับระบบ Korat KOS"
      footer={
        <>
          ยังไม่มีบัญชี?{" "}
          <Link
            href="/auth/sign-up"
            className="font-semibold text-main-color underline-offset-4 hover:underline"
          >
            ลงทะเบียนผู้ประเมิน
          </Link>
        </>
      }
    >
      <Head>
        <title>เข้าสู่ระบบ | Korat KOS</title>
      </Head>

      <Form onSubmit={handleSubmitSignIn} className="flex flex-col gap-5">
        {errorMessage && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {errorMessage}
          </div>
        )}

        <TextField name="email" type="email" isRequired className="flex flex-col gap-1.5">
          <Label className="label">อีเมล</Label>
          <Input
            onChange={handleChangeSingInForm}
            autoComplete="email"
            placeholder="name@example.com"
            className="input"
          />
          <FieldError className="field-error" />
        </TextField>

        <TextField
          name="password"
          type={showPassword ? "text" : "password"}
          isRequired
          className="flex flex-col gap-1.5"
        >
          <div className="flex items-center justify-between gap-2">
            <Label className="label">รหัสผ่าน</Label>
            <Link
              href="/auth/forget-password"
              className="text-sm font-medium text-main-color underline-offset-4 hover:underline"
            >
              ลืมรหัสผ่าน?
            </Link>
          </div>
          <div className="relative">
            <Input
              onChange={handleChangeSingInForm}
              autoComplete="current-password"
              className="input pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
              aria-pressed={showPassword}
              className="btn btn-ghost btn-sm absolute right-1 top-1 w-8 px-0"
            >
              {showPassword ? (
                <LuEyeOff aria-hidden="true" className="size-4" />
              ) : (
                <LuEye aria-hidden="true" className="size-4" />
              )}
            </button>
          </div>
          <FieldError className="field-error" />
        </TextField>

        <Button type="submit" isDisabled={submitting} className="btn btn-primary mt-2 h-11 w-full text-base">
          {submitting && <LuLoader2 aria-hidden="true" className="size-5 motion-safe:animate-spin" />}
          {submitting ? "กำลังเข้าสู่ระบบ" : "เข้าสู่ระบบ"}
        </Button>
      </Form>
    </AuthLayout>
  );
};

export default Index;
