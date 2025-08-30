
export interface JwtPayload {
  id: string;
  role: string;
}

declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload;
    }
  }
}