import { StatusEvaluation } from "../../model";

// th-TH uses the Buddhist calendar, as formal Thai documents do (e.g. 14 กรกฎาคม 2568).
const longDate = new Intl.DateTimeFormat("th-TH", { dateStyle: "long" });
const monthName = new Intl.DateTimeFormat("th-TH", { month: "long" });
const yearOnly = new Intl.DateTimeFormat("th-TH", { year: "numeric" });

const toDate = (value?: Date | string | null) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatThaiDate = (value?: Date | string | null) => {
  const date = toDate(value);
  return date ? longDate.format(date) : "-";
};

export const formatThaiMonth = (value?: Date | string | null) => {
  const date = toDate(value);
  return date ? monthName.format(date) : "-";
};

export const formatThaiYear = (value?: Date | string | null) => {
  const date = toDate(value);
  return date ? yearOnly.format(date).replace(/\D/g, "") : "-";
};

/** "1-2345-67890-12-3" style grouping used on Thai ID cards. */
export const formatIdCard = (id?: string) => {
  const digits = (id ?? "").replace(/\D/g, "");
  if (digits.length !== 13) return id || "-";
  return `${digits.slice(0, 1)} ${digits.slice(1, 5)} ${digits.slice(5, 10)} ${digits.slice(10, 12)} ${digits.slice(12)}`;
};

export const formatPhone = (phone?: string) => {
  const digits = (phone ?? "").replace(/\D/g, "");
  if (digits.length !== 10) return phone || "-";
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export const formatNumber = (value?: number | string | null) => {
  if (value === null || value === undefined || value === "") return "-";
  const number = Number(value);
  return Number.isNaN(number) ? String(value) : number.toLocaleString("th-TH");
};

export const textOrDash = (value?: string | null) =>
  value && value.trim() !== "" ? value : "-";

export const evaluationResultText: Record<StatusEvaluation, string> = {
  approved: "ผ่าน",
  rejected: "ไม่ผ่าน",
  pending: "รอการประเมิน",
};

export const evaluationStatusText: Record<StatusEvaluation, string> = {
  approved: "ผ่านการประเมิน",
  rejected: "ไม่ผ่านการประเมิน",
  pending: "รอการประเมิน",
};
