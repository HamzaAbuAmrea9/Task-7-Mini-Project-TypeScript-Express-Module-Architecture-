import { Request, Response, NextFunction } from 'express';
import { userService } from './user.service';

import { CreateUserDto, UpdateUserDto } from './user.dto';

export class UserController {



      // Method for ADMIN to create a COACH
  async createCoach(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedBody = CreateUserDto.parse(req.body);
      const newUser = await userService.createCoach(validatedBody);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }

  async getMyProfile(req: Request, res: Response, next: NextFunction) {
    try {
      // req.user is guaranteed to exist here because of the authMiddleware
      const userId = req.user!.id; 
      const user = await userService.findMe(userId);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateMyProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const validatedBody = UpdateUserDto.parse(req.body);
      const updatedUser = await userService.updateMe(userId, validatedBody);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();