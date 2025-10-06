import { PrismaClient } from "@prisma/client";

// Create a global Prisma client instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Use existing instance if available (for development hot reloading)
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// Store the instance globally in development to prevent multiple instances
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown
export const disconnectPrisma = async () => {
  await prisma.$disconnect();
};
