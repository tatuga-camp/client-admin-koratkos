import React, { useState } from "react";
import {
  Button,
  FieldError,
  FileTrigger,
  Form,
  Input,
  Label,
  TextField,
} from "react-aria-components";
import { LuImagePlus, LuLoader2 } from "react-icons/lu";

import Swal from "sweetalert2";
import {
  CreateCertificateService,
  ResponseGetAllCertificateService,
} from "../../services/certificate";
import moment from "moment";
import { useRouter } from "next/router";
import { UseQueryResult } from "@tanstack/react-query";
import Image from "next/image";
import DateInput from "../ui/DateInput";
import Modal from "../ui/Modal";

type CreateCertificateProps = {
  setTriggerCreateCertificate: React.Dispatch<React.SetStateAction<boolean>>;
  certificates: UseQueryResult<ResponseGetAllCertificateService, Error>;
};

function CreateCertificate({
  setTriggerCreateCertificate,
  certificates,
}: CreateCertificateProps) {
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
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [signatureMissing, setSignatureMissing] = useState(false);

  const handleClose = () => {
    if (submitting) return;
    setTriggerCreateCertificate(() => false);
  };

  const handleSummitCreateCertificate = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setErrorMessage(null);
      if (!certificateData?.governorSignature?.file) {
        setSignatureMissing(true);
        return;
      }
      setSubmitting(true);
      await CreateCertificateService({
        farmerId: router.query.farmerId as string,
        certRequestDate: moment(certificateData?.certRequestDate).toISOString(),
        certExpiredDate: moment(certificateData?.certExpiredDate).toISOString(),
        governorName: certificateData?.governorName,
        file: certificateData?.governorSignature.file,
      });
      await certificates.refetch();
      setTriggerCreateCertificate(() => false);
      Swal.fire({
        icon: "success",
        title: "สร้างใบรับรองสำเร็จ",
      });
    } catch (error: any) {
      // Shown inside the dialog so the filled-in form is kept.
      setErrorMessage(
        error?.message ?? "สร้างใบรับรองไม่สำเร็จ กรุณาลองอีกครั้ง",
      );
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open
      onClose={handleClose}
      size="sm"
      title="สร้างใบรับรอง"
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="btn btn-secondary"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            form="create-certificate-form"
            disabled={submitting}
            className="btn btn-primary"
          >
            {submitting && (
              <LuLoader2
                aria-hidden="true"
                className="size-4 motion-safe:animate-spin"
              />
            )}
            {submitting ? "กำลังสร้างใบรับรอง" : "สร้างใบรับรอง"}
          </button>
        </>
      }
    >
      <Form
        id="create-certificate-form"
        onSubmit={handleSummitCreateCertificate}
        className="flex flex-col gap-4"
      >
        {errorMessage && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {errorMessage}
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cert-request-date" className="label">
            วันที่ออกใบรับรอง
          </label>
          <DateInput
            id="cert-request-date"
            name="certRequestDate"
            value={certificateData?.certRequestDate}
            onChange={(date) => {
              setCertificateData((prev) => ({
                ...prev,
                certRequestDate: date ?? undefined,
              }));
            }}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cert-expired-date" className="label">
            วันที่หมดอายุ
          </label>
          <DateInput
            id="cert-expired-date"
            name="certExpiredDate"
            value={certificateData?.certExpiredDate}
            min={certificateData?.certRequestDate}
            onChange={(date) => {
              setCertificateData((prev) => ({
                ...prev,
                certExpiredDate: date ?? undefined,
              }));
            }}
            required
          />
        </div>
        <TextField isRequired className="flex flex-col gap-1.5">
          <Label className="label">ชื่อผู้ว่าราชการจังหวัด</Label>
          <Input
            type="text"
            value={certificateData?.governorName}
            onChange={(e) => {
              setCertificateData((prev: any) => ({
                ...prev,
                governorName: e.target.value,
              }));
            }}
            className="input"
          />
          <FieldError className="field-error" />
        </TextField>
        <div className="flex flex-col gap-1.5">
          <span className="label">ลายเซ็นผู้ว่าราชการจังหวัด</span>
          {certificateData.governorSignature?.url && (
            <div className="relative h-32 w-full overflow-hidden rounded-lg border border-third-color bg-fourth-color">
              <Image
                src={certificateData.governorSignature?.url}
                fill
                alt="ตัวอย่างลายเซ็นผู้ว่าราชการจังหวัด"
                className="object-contain p-2"
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
              setSignatureMissing(false);
              setCertificateData((prev: any) => ({
                ...prev,
                governorSignature: { file, url },
              }));
            }}
          >
            <Button
              aria-describedby={
                signatureMissing ? "governor-signature-error" : undefined
              }
              className="btn btn-secondary w-full sm:w-max"
            >
              <LuImagePlus aria-hidden="true" className="size-4" />
              {certificateData.governorSignature
                ? "เปลี่ยนลายเซ็น"
                : "อัพโหลดลายเซ็น"}
            </Button>
          </FileTrigger>
          {signatureMissing && (
            <p id="governor-signature-error" className="field-error">
              กรุณาอัพโหลดลายเซ็น
            </p>
          )}
        </div>
      </Form>
    </Modal>
  );
}

export default CreateCertificate;
