import { Combobox, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import { LuCheck, LuChevronsUpDown } from "react-icons/lu";
import { SignUpData } from "../../pages/auth/sign-up";
import { organizationLists } from "../../data/organization";

type OrganizationComboxProps = {
  signUpData: SignUpData | undefined;
  setSignUpData: React.Dispatch<React.SetStateAction<SignUpData | undefined>>;
};
function OrganizationCombox({
  setSignUpData,
  signUpData,
}: OrganizationComboxProps) {
  const [query, setQuery] = useState("");
  const filterOganization =
    query === ""
      ? organizationLists
      : organizationLists?.filter((organization) => {
          return organization.title.toLowerCase().includes(query.toLowerCase());
        });
  return (
    <Combobox
      value={signUpData?.organization}
      onChange={(value) => {
        setSignUpData((prev) => {
          return {
            ...prev,
            organization: value,
          };
        });
      }}
    >
      <div className="flex flex-col gap-1.5">
        <Combobox.Label className="label">หน่วยงาน/องค์กร</Combobox.Label>
        <div className="relative">
          <Combobox.Input
            required
            placeholder="เลือกหน่วยงาน"
            className="input pr-10"
            displayValue={(organization: SignUpData["organization"]) =>
              organization?.title ?? ""
            }
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
              {filterOganization?.length === 0 ? (
                <div className="px-4 py-2.5 text-super-main-color/80">
                  {query === ""
                    ? "ไม่มีรายการหน่วยงาน"
                    : `ไม่พบหน่วยงานที่ตรงกับ “${query}”`}
                </div>
              ) : (
                filterOganization?.map((organization, index) => (
                  <Combobox.Option
                    key={index}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2.5 pl-10 pr-4 text-super-main-color ${
                        active ? "bg-fourth-color" : ""
                      }`
                    }
                    value={organization}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block ${
                            selected ? "font-semibold" : "font-normal"
                          }`}
                        >
                          {organization.title}
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
      </div>
    </Combobox>
  );
}

export default OrganizationCombox;
