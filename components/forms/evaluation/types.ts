import { FileOnListFormEvaluation, StatusEvaluation } from "../../../model";

/** One KOS-06 criterion with the evaluator's answer for it. */
export type EvaluationListItem = {
  evalTopicKos06Id: string;
  childEvalTopicKos06Id: string;
  id: string;
  title: string;
  listFormEvaluation: {
    id?: string;
    status: StatusEvaluation;
    suggestion?: string;
    /** Picked in the browser, uploaded on save. */
    files?: File[];
    /** Already uploaded. */
    fileOnListFormEvaluations?: FileOnListFormEvaluation[];
  };
};

export type ListFormEvaluationState = EvaluationListItem["listFormEvaluation"];

/** Overall result of the evaluation round. */
export type EvaluationSummaryData = {
  id?: string;
  status?: StatusEvaluation;
  reason?: string;
  first_evaluator_name?: string;
  first_evaluator_position?: string;
  second_evaluator_name?: string;
  second_evaluator_position?: string;
  third_evaluator_name?: string;
  third_evaluator_position?: string;
};

/** File attached to the whole round; files without an id are not uploaded yet. */
export type EvaluationAttachment = {
  id?: string;
  url?: string;
  type?: string;
  file?: File;
};

export const fileNameFromUrl = (url?: string) => {
  const name = url?.split("/").pop() ?? "";
  try {
    return decodeURIComponent(name);
  } catch {
    return name;
  }
};

/**
 * Controlled value for a react-aria RadioGroup. `null` means "nothing selected"
 * and keeps the radios in the Tab order; "pending" matches no radio and would
 * take them all out of it. The RAC 1.1 typings only accept string.
 */
export const radioValue = (status?: StatusEvaluation) =>
  (status && status !== "pending" ? status : null) as unknown as string;
