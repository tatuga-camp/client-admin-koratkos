import { UseQueryResult } from "@tanstack/react-query";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaSortAmountDown, FaSortAmountUpAlt } from "react-icons/fa";
import { MdAddChart } from "react-icons/md";
import { RegisterFormEvaluation, StatusEvaluation } from "../../model";
import {
  RequestGetAllReadyRegisterFormByPage,
  ResponseGetAllRegisterFormaEvaluation,
} from "../../services/register-form";
import UpdateCertificateFormStatus from "../forms/UpdateCertificateFormStatus";

type TableFarmerProps = {
  registerForms: UseQueryResult<ResponseGetAllRegisterFormaEvaluation, Error>;
  setRegisterFormsQuery: React.Dispatch<
    React.SetStateAction<RequestGetAllReadyRegisterFormByPage>
  >;
  registerFormsQuery: RequestGetAllReadyRegisterFormByPage;
};

const statusEvaluation = (status: StatusEvaluation) => {
  switch (status) {
    case "pending":
      return "รอการประเมิน";

    case "approved":
      return "ผ่านการประเมิน";
    case "rejected":
      return "ไม่ผ่านการประเมิน";
  }
};
const certificateStatus = (status: StatusEvaluation) => {
  switch (status) {
    case "pending":
      return "รอการพิจารณา";

    case "approved":
      return "ผ่านการพิจารณา";
    case "rejected":
      return "ไม่ผ่านการพิจารณา";
  }
};
function TableFarmer({
  registerForms,
  setRegisterFormsQuery,
  registerFormsQuery,
}: TableFarmerProps) {
  const [selectRegisterForm, setSelectRegisterForm] =
    useState<RegisterFormEvaluation | null>(null);

  return (
    <>
      {selectRegisterForm && (
        <UpdateCertificateFormStatus
          onClose={() => setSelectRegisterForm(null)}
          registerForms={registerForms}
          selectRegisterForm={selectRegisterForm}
        />
      )}
      <div className="h-96 w-full overflow-auto rounded-lg bg-fourth-color p-5">
        <table className="w-max min-w-full">
          <thead>
            <tr className="">
              {[
                "รายชื่อ",
                "เบอร์โทรศัพท์",
                "สถานะ",
                "พิจารณา",
                "รอบครั้งการประเมิน",
              ].map((text, i) => {
                return (
                  <td key={i}>
                    <div className="w-full rounded-lg bg-super-main-color py-1 text-center font-semibold text-white">
                      {text}
                    </div>
                  </td>
                );
              })}
              <td>
                <div
                  onClick={() =>
                    setRegisterFormsQuery((prev) => {
                      return {
                        ...prev,
                        orderBy: {
                          summitEvaluationDate:
                            prev.orderBy?.summitEvaluationDate === "asc"
                              ? "desc"
                              : "asc",
                        },
                      };
                    })
                  }
                  className="flex w-full cursor-pointer select-none items-center justify-center gap-1 rounded-lg bg-super-main-color py-1 text-center
             font-semibold text-white transition duration-100 active:scale-110"
                >
                  วันยื่นคำขอ
                  {registerFormsQuery.orderBy?.summitEvaluationDate ===
                  "asc" ? (
                    <FaSortAmountDown />
                  ) : (
                    <FaSortAmountUpAlt />
                  )}
                </div>
              </td>
              <td>
                <div className="w-full rounded-lg bg-super-main-color py-1 text-center font-semibold text-white">
                  การประเมิน
                </div>
              </td>
            </tr>
          </thead>
          <tbody className="mb-5  gap-2">
            {registerForms.isLoading
              ? [...Array(5)].map((_, index) => {
                  return (
                    <tr key={index} className="">
                      <td>
                        <div className="h-10 w-full animate-pulse rounded-lg bg-slate-400"></div>
                      </td>
                      <td>
                        <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100"></div>
                      </td>
                      <td>
                        <div className="h-10 w-full animate-pulse rounded-lg bg-slate-300"></div>
                      </td>
                      <td>
                        <div className="h-10 w-full animate-pulse rounded-lg bg-slate-500"></div>
                      </td>
                      <td>
                        <div className="h-10 w-full animate-pulse rounded-lg bg-slate-300"></div>
                      </td>
                      <td>
                        <div className="h-10 w-full animate-pulse rounded-lg bg-slate-600"></div>
                      </td>
                      <td>
                        <div className="h-10 w-full animate-pulse rounded-lg bg-slate-400"></div>
                      </td>
                    </tr>
                  );
                })
              : registerForms.data?.data.map((registerForm) => {
                  const summitDate = moment(
                    registerForm.registerForm?.summitEvaluationDate,
                  )
                    .locale("th")
                    .format("DD/MMMM/YYYY");
                  const status = statusEvaluation(
                    registerForm.registerForm?.status,
                  );
                  const certificate_status = certificateStatus(
                    registerForm.registerForm?.certificate_status ?? "pending",
                  );
                  return (
                    <tr key={registerForm.farmer.id} className="  ">
                      <td>
                        <div className="flex w-max items-center justify-center gap-2 px-4">
                          <div className="relative h-8 w-8 overflow-hidden rounded-full ">
                            <Image
                              src={registerForm.farmer.picture}
                              fill
                              alt="picture profile"
                              className="object-cover"
                            />
                          </div>

                          <span className=" w-max text-sm ">
                            {registerForm.farmer.firstName}{" "}
                            {registerForm.farmer.lastName}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="flex h-10 w-full items-center  justify-start gap-2  text-left  font-semibold">
                          {registerForm.farmer.phoneNumber}
                        </div>
                      </td>
                      <td>
                        <div
                          className={`flex h-10 w-full items-center  justify-center gap-2 rounded-lg
                     ${
                       registerForm?.registerForm?.status === "pending"
                         ? "bg-secondary-color"
                         : registerForm?.registerForm?.status === "approved"
                           ? "bg-green-700"
                           : registerForm?.registerForm?.status === "rejected"
                             ? "bg-red-700"
                             : "bg-gray-600"
                     } font-semibold  text-white`}
                        >
                          {registerForm.registerForm
                            ? status
                            : "ยังไม่ยื่นคำขอ"}
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            if (registerForm.registerForm) {
                              setSelectRegisterForm(
                                () => registerForm.registerForm,
                              );
                            } else {
                              alert(
                                "ไม่สามารถอัปเดทสถานะพิจารณาได้เนื่องจากไม่มีผลการประเมิน",
                              );
                            }
                          }}
                          className={`flex h-10 w-full items-center justify-center gap-2  rounded-lg hover:ring-1 active:scale-105
                     ${
                       registerForm?.registerForm?.certificate_status ===
                       "pending"
                         ? "bg-secondary-color"
                         : registerForm?.registerForm?.certificate_status ===
                             "approved"
                           ? "bg-green-700"
                           : registerForm?.registerForm?.certificate_status ===
                               "rejected"
                             ? "bg-red-700"
                             : "bg-gray-600"
                     } font-semibold  text-white`}
                        >
                          {registerForm.registerForm
                            ? certificate_status
                            : "ยังไม่ยื่นคำขอ"}
                        </button>
                      </td>
                      <td>
                        <div className="flex h-10 w-full items-center justify-center gap-2 text-xs font-semibold  lg:text-sm xl:text-base">
                          ประเมินไปแล้ว {registerForm.formEvaluations?.length}{" "}
                          ครั้ง
                        </div>
                      </td>
                      <td>
                        <div className="flex h-10 w-full items-center justify-center gap-2 text-xs font-semibold  lg:text-sm xl:text-base">
                          {registerForm.registerForm ? summitDate : "-"}
                        </div>
                      </td>

                      <td>
                        <Link
                          className="flex h-10 w-full cursor-pointer items-center justify-center  gap-2 rounded-lg bg-super-main-color font-semibold text-white
                     drop-shadow-lg transition duration-100 hover:scale-105 active:scale-110"
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
    </>
  );
}

export default TableFarmer;
