import React, { useState } from "react";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "react-aria-components";
import Checkbox from "@mui/material/Checkbox";
import Swal from "sweetalert2";
import { SignUpService } from "@/services/auth";
import { error } from "console";
import { useRouter } from "next/router";
import Head from "next/head";
import HomepageSidebar from "../../../components/sidebars/homepageSidebar";
import OrganizationCombox from "../../../components/combox/organizationCombox";
import AmphureComBox from "../../../components/combox/amphureComBox";
import TambonComBox from "../../../components/combox/tambonComBox";
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

const Index = () => {
  const route = useRouter();

  const [signUpData, setSignUpData] = useState<SignUpData>();

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
    try {
      e.preventDefault();

      if (signUpData?.password !== signUpData?.confirmPassword) {
        throw new Error("รหัสผ่านไม่ตรงกัน");
      }
      Swal.fire({
        title: "กำลังบันทึกข้อมูล",
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const update = await SignUpService({
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

      route.push({ pathname: "/auth/sign-in" });

      Swal.fire({
        title: "บันทึกข้อมูลสำเร็จ",
        icon: "success",
        confirmButtonText: "ตกลง",
      });
      //signup เสร็จให้เด้งไปหน้า sign-in
    } catch (error: any) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: error.message,
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };

  return (
    <div className="flex h-full  font-Anuphan">
      <Head>
        <title>ลงทะเบียน</title>
      </Head>
      {/* Left */}
      <HomepageSidebar />
      {/* right */}
      <div className="m-0 flex w-full flex-col items-center justify-center py-5 ">
        <section>
          <h1 className="w-[15.625rem] rounded-full bg-[#597E52] p-3 px-[3rem] text-center text-xl font-semibold text-white md:w-[20rem] md:px-[2rem]">
            ลงทะเบียนสำหรับผู้ประเมิน
          </h1>
        </section>

        <Form
          onSubmit={handleSubmit}
          className="mt-5 flex w-10/12 flex-col items-center justify-center gap-3 md:mt-3"
        >
          <TextField
            name="firstName"
            type="text"
            className="flex flex-col items-center "
          >
            <div className="flex flex-col items-start justify-start gap-2">
              <Label className="text-xl font-semibold text-[#597E52] md:text-base">
                ชื่อจริง :
              </Label>
              <Input
                onChange={handleChangeSignUpData}
                className="w-[20rem] rounded-lg border-[1px] border-solid border-slate-300 px-3 py-2 md:w-[25rem] md:py-1"
              />
            </div>
            <div className="flex w-full justify-center">
              <FieldError className="mt-2 w-[90%] text-center text-sm text-red-600" />
            </div>
          </TextField>

          <TextField
            name="lastName"
            type="text"
            className="flex flex-col items-center "
          >
            <div className="flex flex-col items-start justify-start gap-2">
              <Label className="text-xl font-semibold text-[#597E52] md:text-base">
                นามสกุล :
              </Label>
              <Input
                onChange={handleChangeSignUpData}
                className="w-[20rem] rounded-lg border-[1px] border-solid border-slate-300 px-3 py-2 md:w-[25rem] md:py-1"
              />
            </div>
            <div className="flex w-full justify-center">
              <FieldError className="mt-2 w-[90%] text-center text-sm text-red-600" />
            </div>
          </TextField>

          <TextField
            name="phone"
            type="tel"
            className="flex flex-col items-center "
          >
            <div className="flex flex-col items-start justify-start gap-2">
              <Label className="text-xl font-semibold text-[#597E52] md:text-base">
                เบอร์มือถือ :
              </Label>
              <Input
                minLength={10}
                maxLength={10}
                onChange={handleChangeSignUpData}
                className="w-[20rem] rounded-lg border-[1px] border-solid border-slate-300 px-3 py-2 md:w-[25rem] md:py-1"
              />
            </div>
            <div className="flex w-full justify-center">
              <FieldError className="mt-2 w-[90%] text-center text-sm text-red-600" />
            </div>
          </TextField>

          {/* องค์กร เอาขนาดเต็มไปเลย  */}

          <OrganizationCombox
            setSignUpData={setSignUpData}
            signUpData={signUpData}
          />
          {(signUpData?.organization?.value === "argiculturalAmphure" ||
            signUpData?.organization?.value === "argiculturalTambon") && (
            <AmphureComBox
              setSignUpData={setSignUpData}
              signUpData={signUpData}
            />
          )}

          {signUpData?.organization?.value === "argiculturalTambon" && (
            <TambonComBox
              setSignUpData={setSignUpData}
              signUpData={signUpData}
            />
          )}

          <TextField
            name="keySignature"
            type="text"
            className="flex flex-col items-center "
          >
            <div className="flex flex-col items-start justify-start gap-2">
              <Label className="text-xl font-semibold text-[#597E52] md:text-base">
                Key Signature :
              </Label>
              <Input
                onChange={handleChangeSignUpData}
                className="w-[20rem] rounded-lg border-[1px] border-solid border-slate-300 px-3 py-2 md:w-[25rem] md:py-1"
              />
            </div>
            <div className="flex w-full justify-center">
              <FieldError className="mt-2 w-[90%] text-center text-sm text-red-600" />
            </div>
          </TextField>

          {/* email password */}
          <TextField
            name="email"
            type="email"
            isRequired
            className="mt-10 flex flex-col items-center md:mt-6"
          >
            <div className="flex flex-col items-start justify-start gap-2">
              <Label className="text-xl font-semibold text-[#597E52] md:text-base">
                E-mail :
              </Label>
              <Input
                onChange={handleChangeSignUpData}
                className="w-[20rem] rounded-lg border-[1px] border-solid border-slate-300 px-3 py-2 md:w-[25rem] md:py-1"
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
            minLength={8}
          >
            <div className="flex flex-col items-start justify-start gap-2">
              <Label className="text-xl font-semibold text-[#597E52] md:text-base">
                รหัสผ่าน :
              </Label>
              <Input
                onChange={handleChangeSignUpData}
                className="w-[20rem] rounded-lg border-[1px] border-solid border-slate-300 px-3 py-2 md:w-[25rem] md:py-1"
              />
            </div>
            <div className="flex w-full justify-center">
              <FieldError className="mt-2 w-[90%] text-center text-sm text-red-600" />
            </div>
          </TextField>

          <TextField
            name="confirmPassword"
            type="password"
            isRequired
            className="flex flex-col items-center "
            minLength={8}
          >
            <div className="flex flex-col items-start justify-start gap-2">
              <Label className="text-xl font-semibold text-[#597E52] md:text-base">
                ยืนยันรหัสผ่าน :
              </Label>
              <Input
                onChange={handleChangeSignUpData}
                className="w-[20rem] rounded-lg border-[1px] border-solid border-slate-300 px-3 py-2 md:w-[25rem] md:py-1"
              />
            </div>
            <div className="flex w-full justify-center">
              <FieldError className="mt-2 w-[90%] text-center text-sm text-red-600" />
            </div>
          </TextField>

          <section className="mt-5 flex items-center justify-center">
            <div>
              <Checkbox
                inputProps={{ "aria-label": "controlled" }}
                onChange={(e) =>
                  setSignUpData((prev) => {
                    return { ...prev, isConfirmed: e.target.checked };
                  })
                }
                value={signUpData?.isConfirmed}
              />
            </div>
            <p className="font-semibold"> ฉันยืนยันว่าข้อมูลถูกต้อง</p>
          </section>

          {/* submit ไปแล้ว ขึ้นalertด้วย */}
          <div className="mt-2 flex justify-center">
            {signUpData?.isConfirmed ? (
              <Button
                type="submit"
                className="w-[13rem] rounded-full bg-[#597E52] p-3 text-center text-xl 
              font-semibold text-white drop-shadow-lg duration-300 hover:bg-[#81b077] md:text-base"
              >
                ลงทะเบียน
              </Button>
            ) : (
              <div
                className="w-80 rounded-full bg-[#767c75] p-3 text-center text-xl 
              font-semibold text-white drop-shadow-lg duration-300  md:text-base"
              >
                กรุณาใส่ข้อมูลให้ถูกต้อง
              </div>
            )}
          </div>
        </Form>
        {/* เหลือ footer */}
      </div>
    </div>
  );
};

export default Index;
