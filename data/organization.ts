import { User } from "../model";

export const organizationLists = [
  { title: "มหาวิทยาลัยราชภัฏนครราชสีมา", value: "university" },
  { title: "เกษตรจังหวัดนครราชสีมา", value: "argiculturalProvince" },
  { title: "สำนักงานเกษตรอำเภอ", value: "argiculturalAmphure" },
  {
    title: "สำนักงานเกษตรตำบล / องค์กรปกครองส่วนท้องถิ่น",
    value: "argiculturalTambon",
  },
];

export const roleLabels: Record<User["role"], string> = {
  admin: "ผู้ดูแลระบบ",
  evaluator: "ผู้ประเมิน",
};

/** Organization name plus the amphure/tambon the user is scoped to, if any. */
export const getOrganizationLabel = (
  user: Pick<User, "organization" | "amphure" | "tambon">,
) => {
  const title =
    organizationLists.find((list) => list.value === user.organization)
      ?.title ?? "";
  if (user.organization === "argiculturalAmphure" && user.amphure) {
    return `${title} ${user.amphure}`;
  }
  if (user.organization === "argiculturalTambon" && user.tambon) {
    return `${title} ${user.tambon}`;
  }
  return title;
};
