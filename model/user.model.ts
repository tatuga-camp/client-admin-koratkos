export type User = {
  id: string;
  createAt: string;
  updateAt: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  picture: string;
  phone: string;
  passwordResetToken?: string;
  passwordResetTokenExpiresAt?: string;
  role: Role;
  organization: Organization;
  amphure?: string;
  tambon?: string;
  userCreateKeyId: string;
  isDeleted: boolean;
};

export type Role = "evaluator" | "admin";

export type Organization =
  | "university"
  | "argiculturalProvince"
  | "argiculturalAmphure"
  | "argiculturalTambon";
