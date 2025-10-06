import { BaseEntity } from "../shared/repositories/prisma.repository";

export interface Course extends BaseEntity {
  title: string;
  description: string;
  image?: string | null;
  createdById: string; // ID of the user (COACH or ADMIN) who created it
}
