import { GenericRepository } from '../shared/repositories/base.repository';
import { User } from './user.entity';
import bcrypt from 'bcryptjs';


export class UserRepository extends GenericRepository<User> {

  constructor() {
    super();
    
    this.createAdminUser();
  }

 
  findByEmail(email: string): User | undefined {
    return this.items.find(item => item.email.toLowerCase() === email.toLowerCase());
  }

  
  private async createAdminUser() {
    const adminEmail = 'admin@no.com';
    const existingAdmin = this.findByEmail(adminEmail);

    if (!existingAdmin) {
      console.log('Creating initial admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10); // Hash the password

      this.create({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
      });
      console.log('Admin user created successfully.');
    }
  }
}

// Export a singleton instance of the repository.
// This ensures that the same instance (and the same in-memory data)
// is used throughout the application.
export const userRepository = new UserRepository();