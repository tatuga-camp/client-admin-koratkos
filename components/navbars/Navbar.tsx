import Link from "next/link";
import React from "react";
import { RiArrowGoBackFill } from "react-icons/ri";
import Return from "../svgs/Return";
import KOSLogo from "../svgs/KOSLogo";

const Navbar = () => {
  return (
    <div className="h-full w-screen">
      <div className="flex h-[8rem] w-full items-center justify-between bg-[#F1E4C3] p-6 font-Anuphan lg:hidden">
        <div>
          <Link
            href={process.env.NEXT_PUBLIC_MAIN_CLIENT_URL as string}
            className="mt-4 flex flex-col items-center justify-center gap-1"
          >
            <Return />
            <p className="text-[0.8rem] font-bold text-[#597E52]">ย้อนกลับ</p>
          </Link>
        </div>

        <div className="text-[0.7rem] font-bold text-[#5C430D]">
          <section className="flex items-center gap-2">
            <h1 className="text-[2.1rem] font-bold text-[#597E52]">
              Korat KOS
            </h1>
            <KOSLogo />
          </section>
          <section className="-mt-1 flex flex-col">
            <p>ระบบสมัครขอรับการตรวจประเมินมาตรฐาน</p>
            <p>เกษตรอินทรีย์ขั้นพื้นฐาน จังหวัดนครราชสีมา</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
