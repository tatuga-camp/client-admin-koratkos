import { UseQueryResult } from "@tanstack/react-query";
import React from "react";
import {
  DeleteCertificateService,
  ResponseGetAllCertificateService,
} from "../../services/certificate";
import moment from "moment";
import Link from "next/link";
import { LuAward, LuTrash2 } from "react-icons/lu";
import { User } from "../../model";
import Swal from "sweetalert2";

type TableCertificateProps = {
  certificates: UseQueryResult<ResponseGetAllCertificateService, Error>;
  user: User;
};

const formatDate = (date?: string) =>
  date ? moment(date).locale("th").format("D MMM YYYY") : "-";

function TableCertificate({ certificates, user }: TableCertificateProps) {
  const handleDeleteCertificate = async ({
    certificateId,
  }: {
    certificateId: string;
  }) => {
    let content = document.createElement("div");
    content.innerHTML =
      "<div>กรุณาพิมพ์ข้อความนี้</div> <strong>" +
      "ยืนยันการลบ" +
      "</strong> <div>เพื่อลบข้อมูล</div>";
    const { value } = await Swal.fire<{ value: string }>({
      title: "ยืนยันการลบข้อมูล",
      input: "text",
      html: content,
      footer: "<strong>หากลบแล้วคุณจะไม่สามารถกู้คืนข้อมูลได้</strong>",
      showCancelButton: true,
      confirmButtonText: "ลบใบรับรอง",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#dc2626",
      inputValidator: (value) => {
        if (value !== "ยืนยันการลบ") {
          return "กรุณาพิมพ์ข้อความยืนยันให้ถูกต้อง";
        }
      },
    });
    if (value) {
      try {
        Swal.fire({
          title: "กำลังลบข้อมูล",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        await DeleteCertificateService({
          certificateId: certificateId,
        });
        await certificates.refetch();
        Swal.fire({
          icon: "success",
          title: "ลบสำเร็จ",
          text: "ลบข้อมูลสำเร็จ",
        });
      } catch (error: any) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: error.message,
        });
      }
    }
  };

  const rows = certificates.data ?? [];
  const certificateHref = (certificate: (typeof rows)[number]) =>
    `/farmer/${certificate.farmerId}/certificate/${certificate.id}`;

  return (
    <section className="card">
      <div className="card-header">
        <h2 className="card-title">ใบรับรอง KOS</h2>
        <span className="text-sm text-super-main-color/80">
          {rows.length} ใบ
        </span>
      </div>

      {/* Tablet and desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-third-color bg-fourth-color/70 text-xs font-semibold text-super-main-color/80">
            <tr>
              <th scope="col" className="px-5 py-3">รหัสใบรับรอง</th>
              <th scope="col" className="px-3 py-3">วันที่ออกใบรับรอง</th>
              <th scope="col" className="px-3 py-3">วันที่หมดอายุ</th>
              <th scope="col" className="px-5 py-3">
                <span className="sr-only">ตัวเลือก</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-third-color">
            {rows.map((certificate) => {
              return (
                <tr key={certificate.id} className="transition-colors hover:bg-fourth-color/60">
                  <td className="px-5 py-3 font-semibold">{certificate.certNumber}</td>
                  <td className="whitespace-nowrap px-3 py-3 tabular-nums">
                    {formatDate(certificate.certRequestDate)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 tabular-nums">
                    {formatDate(certificate.certExpiredDate)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        target="_blank"
                        href={certificateHref(certificate)}
                        className="btn btn-secondary btn-sm"
                      >
                        <LuAward aria-hidden="true" className="size-4" />
                        ดูใบรับรอง
                      </Link>
                      {user.role === "admin" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteCertificate({
                              certificateId: certificate.id,
                            })
                          }
                          className="btn btn-danger-soft btn-sm"
                        >
                          <LuTrash2 aria-hidden="true" className="size-4" />
                          ลบใบรับรอง
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Phones */}
      <ul className="divide-y divide-third-color md:hidden">
        {rows.map((certificate) => (
          <li key={certificate.id} className="p-4">
            <p className="text-xs text-super-main-color/70">รหัสใบรับรอง</p>
            <p className="break-words font-semibold">{certificate.certNumber}</p>
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
              <div>
                <dt className="text-super-main-color/70">วันที่ออกใบรับรอง</dt>
                <dd className="font-medium">{formatDate(certificate.certRequestDate)}</dd>
              </div>
              <div>
                <dt className="text-super-main-color/70">วันที่หมดอายุ</dt>
                <dd className="font-medium">{formatDate(certificate.certExpiredDate)}</dd>
              </div>
            </dl>
            <div className={`mt-3 grid gap-2 ${user.role === "admin" ? "grid-cols-2" : ""}`}>
              <Link
                target="_blank"
                href={certificateHref(certificate)}
                className="btn btn-secondary w-full"
              >
                <LuAward aria-hidden="true" className="size-4" />
                ดูใบรับรอง
              </Link>
              {user.role === "admin" && (
                <button
                  type="button"
                  onClick={() =>
                    handleDeleteCertificate({
                      certificateId: certificate.id,
                    })
                  }
                  className="btn btn-danger-soft w-full"
                >
                  <LuTrash2 aria-hidden="true" className="size-4" />
                  ลบใบรับรอง
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default TableCertificate;
