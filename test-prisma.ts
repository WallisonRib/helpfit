import { PrismaClient } from '@prisma/client';

async function main() {
  try {
    console.log('Instantiating PrismaClient...');
    const prisma = new PrismaClient();
    console.log('PrismaClient instantiated successfully.');
    await prisma.$connect();
    console.log('Connected to database.');
    await prisma.$disconnect();
    console.log('Disconnected.');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
