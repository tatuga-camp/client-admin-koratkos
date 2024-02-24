import { StatusEvaluation } from "../model";

export const filterRegisterForms = [
  { value: null, title: "ทั้งหมด" },
  { value: "pending", title: "รอการประเมิน" },
  { value: "approved", title: "ผ่านการประเมิน" },
  { value: "rejected", title: "ไม่ผ่านการประเมิน" },
] as const;
