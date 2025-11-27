import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'manual_test@helpfit.com';
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Need a trainer first
  const trainerEmail = 'trainer@helpfit.com';
  const trainer = await prisma.user.findUnique({ where: { email: trainerEmail } });
  
  if (!trainer) {
    console.error('Trainer not found!');
    return;
  }

  console.log('Found trainer:', trainer.email);

  try {
    console.log('Creating student...');
    const student = await prisma.user.create({
      data: {
        name: 'Manual Test Student',
        email,
        password: hashedPassword,
        role: 'STUDENT',
        trainer: {
          connect: { email: trainerEmail },
        },
      },
    });
    console.log('Student created successfully:', student);
  } catch (error) {
    console.error('Error creating student:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
