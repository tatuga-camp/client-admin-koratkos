import { UseQueryResult } from "@tanstack/react-query";
import React from "react";
import { UserCreateKey } from "../../model";
import { organizationLists } from "../../data/organization";
import moment from "moment";
import Swal from "sweetalert2";
import { RefetchUserCreateKey } from "../../services/userCreateKey";

type TableUserCreateKeyProps = {
  userCreateKeys: UseQueryResult<UserCreateKey[], Error>;
};
function TableUserCreateKey({ userCreateKeys }: TableUserCreateKeyProps) {
  const handleRefetchKey = async ({
    userCreateKeyId,
  }: {
    userCreateKeyId: string;
  }) => {
    try {
      Swal.fire({
        title: "กำลังรีเซ็ตรหัส Key Signature",
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
        text: "รีเซ็ตรหัส Key Signature สำเร็จ",
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
  return (
    <div className="w-[48rem] overflow-auto rounded-lg bg-fourth-color p-5 xl:w-10/12 2xl:w-11/12">
      <h1 className="my-2 text-xl font-semibold text-super-main-color">
        Key Signature
      </h1>
      <table className="w-max table-auto border-collapse ">
        <thead>
          <tr className="sticky  top-0 border-2  border-super-main-color bg-fifth-color text-white">
            <th className="h-10 border-2 border-super-main-color  px-2">
              รหัส Key Signature
            </th>
            <th className="h-10 border-2 border-super-main-color px-2">
              หน้าที่
            </th>
            <th className="h-10 border-2 border-super-main-color px-2">
              องค์กร/หน่วยงาน
            </th>
            <th className="h-10 border-2 border-super-main-color px-2">
              อัพเดทล่าสุด
            </th>
            <th className="h-10 border-2 border-super-main-color px-2">
              ตั้งค่า
            </th>
          </tr>
        </thead>
        <tbody>
          {userCreateKeys.data?.map((userCreateKey) => (
            <tr
              key={userCreateKey.id}
              className="border-2 border-super-main-color"
            >
              <td className="h-10 border-2 border-super-main-color px-2 text-2xl">
                {userCreateKey.key}
              </td>
              <td className="h-10 border-2 border-super-main-color px-2">
                {userCreateKey.role}
              </td>
              <td className="h-10 border-2 border-super-main-color px-2">
                {
                  organizationLists?.find(
                    (list) => list.value === userCreateKey.organization,
                  )?.title
                }
              </td>
              <td className="h-10 border-2 border-super-main-color px-2">
                {moment(userCreateKey.updateAt).format("DD/MM/YYYY HH:mm:ss")}
              </td>
              <td className="h-10 border-2 border-super-main-color px-2">
                <button
                  onClick={() =>
                    handleRefetchKey({ userCreateKeyId: userCreateKey.id })
                  }
                  className="rounded-lg bg-super-main-color px-2 py-1 text-white transition duration-100 hover:scale-105"
                >
                  รีเซ็ตรหัส Key Signature
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableUserCreateKey;
