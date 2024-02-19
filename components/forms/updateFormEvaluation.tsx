import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  ChildEvalTopicKos06,
  EvalTopicKos06,
  FormEvaluation,
  ListFormEvaluation,
  StatusEvaluation,
} from "../../model";
import { GetFormEvaluationService } from "../../services/evaluation";
import { useRouter } from "next/router";
import {
  Label,
  Radio,
  RadioGroup,
  TextArea,
  TextField,
} from "react-aria-components";
import {
  MdOutlineRadioButtonChecked,
  MdOutlineRadioButtonUnchecked,
} from "react-icons/md";
import { IoIosCheckbox, IoIosCheckboxOutline } from "react-icons/io";

type UpdateFormEvaluationProps = {
  selectFormEvaluation: FormEvaluation;
};
function UpdateFormEvaluation({
  selectFormEvaluation,
}: UpdateFormEvaluationProps) {
  const router = useRouter();
  const [evaluationData, setEvaluationData] = useState<
    {
      evalTopicKos06Id: string;
      id: string;
      title: string;
      listFormEvaluation: {
        id?: string;
        status: StatusEvaluation;
        suggestion?: string;
      };
    }[]
  >();
  const formEvaluation = useQuery({
    queryKey: ["formEvaluation", selectFormEvaluation.id],
    queryFn: () =>
      GetFormEvaluationService({
        formEvaluationId: selectFormEvaluation.id as string,
        farmerId: router.query.farmerId as string,
      }),
  });

  useEffect(() => {
    setEvaluationData(() => {
      return formEvaluation.data?.topics
        .map((topic) => {
          return topic.childs.map((child) => {
            return {
              evalTopicKos06Id: topic.id,
              id: child.id,
              title: child.title,
              listFormEvaluation: child.listFormEvaluation || {
                status: "pending",
                suggestion: "",
              },
            };
          });
        })
        .flat();
    });
  }, [formEvaluation.data]);
  console.log(evaluationData);
  return (
    <div className="mt-5 flex w-full flex-col items-center">
      <header className="grid w-11/12 grid-cols-10 items-center justify-center gap-2  text-xl font-semibold text-white ">
        <div className=" col-span-6 rounded-lg bg-fifth-color px-3 py-1 text-center">
          รายการการประเมิน
        </div>
        <div className=" col-span-1 rounded-lg bg-fifth-color px-3 py-1 text-center">
          ใช่
        </div>
        <div className=" col-span-1 rounded-lg bg-fifth-color px-3 py-1 text-center">
          ไม่ใช่
        </div>
        <div className=" col-span-2 rounded-lg bg-fifth-color px-3 py-1 text-center">
          ข้อเสนอแนะ
        </div>
      </header>
      <main
        className="mt-5 flex w-11/12 flex-col items-center justify-center gap-2  text-xl font-semibold text-white 
      "
      >
        {formEvaluation.data?.topics.map((topic, index) => {
          return (
            <section className="grid w-full grid-cols-10 gap-3" key={index}>
              <div className="col-span-10 flex items-center justify-start gap-2 rounded-lg bg-secondary-color p-3 font-semibold text-white">
                {topic.order} {topic.title}
              </div>
              {topic.childs.map((child, index) => {
                return (
                  <RadioGroup
                    aria-label="evaluation"
                    name={child.id}
                    key={index}
                    onChange={(e) => {
                      setEvaluationData((prev) => {
                        return prev?.map((item) => {
                          if (item.id === child.id) {
                            return {
                              ...item,
                              listFormEvaluation: {
                                ...item.listFormEvaluation,
                                status: e as StatusEvaluation,
                              },
                            };
                          }
                          return item;
                        });
                      });
                    }}
                    value={
                      evaluationData?.find((item) => item.id === child.id)
                        ?.listFormEvaluation?.status
                    }
                    className="col-span-10 grid w-full grid-cols-10 gap-3"
                  >
                    <div className="col-span-6 rounded-lg bg-fourth-color p-5 font-medium text-black">
                      {child.order} {child.title}
                    </div>
                    <Radio
                      aria-label="approved"
                      className="col-span-1 flex items-center justify-center rounded-lg bg-fourth-color p-5"
                      value="approved"
                    >
                      {({ isSelected }) => (
                        <div className="text-4xl text-secondary-color">
                          {isSelected ? (
                            <IoIosCheckbox />
                          ) : (
                            <IoIosCheckboxOutline />
                          )}
                        </div>
                      )}
                    </Radio>
                    <Radio
                      aria-label="rejected"
                      className="col-span-1 flex items-center justify-center rounded-lg bg-fourth-color p-5"
                      value="rejected"
                    >
                      {({ isSelected }) => (
                        <div className="text-4xl text-secondary-color">
                          {isSelected ? (
                            <IoIosCheckbox />
                          ) : (
                            <IoIosCheckboxOutline />
                          )}
                        </div>
                      )}
                    </Radio>
                    <TextField
                      onChange={(e) => {
                        setEvaluationData((prev) => {
                          return prev?.map((item) => {
                            if (item.id === child.id) {
                              return {
                                ...item,
                                listFormEvaluation: {
                                  ...item.listFormEvaluation,
                                  suggestion: e,
                                },
                              };
                            }
                            return item;
                          });
                        });
                      }}
                      value={
                        evaluationData?.find((item) => item.id === child.id)
                          ?.listFormEvaluation?.suggestion
                      }
                      aria-label="note"
                      className="col-span-2 flex items-center justify-center rounded-lg bg-fourth-color p-1 text-sm text-black"
                    >
                      <TextArea className="h-full max-h-full min-h-full w-full min-w-full max-w-full resize-none border-0 p-2 outline-none" />
                    </TextField>
                  </RadioGroup>
                );
              })}
            </section>
          );
        })}
      </main>
    </div>
  );
}

export default UpdateFormEvaluation;
