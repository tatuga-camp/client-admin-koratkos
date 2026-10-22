import { UseQueryResult } from "@tanstack/react-query";
import React, { useState } from "react";
import { User } from "../../model";
import moment from "moment";
import Image from "next/image";
import { getOrganizationLabel, roleLabels } from "../../data/organization";
import {
  LuLoader2,
  LuLogIn,
  LuSearch,
  LuSearchX,
  LuUserCheck,
  LuUsers,
  LuUserX,
} from "react-icons/lu";
import Swal from "sweetalert2";
import { DeleteUserService, UnDeleteUserService } from "../../services/admin";
import { ImpersonateUserService } from "../../services/user";
import { setCookie } from "nookies";
import StatusBadge from "../ui/StatusBadge";

type TableUsersProps = {
  users: UseQueryResult<User[], Error>;
};

const CONFIRM_DISABLE_TEXT = "ยืนยันการปิดใช้งาน";

const formatDateTime = (date?: string) =>
  date ? moment(date).locale("th").format("D MMM YYYY HH:mm") : "-";

const fullName = (user: User) => `${user.firstName} ${user.lastName}`;

function UserAvatar({ src, size }: { src: string; size: "sm" | "md" }) {
  return (
    <span
      className={`relative shrink-0 overflow-hidden rounded-full bg-third-color ${size === "sm" ? "size-9" : "size-10"}`}
    >
      {src && <Image src={src} fill sizes="40px" alt="" className="object-cover" />}
    </span>
  );
}

function AccountStatus({ user }: { user: User }) {
  return user.isDeleted ? (
    <StatusBadge status={null} label="ปิดการใช้งาน" />
  ) : (
    <StatusBadge status="approved" label="ใช้งานได้" />
  );
}

