import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { FormEvaluation, StatusEvaluation } from "../../model";
import moment from "moment";
import { useRouter } from "next/router";
import { Button, Form } from "react-aria-components";
import { LuAlertCircle, LuSave } from "react-icons/lu";
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
import { confirmDestructive } from "../../utils";
import EvaluationProgress from "./evaluation/EvaluationProgress";
import EvaluationSkeleton from "./evaluation/EvaluationSkeleton";
import EvaluationSummary from "./evaluation/EvaluationSummary";
import TopicSection from "./evaluation/TopicSection";
import {
  EvaluationAttachment,
  EvaluationListItem,
  EvaluationSummaryData,
  ListFormEvaluationState,
} from "./evaluation/types";

type UpdateFormEvaluationProps = {
  selectFormEvaluation: FormEvaluation;
};

const formatDate = (date?: Date) =>
  date ? moment(date).locale("th").format("D MMMM YYYY") : undefined;

function UpdateFormEvaluation({
  selectFormEvaluation,
}: UpdateFormEvaluationProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useQuery({
    queryKey: ["user"],
    queryFn: () => GetUserService({}),
  });
  const [files, setFiles] = useState<EvaluationAttachment[]>([]);
  const [evaluationListData, setEvaluationListData] =
    useState<EvaluationListItem[]>();
  const [evaluationData, setEvaluationData] = useState<EvaluationSummaryData>();

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
      // The round picker badges and the farmer's status badge come from other queries.
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["formEvaluations", router.query.farmerId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["farmer", router.query.farmerId],
        }),
      ]);
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
    // Unsaved files only leave this form; saved ones are deleted on the server.
    if (fileOnFormEvaluationId) {
      const confirmed = await confirmDestructive({
        title: "ลบไฟล์แนบนี้?",
        text: "ไฟล์จะถูกลบออกจากผลการประเมินทันทีและกู้คืนไม่ได้",
        confirmText: "ลบไฟล์",
      });
      if (!confirmed) return;
    }
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
    const confirmed = await confirmDestructive({
      title: "ลบไฟล์ของข้อประเมินนี้?",
      text: "ไฟล์จะถูกลบออกจากระบบทันทีและกู้คืนไม่ได้",
      confirmText: "ลบไฟล์",
    });
    if (!confirmed) return;

    try {
      // Remove from the list only once the server has deleted it.
      await DeleteFileOnListEvaluationService({
        fileOnListFormEvaluationId: id,
      });
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
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "ลบไฟล์ไม่สำเร็จ",
        text: error?.message,
      });
    }
  };

  const updateListFormEvaluation = (
    id: string,
    update: (
      current: ListFormEvaluationState,
    ) => Partial<ListFormEvaluationState>,
  ) => {
    setEvaluationListData((prev) => {
      return prev?.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            listFormEvaluation: {
              ...item.listFormEvaluation,
              ...update(item.listFormEvaluation),
            },
          };
        }
        return item;
      });
    });
  };

  const handleAddFiles = (e: FileList | null) => {
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
  };

  if (formEvaluation.isLoading) {
    return <EvaluationSkeleton />;
  }

  if (formEvaluation.isError) {
    return (
      <div className="card flex flex-col items-center gap-3 px-4 py-10 text-center">
        <LuAlertCircle aria-hidden="true" className="size-10 text-red-600" />
        <p className="font-semibold">โหลดแบบประเมินไม่สำเร็จ</p>
        <button
          type="button"
          onClick={() => formEvaluation.refetch()}
          className="btn btn-secondary"
        >
          ลองอีกครั้ง
        </button>
      </div>
    );
  }

  const criteria = evaluationListData ?? [];
  const listFormEvaluationOf = (childId: string) =>
    criteria.find((item) => item.id === childId)?.listFormEvaluation;
  const approvedCount = criteria.filter(
    (item) => item.listFormEvaluation.status === "approved",
  ).length;
  const rejectedCount = criteria.filter(
    (item) => item.listFormEvaluation.status === "rejected",
  ).length;
  const answeredCount = approvedCount + rejectedCount;
  const detail = formEvaluation.data?.formEvaluation;

  return (
    <Form onSubmit={handleSummitEvaluation} className="flex flex-col gap-6">
      <EvaluationProgress
        number={selectFormEvaluation.number}
        evaluatedDate={formatDate(detail?.evaluatedDate)}
        status={detail?.status}
        total={criteria.length}
        approved={approvedCount}
        rejected={rejectedCount}
      />

      {formEvaluation.data?.topics.map((topic) => (
        <TopicSection
          key={topic.id}
          topic={topic}
          getListFormEvaluation={listFormEvaluationOf}
          onStatusChange={(childId, status) =>
            updateListFormEvaluation(childId, () => ({ status }))
          }
          onSuggestionChange={(childId, suggestion) =>
            updateListFormEvaluation(childId, () => ({ suggestion }))
          }
          onAddFiles={(childId, fileArray) =>
            updateListFormEvaluation(childId, (current) => ({
              files: [...(current.files ?? []), ...fileArray],
            }))
          }
          onRemoveFile={(childId, index) => handleRemoveFile(index, childId)}
          onRemoveUploadedFile={(childId, fileId) =>
            handleRemoveFileOnListEvaluation(fileId, childId)
          }
        />
      ))}

      <EvaluationSummary
        data={evaluationData}
        onChange={(patch) =>
          setEvaluationData((prev) => {
            return {
              ...prev,
              ...patch,
            };
          })
        }
        files={files}
        onAddFiles={handleAddFiles}
        onRemoveFile={(file) =>
          handleDeleteFile({
            fileOnFormEvaluationId: file.id as string,
            url: file.url as string,
          })
        }
        approvedCount={approvedCount}
        rejectedCount={rejectedCount}
        evaluatedBy={detail?.user}
        evaluatedDate={formatDate(detail?.evaluatedDate)}
      />

      <div className="sticky bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-20 flex items-center gap-3 rounded-xl border border-third-color bg-white/95 p-3 shadow-lg shadow-super-main-color/10 backdrop-blur sm:px-5">
        <div className="min-w-0 flex-1 text-sm">
          <p className="font-semibold">
            ประเมินแล้ว{" "}
            <span className="tabular-nums">
              {answeredCount}/{criteria.length}
            </span>{" "}
            ข้อ
          </p>
          <p className="hidden text-super-main-color/80 sm:block">
            ไฟล์ที่ยังไม่บันทึกจะอัปโหลดเมื่อกดบันทึก
          </p>
        </div>
        <Button type="submit" className="btn btn-primary">
          <LuSave aria-hidden="true" className="size-4" />
          บันทึกผลการประเมิน
        </Button>
      </div>
    </Form>
  );
}

export default UpdateFormEvaluation;
