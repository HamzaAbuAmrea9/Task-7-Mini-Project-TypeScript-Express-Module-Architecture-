import { UserRole } from "@prisma/client";

export interface JwtPayload {
  id: string;
  role: UserRole;
}

declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload;
    }
  }
}
