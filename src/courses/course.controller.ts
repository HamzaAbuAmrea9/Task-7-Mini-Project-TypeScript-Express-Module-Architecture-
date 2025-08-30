import { Request, Response, NextFunction } from 'express';
import { courseService } from './course.service';
import { CreateCourseDto, UpdateCourseDto } from './course.dto';

export class CourseController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedBody = CreateCourseDto.parse(req.body);
      // Pass the authenticated user from the request to the service
      const course = await courseService.create(validatedBody, req.user!);
      res.status(201).json(course);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const courses = await courseService.findAll();
      res.status(200).json(courses);
    } catch (error) {
      next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await courseService.findOne(req.params.id);
      res.status(200).json(course);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedBody = UpdateCourseDto.parse(req.body);
      const course = await courseService.update(req.params.id, validatedBody, req.user!);
      res.status(200).json(course);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await courseService.delete(req.params.id, req.user!);
      res.status(204).send(); // 204 No Content for successful deletion
    } catch (error) {
      next(error);
    }
  }
}

export const courseController = new CourseController();