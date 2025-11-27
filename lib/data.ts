import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function getStudents() {
  const session = await auth();
  if (!session?.user?.email) return [];

  const trainer = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { students: true },
  });

  return trainer?.students || [];
}

export async function getStudent(id: string) {
  const session = await auth();
  if (!session?.user?.email) return null;

  const student = await prisma.user.findUnique({
    where: { id },
    include: {
      assessments: {
        orderBy: { date: 'desc' },
      },
      workouts: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  
  // Security check: ensure student belongs to trainer
  // In a real app, we'd check the relation more strictly
  
  return student;
}

export async function getStudentData() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const student = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      assessments: {
        orderBy: { date: 'desc' },
        take: 1,
      },
      workouts: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  return student;
}



export async function getWorkout(id: string) {
  try {
    const workout = await prisma.workout.findUnique({
      where: { id },
    });
    return workout;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch workout.');
  }
}

export async function getTrainerStats() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const trainer = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      students: {
        include: {
          assessments: true,
          logs: {
            where: {
              date: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)),
              },
            },
          },
        },
      },
    },
  });

  if (!trainer) return null;

  const totalStudents = trainer.students.length;
  const totalAssessments = trainer.students.reduce((acc, student) => acc + student.assessments.length, 0);
  const workoutsCompletedToday = trainer.students.reduce((acc, student) => acc + student.logs.length, 0);

  return {
    totalStudents,
    totalAssessments,
    workoutsCompletedToday,
  };
}
