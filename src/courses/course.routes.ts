import { Router } from 'express';
import { courseController } from './course.controller';
import { authMiddleware, authorize } from '../shared/middlewares/auth.middleware';

const courseRouter = Router();

// Public routes (anyone can access)
courseRouter.get('/', courseController.findAll);
courseRouter.get('/:id', courseController.findOne);

// Protected routes (only authenticated users can access)
courseRouter.use(authMiddleware);

// Routes with role-based authorization
courseRouter.post('/', authorize(['ADMIN', 'COACH']), courseController.create);
courseRouter.put('/:id', authorize(['ADMIN', 'COACH']), courseController.update);
courseRouter.delete('/:id', authorize(['ADMIN', 'COACH']), courseController.delete);

export default courseRouter;