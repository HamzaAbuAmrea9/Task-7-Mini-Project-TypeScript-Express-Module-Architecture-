import { prisma } from '../src/shared/database/prisma';
import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';

async function seed() {
  try {
    console.log('🌱 Seeding MongoDB database...');
    
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();

    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@no.com',
        password: adminPassword,
        role: UserRole.ADMIN,
      },
    });

    const coachPassword = await bcrypt.hash('coach123', 10);
    const coach = await prisma.user.create({
      data: {
        name: 'John Coach',
        email: 'coach@no.com',
        password: coachPassword,
        role: UserRole.COACH,
      },
    });

    const courses = await Promise.all([
      prisma.course.create({
        data: {
          title: 'JavaScript Fundamentals',
          description: 'Learn JavaScript basics',
          createdById: coach.id,
        },
      }),
      prisma.course.create({
        data: {
          title: 'MongoDB with Prisma',
          description: 'Learn MongoDB database with Prisma ORM',
          createdById: admin.id,
        },
      }),
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('Default accounts:');
    console.log('Admin: admin@no.com / admin123');
    console.log('Coach: coach@no.com / coach123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.();
  }
}

export default seed;

if (require.main === module) {
  seed();
}
