import { CustomError } from '../shared/errors/custom-error';
import { CreateUserDtoType, UpdateUserDtoType } from './user.dto'
import { userRepository } from './user.repository';
import bcrypt from 'bcryptjs';

export class UserService {

  // Create a new COACH user (only for ADMINs)
  async createCoach(data: CreateUserDtoType) {
    const { name, email, password } = data;

    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new CustomError(409, 'User with this email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with the COACH role
    const newUser = await userRepository.createCoach({
      name,
      email,
      password: hashedPassword,
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  // Get a user profile by their ID
  async findMe(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    // Return user data without the password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Update a user's profile
  async updateMe(userId: string, data: UpdateUserDtoType) {
    const { name, email } = data;

    if (email) {
      const existingUser = await userRepository.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        throw new CustomError(409, 'Email is already in use by another account');
      }
    }

    const updatedUser = await userRepository.update(userId, { name, email });

    if (!updatedUser) {
      throw new CustomError(404, 'User not found');
    }

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}

export const userService = new UserService();