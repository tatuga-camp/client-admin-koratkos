import { UseQueryResult } from "@tanstack/react-query";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import {
  LuArrowDown,
  LuArrowUp,
  LuClipboardCheck,
  LuInbox,
  LuPencil,
} from "react-icons/lu";
import { RegisterFormEvaluation } from "../../model";
import {
  RequestGetAllReadyRegisterFormByPage,
  ResponseGetAllRegisterFormaEvaluation,
} from "../../services/register-form";
import UpdateCertificateFormStatus from "../forms/UpdateCertificateFormStatus";
import StatusBadge, { certificateStatusLabels } from "../ui/StatusBadge";

type TableFarmerProps = {
  registerForms: UseQueryResult<ResponseGetAllRegisterFormaEvaluation, Error>;
  setRegisterFormsQuery: React.Dispatch<
    React.SetStateAction<RequestGetAllReadyRegisterFormByPage>
  >;
  registerFormsQuery: RequestGetAllReadyRegisterFormByPage;
};

type Row = ResponseGetAllRegisterFormaEvaluation["data"][number];

const formatDate = (date?: Date) =>
  date ? moment(date).locale("th").format("D MMM YYYY") : "-";

function FarmerAvatar({ src, size }: { src: string; size: "sm" | "md" }) {
  return (
    <span
      className={`relative shrink-0 overflow-hidden rounded-full bg-third-color ${size === "sm" ? "size-9" : "size-10"}`}
    >
      <Image src={src} fill sizes="40px" alt="" className="object-cover" />
    </span>
  );
}

function CertificateStatus({
  row,
  onEdit,
}: {
  row: Row;
  onEdit: (registerForm: RegisterFormEvaluation) => void;
}) {
  if (!row.registerForm) {
    return <StatusBadge status={null} />;
  }
  const status = row.registerForm.certificate_status ?? "pending";
  return (
    <button
      type="button"
      onClick={() => onEdit(row.registerForm)}
      aria-label={`แก้ไขผลการพิจารณาใบรับรองของ ${row.farmer.firstName} ${row.farmer.lastName}`}
      className="group inline-flex items-center gap-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-color"
    >
      <StatusBadge
        status={status}
        label={certificateStatusLabels[status]}
        className="group-hover:ring-main-color"
      />
      <LuPencil
        aria-hidden="true"
        className="size-3.5 text-super-main-color/60 group-hover:text-main-color"
      />
    </button>
  );
}

