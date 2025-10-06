import { JwtPayload } from "../shared/types/express";
import { CustomError } from "../shared/errors/custom-error";
import { CreateCourseDtoType, UpdateCourseDtoType } from "./course.dto";
import { courseRepository } from "./course.repository";
import { UserRole } from "@prisma/client";

export class CourseService {
  // Create a new course
  async create(data: CreateCourseDtoType, user: JwtPayload) {
    const newCourse = await courseRepository.create({
      ...data,
      createdById: user.id, // Link the course to the creator
    });
    return newCourse;
  }

  // Find all courses (public)
  async findAll() {
    return await courseRepository.findAll();
  }

  // Find a single course by ID (public)
  async findOne(id: string) {
    const course = await courseRepository.findById(id);
    if (!course) {
      throw new CustomError(404, "Course not found");
    }
    return course;
  }

  // Update a course
  async update(id: string, data: UpdateCourseDtoType, user: JwtPayload) {
    const course = await this.findOne(id); // Re-use findOne to check if it exists

    // Authorization check: only ADMIN or the course creator can update
    if (user.role !== UserRole.ADMIN && course.createdById !== user.id) {
      throw new CustomError(403, "Forbidden: You cannot update this course");
    }

    const updatedCourse = await courseRepository.update(id, data);
    return updatedCourse;
  }

  // Delete a course
  async delete(id: string, user: JwtPayload) {
    const course = await this.findOne(id); // Re-use findOne to check if it exists

    // Authorization check: only ADMIN or the course creator can delete
    if (user.role !== UserRole.ADMIN && course.createdById !== user.id) {
      throw new CustomError(403, "Forbidden: You cannot delete this course");
    }

    const success = await courseRepository.delete(id);
    if (!success) {
      throw new CustomError(404, "Course not found");
    }
  }

  // Search courses by title (MongoDB-specific feature)
  async searchCourses(searchTerm: string) {
    return await courseRepository.searchByTitle(searchTerm);
  }
}

export const courseService = new CourseService();
