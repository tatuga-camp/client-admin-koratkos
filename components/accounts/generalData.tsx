import React, { useState } from "react";
import { User } from "../../model";
import {
  Button,
  FileTrigger,
  Form,
  Input,
  Label,
  TextField,
} from "react-aria-components";
import { AiFillPicture } from "react-icons/ai";
import Image from "next/image";
import { InputMask, InputMaskChangeEvent } from "primereact/inputmask";
import { DefinedUseQueryResult } from "@tanstack/react-query";
import {
  UpdateUserService,
  UploadProfileUserService,
} from "../../services/user";
import Swal from "sweetalert2";

type GernerralDataProps = {
  user: DefinedUseQueryResult<User, Error>;
};
type UserData = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  organization: string;
  picture: {
    file: File | null;
    url: string;
  };
};
function GeneralData({ user }: GernerralDataProps) {
  const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData>({
    firstName: user.data.firstName,
    lastName: user.data.lastName,
    phoneNumber: user.data.phone,
    organization: user.data.organization,
    picture: {
      file: null,
      url: user.data.picture,
    },
  });

  const handleChangeUserData = (
    e: InputMaskChangeEvent | React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadProfile = async ({ e }: { e: FileList | null }) => {
    try {
      if (!e) return;
      setLoadingUpload(() => true);
      setUserData((prev) => {
        const file = e[0];
        const url = URL.createObjectURL(file);
        return {
          ...prev,
          picture: {
            file: file,
            url: url,
          },
        };
      });
      const upload = await UploadProfileUserService({ file: e[0] });
      await user.refetch();
      setLoadingUpload(() => false);
    } catch (error) {
      setLoadingUpload(() => false);
      console.log(error);
    }
  };

  const handleSummitUpdateUser = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      Swal.fire({
        title: "กำลังบันทึกข้อมูล",
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const update = await UpdateUserService({
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phoneNumber.replace(/-/g, ""),
        organization: userData.organization,
      });
      await user.refetch();
      Swal.fire({
        title: "บันทึกข้อมูลสำเร็จ",
        icon: "success",
        confirmButtonText: "ตกลง",
      });
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
    <Form
      onSubmit={handleSummitUpdateUser}
      className="flex flex-col items-center justify-center gap-5"
    >
      <div className="flex h-96 w-full justify-center gap-2 rounded-lg bg-fourth-color p-5 font-Anuphan">
        <div className="flex w-4/12 flex-col items-center justify-between gap-2">
          <h2 className="text-2xl font-semibold text-[#C6A969]">รูปโปรไฟล์</h2>
          <div className="relative h-40 w-40 overflow-hidden rounded-full ring-2 ring-super-main-color ">
            {loadingUpload ? (
              <div className="h-60 w-60 animate-pulse bg-gray-300"></div>
            ) : (
              <Image
                alt="user profile"
                src={userData.picture.url}
                fill
                className="object-cover"
              />
            )}
          </div>
          <FileTrigger
            acceptedFileTypes={[
              "image/png",
              "image/jpg",
              "image/jpeg",
              "image/gif",
              "image/bmp",
              "image/webp",
            ]}
            onSelect={(e) => handleUploadProfile({ e })}
            allowsMultiple={false}
          >
            <Button
              className="flex items-center justify-center gap-2 rounded-xl bg-[#C6A969] px-5
             py-1 text-xl font-semibold
           text-white drop-shadow-md transition duration-100 hover:scale-105 active:scale-110 "
            >
              <AiFillPicture />
              อัพโหลดรูป
            </Button>
          </FileTrigger>
        </div>
        <div className="max flex flex-col items-start justify-between gap-2">
          <h2 className="text-2xl font-semibold text-[#C6A969]">
            ข้อมูลทั่วไป
          </h2>
          <TextField className="flex w-full items-center justify-start gap-2">
            <Label className="text-xl font-semibold text-super-main-color">
              ชื่อจริง :{" "}
            </Label>
            <Input
              name="firstName"
              onChange={handleChangeUserData}
              value={userData.firstName}
              className="w-60 rounded-lg bg-white p-2 ring-1 ring-super-main-color"
            />
          </TextField>
          <TextField className="flex w-full items-center justify-start gap-2">
            <Label className="text-xl font-semibold text-super-main-color">
              นามสกุล :{" "}
            </Label>
            <Input
              name="lastName"
              onChange={handleChangeUserData}
              value={userData.lastName}
              className="w-60 rounded-lg bg-white p-2 ring-1 ring-super-main-color"
            />
          </TextField>
          <TextField className="flex w-full items-center justify-start gap-2">
            <Label className="text-xl font-semibold text-super-main-color">
              หมายเลขโทรศัพท์ :{" "}
            </Label>
            <InputMask
              required
              name="phoneNumber"
              onChange={handleChangeUserData}
              value={userData.phoneNumber}
              className="w-60 rounded-lg bg-white p-2 ring-1 ring-super-main-color"
              mask="999-999-9999"
              placeholder="999-999-9999"
            />
          </TextField>
          <TextField className="flex w-full flex-col items-start justify-center gap-2">
            <Label className="text-xl font-semibold text-super-main-color">
              องค์กร/หน่วยงาน :{" "}
            </Label>
            <Input
              name="organization"
              onChange={handleChangeUserData}
              value={userData.organization}
              className="w-60 rounded-lg bg-white p-2 ring-1 ring-super-main-color"
            />
          </TextField>
        </div>
      </div>
      <Button
        type="submit"
        className="rounded-lg bg-super-main-color px-5 py-1 text-xl
       font-semibold text-white drop-shadow-lg transition duration-100
       hover:scale-105 active:scale-110"
      >
        บันทึก
      </Button>
    </Form>
  );
}

export default GeneralData;
