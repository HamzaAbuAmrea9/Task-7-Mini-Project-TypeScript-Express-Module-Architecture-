import { prisma } from '../src/shared/database/prisma';
import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';

async function seed() {
  try {
    console.log('🌱 Seeding database...');

    // Clear existing data
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@no.com',
        password: adminPassword,
        role: UserRole.ADMIN,
      },
    });

    // Create a coach user
    const coachPassword = await bcrypt.hash('coach123', 10);
    const coach = await prisma.user.create({
      data: {
        name: 'John Coach',
        email: 'coach@no.com',
        password: coachPassword,
        role: UserRole.COACH,
      },
    });

    // Create a student user
    const studentPassword = await bcrypt.hash('student123', 10);
    const student = await prisma.user.create({
      data: {
        name: 'Jane Student',
        email: 'student@no.com',
        password: studentPassword,
        role: UserRole.STUDENT,
      },
    });

    // Create sample courses
    const courses = await Promise.all([
      prisma.course.create({
        data: {
          title: 'Introduction to JavaScript',
          description: 'Learn the fundamentals of JavaScript programming language.',
          image: 'https://via.placeholder.com/400x300/007acc/ffffff?text=JavaScript',
          createdById: coach.id,
        },
      }),
      prisma.course.create({
        data: {
          title: 'Advanced React Development',
          description: 'Master React.js with hooks, context, and advanced patterns.',
          image: 'https://via.placeholder.com/400x300/61dafb/000000?text=React',
          createdById: admin.id,
        },
      }),
      prisma.course.create({
        data: {
          title: 'Node.js Backend Development',
          description: 'Build scalable backend applications with Node.js and Express.',
          image: 'https://via.placeholder.com/400x300/339933/ffffff?text=Node.js',
          createdById: coach.id,
        },
      }),
    ]);

    console.log('✅ Database seeded successfully!');
    console.log(`Created ${courses.length} courses`);
    console.log('Default users:');
    console.log('Admin: admin@no.com / admin123');
    console.log('Coach: coach@no.com / coach123');
    console.log('Student: student@no.com / student123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seed()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

export default seed;