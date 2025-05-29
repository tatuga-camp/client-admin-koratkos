import { UseQueryResult } from "@tanstack/react-query";
import React from "react";
import { User } from "../../model";
import moment from "moment";
import Image from "next/image";
import { organizationLists } from "../../data/organization";
import { AiOutlineUserDelete } from "react-icons/ai";
import Swal from "sweetalert2";
import { DeleteUserService, UnDeleteUserService } from "../../services/admin";
import { ImpersonateUserService } from "../../services/user";
import { setCookie } from "nookies";
import { MdLogin } from "react-icons/md";

type TableUsersProps = {
  users: UseQueryResult<User[], Error>;
};

function TableUsers({ users }: TableUsersProps) {
  const handleDeleteUser = async ({ user }: { user: User }) => {
    let content = document.createElement("div");
    content.innerHTML =
      "<div>กรุณาพิมพ์ข้อความนี้</div> <strong>" +
      "ยืนยันการลบ" +
      "</strong> <div>เพื่อปิดการใช้งาน user</div>";
    const { value } = await Swal.fire<{ value: string }>({
      title: `ปิดการใช้งานบัญชี${user.email}`,
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
        const deletePlant = await DeleteUserService({
          userId: user.id,
        });
        await users.refetch();
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
      const accessToken = await ImpersonateUserService({ userId });
      setCookie(null, "access_token", accessToken.accessToken, {
        maxAge: 2 * 24 * 60 * 60, // Cookie expiration time in seconds (e.g., 30 days)
        path: "/", // Cookie path
      });

      window.location.reload();
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
        รายชื่อผู้ประเมิน
      </h1>
      <div className=" w-full overflow-auto p-5 ">
        <table className="w-max table-auto border-collapse ">
          <thead>
            <tr className="sticky  top-0 border-2  border-super-main-color bg-fifth-color text-white">
              <th className="h-10 border-2 border-super-main-color  px-2">
                ชื่อ
              </th>
              <th className="h-10 border-2 border-super-main-color px-2">
                Email
              </th>
              <th className="h-10 border-2 border-super-main-color px-2">
                เบอร์โทร
              </th>
              <th className="h-10 border-2 border-super-main-color px-2">
                องค์กร/หน่วยงาน
              </th>
              <th className="h-10 border-2 border-super-main-color px-2">
                สะถานะ
              </th>
              <th className="h-10 border-2 border-super-main-color px-2">
                เข้าสู่ระบบล่าสุดเมื่อ
              </th>
              <th className="h-10 border-2 border-super-main-color px-2">
                ตั้งค่า
              </th>
            </tr>
          </thead>
          <tbody>
            {users.data?.map((user, index) => {
              return (
                <tr key={index} className="text-left hover:bg-third-color">
                  <td className="h-16 px-3">
                    <div className="flex items-center justify-start gap-2">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full ">
                        <Image
                          src={user.picture}
                          fill
                          alt="user profile"
                          className="object-cover"
                        />
                      </div>{" "}
                      {user.firstName} {user.lastName}
                    </div>
                  </td>
                  <td className="px-3">{user.email}</td>
                  <td className=" px-3">{user.phone}</td>
                  <td className="px-3 ">
                    {
                      organizationLists?.find(
                        (list) => list.value === user.organization,
                      )?.title
                    }
                    {user.organization === "argiculturalAmphure" &&
                      user.amphure}
                    {user.organization === "argiculturalTambon" && user.tambon}
                  </td>
                  <td className="px-3 ">
                    {user.isDeleted ? (
                      <div className="rounded-lg bg-gray-600 px-2 py-1 text-white">
                        ไม่พร้อมใช้งาน
                      </div>
                    ) : (
                      <div className="rounded-lg bg-green-600 px-2 py-1 text-white">
                        ปกติ
                      </div>
                    )}
                  </td>
                  <td className="px-3 ">
                    {moment(user.updateAt).format("DD/MM/YYYY HH:mm:ss")}
                  </td>
                  <td className="px-3 ">
                    <div className="flex w-full gap-2">
                      {user.isDeleted ? (
                        <button
                          onClick={() => handleUnDeleteUser({ user })}
                          className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-600 
                    px-2 py-1 text-white transition duration-100 hover:scale-105 hover:bg-green-700"
                        >
                          เปิดการใช้งาน
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDeleteUser({ user })}
                          className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 
                    px-2 py-1 text-white transition duration-100 hover:scale-105 hover:bg-red-700"
                        >
                          <AiOutlineUserDelete />
                          ปิดการใช้งาน
                        </button>
                      )}
                      <button
                        onClick={() => handleImersonate(user.id)}
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 
                    px-2 py-1 text-white transition duration-100 hover:scale-105 hover:bg-red-700"
                      >
                        <MdLogin />
                        เข้าสู่ระบบ
                      </button>
                    </div>
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

export default TableUsers;
