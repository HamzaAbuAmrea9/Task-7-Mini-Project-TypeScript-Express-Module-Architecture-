import { PrismaRepository } from "../shared/repositories/base.repository";
import { User } from "./user.entity";
import { prisma } from "../shared/database/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";

export class UserRepository extends PrismaRepository<User> {
  protected model = prisma.user;

  constructor() {
    super();
    this.createAdminUser();
  }

  // Find user by email
  async findByEmail(email: string): Promise<User | null> {
    return await this.model.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });
  }

  // Create a user with COACH role (admin functionality)
  async createCoach(
    data: Omit<User, "id" | "createdAt" | "updatedAt" | "role">
  ): Promise<User> {
    return await this.model.create({
      data: {
        ...data,
        role: UserRole.COACH,
      },
    });
  }

  private async createAdminUser() {
    try {
      const adminEmail = "admin@no.com";
      const existingAdmin = await this.findByEmail(adminEmail);

      if (!existingAdmin) {
        console.log("Creating initial admin user...");
        const hashedPassword = await bcrypt.hash("admin123", 10);

        await this.create({
          name: "Admin",
          email: adminEmail,
          password: hashedPassword,
          role: UserRole.ADMIN,
        });
        console.log("Admin user created successfully.");
      }
    } catch (error) {
      console.error("Error creating admin user:", error);
      // Admin user creation will be handled when database is available
    }
  }
}

// Export a singleton instance of the repository
export const userRepository = new UserRepository();