function TableUsers({ users }: TableUsersProps) {
  const [search, setSearch] = useState("");
  const [impersonatingId, setImpersonatingId] = useState<string | null>(null);

  const handleDeleteUser = async ({ user }: { user: User }) => {
    const content = document.createElement("div");
    const account = document.createElement("p");
    account.textContent = `${fullName(user)} (${user.email})`;
    const instruction = document.createElement("p");
    instruction.append("กรุณาพิมพ์ ");
    const phrase = document.createElement("strong");
    phrase.textContent = CONFIRM_DISABLE_TEXT;
    instruction.append(phrase, " เพื่อยืนยัน");
    content.append(account, instruction);

    const { value } = await Swal.fire<{ value: string }>({
      titleText: "ปิดการใช้งานบัญชีนี้?",
      input: "text",
      html: content,
      inputAttributes: {
        autocomplete: "off",
        "aria-label": `พิมพ์ ${CONFIRM_DISABLE_TEXT}`,
      },
      footer: "ผู้ใช้จะเข้าสู่ระบบไม่ได้จนกว่าจะเปิดการใช้งานอีกครั้ง",
      showCancelButton: true,
      confirmButtonText: "ปิดการใช้งาน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#dc2626",
      inputValidator: (value) => {
        if (value !== CONFIRM_DISABLE_TEXT) {
          return "กรุณาพิมพ์ข้อความยืนยันให้ถูกต้อง";
        }
      },
    });
    if (value) {
      try {
        Swal.fire({
          title: "กำลังปิดการใช้งาน",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        const deletePlant = await DeleteUserService({
          userId: user.id,
        });
        await users.refetch();
        Swal.fire({
          icon: "success",
          title: "ปิดการใช้งานสำเร็จ",
          text: `ปิดการใช้งานบัญชี ${user.email} แล้ว`,
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

  const handleUnDeleteUser = async ({ user }: { user: User }) => {
    try {
      Swal.fire({
        title: "กำลังเปิดการใช้งาน",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const deletePlant = await UnDeleteUserService({
        userId: user.id,
      });
      await users.refetch();
      Swal.fire({
        icon: "success",
        title: "เปิดการใช้งานสำเร็จ",
        text: "เปิดการใช้งานสำเร็จ",
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

  const handleImersonate = async (userId: string) => {
    try {
      setImpersonatingId(userId);
      const accessToken = await ImpersonateUserService({ userId });
      setCookie(null, "access_token", accessToken.accessToken, {
        maxAge: 2 * 24 * 60 * 60, // Cookie expiration time in seconds (e.g., 30 days)
        path: "/", // Cookie path
      });

      window.location.reload();
    } catch (error: any) {
      setImpersonatingId(null);
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.message,
      });
    }
  };

  const allUsers = users.data ?? [];
  const keyword = search.trim().toLowerCase();
  const rows = keyword
    ? allUsers.filter((user) =>
        `${fullName(user)} ${user.email}`.toLowerCase().includes(keyword),
      )
    : allUsers;

  const renderActions = (user: User, size: "sm" | "md") => {
    const sizeClass = size === "sm" ? "btn-sm" : "px-3";
    const impersonating = impersonatingId === user.id;
    return (
      <>
        <button
          type="button"
          onClick={() => handleImersonate(user.id)}
          disabled={impersonatingId !== null}
          aria-label={`เข้าสู่ระบบแทน ${fullName(user)}`}
          className={`btn btn-secondary ${sizeClass}`}
        >
          {impersonating ? (
            <LuLoader2 aria-hidden="true" className="size-4 motion-safe:animate-spin" />
          ) : (
            <LuLogIn aria-hidden="true" className="size-4" />
          )}
          เข้าสู่ระบบแทน
        </button>
        {user.isDeleted ? (
          <button
            type="button"
            onClick={() => handleUnDeleteUser({ user })}
            aria-label={`เปิดการใช้งาน ${fullName(user)}`}
            className={`btn btn-secondary ${sizeClass}`}
          >
            <LuUserCheck aria-hidden="true" className="size-4" />
            เปิดการใช้งาน
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleDeleteUser({ user })}
            aria-label={`ปิดการใช้งาน ${fullName(user)}`}
            className={`btn btn-danger-soft ${sizeClass}`}
          >
            <LuUserX aria-hidden="true" className="size-4" />
            ปิดการใช้งาน
          </button>
        )}
      </>
    );
  };

  if (users.isError) {
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
        <p className="font-semibold">โหลดรายชื่อผู้ประเมินไม่สำเร็จ</p>
        <button type="button" onClick={() => users.refetch()} className="btn btn-secondary">
          ลองอีกครั้ง
        </button>
      </div>
    );
  }

  if (!users.isLoading && allUsers.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
        <LuUsers aria-hidden="true" className="size-10 text-fifth-color" />
        <p className="font-semibold">ยังไม่มีบัญชีผู้ประเมิน</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2 border-b border-third-color px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="relative sm:w-72">
          <label htmlFor="user-search" className="sr-only">
            ค้นหาด้วยชื่อหรืออีเมล
          </label>
          <LuSearch
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-super-main-color/60"
          />
          <input
            id="user-search"
            type="search"
            placeholder="ค้นหาด้วยชื่อหรืออีเมล"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="input pl-9"
          />
        </div>
        {!users.isLoading && (
          <p aria-live="polite" className="text-sm text-super-main-color/80">
            {keyword
              ? `พบ ${rows.length} จาก ${allUsers.length} บัญชี`
              : `ทั้งหมด ${allUsers.length} บัญชี`}
          </p>
        )}
      </div>

      {!users.isLoading && rows.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
          <LuSearchX aria-hidden="true" className="size-10 text-fifth-color" />
          <p className="font-semibold">ไม่พบบัญชีที่ตรงกับคำค้นหา</p>
          <p className="text-sm text-super-main-color/80">ลองค้นหาด้วยชื่อ นามสกุล หรืออีเมล</p>
        </div>
      ) : (
        <>
          {/* Tablet and desktop */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead className="border-b border-third-color bg-fourth-color/70 text-xs font-semibold text-super-main-color/80">
                <tr>
                  <th scope="col" className="px-5 py-3">ผู้ประเมิน</th>
                  <th scope="col" className="px-3 py-3">เบอร์โทร</th>
                  <th scope="col" className="px-3 py-3">องค์กร/หน่วยงาน</th>
                  <th scope="col" className="px-3 py-3">สถานะ</th>
                  <th scope="col" className="px-3 py-3">อัปเดตล่าสุด</th>
                  <th scope="col" className="px-5 py-3">
                    <span className="sr-only">การดำเนินการ</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-third-color">
                {users.isLoading
                  ? [...Array(5)].map((_, index) => (
                      <tr key={index}>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="size-9 animate-pulse rounded-full bg-third-color" />
                            <div className="h-4 w-40 animate-pulse rounded bg-third-color" />
                          </div>
                        </td>
                        {[...Array(4)].map((_, cell) => (
                          <td key={cell} className="px-3 py-3">
                            <div className="h-4 w-20 animate-pulse rounded bg-third-color/70" />
                          </td>
                        ))}
                        <td className="px-5 py-3">
                          <div className="ml-auto h-8 w-32 animate-pulse rounded-lg bg-third-color" />
                        </td>
                      </tr>
                    ))
                  : rows.map((user) => (
                      <tr key={user.id} className="transition-colors hover:bg-fourth-color/60">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <UserAvatar src={user.picture} size="sm" />
                            <div className="min-w-0 max-w-[16rem]">
                              <p className="truncate font-semibold">{fullName(user)}</p>
                              <p className="truncate text-xs text-super-main-color/70">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 tabular-nums">
                          {user.phone || "-"}
                        </td>
                        <td className="min-w-[12rem] max-w-[16rem] px-3 py-3">
                          <p className="break-words">{getOrganizationLabel(user) || "-"}</p>
                          <p className="text-xs text-super-main-color/70">
                            {roleLabels[user.role]}
                          </p>
                        </td>
                        <td className="px-3 py-3">
                          <AccountStatus user={user} />
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 tabular-nums">
                          {formatDateTime(user.updateAt)}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex flex-col items-stretch gap-2 2xl:flex-row 2xl:justify-end">
                            {renderActions(user, "sm")}
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Phones */}
          <ul className="divide-y divide-third-color md:hidden">
            {users.isLoading
              ? [...Array(4)].map((_, index) => (
                  <li key={index} className="flex items-center gap-3 p-4">
                    <div className="size-10 animate-pulse rounded-full bg-third-color" />
                    <div className="h-4 flex-1 animate-pulse rounded bg-third-color" />
                  </li>
                ))
              : rows.map((user) => (
                  <li key={user.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <UserAvatar src={user.picture} size="md" />
                      <div className="min-w-0 flex-1">
                        <p className="break-words font-semibold">{fullName(user)}</p>
                        <p className="break-all text-xs text-super-main-color/70">
                          {user.email}
                        </p>
                      </div>
                      <AccountStatus user={user} />
                    </div>
                    <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                      <div>
                        <dt className="text-super-main-color/70">เบอร์โทร</dt>
                        <dd className="font-medium tabular-nums">{user.phone || "-"}</dd>
                      </div>
                      <div>
                        <dt className="text-super-main-color/70">หน้าที่</dt>
                        <dd className="font-medium">{roleLabels[user.role]}</dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-super-main-color/70">องค์กร/หน่วยงาน</dt>
                        <dd className="break-words font-medium">
                          {getOrganizationLabel(user) || "-"}
                        </dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-super-main-color/70">อัปเดตล่าสุด</dt>
                        <dd className="font-medium tabular-nums">
                          {formatDateTime(user.updateAt)}
                        </dd>
                      </div>
                    </dl>
                    <div className="mt-3 grid grid-cols-2 gap-2">{renderActions(user, "md")}</div>
                  </li>
                ))}
          </ul>
        </>
      )}
    </>
  );
}

export default TableUsers;
