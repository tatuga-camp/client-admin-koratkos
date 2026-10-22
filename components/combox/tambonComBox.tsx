import { Combobox, Transition } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import React, { Fragment, useState } from "react";
import { LuCheck, LuChevronsUpDown, LuLoader2 } from "react-icons/lu";
import { SignUpData } from "../../pages/auth/sign-up";
import { GetAllTambonByAmphureService } from "../../services/thai-data";
import { Tambon } from "../../model";

type TambonComBoxProps = {
  signUpData: SignUpData | undefined;
  setSignUpData: React.Dispatch<React.SetStateAction<SignUpData | undefined>>;
};
function TambonComBox({ signUpData, setSignUpData }: TambonComBoxProps) {
  const [query, setQuery] = useState("");

  const tambons = useQuery({
    queryKey: ["tambons", signUpData?.amphure?.originalId],
    queryFn: () =>
      GetAllTambonByAmphureService({
        amphureId: signUpData?.amphure?.originalId as number,
      }),
  });

  const filterAmphures =
    query === ""
      ? tambons.data
      : tambons.data?.filter((tambon: Tambon) => {
          return tambon.name_th.toLowerCase().includes(query.toLowerCase());
        });
  return (
    <Combobox
      value={signUpData?.tambon}
      onChange={(value) => {
        setSignUpData((prev: any) => {
          return {
            ...prev,
            tambon: value as Tambon,
          };
        });
      }}
    >
      <div className="flex flex-col gap-1.5">
        <Combobox.Label className="label">ตำบล</Combobox.Label>
        {tambons.isLoading ? (
          <div className="flex h-10 w-full items-center gap-2 rounded-lg border border-third-color bg-third-color/40 px-3 text-sm text-super-main-color/80">
            <LuLoader2 aria-hidden="true" className="size-4 motion-safe:animate-spin" />
            กำลังโหลดรายชื่อตำบล
          </div>
        ) : (
          <div className="relative">
            <Combobox.Input
              required
              placeholder="เลือกตำบล"
              className="input pr-10"
              displayValue={(tambon: Tambon) => tambon?.name_th ?? ""}
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
                      ? "ไม่มีรายชื่อตำบล"
                      : `ไม่พบตำบลที่ตรงกับ “${query}”`}
                  </div>
                ) : (
                  filterAmphures.map((tambon) => (
                    <Combobox.Option
                      key={tambon.id}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2.5 pl-10 pr-4 text-super-main-color ${
                          active ? "bg-fourth-color" : ""
                        }`
                      }
                      value={tambon}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block ${
                              selected ? "font-semibold" : "font-normal"
                            }`}
                          >
                            {tambon.name_th}
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

export default TambonComBox;
