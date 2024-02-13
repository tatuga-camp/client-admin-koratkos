import { UseQueryResult } from "@tanstack/react-query";
import React from "react";
import { ResponseGetAllRegisterFormaEvaluation } from "../../services/register-form";
import Image from "next/image";
import moment from "moment";
import { MdAddChart } from "react-icons/md";
import { BiNoEntry } from "react-icons/bi";
import Link from "next/link";

type TableFarmerProps = {
  registerForms: UseQueryResult<ResponseGetAllRegisterFormaEvaluation, Error>;
};

const statusEvaluation = (
  status: "pending" | "evaluating" | "approved" | "rejected",
) => {
  switch (status) {
    case "pending":
      return "รอการประเมิน";
    case "evaluating":
      return "กำลังประเมิน";
    case "approved":
      return "ผ่านการประเมิน";
    case "rejected":
      return "ไม่ผ่านการประเมิน";
  }
};
function TableFarmer({ registerForms }: TableFarmerProps) {
  return (
    <div className="w-full rounded-lg bg-fourth-color p-5">
      <table className="w-full  ">
        <thead>
          <tr className=" mb-5 grid w-full grid-cols-5 place-items-center items-center justify-start gap-5">
            <td className="w-full rounded-lg bg-super-main-color py-1 text-center font-semibold text-white">
              รายชื่อ
            </td>
            <td className="w-full rounded-lg bg-super-main-color py-1 text-center font-semibold text-white">
              เบอร์โทรศัพท์
            </td>
            <td className="w-full rounded-lg bg-super-main-color py-1 text-center font-semibold text-white">
              สถานะ
            </td>
            <td className="w-full rounded-lg bg-super-main-color py-1 text-center font-semibold text-white">
              วันยื่นคำขอ
            </td>
            <td className="w-full rounded-lg bg-super-main-color py-1 text-center font-semibold text-white">
              การประเมิน
            </td>
          </tr>
        </thead>
        <tbody className="mb-5 grid gap-2">
          {registerForms.isLoading
            ? [...Array(5)].map((_, index) => {
                return (
                  <tr className=" grid w-full grid-cols-5 items-start justify-center gap-5">
                    <td className="h-10 w-full animate-pulse rounded-lg bg-slate-400"></td>
                    <td className="h-10 w-full  animate-pulse rounded-lg bg-slate-100"></td>
                    <td className="h-10 w-full  animate-pulse rounded-lg bg-slate-300"></td>
                    <td className="h-10 w-full  animate-pulse rounded-lg bg-slate-600"></td>
                    <td className="h-10 w-full  animate-pulse rounded-lg bg-slate-100"></td>
                  </tr>
                );
              })
            : registerForms.data?.data.map((registerForm) => {
                const summitDate = moment(
                  registerForm.registerForm.summitEvaluationDate,
                )
                  .locale("th")
                  .format("DD/MMMM/YYYY");
                const status = statusEvaluation(
                  registerForm.registerForm.forms[
                    registerForm.registerForm.forms.length - 1
                  ]?.status || "pending",
                );
                return (
                  <tr className=" grid w-full grid-cols-5  items-start justify-center gap-5 ">
                    <td className="flex h-11  max-w-full items-center justify-start gap-2 overflow-x-auto  font-semibold">
                      <div className="flex w-max items-center justify-center gap-2 px-4">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full ">
                          <Image
                            src={registerForm.farmer.picture}
                            fill
                            alt="picture profile"
                            className="object-cover"
                          />
                        </div>

                        <span className=" w-max ">
                          {registerForm.farmer.firstName}{" "}
                          {registerForm.farmer.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="flex h-10 w-full items-center  justify-start gap-2  text-left  font-semibold">
                      {registerForm.farmer.phoneNumber}
                    </td>
                    <td
                      className="flex h-10 w-full items-center  justify-center gap-2 rounded-lg
                     bg-secondary-color font-semibold  text-white"
                    >
                      {status}
                    </td>
                    <td className="flex h-10 w-full items-center justify-center gap-2 text-sm font-semibold  lg:text-base">
                      {summitDate}
                    </td>

                    <td
                      className="flex h-10 w-full cursor-pointer items-center justify-center  gap-2 rounded-lg bg-super-main-color font-semibold text-white
                     drop-shadow-lg transition duration-100 hover:scale-105 active:scale-110"
                    >
                      <Link
                        className="flex w-full items-center justify-center gap-2"
                        href={`/farmer/${registerForm.farmer.id}`}
                      >
                        <MdAddChart />
                        ประเมิน
                      </Link>
                    </td>
                  </tr>
                );
              })}
        </tbody>
      </table>
    </div>
  );
}

export default TableFarmer;
