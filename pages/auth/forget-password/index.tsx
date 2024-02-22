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

const Index = () => {
  const [isPhone, setIsPhone] = useState<boolean>(false);
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

          <Form className="flex w-[85%] flex-col gap-5 md:mt-1 lg:gap-2">
            {isPhone ? (
              <div>
                <section className="-mt-1 flex flex-col items-center">
                  <p className="my-2 flex w-[18rem] flex-col items-start text-start text-sm  font-semibold text-[#3193A9] underline lg:text-[0.8rem] ">
                    <button
                      onClick={() => {
                        setIsPhone(!isPhone);
                      }}
                    >
                      เปลี่ยนไปใช้ email
                    </button>
                    {/* ควร toggle ให้กลับไปใส่ email เหมือนเดิมดีไหม?? */}
                  </p>
                </section>
                <TextField
                  name="phone"
                  type="tel"
                  isRequired
                  className="flex flex-col items-center  "
                >
                  <div className="flex flex-col items-start justify-start gap-2">
                    <Label className="text-xl font-semibold text-[#597E52] md:text-sm">
                      เบอร์โทรศัพท์ :
                    </Label>
                    <Input className="w-[18rem] rounded-lg border-[1px] border-solid border-slate-300 py-2 pl-3 text-sm md:py-1" />
                  </div>
                  <div className="flex w-full justify-center">
                    <FieldError className="mt-2 w-[90%] text-center text-sm text-red-600" />
                  </div>
                </TextField>
              </div>
            ) : (
              <div>
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
                    <Input className="w-[18rem] rounded-lg border-[1px] border-solid border-slate-300 py-2 pl-3 text-sm md:py-1" />
                  </div>
                  <div className="flex w-full justify-center">
                    <FieldError className="mt-2 w-[90%] text-center text-sm text-red-600" />
                  </div>
                </TextField>
                <section className="mt-1 flex flex-col items-center">
                  <p className="my-2 flex w-[18rem] flex-col items-start text-start text-sm  font-semibold text-[#3193A9] underline lg:text-[0.8rem] ">
                    <button
                      onClick={() => {
                        setIsPhone(!isPhone);
                      }}
                    >
                      ลืม E-mail ใช่ไหม? กรอกเบอร์โทรศัทพ์เพื่อค้นหา?
                    </button>
                  </p>
                </section>
              </div>
            )}
            {/* email password */}

            {/* submit ไปแล้ว ขึ้นalertด้วย */}
            <div className="flex justify-center">
              <Button
                type="submit"
                className="mt-5 w-[13rem] rounded-full bg-[#597E52] p-3 text-center 
           text-xl font-semibold text-white drop-shadow-lg duration-300 hover:bg-[#81b077] md:text-base"
              >
                ค้นหา
              </Button>
            </div>
          </Form>
          {/* <div className="col-3 col-s-3 menu flex flex-col">
                <h2>PRSME</h2>
              <ul className='bg-slate-200'>
                <li><a href="">My Showcase</a></li>
                <li><a href="">My Resume</a></li>
                <li><a href="">TU Life</a></li> 
              </ul>
        </div> */}
        </div>
      </div>
    </div>
  );
};

export default Index;
