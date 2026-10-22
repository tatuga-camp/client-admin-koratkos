import React, { useState } from "react";
import {
  FieldError,
  Form,
  Input,
  Label,
  Text,
  TextField,
} from "react-aria-components";
import { LuEye, LuEyeOff, LuLoader2 } from "react-icons/lu";
import Swal from "sweetalert2";
import { UpdatePasswordUserService } from "../../services/user";
import Modal from "../ui/Modal";

type ChangePasswordProps = {
  setTriggerChangePassword: React.Dispatch<React.SetStateAction<boolean>>;
};

type PasswordFieldProps = {
  name: "currentPassword" | "newPassword" | "confirmNewPassword";
  label: string;
  value: string;
  autoComplete: "current-password" | "new-password";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  description?: string;
  minLength?: number;
  maxLength?: number;
  validate?: (value: string) => string | null;
  autoFocus?: boolean;
};

function PasswordField({
  name,
  label,
  value,
  autoComplete,
  onChange,
  description,
  minLength,
  maxLength,
  validate,
  autoFocus,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <TextField
      name={name}
      type={showPassword ? "text" : "password"}
      isRequired
      validate={validate}
      className="flex flex-col gap-1.5"
    >
      <Label className="label">{label}</Label>
      <div className="relative">
        <Input
          onChange={onChange}
          value={value}
          minLength={minLength}
          maxLength={maxLength}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          className="input pr-11"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? `ซ่อน${label}` : `แสดง${label}`}
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
      {description && (
        <Text slot="description" className="text-xs text-super-main-color/80">
          {description}
        </Text>
      )}
      <FieldError className="field-error" />
    </TextField>
  );
}

function ChangePassword({ setTriggerChangePassword }: ChangePasswordProps) {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChangePasswordData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    if (submitting) return;
    setTriggerChangePassword(() => false);
  };

  const handleSummitUpdatePassword = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setErrorMessage(null);
      setSubmitting(true);

      if (passwordData.newPassword !== passwordData.confirmNewPassword) {
        throw new Error("รหัสผ่านใหม่ไม่ตรงกัน");
      }
      const changePassword = await UpdatePasswordUserService({
        password: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.confirmNewPassword,
      });
      setTriggerChangePassword(() => false);
      Swal.fire({
        icon: "success",
        title: "เปลี่ยนรหัสผ่านสำเร็จ",
      });
    } catch (error: any) {
      // Shown inside the dialog: a Swal popup would count as an outside
      // click and close the dialog, losing what was typed.
      setErrorMessage(error?.message ?? "เปลี่ยนรหัสผ่านไม่สำเร็จ กรุณาลองอีกครั้ง");
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open
      onClose={handleClose}
      size="sm"
      title="เปลี่ยนรหัสผ่าน"
      description="กรอกรหัสผ่านเดิม แล้วตั้งรหัสผ่านใหม่ 8–16 ตัวอักษร"
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="btn btn-secondary"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            form="change-password-form"
            disabled={submitting}
            className="btn btn-primary"
          >
            {submitting && (
              <LuLoader2 aria-hidden="true" className="size-4 motion-safe:animate-spin" />
            )}
            {submitting ? "กำลังเปลี่ยนรหัสผ่าน" : "เปลี่ยนรหัสผ่าน"}
          </button>
        </>
      }
    >
      <Form
        id="change-password-form"
        onSubmit={handleSummitUpdatePassword}
        className="flex flex-col gap-4"
      >
        {errorMessage && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {errorMessage}
          </div>
        )}
        <PasswordField
          name="currentPassword"
          label="รหัสผ่านเดิม"
          value={passwordData.currentPassword}
          onChange={handleChangePasswordData}
          autoComplete="current-password"
          autoFocus
        />
        <PasswordField
          name="newPassword"
          label="รหัสผ่านใหม่"
          value={passwordData.newPassword}
          onChange={handleChangePasswordData}
          autoComplete="new-password"
          minLength={8}
          maxLength={16}
          description="8–16 ตัวอักษร"
        />
        <PasswordField
          name="confirmNewPassword"
          label="ยืนยันรหัสผ่านใหม่"
          value={passwordData.confirmNewPassword}
          onChange={handleChangePasswordData}
          autoComplete="new-password"
          minLength={8}
          maxLength={16}
          validate={(value) =>
            value && value !== passwordData.newPassword
              ? "รหัสผ่านใหม่ไม่ตรงกัน"
              : null
          }
        />
      </Form>
    </Modal>
  );
}

export default ChangePassword;
