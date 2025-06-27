import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { FaFileArrowDown, FaSquarePhone } from "react-icons/fa6";
import { GrFormView } from "react-icons/gr";
import {
  FileOnListFormEvaluation,
  FormEvaluation,
  StatusEvaluation,
} from "../../model";

import moment from "moment";
import { useRouter } from "next/router";
import {
  Button,
  FileTrigger,
  Form,
  Label,
  Radio,
  RadioGroup,
  TextArea,
  TextField,
} from "react-aria-components";
import { BsFileEarmarkCode } from "react-icons/bs";
import { IoIosCheckbox, IoIosCheckboxOutline, IoMdClose } from "react-icons/io";
import { MdDelete, MdEmail, MdFileOpen, MdUpload } from "react-icons/md";
import Swal from "sweetalert2";
import {
  CreateFileOnEvaulationService,
  CreateFileOnListFormEvaluationService,
  CreateListFormEvaluationService,
  DeleteFileOnEvaluationService,
  DeleteFileOnListEvaluationService,
  GetFormEvaluationService,
  UpdateFormEvaluationService,
  UpdateListFormEvaluationService,
} from "../../services/evaluation";
import {
  GetSignURLService,
  UploadSignURLService,
} from "../../services/google-storage";
import { GetUserService } from "../../services/user";
import Image from "next/image";

