import { Calendar } from "primereact/calendar";
import React, { useState } from "react";
import { Button, Form, Label, TextField } from "react-aria-components";
import Swal from "sweetalert2";
import { useDeviceType } from "../../utils";
import {
  CreateCertificateService,
  ResponseGetAllCertificateService,
} from "../../services/certificate";
import moment from "moment";
import { useRouter } from "next/router";
import { UseQueryResult } from "@tanstack/react-query";

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
    certRequestDate: Date;
    certExpiredDate: Date;
  }>();

  const handleSummitCreateCertificate = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      Swal.fire({
        title: "กำลังสร้างใบรับรอง",
        didOpen: () => {
          Swal.showLoading();
        },
      });
      await CreateCertificateService({
        farmerId: router.query.farmerId as string,
        certRequestDate: moment(certificateData?.certRequestDate).toISOString(),
        certExpiredDate: moment(certificateData?.certExpiredDate).toISOString(),
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
        className="flex h-96 w-96 flex-col items-center justify-between gap-3 rounded-lg bg-fourth-color p-5 ring-2 ring-black"
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
