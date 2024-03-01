import { useState, type ReactNode, useEffect } from "react";
import DashboardSidebar from "../components/sidebars/dashboardSidebar";
import { User } from "../model";
import Image from "next/image";
import {
  Button,
  FieldError,
  Input,
  Label,
  SearchField,
  Text,
} from "react-aria-components";
import { IoSearchCircleSharp } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import { GetListFarmersService } from "../services/farmer";
import Link from "next/link";
import { backgroundImageBase64 } from "../data/base64Images";
import Navbar from "@/components/navbars/Navbar";

type LayoutProps = {
  children: ReactNode;
  user: User;
};

function DashboardLayout({ children, user }: LayoutProps) {
  const [query, setQuery] = useState({
    firstName: "",
  });
  const [loading, setLoading] = useState(false);
  const farmers = useQuery({
    queryKey: ["farmers"],
    queryFn: () => GetListFarmersService({ firstName: query.firstName }),
  });

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery((prev) => ({ ...prev, firstName: e.target.value }));
  };

  useEffect(() => {
    if (query.firstName === "") return;
    setLoading(() => true);
    const delayDebounceFn = setTimeout(async () => {
      await farmers.refetch();
      setLoading(() => false);
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [query.firstName]);
  return (
    <section className="flex bg-third-color font-Anuphan">
      <DashboardSidebar />
      <div className="flex w-full flex-col items-center pb-10 lg:pt-10">
        <section className="lg:hidden">
          <Navbar />
        </section>

        <section className="flex w-full flex-col items-center justify-between gap-3 px-10 lg:w-11/12 lg:flex-row lg:px-5">
          <div className=" flex flex-col gap-1  font-semibold">
            <span className="text-2xl font-semibold">สวัสดี! </span>
            <span className="text-4xl">
              {user.firstName} {user.lastName}
            </span>
            <span className="text-sm text-secondary-color">{user.email}</span>
          </div>

          <SearchField className="relative z-20 flex w-full flex-col gap-2 lg:w-80 ">
            <Label>ค้นหาเกษตรกร</Label>
            <Input
              placeholder="ค้นหาด้วยชื่อจริง"
              onChange={handleChangeSearch}
              value={query.firstName}
              className=" h-10 rounded-lg bg-slate-50 p-5 pl-10 outline-0 ring-1 ring-slate-400 lg:w-full"
            />
            <IoSearchCircleSharp className="absolute bottom-0 left-2 top-6 m-auto text-3xl text-super-main-color" />
            <FieldError />

            {query.firstName && (
              <ul className="absolute top-20 flex h-max w-full flex-col gap-2 rounded-lg bg-white p-5 drop-shadow-lg">
                {loading === true
                  ? [...new Array(2)].map((_, index) => {
                      return (
                        <li
                          className="h-8 w-full animate-pulse rounded-lg bg-gray-100"
                          key={index}
                        ></li>
                      );
                    })
                  : farmers.data && farmers.data?.length > 0
                    ? farmers.data?.map((farmer) => {
                        return (
                          <li
                            className="flex h-12 w-full cursor-pointer items-center justify-start rounded-lg
                             border-b-2 p-2 font-semibold text-super-main-color
                             transition  hover:bg-slate-100 
                            active:scale-110"
                            key={farmer.id}
                          >
                            <Link
                              href={`/farmer/${farmer.id}`}
                              className="flex items-center justify-start gap-2"
                            >
                              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-black">
                                <Image
                                  src={farmer.picture}
                                  fill
                                  alt="farmer profile picture"
                                  placeholder="blur"
                                  sizes="(max-width: 768px) 100vw, 33vw"
                                  blurDataURL={backgroundImageBase64}
                                  className="object-cover"
                                />
                              </div>
                              <span className="flex">
                                {farmer.firstName} {farmer.lastName}
                              </span>
                            </Link>
                          </li>
                        );
                      })
                    : (farmers.isError || farmers.data?.length === 0) && (
                        <li className="text-lg font-bold text-red-600">
                          ไม่พบข้อมูล
                        </li>
                      )}
              </ul>
            )}
          </SearchField>

          <div className="relative flex items-center justify-center ">
            <div className="relative my-4 h-32 w-32 overflow-hidden rounded-full bg-transparent ring-2 ring-super-main-color lg:h-24 lg:w-24">
              <Image
                alt="picture profile"
                src={user.picture}
                fill
                className="object-contain"
              />
            </div>
            <div
              className="absolute -bottom-3 left-0 right-0 m-auto
             rounded-full bg-secondary-color px-4 py-1 text-center text-sm font-semibold text-white"
            >
              ผู้ประเมิน
            </div>
          </div>
        </section>
        {children}
      </div>
    </section>
  );
}

export default DashboardLayout;