function TableFarmer({
  registerForms,
  setRegisterFormsQuery,
  registerFormsQuery,
}: TableFarmerProps) {
  const [selectRegisterForm, setSelectRegisterForm] =
    useState<RegisterFormEvaluation | null>(null);
  const sortDirection = registerFormsQuery.orderBy?.summitEvaluationDate ?? "desc";

  const toggleSort = () =>
    setRegisterFormsQuery((prev) => ({
      ...prev,
      page: 1,
      orderBy: {
        summitEvaluationDate:
          prev.orderBy?.summitEvaluationDate === "asc" ? "desc" : "asc",
      },
    }));

  const rows = registerForms.data?.data ?? [];

  if (registerForms.isError) {
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
        <p className="font-semibold">โหลดรายการคำขอไม่สำเร็จ</p>
        <button type="button" onClick={() => registerForms.refetch()} className="btn btn-secondary">
          ลองอีกครั้ง
        </button>
      </div>
    );
  }

  if (!registerForms.isLoading && rows.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
        <LuInbox aria-hidden="true" className="size-10 text-fifth-color" />
        <p className="font-semibold">ไม่พบคำขอรับการประเมิน</p>
        <p className="text-sm text-super-main-color/80">
          ลองเปลี่ยนสถานะ พื้นที่ หรือคำค้นหา
        </p>
      </div>
    );
  }

  return (
    <>
      {selectRegisterForm && (
        <UpdateCertificateFormStatus
          onClose={() => setSelectRegisterForm(null)}
          registerForms={registerForms}
          selectRegisterForm={selectRegisterForm}
        />
      )}

      {/* Tablet and desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-third-color bg-fourth-color/70 text-xs font-semibold text-super-main-color/80">
            <tr>
              <th scope="col" className="px-5 py-3">เกษตรกร</th>
              <th scope="col" className="px-3 py-3">สถานะการประเมิน</th>
              <th scope="col" className="px-3 py-3">การพิจารณาใบรับรอง</th>
              <th scope="col" className="px-3 py-3">ประเมินแล้ว</th>
              <th
                scope="col"
                className="px-3 py-3"
                aria-sort={sortDirection === "asc" ? "ascending" : "descending"}
              >
                <button
                  type="button"
                  onClick={toggleSort}
                  className="-mx-1 inline-flex items-center gap-1 rounded px-1 hover:text-super-main-color focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-color"
                >
                  วันยื่นคำขอ
                  {sortDirection === "asc" ? (
                    <LuArrowUp aria-hidden="true" className="size-3.5" />
                  ) : (
                    <LuArrowDown aria-hidden="true" className="size-3.5" />
                  )}
                </button>
              </th>
              <th scope="col" className="px-5 py-3">
                <span className="sr-only">การดำเนินการ</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-third-color">
            {registerForms.isLoading
              ? [...Array(6)].map((_, index) => (
                  <tr key={index}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="size-9 animate-pulse rounded-full bg-third-color" />
                        <div className="h-4 w-36 animate-pulse rounded bg-third-color" />
                      </div>
                    </td>
                    {[...Array(4)].map((_, cell) => (
                      <td key={cell} className="px-3 py-3">
                        <div className="h-4 w-20 animate-pulse rounded bg-third-color/70" />
                      </td>
                    ))}
                    <td className="px-5 py-3">
                      <div className="ml-auto h-8 w-20 animate-pulse rounded-lg bg-third-color" />
                    </td>
                  </tr>
                ))
              : rows.map((row) => (
                  <tr key={row.farmer.id} className="transition-colors hover:bg-fourth-color/60">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <FarmerAvatar src={row.farmer.picture} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate font-semibold">
                            {row.farmer.firstName} {row.farmer.lastName}
                          </p>
                          <p className="text-xs text-super-main-color/70">
                            {row.farmer.phoneNumber}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={row.registerForm?.status ?? null} />
                    </td>
                    <td className="px-3 py-3">
                      <CertificateStatus row={row} onEdit={setSelectRegisterForm} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 tabular-nums">
                      {row.formEvaluations?.length ?? 0} ครั้ง
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 tabular-nums">
                      {row.registerForm
                        ? formatDate(row.registerForm.summitEvaluationDate)
                        : "-"}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/farmer/${row.farmer.id}`} className="btn btn-dark btn-sm">
                        <LuClipboardCheck aria-hidden="true" className="size-4" />
                        ประเมิน
                      </Link>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Phones */}
      <ul className="divide-y divide-third-color md:hidden">
        {registerForms.isLoading
          ? [...Array(4)].map((_, index) => (
              <li key={index} className="flex items-center gap-3 p-4">
                <div className="size-10 animate-pulse rounded-full bg-third-color" />
                <div className="h-4 flex-1 animate-pulse rounded bg-third-color" />
              </li>
            ))
          : rows.map((row) => (
              <li key={row.farmer.id} className="p-4">
                <div className="flex items-start gap-3">
                  <FarmerAvatar src={row.farmer.picture} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">
                      {row.farmer.firstName} {row.farmer.lastName}
                    </p>
                    <p className="text-xs text-super-main-color/70">
                      {row.farmer.phoneNumber}
                    </p>
                  </div>
                  <StatusBadge status={row.registerForm?.status ?? null} />
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-x-3 text-xs">
                  <div>
                    <dt className="text-super-main-color/70">วันยื่นคำขอ</dt>
                    <dd className="font-medium">
                      {row.registerForm
                        ? formatDate(row.registerForm.summitEvaluationDate)
                        : "-"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-super-main-color/70">ประเมินแล้ว</dt>
                    <dd className="font-medium">{row.formEvaluations?.length ?? 0} ครั้ง</dd>
                  </div>
                </dl>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <div className="min-w-0 text-xs">
                    <p className="mb-1 text-super-main-color/70">การพิจารณาใบรับรอง</p>
                    <CertificateStatus row={row} onEdit={setSelectRegisterForm} />
                  </div>
                  <Link href={`/farmer/${row.farmer.id}`} className="btn btn-dark">
                    <LuClipboardCheck aria-hidden="true" className="size-4" />
                    ประเมิน
                  </Link>
                </div>
              </li>
            ))}
      </ul>
    </>
  );
}

export default TableFarmer;