type UpdateFormEvaluationProps = {
  selectFormEvaluation: FormEvaluation;
};
function UpdateFormEvaluation({
  selectFormEvaluation,
}: UpdateFormEvaluationProps) {
  const router = useRouter();
  const user = useQuery({
    queryKey: ["user"],
    queryFn: () => GetUserService({}),
  });
  const [files, setFiles] = useState<
    {
      id?: string;
      url?: string;
      type?: string;
      file?: File;
    }[]
  >([]);
  const [evaluationListData, setEvaluationListData] = useState<
    {
      evalTopicKos06Id: string;
      childEvalTopicKos06Id: string;
      id: string;
      title: string;
      listFormEvaluation: {
        id?: string;
        status: StatusEvaluation;
        suggestion?: string;
        files?: File[];
        fileOnListFormEvaluations?: FileOnListFormEvaluation[];
      };
    }[]
  >();
  const [evaluationData, setEvaluationData] = useState<{
    id?: string;
    status?: StatusEvaluation;
    reason?: string;
    first_evaluator_name?: string;
    first_evaluator_position?: string;
    second_evaluator_name?: string;
    second_evaluator_position?: string;
    third_evaluator_name?: string;
    third_evaluator_position?: string;
  }>();

  const formEvaluation = useQuery({
    queryKey: ["formEvaluation", selectFormEvaluation.id],
    queryFn: () =>
      GetFormEvaluationService({
        formEvaluationId: selectFormEvaluation.id as string,
        farmerId: router.query.farmerId as string,
      }),
  });

  useEffect(() => {
    setEvaluationListData(() => {
      return formEvaluation.data?.topics
        .map((topic) => {
          return topic.childs.map((child) => {
            return {
              evalTopicKos06Id: topic.id,
              id: child.id,
              title: child.title,
              childEvalTopicKos06Id: child.id,
              listFormEvaluation: child.listFormEvaluation || {
                status: "pending",
                suggestion: "",
              },
            };
          });
        })
        .flat();
    });
    setEvaluationData(() => {
      return {
        id: formEvaluation.data?.formEvaluation.id as string,
        status: formEvaluation.data?.formEvaluation.status as StatusEvaluation,
        reason: formEvaluation.data?.formEvaluation.reason as string,
        first_evaluator_name:
          formEvaluation.data?.formEvaluation.first_evaluator_name,
        first_evaluator_position:
          formEvaluation.data?.formEvaluation.first_evaluator_position,
        second_evaluator_name:
          formEvaluation.data?.formEvaluation.second_evaluator_name,
        second_evaluator_position:
          formEvaluation.data?.formEvaluation.second_evaluator_position,
        third_evaluator_name:
          formEvaluation.data?.formEvaluation.third_evaluator_name,
        third_evaluator_position:
          formEvaluation.data?.formEvaluation.third_evaluator_position,
      };
    });
    setFiles(() => {
      if (!formEvaluation.data?.formEvaluation?.files) return [];
      return formEvaluation.data?.formEvaluation?.files.map((file) => {
        return {
          id: file.id,
          url: file.url,
          type: file.type,
        };
      });
    });
  }, [formEvaluation.data]);
  const handleSummitEvaluation = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      Swal.fire({
        title: "กำลังบันทึกการประเมิน",
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      if (
        !evaluationData?.first_evaluator_name ||
        !evaluationData.first_evaluator_position ||
        !evaluationData.second_evaluator_name ||
        !evaluationData.second_evaluator_position ||
        !evaluationData.third_evaluator_name ||
        !evaluationData.third_evaluator_position
      ) {
        throw new Error("กรอกข้อมูลชื่อผู้ประเมินให้ครบ");
      }
      const filterFiles = files?.filter((file) => !file.id);

      for (const file of filterFiles) {
        const getSignURL = await GetSignURLService({
          fileName: file.file?.name as string,
          fileType: file.type as string,
          farmerId: selectFormEvaluation.farmerId as string,
        });

        await UploadSignURLService({
          contentType: file.type as string,
          file: file.file as File,
          signURL: getSignURL.signURL,
        });

        await CreateFileOnEvaulationService({
          formEvaluationId: selectFormEvaluation.id as string,
          type: file.type as string,
          url: getSignURL.originalURL,
          farmerId: selectFormEvaluation.farmerId as string,
        });
      }

      const updatePromise = UpdateFormEvaluationService({
        query: {
          formEvaluationId: selectFormEvaluation.id as string,
          farmerId: router.query.farmerId as string,
        },
        body: {
          ...evaluationData,
          first_evaluator_name: evaluationData.first_evaluator_name,
          first_evaluator_position: evaluationData.first_evaluator_position,
          second_evaluator_name: evaluationData.second_evaluator_name,
          second_evaluator_position: evaluationData.second_evaluator_position,
          third_evaluator_name: evaluationData.third_evaluator_name,
          third_evaluator_position: evaluationData.third_evaluator_position,
          approveByUserId: user.data?.id as string,
        },
      });

      const createPromises = evaluationListData?.map(async (list) => {
        if (list.listFormEvaluation.id) {
          for (const file of list.listFormEvaluation.files ?? []) {
            const getSignURL = await GetSignURLService({
              fileName: file.name as string,
              fileType: file.type as string,
              farmerId: selectFormEvaluation.farmerId as string,
            });

            await UploadSignURLService({
              contentType: file.type as string,
              file: file as File,
              signURL: getSignURL.signURL,
            });

            await CreateFileOnListFormEvaluationService({
              type: file.type as string,
              url: getSignURL.originalURL,
              listFormEvaluationId: list.listFormEvaluation.id,
              farmerId: selectFormEvaluation.farmerId as string,
            });
          }
          return UpdateListFormEvaluationService({
            query: {
              listFormEvaluationId: list.listFormEvaluation.id as string,
            },
            body: {
              status: list.listFormEvaluation.status,
              suggestion: list.listFormEvaluation.suggestion as string,
            },
          });
        } else if (!list.listFormEvaluation.id) {
          const create = await CreateListFormEvaluationService({
            status: list.listFormEvaluation.status,
            formEvaluationId: selectFormEvaluation.id as string,
            farmerId: router.query.farmerId as string,
            childEvalTopicKos06Id: list.childEvalTopicKos06Id as string,
            evalTopicKos06Id: list.evalTopicKos06Id as string,
            suggestion: list.listFormEvaluation.suggestion as string,
          });

          for (const file of list.listFormEvaluation.files ?? []) {
            const getSignURL = await GetSignURLService({
              fileName: file.name as string,
              fileType: file.type as string,
              farmerId: selectFormEvaluation.farmerId as string,
            });

            await UploadSignURLService({
              contentType: file.type as string,
              file: file as File,
              signURL: getSignURL.signURL,
            });

            await CreateFileOnListFormEvaluationService({
              type: file.type as string,
              url: getSignURL.originalURL,
              listFormEvaluationId: create.id,
              farmerId: selectFormEvaluation.farmerId as string,
            });
          }

          return create;
        }
      });
      if (createPromises) {
        await Promise.all([updatePromise, ...createPromises]);
      } else if (!createPromises) {
        await Promise.all([updatePromise]);
      }
      await formEvaluation.refetch();
      Swal.fire({
        icon: "success",
        title: "สำเร็จ",
        text: "บันทึกการประเมินเรียบร้อย",
      });
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.message,
      });
    }
  };

  const handleDeleteFile = async ({
    fileOnFormEvaluationId,
    url,
  }: {
    fileOnFormEvaluationId: string;
    url: string;
  }) => {
    try {
      Swal.fire({
        title: "กำลังลบ",
        didOpen: () => {
          Swal.showLoading();
        },
      });
      if (!fileOnFormEvaluationId) {
        const unDeleteFiles = files?.filter((file) => file.url !== url);
        setFiles(() => unDeleteFiles);
      } else {
        const deleteFile = await DeleteFileOnEvaluationService({
          fileOnFormEvaluationId: fileOnFormEvaluationId,
        });
        await formEvaluation.refetch();
      }

      Swal.fire({
        icon: "success",
        title: "ลบไฟล์สำเร็จ",
        timer: 1500,
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "ผิดพลาด",
        text: error.message,
      });
    }
  };

  const handleRemoveFile = (indexRemove: number, id: string) => {
    setEvaluationListData((prev) => {
      return prev?.map((list) => {
        if (list.id === id) {
          return {
            ...list,
            listFormEvaluation: {
              ...list.listFormEvaluation,
              files: list.listFormEvaluation.files?.filter(
                (_, i) => i !== indexRemove,
              ),
            },
          };
        }

        return list;
      });
    });
  };

  const handleRemoveFileOnListEvaluation = async (
    id: string,
    listId: string,
  ) => {
    setEvaluationListData((prev) => {
      return prev?.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            listFormEvaluation: {
              ...list.listFormEvaluation,
              fileOnListFormEvaluations:
                list.listFormEvaluation.fileOnListFormEvaluations?.filter(
                  (file) => file.id !== id,
                ),
            },
          };
        }

        return list;
      });
    });

    await DeleteFileOnListEvaluationService({
      fileOnListFormEvaluationId: id,
    });
  };

  return (
    <Form
      onSubmit={handleSummitEvaluation}
      className="mt-5 flex w-full flex-col items-center"
    >
      <header className="sticky top-0 z-20 grid w-11/12 grid-cols-10 items-center justify-center gap-2  text-xl font-semibold text-white ">
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
        {formEvaluation.isLoading
          ? [...new Array(5)].map((list, index) => {
              return (
                <div
                  key={index}
                  className="grid h-10 w-full animate-pulse grid-cols-10 gap-2"
                >
                  <div className="col-span-6 h-10 animate-pulse rounded-lg bg-gray-400"></div>
                  <div className="col-span-1 h-10 animate-pulse rounded-lg bg-gray-300"></div>
                  <div className="col-span-1 h-10 animate-pulse rounded-lg bg-gray-500"></div>
                  <div className="col-span-2 h-10 animate-pulse rounded-lg bg-gray-300"></div>
                </div>
              );
            })
          : formEvaluation.data?.topics.map((topic, index) => {
              return (
                <section className="grid w-full grid-cols-10 gap-3" key={index}>
                  <div className="sticky top-10 col-span-10 flex items-center justify-start gap-2 rounded-lg bg-secondary-color p-3 font-semibold text-white">
                    {topic.order} {topic.title}
                  </div>
                  {topic.childs.map((child, index) => {
                    const list = evaluationListData?.find(
                      (item) => item.id === child.id,
                    );
                    return (
                      <RadioGroup
                        aria-label="evaluation"
                        name={child.id}
                        key={index}
                        isRequired
                        onChange={(e) => {
                          setEvaluationListData((prev) => {
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
                        value={list?.listFormEvaluation?.status}
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
                            <div className="text-4xl text-red-600">
                              {isSelected ? (
                                <IoIosCheckbox />
                              ) : (
                                <IoIosCheckboxOutline />
                              )}
                            </div>
                          )}
                        </Radio>
                        <div className="col-span-2 flex flex-col gap-2">
                          <label form="dropzone-file">
                            <div
                              className="flex w-full items-center justify-center gap-2
                               rounded-lg bg-main-color px-4 py-1 text-sm 
          font-semibold text-white hover:bg-super-main-color"
                            >
                              <MdUpload />
                              Click to upload
                            </div>
                            <input
                              onChange={(e) => {
                                const files = e.target.files;

                                if (files) {
                                  const fileArray = Array.from(files);
                                  setEvaluationListData((prev) => {
                                    return prev?.map((item) => {
                                      if (item.id === child.id) {
                                        return {
                                          ...item,
                                          listFormEvaluation: {
                                            ...item.listFormEvaluation,
                                            files: [
                                              ...(item.listFormEvaluation
                                                .files ?? []),
                                              ...fileArray,
                                            ],
                                          },
                                        };
                                      }
                                      return item;
                                    });
                                  });
                                }
                              }}
                              multiple
                              id="dropzone-file"
                              type="file"
                              className="hidden"
                            />
                          </label>
                          <TextField
                            onChange={(e) => {
                              setEvaluationListData((prev) => {
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
                              evaluationListData?.find(
                                (item) => item.id === child.id,
                              )?.listFormEvaluation?.suggestion
                            }
                            aria-label="note"
                            className=" flex grow items-center justify-center rounded-lg
                             bg-fourth-color p-1 text-sm text-black"
                          >
                            <TextArea
                              placeholder="....ข้อเสนอแนะ"
                              className="h-full max-h-full min-h-full w-full min-w-full max-w-full resize-none border-0 p-2 outline-none"
                            />
                          </TextField>
                        </div>
                        <div className="col-span-10 flex w-full flex-wrap  gap-2">
                          {[
                            ...(list?.listFormEvaluation.files ?? []),
                            ...(list?.listFormEvaluation
                              .fileOnListFormEvaluations ?? []),
                          ].map((file, index) => {
                            if (!list) {
                              return;
                            }
                            const fileToProcess = "file" in file ? file : file; // This line might be needed if item itself could be a File
                            if (!(fileToProcess instanceof File)) {
                              const name =
                                fileToProcess.url.split("/")[
                                  fileToProcess.url.split("/").length - 1
                                ];
                              return (
                                <li
                                  key={index}
                                  className="flex w-max items-center justify-between gap-3 rounded-lg border bg-super-main-color  p-1 pl-3"
                                >
                                  <a
                                    href={fileToProcess.url}
                                    target="_blank"
                                    className="flex items-center justify-center gap-2 text-white"
                                  >
                                    <MdFileOpen className="mr-3" />
                                    <section className="flex flex-col gap-0">
                                      <div className="max-w-96 truncate text-sm">
                                        {name} {/* Access directly */}
                                      </div>
                                    </section>
                                  </a>
                                  <button
                                    onClick={() =>
                                      handleRemoveFileOnListEvaluation(
                                        fileToProcess.id,
                                        list.id,
                                      )
                                    }
                                    type="button"
                                    className="flex h-6 w-6 items-center justify-center rounded text-sm font-semibold hover:bg-gray-300/50"
                                  >
                                    <IoMdClose />
                                  </button>
                                </li>
                              );
                            }
                            const url = URL.createObjectURL(fileToProcess);

                            return (
                              <li
                                key={index}
                                className="flex w-max items-center justify-between gap-3 rounded-lg border bg-super-main-color  p-1 pl-3"
                              >
                                <a
                                  href={url}
                                  target="_blank"
                                  className="flex items-center justify-center gap-2 text-white"
                                >
                                  <MdFileOpen className="mr-3" />
                                  <section className="flex flex-col gap-0">
                                    <div className="max-w-96 truncate text-sm">
                                      {fileToProcess.name}{" "}
                                      {/* Access directly */}
                                    </div>
                                  </section>
                                </a>
                                <button
                                  onClick={() =>
                                    handleRemoveFile(index, list?.id)
                                  }
                                  type="button"
                                  className="flex h-6 w-6 items-center justify-center rounded text-sm font-semibold hover:bg-gray-300/50"
                                >
                                  <IoMdClose />
                                </button>
                              </li>
                            );
                          })}
                        </div>
                      </RadioGroup>
                    );
                  })}
                </section>
              );
            })}
      </main>
      <footer className="mt-5 flex w-full flex-col items-center justify-center gap-5">
        <div className="w-11/12 rounded-lg bg-fifth-color px-3 py-1 text-left text-xl font-semibold text-white ">
          สรุปผลการประเมิน
        </div>
        <div className="flex w-11/12 flex-col gap-4 rounded-lg bg-fourth-color p-5">
          <RadioGroup
            isRequired
            onChange={(e) => {
              setEvaluationData((prev) => {
                return {
                  ...prev,
                  status: e as StatusEvaluation,
                };
              });
            }}
            value={evaluationData?.status}
            aria-label="evaluation"
            className=" grid w-full grid-cols-2 gap-3"
          >
            <Radio
              aria-label="approved"
              className="col-span-1 flex items-center justify-center rounded-lg bg-fourth-color p-5"
              value="approved"
            >
              {({ isSelected }) => (
                <div className="flex items-center justify-center gap-2 text-4xl text-secondary-color">
                  {isSelected ? <IoIosCheckbox /> : <IoIosCheckboxOutline />}{" "}
                  <span className="text-lg font-bold text-secondary-color">
                    ผ่านการประเมิน
                  </span>
                </div>
              )}
            </Radio>
            <Radio
              aria-label="rejected"
              className="col-span-1 flex items-center justify-center rounded-lg bg-fourth-color p-5"
              value="rejected"
            >
              {({ isSelected }) => (
                <div className="flex items-center justify-center gap-2 text-4xl text-red-600">
                  {isSelected ? <IoIosCheckbox /> : <IoIosCheckboxOutline />}
                  <span className="text-lg font-bold text-red-600">
                    ไม่ผ่านการประเมิน
                  </span>
                </div>
              )}
            </Radio>
          </RadioGroup>
          {formEvaluation.data?.formEvaluation.user && (
            <div className="flex w-full items-center justify-start gap-5 text-lg font-semibold text-black">
              <h3>ประเมินโดย</h3>
              <h3>
                {formEvaluation.data?.formEvaluation.user.firstName}{" "}
                {formEvaluation.data?.formEvaluation.user.lastName}
              </h3>
              <h3 className="flex items-center justify-start gap-2 text-super-main-color">
                <MdEmail />
                {formEvaluation.data?.formEvaluation.user.email}{" "}
              </h3>
              <h3 className="flex items-center justify-start gap-2 text-super-main-color">
                <FaSquarePhone />
                {formEvaluation.data?.formEvaluation.user.phone}{" "}
              </h3>
              <h3 className="flex items-center justify-start gap-2 text-super-main-color">
                ประเมินเมื่อวันที่{" "}
                {moment(
                  formEvaluation.data.formEvaluation.evaluatedDate,
                ).format("DD/MMMM/YYYY")}{" "}
              </h3>
            </div>
          )}
          <FileTrigger
            allowsMultiple
            onSelect={(e) => {
              if (!e) return null;

              const files: FileList = e;

              Array.from(files).forEach((file) => {
                const url = URL.createObjectURL(file);
                const reader = new FileReader();

                setFiles((prev) => {
                  if (!prev) return [{ file, url: url }];
                  return [...prev, { file, url: url, type: file.type }];
                });

                reader.readAsDataURL(file);
              });
            }}
          >
            <Button
              className=" flex w-80 items-center justify-center gap-2 rounded-lg bg-main-color px-4 py-1 font-semibold 
          text-white hover:bg-super-main-color"
            >
              <FaFileArrowDown />
              อัพโหลดไฟล์แนบ
            </Button>
          </FileTrigger>
          <div className="grid w-full grid-cols-3 gap-2">
            {files?.map((file, index) => {
              const fileName = file?.url?.split("/").pop();
              return (
                <div
                  key={index}
                  className="relative  flex h-10 w-full cursor-pointer select-none
                        items-center justify-between  gap-2 rounded-xl bg-purple-100 px-5 
                        ring-2 ring-purple-500 drop-shadow-sm
                     transition duration-75 "
                >
                  <div className="flex justify-center gap-1">
                    <div className="flex items-center justify-center text-purple-700">
                      <BsFileEarmarkCode />
                    </div>
                    <span className="w-max max-w-[7rem] truncate text-sm md:max-w-40 ">
                      {file?.id ? fileName : file.file?.name}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div
                      onClick={() => window.open(file.url, "_blank")}
                      className=" z-40 flex
                     cursor-pointer items-center justify-center gap-2 rounded-md bg-green-500 p-1  text-xl text-white"
                    >
                      <GrFormView />
                    </div>
                    <div
                      onClick={() => {
                        handleDeleteFile({
                          fileOnFormEvaluationId: file.id as string,
                          url: file.url as string,
                        });
                      }}
                      className=" z-40 flex cursor-pointer 
                     items-center justify-center gap-2 rounded-md bg-red-500 p-1  text-xl text-white"
                    >
                      <MdDelete />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <TextField
            onChange={(e) => {
              setEvaluationData((prev) => {
                return {
                  ...prev,
                  reason: e,
                };
              });
            }}
            value={evaluationData?.reason}
          >
            <Label className="text-lg font-semibold text-super-main-color">
              เนื่องจาก:{" "}
            </Label>
            <TextArea
              placeholder="..ข้อเสนอแนะ"
              className="h-32 w-full resize-none rounded-lg border-0 p-5 text-lg outline-none ring-1 ring-black"
            ></TextArea>
          </TextField>

          <section className="grid w-full grid-cols-3">
            <div className="flex flex-col items-center justify-center gap-3">
              <span>ผู้ประเมินคนที่ 1</span>
              <input
                value={evaluationData?.first_evaluator_name}
                onChange={(e) => {
                  setEvaluationData((prev) => {
                    return {
                      ...prev,
                      first_evaluator_name: e.target.value,
                    };
                  });
                }}
                required
                placeholder="ชื่อผู้ประเมินคนที่ 1"
                className="w-60 rounded-md border border-super-main-color p-2 focus:outline-super-main-color"
              />
              <input
                value={evaluationData?.first_evaluator_position}
                onChange={(e) => {
                  setEvaluationData((prev) => {
                    return {
                      ...prev,
                      first_evaluator_position: e.target.value,
                    };
                  });
                }}
                required
                placeholder="ตำแหน่งผู้ประเมินคนที่ 1"
                className="w-60 rounded-md border border-super-main-color p-2 focus:outline-super-main-color"
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-3">
              <span>ผู้ประเมินคนที่ 2</span>
              <input
                value={evaluationData?.second_evaluator_name}
                onChange={(e) => {
                  setEvaluationData((prev) => {
                    return {
                      ...prev,
                      second_evaluator_name: e.target.value,
                    };
                  });
                }}
                required
                placeholder="ชื่อผู้ประเมินคนที่ 2"
                className="w-60 rounded-md border border-super-main-color p-2 focus:outline-super-main-color"
              />
              <input
                value={evaluationData?.second_evaluator_position}
                onChange={(e) => {
                  setEvaluationData((prev) => {
                    return {
                      ...prev,
                      second_evaluator_position: e.target.value,
                    };
                  });
                }}
                required
                placeholder="ตำแหน่งผู้ประเมินคนที่ 2"
                className="w-60 rounded-md border border-super-main-color p-2 focus:outline-super-main-color"
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-3">
              <span>ผู้ประเมินคนที่ 3</span>
              <input
                value={evaluationData?.third_evaluator_name}
                onChange={(e) => {
                  setEvaluationData((prev) => {
                    return {
                      ...prev,
                      third_evaluator_name: e.target.value,
                    };
                  });
                }}
                required
                placeholder="ชื่อผู้ประเมินคนที่ 3"
                className="w-60 rounded-md border border-super-main-color p-2 focus:outline-super-main-color"
              />
              <input
                value={evaluationData?.third_evaluator_position}
                onChange={(e) => {
                  setEvaluationData((prev) => {
                    return {
                      ...prev,
                      third_evaluator_position: e.target.value,
                    };
                  });
                }}
                required
                placeholder="ตำแหน่งผู้ประเมินคนที่ 3"
                className="w-60 rounded-md border border-super-main-color p-2 focus:outline-super-main-color"
              />
            </div>
          </section>

          <Button
            type="submit"
            className="button-focus w-60 rounded-lg bg-super-main-color p-2 text-lg font-semibold text-white"
          >
            บันทึก
          </Button>
        </div>
      </footer>
    </Form>
  );
}

export default UpdateFormEvaluation;
