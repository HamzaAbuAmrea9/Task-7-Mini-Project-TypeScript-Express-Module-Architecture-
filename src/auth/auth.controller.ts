import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate request body
      const validatedBody = RegisterDto.parse(req.body);
      const newUser = await authService.register(validatedBody);
      res.status(201).json(newUser);
    } catch (error) {
      next(error); // Pass error to the global error handler
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate request body
      const validatedBody = LoginDto.parse(req.body);
      const result = await authService.login(validatedBody);
      res.status(200).json(result);
    } catch (error) {
      next(error); // Pass error to the global error handler
    }
  }
}

export const authController = new AuthController();