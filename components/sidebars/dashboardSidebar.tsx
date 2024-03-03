import Image from "next/image";
import Link from "next/link";
import React from "react";
import { RiShutDownLine } from "react-icons/ri";
import { menusSidebar } from "../../data/menus";
import { useQueryClient } from "@tanstack/react-query";
import { destroyCookie } from "nookies";
import { User } from "../../model";

function DashboardSidebar({ user }: { user: User }) {
  const queryClient = useQueryClient();
  const useSignOut = () => {
    destroyCookie(null, "access_token", { path: "/" });
    queryClient.removeQueries();
  };

  return (
    <div
      className="sticky top-0  hidden h-screen flex-col items-center justify-between bg-fourth-color
     px-5 py-10 lg:flex lg:w-60 xl:w-96"
    >
      <div className="flex flex-col gap-20">
        <Link
          href="/"
          className="flex flex-col items-center justify-center  gap-1  "
        >
          <div className="flex items-end justify-center gap-1">
            <h1 className="text-lg font-bold uppercase text-main-color ">
              Korat KOS
            </h1>
            <div className="relative h-12 w-12">
              <Image
                src="/favicon.ico"
                fill
                alt="icon"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>
          <p className=" w-full text-balance  text-center text-xs font-medium text-super-main-color">
            ระบบสมัครขอรับการตรวจประเมินมาตรฐาน เกษตรอินทรีย์ขั้นพื้นฐาน
            จังหวัดนครราชสีมา
          </p>
        </Link>
        <ul className="flex flex-col  items-center justify-center gap-4">
          {menusSidebar({ user }).map((menu, index) => {
            return (
              <Link
                className="flex  items-center justify-start gap-2 rounded-lg p-1 text-lg font-semibold text-super-main-color ring-third-color transition duration-100
               hover:bg-white hover:text-super-main-color hover:ring-2 hover:drop-shadow-lg active:scale-110 xl:text-2xl"
                href={menu.href}
                key={index}
              >
                <menu.icon />
                {menu.title}
              </Link>
            );
          })}
        </ul>
      </div>
      <Link
        href="/auth/sign-in"
        onClick={useSignOut}
        className="flex flex-col items-center justify-center "
      >
        <div
          className="rounded-full bg-red-600 p-3 text-4xl text-white drop-shadow-lg
         transition duration-150 hover:bg-red-800 active:scale-110"
        >
          <RiShutDownLine />
        </div>
        <span className="text-xl font-extrabold text-black">ออกจากระบบ</span>
      </Link>
    </div>
  );
}

export default DashboardSidebar;
