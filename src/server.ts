import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./auth/auth.routes";
import userRouter from "./users/user.routes";
import courseRouter from "./courses/course.routes";
import { errorHandler } from "./shared/middlewares/error-handler.middleware";
import { notFoundHandler } from "./shared/middlewares/not-found.middleware";
import { prisma, disconnectPrisma } from "./shared/database/prisma";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

// Database health check
app.get("/health", async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "healthy", database: "connected" });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "unhealthy",
        database: "disconnected",
        error: String(error),
      });
  }
});

// === API Routes ===
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/courses", courseRouter);

// === Not Found Middleware ===
app.use(notFoundHandler);

// === Global Error Handler ===
app.use(errorHandler);

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await disconnectPrisma();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down gracefully...");
  await disconnectPrisma();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});
