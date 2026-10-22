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
import { LuLoader2, LuMailCheck } from "react-icons/lu";
import { ForgetPasswordService } from "../../../services/auth";
import AuthLayout from "../../../layouts/authLayout";

const RESEND_WAIT_SECONDS = 20;

const Index = () => {
  const [email, setEmail] = useState<string>("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [secound, setSecound] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sendCount, setSendCount] = useState(0);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  // The submit button disables after sending, so land keyboard and screen-reader users on the result.
  useEffect(() => {
    if (sendCount > 0) successHeadingRef.current?.focus();
  }, [sendCount]);

  // Counts down the resend cooldown one second at a time.
  useEffect(() => {
    if (secound <= 0) return;
    const timer = setTimeout(() => setSecound((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [secound]);

  const handleSummitForgetPassword = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);
    try {
      await ForgetPasswordService({ email });
      setSentTo(email);
      setSecound(RESEND_WAIT_SECONDS);
      setSendCount((prev) => prev + 1);
    } catch (error: any) {
      const message = error?.message;
      setErrorMessage(
        (Array.isArray(message) ? message.join(" ") : message) ??
          "ส่งลิงก์ไม่สำเร็จ กรุณาลองอีกครั้ง",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const wait = secound > 0;

  return (
    <AuthLayout
      title="ลืมรหัสผ่าน"
      description="กรอกอีเมลที่ใช้ลงทะเบียน ระบบจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปให้ทางอีเมล"
      footer={
        <>
          จำรหัสผ่านได้แล้ว?{" "}
          <Link
            href="/auth/sign-in"
            className="font-semibold text-main-color underline-offset-4 hover:underline"
          >
            เข้าสู่ระบบ
          </Link>
        </>
      }
    >
      <Head>
        <title>ลืมรหัสผ่าน | Korat KOS</title>
      </Head>

      <div role="status">
        {sentTo && (
          <div className="mb-5 flex gap-3 rounded-lg border border-main-color/30 bg-main-color/10 px-4 py-3 text-sm">
            <LuMailCheck
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-main-color"
            />
            <div className="min-w-0">
              <h2
                ref={successHeadingRef}
                tabIndex={-1}
                className="font-semibold focus:outline-none"
              >
                ส่งลิงก์ตั้งรหัสผ่านใหม่ไปที่อีเมลแล้ว
              </h2>
              <p className="mt-1 text-super-main-color/80">
                กรุณาตรวจสอบกล่องจดหมายของ{" "}
                <span className="break-all font-medium text-super-main-color">
                  {sentTo}
                </span>{" "}
                หากไม่พบ ให้ดูในโฟลเดอร์จดหมายขยะ
              </p>
            </div>
          </div>
        )}
      </div>

      <Form onSubmit={handleSummitForgetPassword} className="flex flex-col gap-5">
        {errorMessage && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {errorMessage}
          </div>
        )}

        <TextField
          name="email"
          type="email"
          isRequired
          value={email}
          onChange={(e) => setEmail(e)}
          className="flex flex-col gap-1.5"
        >
          <Label className="label">อีเมล</Label>
          <Input
            autoComplete="email"
            placeholder="name@example.com"
            className="input"
          />
          <FieldError className="field-error" />
        </TextField>

        <Button
          type="submit"
          isDisabled={submitting || wait}
          className="btn btn-primary mt-2 h-11 w-full text-base"
        >
          {submitting && (
            <LuLoader2 aria-hidden="true" className="size-5 motion-safe:animate-spin" />
          )}
          {submitting
            ? "กำลังส่งลิงก์"
            : wait
              ? `ส่งอีกครั้งได้ใน ${secound} วินาที`
              : sentTo
                ? "ส่งลิงก์อีกครั้ง"
                : "ส่งลิงก์ตั้งรหัสผ่านใหม่"}
        </Button>
      </Form>
    </AuthLayout>
  );
};

export default Index;
