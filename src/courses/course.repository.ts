import { GenericRepository } from '../shared/repositories/base.repository';
import { Course } from './course.entity';

class CourseRepository extends GenericRepository<Course> {}

export const courseRepository = new CourseRepository();