import WorkoutForm from '@/app/ui/trainer/workout-form';
import { getStudent } from '@/lib/data';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function EditWorkoutPage({ params }: { params: Promise<{ id: string; day: string }> }) {
    const { id, day } = await params;
    const decodedDay = decodeURIComponent(day);
    const student = await getStudent(id);

    if (!student) {
        notFound();
    }

    // Fetch existing workout for this day if it exists
    const workout = await prisma.workout.findFirst({
        where: {
            studentId: student.id,
            title: decodedDay
        }
    });

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold">{decodedDay}</h1>
                    <p className="text-zinc-400">Treino para {student.name}</p>
                </div>
            </div>
            <div className="mt-6">
                <WorkoutForm
                    studentId={student.id}
                    day={decodedDay}
                    initialData={workout ? JSON.parse(workout.content) : null}
                />
            </div>
        </div>
    );
}
