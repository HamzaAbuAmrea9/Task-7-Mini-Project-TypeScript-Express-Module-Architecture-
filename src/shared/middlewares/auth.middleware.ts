import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CustomError } from '../errors/custom-error';
import { JwtPayload } from '../types/express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new CustomError(401, 'Unauthorized: No token provided'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded; // Attach user payload to the request object
    next();
  } catch (error) {
    return next(new CustomError(401, 'Unauthorized: Invalid token'));
  }
};


import { UserRole } from '../../users/user.entity';


export const authorize = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new CustomError(401, 'Unauthorized'));
    }

    const { role } = req.user;

    if (!allowedRoles.includes(role as UserRole)) {
      return next(new CustomError(403, 'Forbidden: You do not have permission to perform this action'));
    }

    next();
  };
};