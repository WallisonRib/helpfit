import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const trainerEmail = 'personal_manual@email.com';
    const trainer = await prisma.user.findUnique({ where: { email: trainerEmail } });

    if (!trainer) {
        console.error('Trainer not found');
        return;
    }

    const studentEmail = 'timeline_student@email.com';
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create or update student
    const studentCreateData: any = {
        name: 'Timeline Student',
        email: studentEmail,
        password: hashedPassword,
        role: 'STUDENT',
        trainers: {
            connect: { id: trainer.id }
        }
    };

    const student = await prisma.user.upsert({
        where: { email: studentEmail },
        update: {},
        create: studentCreateData
    });

    console.log('Student created/found:', student.name);

    // Create workout
    const workout = await prisma.workout.create({
        data: {
            title: 'Timeline Workout',
            content: '[]',
            studentId: student.id
        }
    });

    console.log('Workout created:', workout.title);

    // Log workout for today
    const log = await prisma.workoutLog.create({
        data: {
            studentId: student.id,
            workoutId: workout.id,
        }
    });

    console.log('Workout logged for today:', log.date);
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
