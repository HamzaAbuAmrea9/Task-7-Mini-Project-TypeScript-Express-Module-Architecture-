import { Router } from "express";
import { userController } from "./user.controller";
import {
  authMiddleware,
  authorize,
} from "../shared/middlewares/auth.middleware";
import { UserRole } from "@prisma/client";

const userRouter = Router();

// Apply authentication middleware to all routes
userRouter.use(authMiddleware);

// Admin-only route to create COACH users
userRouter.post(
  "/coach",
  authorize([UserRole.ADMIN]),
  userController.createCoach
);

// User profile routes
userRouter.get("/me", userController.getMyProfile);
userRouter.put("/me", userController.updateMyProfile);

export default userRouter;
