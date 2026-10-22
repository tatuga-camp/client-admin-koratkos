import { Combobox, Transition } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import React, { Fragment, useState } from "react";
import { LuCheck, LuChevronsUpDown, LuLoader2 } from "react-icons/lu";
import { Amphure } from "../../model";
import { SignUpData } from "../../pages/auth/sign-up";
import { GetAllAmphuresByProvinceService } from "../../services/thai-data";

type AmphureComBoxProps = {
  signUpData: SignUpData | undefined;
  setSignUpData: React.Dispatch<React.SetStateAction<SignUpData | undefined>>;
};
function AmphureComBox({ signUpData, setSignUpData }: AmphureComBoxProps) {
  const [query, setQuery] = useState("");
  const amphures = useQuery({
    queryKey: ["amphures"],
    queryFn: () => GetAllAmphuresByProvinceService(),
  });
  const filterAmphures =
    query === ""
      ? amphures.data
      : amphures.data?.filter((amphure: Amphure) => {
          return amphure.name_th.toLowerCase().includes(query.toLowerCase());
        });
  return (
    <Combobox
      value={signUpData?.amphure}
      onChange={(value) => {
        setSignUpData((prev: any) => {
          return {
            ...prev,
            amphure: value,
          };
        });
      }}
    >
      <div className="flex flex-col gap-1.5">
        <Combobox.Label className="label">อำเภอ</Combobox.Label>
        {amphures.isLoading ? (
          <div className="flex h-10 w-full items-center gap-2 rounded-lg border border-third-color bg-third-color/40 px-3 text-sm text-super-main-color/80">
            <LuLoader2 aria-hidden="true" className="size-4 motion-safe:animate-spin" />
            กำลังโหลดรายชื่ออำเภอ
          </div>
        ) : (
          <div className="relative">
            <Combobox.Input
              required
              placeholder="เลือกอำเภอ"
              className="input pr-10"
              displayValue={(amphure: Amphure) => amphure?.name_th ?? ""}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-lg text-super-main-color/70 hover:text-super-main-color">
              <LuChevronsUpDown aria-hidden="true" className="size-4" />
            </Combobox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery("")}
            >
              <Combobox.Options className="absolute inset-x-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-xl border border-third-color bg-white py-1 text-sm shadow-lg shadow-super-main-color/10 focus:outline-none">
                {!filterAmphures || filterAmphures.length === 0 ? (
                  <div className="px-4 py-2.5 text-super-main-color/80">
                    {query === ""
                      ? "ไม่มีรายชื่ออำเภอ"
                      : `ไม่พบอำเภอที่ตรงกับ “${query}”`}
                  </div>
                ) : (
                  filterAmphures.map((amphure) => (
                    <Combobox.Option
                      key={amphure.id}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2.5 pl-10 pr-4 text-super-main-color ${
                          active ? "bg-fourth-color" : ""
                        }`
                      }
                      value={amphure}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block ${
                              selected ? "font-semibold" : "font-normal"
                            }`}
                          >
                            {amphure.name_th}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-main-color">
                              <LuCheck aria-hidden="true" className="size-4" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        )}
      </div>
    </Combobox>
  );
}

export default AmphureComBox;
