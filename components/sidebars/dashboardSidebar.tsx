import { Dialog, Transition } from "@headlessui/react";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { destroyCookie } from "nookies";
import React, { Fragment } from "react";
import { LuLogOut, LuX } from "react-icons/lu";
import { menusSidebar } from "../../data/menus";
import { getOrganizationLabel, roleLabels } from "../../data/organization";
import { User } from "../../model";

type DashboardSidebarProps = {
  user: User;
  mobileOpen: boolean;
  onMobileClose: () => void;
};

function SidebarContent({
  user,
  onNavigate,
  inDrawer = false,
}: {
  user: User;
  onNavigate?: () => void;
  /** Leaves room for the drawer's close button beside the brand. */
  inDrawer?: boolean;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSignOut = () => {
    destroyCookie(null, "access_token", { path: "/" });
    queryClient.removeQueries();
  };

  // Farmer detail pages are reached from the home queue, so keep it highlighted.
  const isActive = (href: string) =>
    href === "/"
      ? router.pathname === "/" || router.pathname.startsWith("/farmer")
      : router.pathname.startsWith(href);

  return (
    <div className="flex h-full flex-col">
      <Link
        href="/"
        onClick={onNavigate}
        className={`flex items-center gap-3 rounded-lg py-5 pl-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-main-color ${inDrawer ? "pr-14" : "pr-5"}`}
      >
        <Image src="/favicon.ico" width={40} height={40} alt="" className="size-10 shrink-0" />
        <div className="min-w-0 leading-tight">
          <p className="text-lg font-bold text-main-color">Korat KOS</p>
          <p className="text-xs text-super-main-color/80">ระบบตรวจประเมินมาตรฐาน KOS</p>
        </div>
      </Link>

      <nav aria-label="เมนูหลัก" className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="flex flex-col gap-1">
          {menusSidebar({ user }).map((menu) => {
            const active = isActive(menu.href);
            return (
              <li key={menu.href}>
                <Link
                  href={menu.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={`group relative flex h-11 items-center gap-3 rounded-lg px-3 text-[15px] transition-colors
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-color
                    ${
                      active
                        ? "bg-white font-semibold text-super-main-color shadow-sm shadow-super-main-color/5"
                        : "font-medium text-super-main-color/80 hover:bg-white/60 hover:text-super-main-color"
                    }`}
                >
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-main-color"
                    />
                  )}
                  <menu.icon
                    className={`size-5 shrink-0 ${active ? "text-main-color" : "text-super-main-color/60 group-hover:text-super-main-color"}`}
                  />
                  {menu.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-third-color p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-third-color ring-2 ring-white">
            {user.picture && (
              <Image src={user.picture} fill sizes="40px" alt="" className="object-cover" />
            )}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-semibold text-super-main-color">
              {user.firstName} {user.lastName}
            </p>
            <p className="truncate text-xs text-super-main-color/80">
              {roleLabels[user.role]}
            </p>
          </div>
        </div>
        <p className="truncate px-2 pb-2 text-xs text-super-main-color/70" title={getOrganizationLabel(user)}>
          {getOrganizationLabel(user)}
        </p>
        <Link
          href="/auth/sign-in"
          onClick={handleSignOut}
          className="btn btn-ghost w-full justify-start text-red-700 hover:bg-red-50 active:bg-red-100"
        >
          <LuLogOut className="size-5" />
          ออกจากระบบ
        </Link>
      </div>
    </div>
  );
}

function DashboardSidebar({ user, mobileOpen, onMobileClose }: DashboardSidebarProps) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-third-color bg-third-color/50 lg:block">
        <SidebarContent user={user} />
      </aside>

      <Transition show={mobileOpen} as={Fragment}>
        <Dialog onClose={onMobileClose} className="relative z-50 font-Anuphan lg:hidden">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-super-main-color/40" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-transform duration-200 ease-out motion-reduce:transition-none"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition-transform duration-150 ease-in motion-reduce:transition-none"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="fixed inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-fourth-color shadow-xl">
              <Dialog.Title className="sr-only">เมนู</Dialog.Title>
              <button
                type="button"
                onClick={onMobileClose}
                aria-label="ปิดเมนู"
                className="btn btn-ghost btn-icon btn-sm absolute right-3 top-5 w-8"
              >
                <LuX className="size-5" />
              </button>
              <SidebarContent user={user} onNavigate={onMobileClose} inDrawer />
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

export default DashboardSidebar;
