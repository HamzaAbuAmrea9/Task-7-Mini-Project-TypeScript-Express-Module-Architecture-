import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../users/user.repository';
import { RegisterDtoType, LoginDtoType } from './auth.dto';
import { CustomError } from '../shared/errors/custom-error';
import { UserRole } from '@prisma/client';

export class AuthService {
  async register(data: RegisterDtoType) {
    const { name, email, password } = data;

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new CustomError(409, 'User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: UserRole.STUDENT,
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async login(data: LoginDtoType) {
    const { email, password } = data;

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new CustomError(401, 'Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new CustomError(401, 'Invalid email or password');
    }

    const secret = process.env.JWT_SECRET!;
    const token = jwt.sign(
      { id: user.id, role: user.role },
      secret,
      { expiresIn: '1d' }
    );

    return { token };
  }
}

export const authService = new AuthService();