import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { GetFormEvaluationsService } from "../../services/evaluation";
import { FormEvaluation } from "../../model";
import ConfirmStartEvalation from "./confirmStartEvalation";
import UpdateFormEvaluation from "./updateFormEvaluation";

function Kos06Form() {
  const router = useRouter();
  const [menuEvaluation, setMenuEvaluation] = useState<FormEvaluation[]>();
  const [selectFormEvaluation, setselectFormEvaluation] =
    useState<FormEvaluation>({ number: 1 });
  const formEvaluations = useQuery({
    queryKey: ["formEvaluations", router.query.farmerId],
    queryFn: () =>
      GetFormEvaluationsService({
        farmerId: router.query.farmerId as string,
      }),
  });

  useEffect(() => {
    if (formEvaluations.data?.length === 0) {
      setMenuEvaluation(() => {
        return [...new Array(3)].map((list, index) => {
          return {
            number: index + 1,
          };
        });
      });
    } else if (formEvaluations.data && formEvaluations.data.length > 0) {
      const blankMenus = 3 - formEvaluations.data.length;
      setMenuEvaluation(() => {
        return [
          ...formEvaluations.data,
          ...[...new Array(blankMenus)].map((list, index) => {
            return {
              number: formEvaluations.data.length + index + 1,
            };
          }),
        ];
      });
      setselectFormEvaluation(
        () => formEvaluations.data[formEvaluations.data.length - 1],
      );
    }
  }, [formEvaluations.data]);

  return (
    <div className="w-full">
      <header className="flex w-11/12 flex-col items-center font-Anuphan">
        <h1 className="w-max rounded-lg bg-super-main-color px-5 py-1 text-lg font-semibold text-white">
          แบบประเมินเกษตรอินทรีย์ขั้นพื้นฐาน จังหวัดนครราชสีมา (KOS-06)
        </h1>
        <ul className=" mt-5 flex w-full items-center justify-center gap-3 ">
          {formEvaluations.isLoading
            ? [...new Array(3)].map((list, index) => {
                return (
                  <div
                    key={index}
                    className="h-8 w-20 animate-pulse rounded-md bg-gray-600"
                  ></div>
                );
              })
            : menuEvaluation?.map((item, index) => (
                <li
                  onClick={() => setselectFormEvaluation(() => item)}
                  key={index}
                  className={`cursor-pointer rounded-lg px-3 py-1 text-lg font-semibold
               text-white transition duration-100 hover:scale-105
               active:scale-110 ${selectFormEvaluation.number === index + 1 ? "bg-super-main-color" : "bg-gray-300"}`}
                >
                  ครั้งที่ {item.number}
                </li>
              ))}
        </ul>
      </header>
      <main className="w-full">
        {!selectFormEvaluation.id && (
          <ConfirmStartEvalation
            formEvaluations={formEvaluations}
            selectFormEvaluation={selectFormEvaluation}
          />
        )}
        {selectFormEvaluation.id && (
          <UpdateFormEvaluation selectFormEvaluation={selectFormEvaluation} />
        )}
      </main>
    </div>
  );
}

export default Kos06Form;
