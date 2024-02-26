import User from "@/components/svgs/User";
import { SignInService } from "@/services/auth";
import Link from "next/link";
import React from "react";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "react-aria-components";
import Swal from "sweetalert2";
import { setCookie } from "nookies";
import { useRouter } from "next/router";

type SignInData = {
  email?: string;
  password?: string;
};

const Index = () => {
  return (
    <div className=" flex min-h-screen font-Anuphan">
      <Head>
        <title>เข้าสู่ระบบ</title>
      </Head>
      {/* Left */}

      <HomepageSidebar />

      {/* Right */}
      <div className="flex h-full w-full flex-col items-center lg:mt-6 lg:justify-center">
        <div className="my-8 flex w-full flex-col items-center justify-center  ">
          <section className="mt-7 lg:mt-0">
            <h1
              className="\ w-[15.625rem] rounded-full bg-[#C6A969] p-3 px-[3rem] text-center
              text-xl font-semibold text-white md:w-[18rem] md:px-[2rem] lg:text-base"
            >
              เข้าสู่ระบบสำหรับผู้ประเมิน
            </h1>
          </section>

          <div className="my-10 w-[7rem] lg:my-4 ">
            <User />
          </div>

          <Form
            onSubmit={handleSubmitSignIn}
            className="flex w-[85%] flex-col gap-5 md:mt-1 lg:gap-2"
          >
            {/* email password */}
            <TextField
              name="email"
              type="email"
              isRequired
              className="flex flex-col items-center  "
            >
              <div className="flex flex-col items-start justify-start gap-2">
                <Label className="text-xl font-semibold text-[#597E52] md:text-sm">
                  E-mail :
                </Label>
                <Input
                  onChange={handleChangeSingInForm}
                  className=" w-[18rem] rounded-lg border-[1px] border-solid border-slate-300 px-3 py-2 text-sm md:py-1"
                />
              </div>
              <div className="flex w-full justify-center">
                <FieldError className="mt-2 w-[90%] text-center text-sm text-red-600" />
              </div>
            </TextField>

            <TextField
              name="password"
              type="password"
              isRequired
              className="flex flex-col items-center "
            >
              <div className="flex flex-col items-start justify-start gap-2">
                <Label className="text-xl font-semibold text-[#597E52] md:text-sm">
                  รหัสผ่าน :
                </Label>
                <Input
                  onChange={handleChangeSingInForm}
                  className=" w-[18rem] rounded-lg border-[1px] border-solid border-slate-300 px-3 py-2 text-sm md:py-1"
                />
              </div>
              <div className="flex w-full justify-center">
                <FieldError className="mt-2 w-[90%] text-center text-sm text-red-600" />
              </div>
            </TextField>

            <Button
              type="submit"
              className="mt-5 w-60 rounded-full bg-[#597E52] p-1 py-2 text-center 
              text-xl font-semibold text-white drop-shadow-lg duration-300 hover:bg-[#81b077] md:text-base"
            >
              ลงทะเบียน
            </Button>
          </Form>
          <section className="mt-2 flex w-60 items-center  justify-between">
            <Link
              className="text-sm font-medium text-blue-500"
              href="/auth/forget-password"
            >
              <button className="underline">ลืมรหัสผ่าน?</button>
            </Link>
            <Link
              className="text-sm font-medium text-blue-500"
              href="/auth/sign-up"
            >
              <button className="underline">ไม่มีบัญชี?</button>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Index;
