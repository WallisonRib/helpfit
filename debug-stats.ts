
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'trainer@helpfit.com';
  console.log(`Fetching stats for ${email}...`);

  const trainer = await prisma.user.findUnique({
    where: { email },
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

  if (!trainer) {
    console.log('Trainer not found');
    return;
  }

  const totalStudents = trainer.students.length;
  const totalAssessments = trainer.students.reduce((acc: number, student: any) => acc + student.assessments.length, 0);
  const workoutsCompletedToday = trainer.students.reduce((acc: number, student: any) => acc + student.logs.length, 0);

  console.log('Stats:', {
    totalStudents,
    totalAssessments,
    workoutsCompletedToday,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
