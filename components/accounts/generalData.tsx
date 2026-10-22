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
import { LuCamera, LuLoader2 } from "react-icons/lu";
import Image from "next/image";
import { DefinedUseQueryResult } from "@tanstack/react-query";
import {
  UpdateUserService,
  UploadProfileUserService,
} from "../../services/user";
import Swal from "sweetalert2";
import { organizationLists } from "../../data/organization";

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

/** Formats up to 10 digits as 999-999-9999 while typing. */
const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  return [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6)]
    .filter(Boolean)
    .join("-");
};

function GeneralData({ user }: GernerralDataProps) {
  const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData>({
    firstName: user.data.firstName,
    lastName: user.data.lastName,
    phoneNumber: formatPhone(user.data.phone ?? ""),
    organization: user.data.organization,
    picture: {
      file: null,
      url: user.data.picture,
    },
  });

  const handleChangeUserData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: name === "phoneNumber" ? formatPhone(value) : value,
    }));
  };

  const handleUploadProfile = async ({ e }: { e: FileList | null }) => {
    try {
      if (!e) return;
      setUploadError(null);
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
      // Show the saved picture again rather than a preview that never uploaded.
      setUserData((prev) => ({
        ...prev,
        picture: { file: null, url: user.data.picture },
      }));
      setUploadError("อัปโหลดรูปไม่สำเร็จ กรุณาลองอีกครั้ง");
      console.log(error);
    }
  };

  const handleSummitUpdateUser = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setSubmitting(true);

      const update = await UpdateUserService({
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phoneNumber.replace(/-/g, ""),
        organization: userData.organization,
      });
      await user.refetch();
      setSubmitting(false);
      Swal.fire({
        title: "บันทึกข้อมูลสำเร็จ",
        icon: "success",
        confirmButtonText: "ตกลง",
      });
    } catch (error: any) {
      setSubmitting(false);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: error.message,
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };

  const organizationTitle =
    organizationLists.find((org) => org.value === userData.organization)
      ?.title ?? "";
  const area =
    user.data.organization === "argiculturalAmphure"
      ? { label: "อำเภอ", value: user.data.amphure }
      : user.data.organization === "argiculturalTambon"
        ? { label: "ตำบล", value: user.data.tambon }
        : null;

  return (
    <div className="grid items-start gap-6 xl:grid-cols-3">
      <section aria-labelledby="profile-picture-title" className="card">
        <div className="card-header">
          <h2 id="profile-picture-title" className="card-title">
            รูปโปรไฟล์
          </h2>
        </div>
        <div className="flex flex-col items-center gap-4 p-4 text-center sm:flex-row sm:p-5 sm:text-left xl:flex-col xl:text-center">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-full bg-third-color ring-4 ring-third-color/60">
            {userData.picture.url && (
              <Image
                alt="รูปโปรไฟล์ของคุณ"
                src={userData.picture.url}
                fill
                sizes="96px"
                className={`object-cover transition-opacity ${loadingUpload ? "opacity-50" : ""}`}
              />
            )}
            {loadingUpload && (
              <span className="absolute inset-0 flex items-center justify-center">
                <LuLoader2
                  aria-hidden="true"
                  className="size-6 text-super-main-color motion-safe:animate-spin"
                />
              </span>
            )}
          </div>
          <div className="flex min-w-0 flex-col items-center gap-2 sm:items-start xl:items-center">
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
              <Button isDisabled={loadingUpload} className="btn btn-secondary">
                <LuCamera aria-hidden="true" className="size-4" />
                เปลี่ยนรูปโปรไฟล์
              </Button>
            </FileTrigger>
            <p className="text-xs text-super-main-color/80">
              ไฟล์ PNG, JPG, GIF, BMP หรือ WEBP รูปจะบันทึกทันทีหลังเลือกไฟล์
            </p>
            <p aria-live="polite" className="text-xs">
              {loadingUpload && "กำลังอัปโหลดรูป…"}
              {uploadError && <span className="field-error">{uploadError}</span>}
            </p>
          </div>
        </div>
      </section>

      <Form
        onSubmit={handleSummitUpdateUser}
        aria-labelledby="general-data-title"
        className="card xl:col-span-2"
      >
        <div className="card-header">
          <div className="min-w-0">
            <h2 id="general-data-title" className="card-title">
              ข้อมูลทั่วไป
            </h2>
            <p className="text-sm text-super-main-color/80">
              ชื่อและเบอร์โทรศัพท์ที่ใช้ติดต่อในระบบ
            </p>
          </div>
        </div>

        <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
          <TextField className="flex flex-col gap-1.5">
            <Label className="label">ชื่อจริง</Label>
            <Input
              name="firstName"
              onChange={handleChangeUserData}
              value={userData.firstName}
              autoComplete="given-name"
              className="input"
            />
          </TextField>
          <TextField className="flex flex-col gap-1.5">
            <Label className="label">นามสกุล</Label>
            <Input
              name="lastName"
              onChange={handleChangeUserData}
              value={userData.lastName}
              autoComplete="family-name"
              className="input"
            />
          </TextField>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="account-phone" className="label">
              หมายเลขโทรศัพท์
            </label>
            <input
              id="account-phone"
              type="tel"
              required
              name="phoneNumber"
              onChange={handleChangeUserData}
              value={userData.phoneNumber}
              autoComplete="tel"
              inputMode="numeric"
              pattern="\d{3}-\d{3}-\d{4}"
              title="กรอกหมายเลขโทรศัพท์ 10 หลัก"
              className="input"
              placeholder="081-234-5678"
            />
          </div>
        </div>

        <div className="grid gap-4 border-t border-third-color p-4 sm:grid-cols-2 sm:p-5">
          <TextField
            isDisabled
            className={`flex flex-col gap-1.5 ${area ? "" : "sm:col-span-2"}`}
          >
            <Label className="label">องค์กร/หน่วยงาน</Label>
            <Input value={organizationTitle} className="input" />
          </TextField>
          {area && (
            <TextField isDisabled className="flex flex-col gap-1.5">
              <Label className="label">{area.label}</Label>
              <Input value={area.value ?? ""} className="input" />
            </TextField>
          )}
          <p className="-mt-1 text-xs text-super-main-color/80 sm:col-span-2">
            หน่วยงานถูกกำหนดตอนลงทะเบียนและแก้ไขเองไม่ได้
          </p>
        </div>

        <div className="flex justify-end border-t border-third-color px-4 py-3 sm:px-5">
          <Button
            type="submit"
            isDisabled={submitting}
            className="btn btn-primary w-full sm:w-auto"
          >
            {submitting && (
              <LuLoader2 aria-hidden="true" className="size-4 motion-safe:animate-spin" />
            )}
            {submitting ? "กำลังบันทึก" : "บันทึกการเปลี่ยนแปลง"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default GeneralData;
