import { Router } from 'express';
import { userController } from './user.controller';
import { authMiddleware, authorize } from '../shared/middlewares/auth.middleware';

const userRouter = Router();


userRouter.use(authMiddleware);


userRouter.post('/coach', authorize(['ADMIN']), userController.createCoach);


userRouter.get('/me', userController.getMyProfile);
userRouter.put('/me', userController.updateMyProfile);

export default userRouter;