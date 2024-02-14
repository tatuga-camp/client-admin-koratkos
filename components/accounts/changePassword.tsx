import React, { useState } from "react";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "react-aria-components";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Swal from "sweetalert2";
import { UpdatePasswordUserService } from "../../services/user";

type ChangePasswordProps = {
  setTriggerChangePassword: React.Dispatch<React.SetStateAction<boolean>>;
};
function ChangePassword({ setTriggerChangePassword }: ChangePasswordProps) {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChangePasswordData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSummitUpdatePassword = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      Swal.fire({
        title: "กำลังเปลี่ยนรหัสผ่าน",
        didOpen: () => {
          Swal.showLoading();
        },
      });

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
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.message,
      });
    }
  };
  return (
    <div
      className="fixed bottom-0 left-0 right-0 top-0 z-50 m-auto
    flex h-screen w-screen items-center justify-center"
    >
      <Form
        onSubmit={handleSummitUpdatePassword}
        className="relative flex h-max w-96 flex-col items-center justify-center gap-3 rounded-lg bg-[#C6A969] p-5"
      >
        <button
          onClick={() => {
            document.body.style.overflow = "auto";
            setTriggerChangePassword(() => false);
          }}
          className="absolute right-4 top-4 m-auto flex items-center justify-center text-2xl text-white"
        >
          <IoIosCloseCircleOutline />
        </button>
        <Label className="text-xl font-bold text-fourth-color">
          เปลี่ยนรหัสผ่าน
        </Label>
        <TextField isRequired className="flex w-80 flex-col gap-2">
          <Label className="text-lg font-semibold text-super-main-color">
            รหัสผ่านเดิม
          </Label>
          <Input
            required
            type="password"
            name="currentPassword"
            onChange={handleChangePasswordData}
            value={passwordData.currentPassword}
            className="h-10 w-full rounded-lg p-3 ring-1 ring-super-main-color"
          />
          <FieldError className="text-xs text-white" />
        </TextField>
        <TextField isRequired className="flex w-80 flex-col gap-2">
          <Label className="text-lg font-semibold text-super-main-color">
            รหัสผ่านใหม่
          </Label>
          <Input
            required
            minLength={8}
            maxLength={16}
            name="newPassword"
            onChange={handleChangePasswordData}
            value={passwordData.newPassword}
            type="password"
            className="h-10 w-full rounded-lg p-3 ring-1 ring-super-main-color"
          />
          <FieldError className="text-xs text-white" />
        </TextField>
        <TextField isRequired className="flex w-80 flex-col gap-2">
          <Label className="text-lg font-semibold text-super-main-color">
            ยืนยันรหัสผ่านเใหม่
          </Label>
          <Input
            minLength={8}
            maxLength={16}
            required
            name="confirmNewPassword"
            onChange={handleChangePasswordData}
            value={passwordData.confirmNewPassword}
            type="password"
            className="h-10 w-full rounded-lg p-3 ring-1 ring-super-main-color"
          />
          <FieldError className="line-clamp-2 text-xs text-white" />
        </TextField>
        <Button
          type="submit"
          className="w-40 rounded-lg bg-super-main-color py-2 text-lg font-semibold
         text-white drop-shadow-lg transition duration-100 hover:scale-105 active:scale-110"
        >
          ยืนยัน
        </Button>
      </Form>
      <footer
        onClick={() => {
          document.body.style.overflow = "auto";
          setTriggerChangePassword(() => false);
        }}
        className=" fixed bottom-0 left-0 right-0 top-0 -z-10 m-auto h-screen w-screen bg-white/20 backdrop-blur-sm "
      ></footer>
    </div>
  );
}

export default ChangePassword;
