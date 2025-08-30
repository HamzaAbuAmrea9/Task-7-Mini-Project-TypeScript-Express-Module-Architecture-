import { JwtPayload } from '../shared/types/express';
import { CustomError } from '../shared/errors/custom-error';
import { CreateCourseDtoType, UpdateCourseDtoType } from './course.dto';
import { courseRepository } from './course.repository';

export class CourseService {
  // Create a new course
  async create(data: CreateCourseDtoType, user: JwtPayload) {
    const newCourse = courseRepository.create({
      ...data,
      createdById: user.id, // Link the course to the creator
    });
    return newCourse;
  }

  // Find all courses (public)
  async findAll() {
    return courseRepository.findAll();
  }

  // Find a single course by ID (public)
  async findOne(id: string) {
    const course = courseRepository.findById(id);
    if (!course) {
      throw new CustomError(404, 'Course not found');
    }
    return course;
  }

  // Update a course
  async update(id: string, data: UpdateCourseDtoType, user: JwtPayload) {
    const course = await this.findOne(id); // Re-use findOne to check if it exists

    // Authorization check: only ADMIN or the course creator can update
    if (user.role !== 'ADMIN' && course.createdById !== user.id) {
      throw new CustomError(403, 'Forbidden: You cannot update this course');
    }

    const updatedCourse = courseRepository.update(id, data);
    return updatedCourse;
  }

  // Delete a course
  async delete(id: string, user: JwtPayload) {
    const course = await this.findOne(id); // Re-use findOne to check if it exists

    // Authorization check: only ADMIN or the course creator can delete
    if (user.role !== 'ADMIN' && course.createdById !== user.id) {
      throw new CustomError(403, 'Forbidden: You cannot delete this course');
    }

    courseRepository.delete(id);
  }
}

export const courseService = new CourseService();