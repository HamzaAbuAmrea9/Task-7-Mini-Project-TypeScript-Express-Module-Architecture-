import { z } from 'zod';

// Schema for creating a course
export const CreateCourseDto = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  image: z.string().url('Must be a valid URL').optional(),
});

export type CreateCourseDtoType = z.infer<typeof CreateCourseDto>;

// Schema for updating a course
export const UpdateCourseDto = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  image: z.string().url().optional(),
});

export type UpdateCourseDtoType = z.infer<typeof UpdateCourseDto>;