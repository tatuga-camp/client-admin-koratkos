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
import { ForgetPasswordService } from "../../../services/auth";

const Index = () => {
  const [email, setEmail] = useState<string>("");
  const [wait, setWait] = useState(false);
  const [secound, setSecound] = useState(0);

  const handleSummitForgetPassword = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      Swal.fire({
        title: "กรุณารอสักครู่",
        html: "กำลังดำเนินการ...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const sendEmail = await ForgetPasswordService({ email });
      setWait(() => true);
      hanldeTimmingWait();
      Swal.fire({
        icon: "success",
        title: "สำเร็จ",
        text: "กรุณาตรวจสอบอีเมลล์ของท่าน",
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

  const hanldeTimmingWait = () => {
    setSecound(20); // Set the initial value of the countdown timer
    setWait(() => true);
    const timer = setInterval(() => {
      setSecound((prevCount) => prevCount - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      if (secound === 0) {
        setWait(() => false);
      }
      setWait(false);
      // Perform your action here after the wait duration
      // For example, you can set the `wait` state to false to indicate that the wait is over
    }, 20000); // Wait for 10 seconds (1000 milliseconds * 10)

    // Cleanup function
    return () => {
      clearInterval(timer);
    };
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
              ลืมรหัสผ่าน
            </h1>
          </section>

          <div className="my-10 w-[7rem] lg:my-6 ">
            <User />
          </div>

          <Form
            onSubmit={handleSummitForgetPassword}
            className="flex w-[85%] flex-col gap-5 md:mt-1 lg:gap-2"
          >
            <div>
              <TextField
                name="email"
                type="email"
                isRequired
                value={email}
                onChange={(e) => setEmail(e)}
                className="flex flex-col items-center  "
              >
                <div className="flex flex-col items-start justify-start gap-2">
                  <Label className="text-xl font-semibold text-[#597E52] md:text-sm">
                    E-mail :
                  </Label>
                  <Input
                    type="email"
                    className="h-10 w-[18rem] rounded-lg border-[1px] border-solid border-slate-300 py-2 pl-3 text-sm md:py-1"
                  />
                </div>
                <div className="flex w-full justify-center">
                  <FieldError className="mt-2 w-[90%] text-center text-sm text-red-600" />
                </div>
              </TextField>
            </div>

            <div className="flex justify-center">
              {wait ? (
                <div
                  className="mt-5 w-60 rounded-full bg-gray-400 p-3 text-center 
           text-xl font-semibold text-white  md:text-base"
                >
                  โปรดตรวจสอบอีเมลของคุณ {secound}
                </div>
              ) : (
                <Button
                  type="submit"
                  className="mt-5 w-[13rem] rounded-full bg-[#597E52] p-3 text-center 
           text-xl font-semibold text-white drop-shadow-lg duration-300 hover:bg-[#81b077] md:text-base"
                >
                  ส่งอีเมลล์
                </Button>
              )}
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Index;
