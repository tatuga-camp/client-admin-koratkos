import { Combobox, Transition } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import React, { Fragment, useEffect, useState } from "react";
import { Input, Label, TextField } from "react-aria-components";
import { FaCheck } from "react-icons/fa";
import { RiExpandUpDownLine } from "react-icons/ri";
import { GetAllAmphuresByProvinceService } from "../../services/thai-data";
import { Amphure } from "../../model";
import { SignUpData } from "../../pages/auth/sign-up";

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
      <div className="relative flex flex-col items-start justify-center  gap-2">
        <Label className="text-xl font-semibold text-[#597E52] md:text-base">
          อำเภอ :
        </Label>
        {amphures.isLoading ? (
          <div className="relative flex h-10 w-96 animate-pulse items-center justify-start rounded-lg bg-gray-400 px-3">
            กำลังโหลด..
          </div>
        ) : (
          <div
            className="relative w-full cursor-default overflow-hidden bg-slate-200
       text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75
        focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
          >
            <Combobox.Input
              required
              className="h-10 w-[20rem] rounded-lg border-[1px] border-solid border-slate-300 px-3 py-2 md:w-[25rem] md:py-1"
              displayValue={(amphure: Amphure) => amphure.name_th}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <RiExpandUpDownLine />
            </Combobox.Button>
          </div>
        )}
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options
            className="absolute top-20  z-50 mt-1 max-h-36  w-full overflow-auto rounded-md bg-white 
      py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
          >
            {filterAmphures?.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                ไม่พบข้อมูล
              </div>
            ) : (
              filterAmphures?.map((amphure) => (
                <Combobox.Option
                  key={amphure.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-teal-600 text-white" : "text-gray-900"
                    }`
                  }
                  value={amphure}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {amphure.name_th}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-white" : "text-teal-600"
                          }`}
                        >
                          <FaCheck />
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
    </Combobox>
  );
}

export default AmphureComBox;
