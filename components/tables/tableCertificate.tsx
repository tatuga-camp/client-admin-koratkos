import { UseQueryResult } from "@tanstack/react-query";
import React from "react";
import {
  DeleteCertificateService,
  ResponseGetAllCertificateService,
} from "../../services/certificate";
import moment from "moment";
import { PiCertificateBold } from "react-icons/pi";
import Link from "next/link";
import { MdDelete } from "react-icons/md";
import { User } from "../../model";
import Swal from "sweetalert2";

type TableCertificateProps = {
  certificates: UseQueryResult<ResponseGetAllCertificateService, Error>;
  user: User;
};
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
        const deletePlant = await DeleteCertificateService({
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
  return (
    <div className="w-[48rem] overflow-auto rounded-lg bg-fourth-color p-5 xl:w-10/12 2xl:w-11/12">
      <h1 className="my-2 text-xl font-semibold text-super-main-color">
        ใบรับรอง KOS
      </h1>
      <div className=" w-full overflow-auto p-5 ">
        <table className="w-full table-auto border-collapse ">
          <thead>
            <tr className="sticky  top-0 border-2  border-super-main-color bg-fifth-color text-white">
              <th className="h-10 border-2 border-super-main-color  px-2">
                รหัสใบรับรอง
              </th>
              <th className="h-10 border-2 border-super-main-color px-2">
                วันที่ออกใบรับรอง
              </th>
              <th className="h-10 border-2 border-super-main-color px-2">
                วันที่หมดอายุ
              </th>
              <th className="h-10 border-2 border-super-main-color px-2">
                ตัวเลือก
              </th>
            </tr>
          </thead>
          <tbody>
            {certificates.data?.map((certificate, index) => {
              return (
                <tr key={index} className="h-10 text-left ">
                  <td className="h-16 px-3">{certificate.certNumber}</td>
                  <td className="px-3">
                    {moment(certificate.certRequestDate).format("DD/MMMM/YYYY")}
                  </td>
                  <td className=" px-3">
                    {moment(certificate.certExpiredDate).format("DD/MMMM/YYYY")}
                  </td>
                  <td className="flex w-full items-center justify-center gap-3 py-2">
                    <Link
                      target="_blank"
                      href={`/farmer/${certificate.farmerId}/certificate/${certificate.id}`}
                      className="flex items-center justify-center gap-2 rounded-lg bg-green-300
                     px-3 py-1 text-green-950 drop-shadow-md transition duration-150 hover:scale-105"
                    >
                      <PiCertificateBold />
                      ดูใบรับรอง
                    </Link>
                    {user.role === "admin" && (
                      <button
                        onClick={() =>
                          handleDeleteCertificate({
                            certificateId: certificate.id,
                          })
                        }
                        className="flex items-center justify-center gap-2 rounded-lg bg-red-300
                     px-3 py-1 text-red-700 drop-shadow-md transition duration-150 hover:scale-105"
                      >
                        <MdDelete /> ลบใบรับรอง
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableCertificate;
