import { Organization, Role } from ".";

export type UserCreateKey = {
  id: string;
  createAt: Date;
  updateAt: Date;
  key: string;
  role: Role;
  organization: Organization;
};
