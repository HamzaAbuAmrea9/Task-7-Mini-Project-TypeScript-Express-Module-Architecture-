import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../users/user.repository';
import { RegisterDtoType, LoginDtoType } from './auth.dto';
import { CustomError } from '../shared/errors/custom-error'; // <-- IMPORT

export class AuthService {
  async register(data: RegisterDtoType) {
    const { name, email, password } = data;

    const existingUser = userRepository.findByEmail(email);
    if (existingUser) {
      // Use CustomError with a 409 Conflict status
      throw new CustomError(409, 'User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: 'STUDENT',
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async login(data: LoginDtoType) {
    const { email, password } = data;

    const user = userRepository.findByEmail(email);
    if (!user) {
      // Use CustomError with a 401 Unauthorized status
      throw new CustomError(401, 'Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Use the same error for both cases to prevent email enumeration attacks
      throw new CustomError(401, 'Invalid email or password');
    }

    const secret = process.env.JWT_SECRET!; // The '!' asserts that this is never undefined
    const token = jwt.sign(
      { id: user.id, role: user.role },
      secret,
      { expiresIn: '1d' }
    );

    return { token };
  }
}

export const authService = new AuthService();