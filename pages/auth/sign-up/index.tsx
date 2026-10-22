import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  FieldError,
  Form,
  Input,
  Label,
  Text,
  TextField,
} from "react-aria-components";
import { SignUpService } from "@/services/auth";
import Head from "next/head";
import Link from "next/link";
import {
  LuCheck,
  LuCheckCircle2,
  LuEye,
  LuEyeOff,
  LuLoader2,
} from "react-icons/lu";
import OrganizationCombox from "../../../components/combox/organizationCombox";
import AmphureComBox from "../../../components/combox/amphureComBox";
import TambonComBox from "../../../components/combox/tambonComBox";
import AuthLayout from "../../../layouts/authLayout";
import { Organization } from "../../../model";

export type SignUpData = {
  firstName?: string;
  lastName?: string;
  organization?: {
    title: string;
    value: string;
  };
  amphure?: {
    name_th: string;
    originalId: number;
  };
  tambon?: {
    name_th: string;
    originalId: number;
  };
  keySignature?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  isConfirmed?: boolean;
};

type FormSectionProps = {
  step: number;
  title: string;
  children: ReactNode;
};

function FormSection({ step, title, children }: FormSectionProps) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-4 flex items-center gap-2.5 text-base font-semibold sm:text-lg">
        <span
          aria-hidden="true"
          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-main-color text-sm text-white"
        >
          {step}
        </span>
        {title}
      </legend>
      <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

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
  const [triggerShowPassword, setTriggerShowPassword] = useState<boolean>(false);
  const [signUpData, setSignUpData] = useState<SignUpData>();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  // The form unmounts on success, so land keyboard and screen-reader users on the result.
  useEffect(() => {
    if (isSignedUp) successHeadingRef.current?.focus();
  }, [isSignedUp]);

  const handleChangeSignUpData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setSignUpData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (signUpData?.password !== signUpData?.confirmPassword) {
      setErrorMessage("รหัสผ่านไม่ตรงกัน");
      return;
    }

    setSubmitting(true);
    try {
      await SignUpService({
        email: signUpData?.email as string,
        firstName: signUpData?.firstName as string,
        lastName: signUpData?.lastName as string,
        organization: signUpData?.organization?.value as Organization,
        phone: signUpData?.phone as string,
        password: signUpData?.password as string,
        createUserKey: signUpData?.keySignature as string,
        amphure: signUpData?.amphure?.name_th as string,
        tambon: signUpData?.tambon?.name_th as string,
      });
      setIsSignedUp(true);
    } catch (error: any) {
      const message = error?.message;
      setErrorMessage(
        (Array.isArray(message) ? message.join(" ") : message) ??
          "ลงทะเบียนไม่สำเร็จ กรุณาลองอีกครั้ง",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const organization = signUpData?.organization?.value;

  return (
    <AuthLayout
      wide
      title="ลงทะเบียนสำหรับผู้ประเมิน"
      description="กรอกข้อมูลให้ครบถ้วน และใช้ Key Signature ที่ได้รับจากผู้ดูแลระบบสำหรับหน่วยงานของท่าน"
      footer={
        isSignedUp ? undefined : (
          <>
            มีบัญชีอยู่แล้ว?{" "}
            <Link
              href="/auth/sign-in"
              className="font-semibold text-main-color underline-offset-4 hover:underline"
            >
              เข้าสู่ระบบ
            </Link>
          </>
        )
      }
    >
      <Head>
        <title>ลงทะเบียน | Korat KOS</title>
      </Head>

      <div role="status">
        {isSignedUp && (
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
                ลงทะเบียนสำเร็จ
              </h2>
              <p className="mt-1 text-super-main-color/80">
                บัญชีของท่านพร้อมใช้งานแล้ว เข้าสู่ระบบด้วยอีเมล{" "}
                <span className="break-all font-medium text-super-main-color">
                  {signUpData?.email}
                </span>{" "}
                และรหัสผ่านที่ตั้งไว้
              </p>
            </div>
          </div>
        )}
      </div>

      {isSignedUp ? (
        <Link
          href="/auth/sign-in"
          className="btn btn-primary mt-6 h-11 w-full text-base"
        >
          เข้าสู่ระบบ
        </Link>
      ) : (
        <Form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <FormSection step={1} title="ข้อมูลส่วนตัว">
            <TextField name="firstName" type="text" className="flex flex-col gap-1.5">
              <Label className="label">ชื่อจริง</Label>
              <Input
                onChange={handleChangeSignUpData}
                autoComplete="given-name"
                className="input"
              />
              <FieldError className="field-error" />
            </TextField>

            <TextField name="lastName" type="text" className="flex flex-col gap-1.5">
              <Label className="label">นามสกุล</Label>
              <Input
                onChange={handleChangeSignUpData}
                autoComplete="family-name"
                className="input"
              />
              <FieldError className="field-error" />
            </TextField>

            <TextField name="phone" type="tel" className="flex flex-col gap-1.5">
              <Label className="label">เบอร์มือถือ</Label>
              <Input
                minLength={10}
                maxLength={10}
                onChange={handleChangeSignUpData}
                autoComplete="tel"
                placeholder="0812345678"
                className="input"
              />
              <Text slot="description" className="text-sm text-super-main-color/80">
                ตัวเลข 10 หลัก ไม่ต้องใส่ขีด
              </Text>
              <FieldError className="field-error" />
            </TextField>
          </FormSection>

          <hr className="border-third-color" />

          <FormSection step={2} title="หน่วยงาน">
            <div className="sm:col-span-2">
              <OrganizationCombox
                setSignUpData={setSignUpData}
                signUpData={signUpData}
              />
            </div>
            {(organization === "argiculturalAmphure" ||
              organization === "argiculturalTambon") && (
              <AmphureComBox
                setSignUpData={setSignUpData}
                signUpData={signUpData}
              />
            )}
            {organization === "argiculturalTambon" && (
              <TambonComBox
                setSignUpData={setSignUpData}
                signUpData={signUpData}
              />
            )}

            <TextField
              name="keySignature"
              type="text"
              className="flex flex-col gap-1.5 sm:col-span-2"
            >
              <Label className="label">Key Signature</Label>
              <Input
                onChange={handleChangeSignUpData}
                autoComplete="off"
                spellCheck={false}
                className="input"
              />
              <Text slot="description" className="text-sm text-super-main-color/80">
                รหัสที่ได้รับจากผู้ดูแลระบบ ต้องตรงกับหน่วยงานที่เลือก
              </Text>
              <FieldError className="field-error" />
            </TextField>
          </FormSection>

          <hr className="border-third-color" />

          <FormSection step={3} title="บัญชีผู้ใช้">
            <TextField
              name="email"
              type="email"
              isRequired
              className="flex flex-col gap-1.5 sm:col-span-2"
            >
              <Label className="label">อีเมล</Label>
              <Input
                onChange={handleChangeSignUpData}
                autoComplete="email"
                placeholder="name@example.com"
                className="input"
              />
              <FieldError className="field-error" />
            </TextField>

            <TextField
              name="password"
              type={triggerShowPassword ? "text" : "password"}
              isRequired
              minLength={8}
              className="flex flex-col gap-1.5"
            >
              <Label className="label">รหัสผ่าน</Label>
              <div className="relative">
                <Input
                  onChange={handleChangeSignUpData}
                  autoComplete="new-password"
                  className="input pr-11"
                />
                <PasswordToggle
                  shown={triggerShowPassword}
                  onToggle={() => setTriggerShowPassword((prev) => !prev)}
                />
              </div>
              <Text slot="description" className="text-sm text-super-main-color/80">
                อย่างน้อย 8 ตัวอักษร
              </Text>
              <FieldError className="field-error" />
            </TextField>

            <TextField
              name="confirmPassword"
              type={triggerShowPassword ? "text" : "password"}
              isRequired
              minLength={8}
              validate={(value) =>
                value && value !== signUpData?.password
                  ? "รหัสผ่านไม่ตรงกัน"
                  : null
              }
              className="flex flex-col gap-1.5"
            >
              <Label className="label">ยืนยันรหัสผ่าน</Label>
              <div className="relative">
                <Input
                  onChange={handleChangeSignUpData}
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
          </FormSection>

          <div className="flex flex-col gap-4">
            <Checkbox
              isSelected={signUpData?.isConfirmed ?? false}
              onChange={(isSelected) =>
                setSignUpData((prev) => {
                  return { ...prev, isConfirmed: isSelected };
                })
              }
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-third-color bg-white px-4 py-3 text-sm font-medium"
            >
              {({ isSelected, isFocusVisible }) => (
                <>
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border-2 transition ${
                      isSelected
                        ? "border-main-color bg-main-color text-white"
                        : "border-super-main-color/60 bg-white"
                    } ${isFocusVisible ? "ring-2 ring-main-color ring-offset-2" : ""}`}
                  >
                    {isSelected && <LuCheck className="size-3.5" strokeWidth={3} />}
                  </span>
                  ฉันยืนยันว่าข้อมูลถูกต้อง
                </>
              )}
            </Checkbox>

            {errorMessage && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              >
                {errorMessage}
              </div>
            )}

            <Button
              type="submit"
              isDisabled={!signUpData?.isConfirmed || submitting}
              aria-describedby={signUpData?.isConfirmed ? undefined : "sign-up-confirm-hint"}
              className="btn btn-primary h-11 w-full text-base"
            >
              {submitting && (
                <LuLoader2 aria-hidden="true" className="size-5 motion-safe:animate-spin" />
              )}
              {submitting ? "กำลังลงทะเบียน" : "ลงทะเบียน"}
            </Button>
            {!signUpData?.isConfirmed && (
              <p
                id="sign-up-confirm-hint"
                className="-mt-2 text-center text-sm text-super-main-color/80"
              >
                กรุณาติ๊กยืนยันว่าข้อมูลถูกต้องก่อนลงทะเบียน
              </p>
            )}
          </div>
        </Form>
      )}
    </AuthLayout>
  );
};

export default Index;
