import { PrismaRepository } from "../shared/repositories/base.repository";
import { Course } from "./course.entity";
import { prisma } from "../shared/database/prisma";

export class CourseRepository extends PrismaRepository<Course> {
  protected model = prisma.course;

  // Find courses by creator ID
  async findByCreatorId(createdById: string): Promise<Course[]> {
    return await this.model.findMany({
      where: { createdById },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  // Override findAll to include creator information
  async findAll(): Promise<Course[]> {
    return await this.model.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  // Override findById to include creator information
  async findById(id: string): Promise<Course | null> {
    return await this.model.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  // MongoDB-specific: Search courses by title
  async searchByTitle(searchTerm: string): Promise<Course[]> {
    return await this.model.findMany({
      where: {
        title: {
          contains: searchTerm,
        },
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }
}

export const courseRepository = new CourseRepository();
