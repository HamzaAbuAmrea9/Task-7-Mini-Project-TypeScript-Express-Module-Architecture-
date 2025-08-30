import { BaseEntity } from '../shared/repositories/base.repository';

export type UserRole = "ADMIN" | "COACH" | "STUDENT";

export interface User extends BaseEntity {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}