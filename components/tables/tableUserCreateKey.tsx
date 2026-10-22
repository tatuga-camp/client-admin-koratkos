import { UseQueryResult } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { LuCheck, LuCopy, LuKeyRound, LuRefreshCw } from "react-icons/lu";
import { UserCreateKey } from "../../model";
import { getOrganizationLabel, roleLabels } from "../../data/organization";
import moment from "moment";
import Swal from "sweetalert2";
import { RefetchUserCreateKey } from "../../services/userCreateKey";
import { confirmDestructive } from "../../utils";

type TableUserCreateKeyProps = {
  userCreateKeys: UseQueryResult<UserCreateKey[], Error>;
};

const formatDateTime = (date?: Date) =>
  date ? moment(date).locale("th").format("D MMM YYYY HH:mm") : "-";

const describeKey = (userCreateKey: UserCreateKey) =>
  `${roleLabels[userCreateKey.role]} ${getOrganizationLabel({ organization: userCreateKey.organization })}`;

function KeyValue({ value }: { value: string }) {
  return (
    <span className="inline-block select-all break-all rounded-md bg-fourth-color px-2.5 py-1 text-base font-semibold tabular-nums tracking-wider ring-1 ring-inset ring-third-color">
      {value}
    </span>
  );
}

function CopyKeyButton({
  userCreateKey,
  copied,
  onCopy,
  showLabel = false,
}: {
  userCreateKey: UserCreateKey;
  copied: boolean;
  onCopy: (userCreateKey: UserCreateKey) => void;
  showLabel?: boolean;
}) {
  const Icon = copied ? LuCheck : LuCopy;
  return (
    <button
      type="button"
      onClick={() => onCopy(userCreateKey)}
      aria-label={
        showLabel ? undefined : `คัดลอกรหัส ${describeKey(userCreateKey)}`
      }
      title={showLabel ? undefined : "คัดลอกรหัส"}
      className={`btn ${showLabel ? "btn-secondary" : "btn-ghost btn-icon"}`}
    >
      <Icon
        aria-hidden="true"
        className={`size-4 ${copied ? "text-main-color" : ""}`}
      />
      {showLabel && (copied ? "คัดลอกแล้ว" : "คัดลอกรหัส")}
    </button>
  );
}

