import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./auth/auth.routes";
import userRouter from "./users/user.routes";
import courseRouter from "./courses/course.routes";
import { errorHandler } from "./shared/middlewares/error-handler.middleware";
import { notFoundHandler } from "./shared/middlewares/not-found.middleware";
import {
  prisma,
  disconnectPrisma,
  testConnection,
} from "./shared/database/prisma";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.send("API is running with MongoDB + Prisma...");
});

// Database health check
app.get("/health", async (req: Request, res: Response) => {
  try {
    const isConnected = await testConnection();
    res.json({
      status: "healthy",
      database: "connected",
      mongodb: isConnected,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      database: "disconnected",
      error: String(error),
      timestamp: new Date().toISOString(),
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

async function startServer() {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      console.warn(
        "⚠️  MongoDB connection failed, but starting server anyway..."
      );
    }

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Health check available at http://localhost:${PORT}/health`);
      console.log(`Database: MongoDB with Prisma ORM`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
