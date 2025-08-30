import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { CustomError } from '../errors/custom-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('An error occurred:', err); // Log the error for debugging

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: err.issues.map(e => ({ path: e.path.join('.'), message: e.message })),
    });
  }

  // Handle our custom errors
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Handle generic errors from services (like "User already exists")
  if (err instanceof Error) {
    
    if (err.message === 'User with this email already exists' || err.message === 'Invalid credentials') {
       return res.status(400).json({ message: err.message });
    }
  }

  
  return res.status(500).json({ message: 'An unexpected internal server error occurred' });
};