function TableUserCreateKey({ userCreateKeys }: TableUserCreateKeyProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copiedTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(copiedTimer.current), []);

  const handleCopyKey = async (userCreateKey: UserCreateKey) => {
    try {
      await navigator.clipboard.writeText(userCreateKey.key);
      setCopiedId(userCreateKey.id);
      clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "คัดลอกรหัสไม่สำเร็จ",
        text: "กรุณาเลือกรหัสแล้วคัดลอกด้วยตนเอง",
      });
    }
  };

  const handleRefetchKey = async ({
    userCreateKeyId,
    currentKey,
  }: {
    userCreateKeyId: string;
    currentKey: string;
  }) => {
    const confirmed = await confirmDestructive({
      title: "รีเซ็ตรหัสสำหรับลงทะเบียน?",
      text: `รหัสเดิม ${currentKey} จะใช้ลงทะเบียนไม่ได้อีก ผู้ที่ได้รับรหัสเดิมไปแล้วต้องได้รับรหัสใหม่`,
      confirmText: "รีเซ็ตรหัส",
    });
    if (!confirmed) return;
    try {
      Swal.fire({
        title: "กำลังรีเซ็ตรหัสสำหรับลงทะเบียน",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const refetchKey = await RefetchUserCreateKey({
        userCreateKeyId: userCreateKeyId,
      });
      await userCreateKeys.refetch();
      Swal.fire({
        icon: "success",
        title: "รีเซ็ตสำเร็จ",
        text: "รีเซ็ตรหัสสำหรับลงทะเบียนสำเร็จ",
      });
    } catch (error: any) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.message,
      });
    }
  };

  const rows = userCreateKeys.data ?? [];

  if (userCreateKeys.isError) {
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
        <p className="font-semibold">โหลดรหัสสำหรับลงทะเบียนไม่สำเร็จ</p>
        <button
          type="button"
          onClick={() => userCreateKeys.refetch()}
          className="btn btn-secondary"
        >
          ลองอีกครั้ง
        </button>
      </div>
    );
  }

  if (!userCreateKeys.isLoading && rows.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
        <LuKeyRound aria-hidden="true" className="size-10 text-fifth-color" />
        <p className="font-semibold">ยังไม่มีรหัสสำหรับลงทะเบียน</p>
      </div>
    );
  }

  const resetButton = (userCreateKey: UserCreateKey, className: string) => (
    <button
      type="button"
      onClick={() =>
        handleRefetchKey({
          userCreateKeyId: userCreateKey.id,
          currentKey: userCreateKey.key,
        })
      }
      aria-label={`รีเซ็ตรหัส ${describeKey(userCreateKey)}`}
      className={`btn btn-secondary ${className}`}
    >
      <LuRefreshCw aria-hidden="true" className="size-4" />
      รีเซ็ตรหัส
    </button>
  );

  return (
    <>
      <p aria-live="polite" className="sr-only">
        {copiedId ? "คัดลอกรหัสแล้ว" : ""}
      </p>

      {/* Tablet and desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-third-color bg-fourth-color/70 text-xs font-semibold text-super-main-color/80">
            <tr>
              <th scope="col" className="px-5 py-3">รหัส</th>
              <th scope="col" className="px-3 py-3">หน้าที่</th>
              <th scope="col" className="px-3 py-3">องค์กร/หน่วยงาน</th>
              <th scope="col" className="px-3 py-3">อัปเดตล่าสุด</th>
              <th scope="col" className="px-5 py-3">
                <span className="sr-only">การดำเนินการ</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-third-color">
            {userCreateKeys.isLoading
              ? [...Array(3)].map((_, index) => (
                  <tr key={index}>
                    <td className="px-5 py-3">
                      <div className="h-8 w-32 animate-pulse rounded-md bg-third-color" />
                    </td>
                    {[...Array(3)].map((_, cell) => (
                      <td key={cell} className="px-3 py-3">
                        <div className="h-4 w-24 animate-pulse rounded bg-third-color/70" />
                      </td>
                    ))}
                    <td className="px-5 py-3">
                      <div className="ml-auto h-8 w-24 animate-pulse rounded-lg bg-third-color" />
                    </td>
                  </tr>
                ))
              : rows.map((userCreateKey) => (
                  <tr
                    key={userCreateKey.id}
                    className="transition-colors hover:bg-fourth-color/60"
                  >
                    <td className="px-5 py-2">
                      <div className="flex items-center gap-1">
                        <KeyValue value={userCreateKey.key} />
                        <CopyKeyButton
                          userCreateKey={userCreateKey}
                          copied={copiedId === userCreateKey.id}
                          onCopy={handleCopyKey}
                        />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {roleLabels[userCreateKey.role]}
                    </td>
                    <td className="min-w-[12rem] px-3 py-3">
                      {getOrganizationLabel({
                        organization: userCreateKey.organization,
                      })}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 tabular-nums">
                      {formatDateTime(userCreateKey.updateAt)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      {resetButton(userCreateKey, "btn-sm")}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Phones */}
      <ul className="divide-y divide-third-color md:hidden">
        {userCreateKeys.isLoading
          ? [...Array(3)].map((_, index) => (
              <li key={index} className="flex flex-col gap-3 p-4">
                <div className="h-4 w-40 animate-pulse rounded bg-third-color" />
                <div className="h-9 w-32 animate-pulse rounded-md bg-third-color/70" />
              </li>
            ))
          : rows.map((userCreateKey) => (
              <li key={userCreateKey.id} className="p-4">
                <p className="break-words font-semibold">
                  {getOrganizationLabel({
                    organization: userCreateKey.organization,
                  })}
                </p>
                <p className="text-xs text-super-main-color/80">
                  {roleLabels[userCreateKey.role]} · อัปเดต{" "}
                  {formatDateTime(userCreateKey.updateAt)}
                </p>
                <div className="mt-3">
                  <KeyValue value={userCreateKey.key} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <CopyKeyButton
                    userCreateKey={userCreateKey}
                    copied={copiedId === userCreateKey.id}
                    onCopy={handleCopyKey}
                    showLabel
                  />
                  {resetButton(userCreateKey, "")}
                </div>
              </li>
            ))}
      </ul>
    </>
  );
}

export default TableUserCreateKey;
