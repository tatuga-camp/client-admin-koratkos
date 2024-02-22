import Link from "next/link";
import React from "react";
import Return from "../svgs/Return";
import KOSLogo from "../svgs/KOSLogo";
import KOSLogoLarge from "../svgs/KOSLogoLarge";
import { RiArrowGoBackFill } from "react-icons/ri";
import Leaf from "../svgs/Leaf";
import Image from "next/image";

const HomepageSidebar = () => {
  return (
    <div className="sticky top-0 hidden h-screen lg:block lg:w-96 lg:bg-[#F1E4C3]">
      <div className="flex items-center justify-center">
        {/* return */}
        <Link
          href={process.env.NEXT_PUBLIC_MAIN_CLIENT_URL as string}
          className="mt-4 flex flex-col items-center justify-center gap-1"
        >
          <div className="absolute left-5 top-5 flex flex-col items-center gap-1">
            <section
              className="flex h-[38px] w-[38px] items-center justify-center rounded-lg bg-[#597E52] text-2xl text-white
           duration-300 hover:bg-[#81b077]"
            >
              <RiArrowGoBackFill />
            </section>
            <p className="text-[0.65rem] font-semibold text-[#597E52]">
              ย้อนกลับ
            </p>
          </div>
        </Link>

        {/* Logo */}
        <div className="absolute top-[7rem] z-10 flex w-10/12 justify-center ">
          <div className="flex flex-col ">
            {/* img */}
            <div className="-mb-5 flex items-end justify-end pr-3">
              <div className="relative h-[6.25rem] w-[6.25rem]">
                <Image
                  src="/ks_logo_photo.png"
                  alt="logo"
                  width={200}
                  height={200}
                  className="overflow-hidden object-contain"
                />
              </div>
            </div>

            <section className="font-bold">WELCOME TO</section>
            <h1 className="overflow-hidden text-5xl font-bold text-[#597E52]">
              Korat KOS
            </h1>
            <p className="mt-2 text-[0.8rem] font-semibold text-[#5C430D]">
              ระบบสมัครขอรับการตรวจประเมินมาตรฐาน
              <br />
              เกษตรอินทรีย์ขั้นพื้นฐานจังหวัดนครราชสีมา
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 z-0 w-full">
          <Leaf />
        </div>
      </div>
    </div>
  );
};

export default HomepageSidebar;
