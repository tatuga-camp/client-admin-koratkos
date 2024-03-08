import { Calendar } from "primereact/calendar";
import React, { useState } from "react";
import {
  Button,
  FileTrigger,
  Form,
  Input,
  Label,
  TextField,
} from "react-aria-components";
import { CiImageOn } from "react-icons/ci";

import Swal from "sweetalert2";
import { useDeviceType } from "../../utils";
import {
  CreateCertificateService,
  ResponseGetAllCertificateService,
} from "../../services/certificate";
import moment from "moment";
import { useRouter } from "next/router";
import { UseQueryResult } from "@tanstack/react-query";
import Image from "next/image";

type CreateCertificateProps = {
  setTriggerCreateCertificate: React.Dispatch<React.SetStateAction<boolean>>;
  certificates: UseQueryResult<ResponseGetAllCertificateService, Error>;
};

function CreateCertificate({
  setTriggerCreateCertificate,
  certificates,
}: CreateCertificateProps) {
  const deviceType = useDeviceType();
  const router = useRouter();
  const [certificateData, setCertificateData] = useState<{
    certRequestDate?: Date;
    certExpiredDate?: Date;
    governorName: string;
    governorSignature?: {
      file: File;
      url: string;
    };
  }>({ governorName: "นายสยาม ศิริมงคล" });

  const handleSummitCreateCertificate = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      Swal.fire({
        title: "กำลังสร้างใบรับรอง",
        didOpen: () => {
          Swal.showLoading();
        },
      });
      if (!certificateData?.governorSignature?.file) {
        throw new Error("กรุณาเลือกไฟล์");
      }
      await CreateCertificateService({
        farmerId: router.query.farmerId as string,
        certRequestDate: moment(certificateData?.certRequestDate).toISOString(),
        certExpiredDate: moment(certificateData?.certExpiredDate).toISOString(),
        governorName: certificateData?.governorName,
        file: certificateData?.governorSignature.file,
      });
      await certificates.refetch();
      Swal.fire({
        icon: "success",
        title: "สร้างใบรับรองสำเร็จ",
      });
      setTriggerCreateCertificate(() => false);
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.message,
      });
    }
  };
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-50 m-auto flex h-screen w-screen items-center justify-center font-Anuphan">
      <Form
        onSubmit={handleSummitCreateCertificate}
        className="flex h-max w-96 flex-col items-center justify-between gap-3 rounded-lg bg-fourth-color p-5 ring-2 ring-black"
      >
        <Label className="text-xl font-semibold text-super-main-color">
          สร้างใบรับรอง
        </Label>
        <TextField isRequired className="flex w-80 flex-col  items-start gap-2">
          <Label className="text-base font-semibold text-super-main-color">
            วันที่ออกใบรับรอง
          </Label>
          <Calendar
            value={certificateData?.certRequestDate}
            onChange={(e) => {
              setCertificateData((prev: any) => ({
                ...prev,
                certRequestDate: e.value,
              }));
            }}
            required
            className="w-full"
            dateFormat="dd/MM/yy"
            locale="th"
            touchUI={deviceType === "mobile" ? true : false}
          />
        </TextField>
        <TextField isRequired className="flex w-80 flex-col  items-start gap-2">
          <Label className="text-base font-semibold text-super-main-color">
            วันที่หมดอายุ
          </Label>
          <Calendar
            value={certificateData?.certExpiredDate}
            onChange={(e) => {
              setCertificateData((prev: any) => ({
                ...prev,
                certExpiredDate: e.value,
              }));
            }}
            required
            className="w-full"
            dateFormat="dd/MM/yy"
            locale="th"
            touchUI={deviceType === "mobile" ? true : false}
          />
        </TextField>
        <TextField isRequired className="flex w-80 flex-col  items-start gap-2">
          <Label className="text-base font-semibold text-super-main-color">
            ชื่อผู้ว่าราชการจังหวัด
          </Label>
          <Input
            type="text"
            value={certificateData?.governorName}
            onChange={(e) => {
              setCertificateData((prev: any) => ({
                ...prev,
                governorName: e.target.value,
              }));
            }}
            required
            className="h-13 w-full rounded-md p-3 ring-1 ring-gray-200"
          />
        </TextField>
        {certificateData.governorSignature?.url && (
          <div className="relative h-40 w-full">
            <Image
              src={certificateData.governorSignature?.url}
              fill
              alt="governor signature"
              className="object-contain"
            />
          </div>
        )}
        <FileTrigger
          allowsMultiple={false}
          acceptedFileTypes={[
            "image/png",
            "image/jpg",
            "image/jpeg",
            "image/gif",
            "image/bmp",
            "image/webp",
          ]}
          onSelect={(e) => {
            if (!e) return null;
            const file = e[0];
            const url = URL.createObjectURL(file);
            setCertificateData((prev: any) => ({
              ...prev,
              governorSignature: { file, url },
            }));
          }}
        >
          <div className="w-80">
            <Button
              className=" duration-100justify-center flex  items-center gap-2 rounded-lg bg-third-color px-4 py-1 font-semibold text-white 
          transition hover:bg-super-main-color"
            >
              <CiImageOn />
              อัพโหลดลายเซ็น
            </Button>
          </div>
        </FileTrigger>
        <Button
          type="submit"
          className="button-focus flex items-center justify-center gap-2 rounded-lg bg-fifth-color px-5 py-1 text-xl font-bold text-white"
        >
          ตกลง
        </Button>
      </Form>
      <footer
        onClick={() => setTriggerCreateCertificate(() => false)}
        className="fixed bottom-0 left-0 right-0 top-0 -z-10 m-auto h-screen w-screen bg-white/10 backdrop-blur-md"
      ></footer>
    </div>
  );
}

export default CreateCertificate;
