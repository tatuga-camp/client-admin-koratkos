import Sidebar from "@/components/sidebars/homepageSidebar";
import User from "@/components/svgs/User";
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
import Swal from "sweetalert2";
import {
  ForgetPasswordService,
  ResetPasswordService,
} from "../../../services/auth";
import { useRouter } from "next/router";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Index = () => {
  const [resetPasswordData, setResetPasswordData] = useState<{
    password?: string;
    confirmPassword?: string;
  }>();
  const [triggerShowPassword, setTriggerShowPassword] =
    useState<boolean>(false);
  const router = useRouter();
  const handleSummitResetPasswordPassword = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (resetPasswordData?.password !== resetPasswordData?.confirmPassword) {
        throw new Error("รหัสผ่านไม่ตรงกัน");
      }
      Swal.fire({
        title: "กรุณารอสักครู่",
        html: "กำลังดำเนินการ...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      await ResetPasswordService({
        newPassword: resetPasswordData?.password as string,
        passwordResetToken: router.query.passwordResetToken as string,
      });
      router.push({
        pathname: "/",
      });
      Swal.fire({
        icon: "success",
        title: "สำเร็จ",
        text: "รหัสผ่านของท่านได้รับการเปลี่ยนแล้ว",
      });
    } catch (error: any) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.message,
      });
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
    <div className="flex min-h-screen w-screen font-Anuphan">
      {/* Left */}
      <Sidebar />
      {/* Right */}
      <div className="flex h-full w-full flex-col items-center lg:mt-6 lg:justify-center">
        <div className="my-8 flex w-full flex-col items-center justify-center  ">
          <section className="mt-7 lg:mt-0">
            <h1
              className="\ w-[15.625rem] rounded-full bg-[#3193A9] p-3 px-[3rem] text-center
           text-xl font-semibold text-white md:w-[18rem] md:px-[2rem] lg:text-base"
            >
              ตั้งรหัสผ่านใหม่
            </h1>
          </section>

          <div className="my-10 w-[7rem] lg:my-6 ">
            <User />
          </div>

          <Form
            onSubmit={handleSummitResetPasswordPassword}
            className="flex w-[85%] flex-col items-center gap-5 md:mt-1 lg:gap-2"
          >
            <TextField
              type="password"
              isRequired
              className="relative flex w-max flex-col items-center   "
            >
              <div className="flex flex-col items-start justify-start gap-2">
                <Label className="text-xl font-semibold text-[#597E52] md:text-sm">
                  รหัสผ่านใหม่ :
                </Label>
                <Input
                  name="password"
                  value={resetPasswordData?.password}
                  onChange={handleChangeResetPasswordData}
                  type={triggerShowPassword ? "text" : "password"}
                  className="h-10 w-[18rem] rounded-lg border-[1px] border-solid  py-2 pl-3 text-sm md:py-1"
                />
                {triggerShowPassword ? (
                  <FaRegEye
                    className="absolute bottom-0 right-5 top-7 m-auto"
                    onClick={() => setTriggerShowPassword((prev) => !prev)}
                  />
                ) : (
                  <FaRegEyeSlash
                    className="absolute bottom-0 right-5 top-7 m-auto"
                    onClick={() => setTriggerShowPassword((prev) => !prev)}
                  />
                )}
              </div>
              <div className="flex w-full justify-center">
                <FieldError className="mt-2 w-[90%] text-center text-sm text-red-600" />
              </div>
            </TextField>

            <TextField
              type="password"
              isRequired
              className="relative flex w-max flex-col items-center   "
            >
              <div className="flex flex-col items-start justify-start gap-2">
                <Label className="text-xl font-semibold text-[#597E52] md:text-sm">
                  กรอกรหัสผ่านอีกครั้ง :
                </Label>
                <Input
                  name="confirmPassword"
                  type={triggerShowPassword ? "text" : "password"}
                  value={resetPasswordData?.confirmPassword}
                  onChange={handleChangeResetPasswordData}
                  className="h-10 w-[18rem] rounded-lg border-[1px] border-solid border-slate-300 py-2 pl-3 text-sm md:py-1"
                />
                {triggerShowPassword ? (
                  <FaRegEye
                    className="absolute bottom-0 right-5 top-7 m-auto"
                    onClick={() => setTriggerShowPassword((prev) => !prev)}
                  />
                ) : (
                  <FaRegEyeSlash
                    className="absolute bottom-0 right-5 top-7 m-auto"
                    onClick={() => setTriggerShowPassword((prev) => !prev)}
                  />
                )}
              </div>
              <div className="flex w-full justify-center">
                <FieldError className="mt-2 w-[90%] text-center text-sm text-red-600" />
              </div>
            </TextField>

            <div className="flex justify-center">
              <Button
                type="submit"
                className="mt-5 w-[13rem] rounded-full bg-[#597E52] p-3 text-center 
           text-xl font-semibold text-white drop-shadow-lg duration-300 hover:bg-[#81b077] md:text-base"
              >
                ยืนยัน
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Index;
