import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useState } from "react";
import { LuMenu } from "react-icons/lu";
import FarmerSearch from "../components/navbars/FarmerSearch";
import DashboardSidebar from "../components/sidebars/dashboardSidebar";
import { roleLabels } from "../data/organization";
import { User } from "../model";

type LayoutProps = {
  children: ReactNode;
  user: User;
};

function DashboardLayout({ children, user }: LayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-fourth-color font-Anuphan text-super-main-color">
      <DashboardSidebar
        user={user}
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-third-color bg-fourth-color/90 backdrop-blur">
          <div className="flex h-16 items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="เปิดเมนู"
              className="btn btn-ghost btn-icon -ml-2 lg:hidden"
            >
              <LuMenu className="size-6" />
            </button>
            <Link href="/" aria-label="หน้าหลัก" className="hidden shrink-0 sm:block lg:hidden">
              <Image src="/favicon.ico" width={32} height={32} alt="" className="size-8" />
            </Link>

            <FarmerSearch className="min-w-0 flex-1 sm:max-w-md" />

            <Link
              href="/account/setting"
              className="ml-auto flex shrink-0 items-center gap-3 rounded-lg p-1 hover:bg-third-color/50
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-color sm:pr-3"
            >
              <span className="relative size-9 overflow-hidden rounded-full bg-third-color ring-2 ring-white">
                {user.picture && (
                  <Image src={user.picture} fill sizes="36px" alt="" className="object-cover" />
                )}
              </span>
              <span className="hidden leading-tight md:block">
                <span className="block max-w-[12rem] truncate text-sm font-semibold">
                  {user.firstName} {user.lastName}
                </span>
                <span className="block text-xs text-super-main-color/70">
                  {roleLabels[user.role]}
                </span>
              </span>
              <span className="sr-only md:hidden">การตั้งค่าบัญชี</span>
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
