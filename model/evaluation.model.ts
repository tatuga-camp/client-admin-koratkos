export type RegisterFormEvaluation = {
  id: string;
  createAt: Date;
  updateAt: Date;
  isReadyToEvaluated: boolean;
  status: StatusEvaluation;
  summitEvaluationDate?: Date;
  farmerId: string;
};

export type FormEvaluation = {
  id?: string;
  number: number;
  evaluatedDate?: Date;
  reason?: string;
  status?: StatusEvaluation;
  registerFormEvaluationId?: string;
  docKos06Id?: string;
  farmerId?: string;
  approveByUserId?: string;
};

export type EvalTopicKos06 = {
  id: string;
  createAt: string;
  updateAt: string;
  title: string;
  order: string;
  docKos06Id: string;
};

export type ChildEvalTopicKos06 = {
  id: string;
  createAt: Date;
  updateAt: Date;
  order: string;
  title: string;
  evalTopicKos06Id: string;
  docKos06Id: string;
};

export type ListFormEvaluation = {
  id: string;
  createAt?: Date;
  updateAt?: Date;
  status: StatusEvaluation;
  suggestion?: string;
  formEvaluationId?: string;
  farmerId?: string;
  approveByUserId?: string;
  evalTopicKos06Id: string;
};

export type StatusEvaluation = "pending" | "approved" | "rejected";

export type FileOnKos06 = {
  id: string;
  createAt: string;
  updateAt: string;
  url: string;
  type: string;
  kos06Id: string;
  userId: string;
};
