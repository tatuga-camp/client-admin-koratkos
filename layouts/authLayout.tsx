import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { LuArrowLeft } from "react-icons/lu";
import { sponsors } from "../data/menus";

type AuthLayoutProps = {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  /** Links under the form, e.g. "no account yet?". */
  footer?: ReactNode;
  /** Wider form column for long forms such as sign-up. */
  wide?: boolean;
};

const mainClientUrl = process.env.NEXT_PUBLIC_MAIN_CLIENT_URL as string;

function AuthLayout({ title, description, children, footer, wide = false }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-fourth-color font-Anuphan text-super-main-color">
      <aside className="sticky top-0 hidden h-screen w-[26rem] shrink-0 flex-col justify-between bg-third-color p-10 lg:flex xl:w-[30rem]">
        <a
          href={mainClientUrl}
          className="inline-flex w-max items-center gap-2 rounded-lg text-sm font-medium text-super-main-color/80 hover:text-super-main-color focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-color"
        >
          <LuArrowLeft aria-hidden="true" className="size-4" />
          กลับหน้าหลัก Korat KOS
        </a>

        <div>
          <Image src="/ks_logo_photo.png" width={80} height={80} alt="" priority className="size-20" />
          <p className="mt-6 text-4xl font-bold text-main-color">Korat KOS</p>
          <p className="mt-3 text-lg font-medium leading-relaxed">
            ระบบตรวจประเมินมาตรฐานเกษตรอินทรีย์ขั้นพื้นฐาน จังหวัดนครราชสีมา
          </p>
          <p className="mt-2 text-super-main-color/80">
            สำหรับคณะกรรมการและเจ้าหน้าที่ผู้ประเมิน
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-super-main-color/80">หน่วยงานสนับสนุน</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {sponsors.map((sponsor) => (
              <li key={sponsor.url}>
                <Image
                  src={sponsor.url}
                  width={40}
                  height={40}
                  alt={sponsor.title}
                  title={sponsor.title}
                  className="size-10 rounded-full bg-white object-contain ring-1 ring-fifth-color/40"
                />
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-third-color bg-white px-5 py-3 lg:hidden">
          <div className="flex items-center gap-2">
            <Image src="/ks_logo_photo.png" width={36} height={36} alt="" priority className="size-9" />
            <span className="font-bold text-main-color">Korat KOS</span>
          </div>
          <a
            href={mainClientUrl}
            className="btn btn-ghost btn-sm"
          >
            <LuArrowLeft aria-hidden="true" className="size-4" />
            หน้าหลัก
          </a>
        </header>

        <main className="flex flex-1 items-start justify-center px-5 py-10 sm:items-center sm:px-8">
          <div className={`w-full ${wide ? "max-w-2xl" : "max-w-sm"}`}>
            <h1 className="text-2xl font-bold sm:text-[1.75rem]">{title}</h1>
            {description && (
              <p className="mt-2 text-sm text-super-main-color/80 sm:text-base">{description}</p>
            )}
            <div className="mt-8">{children}</div>
            {footer && (
              <div className="mt-6 text-center text-sm text-super-main-color/80">{footer}</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AuthLayout;
