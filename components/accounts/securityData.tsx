import React, { useState } from "react";
import { User } from "../../model";
import { LuKeyRound } from "react-icons/lu";
import { DefinedUseQueryResult } from "@tanstack/react-query";
import ChangePassword from "./changePassword";

type GernerralDataProps = {
  user: DefinedUseQueryResult<User, Error>;
};
function SecurityData({ user }: GernerralDataProps) {
  const [triggerChangePassword, setTriggerChangePassword] =
    useState<boolean>(false);

  return (
    <>
      {triggerChangePassword && (
        <ChangePassword setTriggerChangePassword={setTriggerChangePassword} />
      )}
      <section aria-labelledby="security-data-title" className="card">
        <div className="card-header">
          <div className="min-w-0">
            <h2 id="security-data-title" className="card-title">
              อีเมลและการเปลี่ยนรหัสผ่าน
            </h2>
            <p className="text-sm text-super-main-color/80">
              ข้อมูลที่ใช้เข้าสู่ระบบ Korat KOS
            </p>
          </div>
        </div>

        <div className="divide-y divide-third-color">
          <div className="grid gap-1.5 p-4 sm:grid-cols-2 sm:items-center sm:gap-4 sm:p-5">
            <div>
              <label htmlFor="account-email" className="label">
                อีเมล
              </label>
              <p className="text-xs text-super-main-color/80">
                ใช้สำหรับเข้าสู่ระบบ แก้ไขเองไม่ได้
              </p>
            </div>
            <input
              id="account-email"
              type="email"
              disabled
              value={user.data.email}
              className="input"
            />
          </div>

          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="min-w-0">
              <p className="label">รหัสผ่าน</p>
              <p className="text-xs text-super-main-color/80">
                ต้องยืนยันรหัสผ่านเดิมก่อนตั้งรหัสผ่านใหม่
              </p>
            </div>
            <button
              type="button"
              onClick={() => setTriggerChangePassword(() => true)}
              className="btn btn-secondary w-full sm:w-auto"
            >
              <LuKeyRound aria-hidden="true" className="size-4" />
              เปลี่ยนรหัสผ่าน
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default SecurityData;
