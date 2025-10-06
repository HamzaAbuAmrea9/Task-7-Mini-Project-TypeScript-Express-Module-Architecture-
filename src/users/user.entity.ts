import { BaseEntity } from "../shared/repositories/base.repository";
import { UserRole } from "@prisma/client";

export interface User extends BaseEntity {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
