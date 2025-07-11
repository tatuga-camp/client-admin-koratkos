import { Combobox, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import { Input, Label } from "react-aria-components";
import { FaCheck } from "react-icons/fa";
import { RiExpandUpDownLine } from "react-icons/ri";
import { plantLists } from "../../data/plants";

type PlantComboxProps = {
  harvestLog: {
    plotNumber?: number | undefined;
    harvestDate?: string | undefined;
    plantType?: string | undefined;
    amount?: number | undefined;
    marketing?: string | undefined;
    typeAmount?: string | undefined;
  };

  setHarvestLog?: React.Dispatch<
    React.SetStateAction<{
      plotNumber?: number | undefined;
      harvestDate?: string | undefined;
      plantType?: string | undefined;
      amount?: number | undefined;
      marketing?: string | undefined;
      typeAmount?: string | undefined;
    }>
  >;
};
function PlantCombox({ setHarvestLog, harvestLog }: PlantComboxProps) {
  const [query, setQuery] = useState("");
  const [unknownPlant, setUnknownPlant] = useState(false);
  const filterPlants =
    query === ""
      ? plantLists
      : plantLists?.filter((plant) => {
          return plant.title.toLowerCase().includes(query.toLowerCase());
        });

  useEffect(() => {
    if (harvestLog?.plantType !== undefined) {
      const isKnowPlat = plantLists?.find(
        (plant) => plant.title === harvestLog?.plantType,
      );
      if (!isKnowPlat) {
        setUnknownPlant(() => true);
      } else if (isKnowPlat) {
        setUnknownPlant(() => false);
      }
    }
  }, [harvestLog]);
  return (
    <Combobox
      value={harvestLog?.plantType}
      onChange={(value) => {
        setHarvestLog?.((prev) => {
          return {
            ...prev,
            plantType: value,
          };
        });
      }}
    >
      <div className="relative flex w-80 flex-col items-start justify-center  gap-2">
        <Label className="w-40 text-xl font-bold text-super-main-color">
          ชนิดพืชที่เก็บเกี่ยว:
        </Label>
        {!unknownPlant && (
          <div
            className="relative w-full cursor-default overflow-hidden bg-slate-200
       text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75
        focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
          >
            <Combobox.Input
              required
              className=" w-full rounded-md  border-2 border-black p-3 text-lg "
              displayValue={(plant: any) => plant}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <RiExpandUpDownLine />
            </Combobox.Button>
          </div>
        )}
        {unknownPlant ? (
          <button
            type="button"
            className="rounded-lg bg-super-main-color px-4 py-1 text-white drop-shadow-lg"
            onClick={() => setUnknownPlant((prev) => !prev)}
          >
            เลือกจากรายการ
          </button>
        ) : (
          <button
            type="button"
            className="rounded-lg bg-super-main-color px-4 py-1 text-white drop-shadow-lg"
            onClick={() => setUnknownPlant((prev) => !prev)}
          >
            ระบุอื่น ๆ
          </button>
        )}
        {unknownPlant && (
          <Input
            value={harvestLog?.plantType}
            onChange={(e) =>
              setHarvestLog?.((prev) => {
                return {
                  ...prev,
                  plantType: e.target.value,
                };
              })
            }
            className="border-1 w-full rounded-md  border-black  p-3 text-lg "
          />
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
            {filterPlants?.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                ไม่พบข้อมูล
              </div>
            ) : (
              filterPlants?.map((plant, index) => (
                <Combobox.Option
                  key={index}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-teal-600 text-white" : "text-gray-900"
                    }`
                  }
                  value={plant.title}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {plant.title}
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

export default PlantCombox;
