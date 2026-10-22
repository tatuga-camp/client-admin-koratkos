import React from "react";
import Head from "next/head";
import Link from "next/link";
import { LuHome } from "react-icons/lu";
import Error404 from "../components/svgs/404";

function ErrorNotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-fourth-color px-4 py-10 font-Anuphan text-super-main-color">
      <Head>
        <title>ไม่พบหน้าที่ต้องการ | Korat KOS</title>
      </Head>
      <main className="card w-full max-w-md px-6 py-10 text-center sm:px-10">
        <p
          aria-hidden="true"
          className="flex items-center justify-center gap-1 text-7xl font-bold leading-none text-super-main-color sm:text-8xl"
        >
          4
          <span className="size-16 sm:size-20">
            <Error404 />
          </span>
          4
        </p>
        <h1 className="mt-8 text-xl font-bold sm:text-2xl">
          <span className="sr-only">404 </span>ไม่พบหน้าที่คุณต้องการ
        </h1>
        <p className="mt-2 text-sm text-super-main-color/80 sm:text-base">
          หน้านี้อาจถูกย้ายหรือลบไปแล้ว หรือที่อยู่ลิงก์ไม่ถูกต้อง
        </p>
        <Link href="/" className="btn btn-primary mt-8 h-11 w-full text-base sm:w-auto sm:px-6">
          <LuHome aria-hidden="true" className="size-5" />
          กลับหน้าหลัก
        </Link>
      </main>
    </div>
  );
}

export default ErrorNotFoundPage;
