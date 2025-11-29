import { getStudent } from '@/lib/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BackButton } from '@/components/BackButton';
import { Dumbbell, Plus, Calendar } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { DeleteWorkoutButton } from '@/app/ui/DeleteWorkoutButton';

const DAYS_OF_WEEK = [
    "Segunda-Feira",
    "Terça-Feira",
    "Quarta-Feira",
    "Quinta-Feira",
    "Sexta-Feira",
    "Sábado",
    "Domingo"
];

export default async function StudentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const student = await getStudent(id);

    if (!student) {
        notFound();
    }

    // Fetch existing workouts to map to days
    const workouts = await prisma.workout.findMany({
        where: { studentId: student.id }
    });

    return (
        <div className="w-full space-y-8">
            <BackButton href="/trainer" />
            <div className="flex w-full items-center justify-between">
                <h1 className="text-3xl font-bold">{student.name}</h1>
                <Link
                    href={`/trainer/students/${student.id}/assessments/new`}
                    className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Nova Avaliação
                </Link>
            </div>

            {/* Weekly Schedule Grid */}
            <div>
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-primary" />
                    Agenda de Treinos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {DAYS_OF_WEEK.map((day) => {
                        const workout = workouts.find(w => w.title === day);
                        return (
                            <div key={day} className="relative group">
                                <Link
                                    href={`/trainer/students/${student.id}/workouts/${encodeURIComponent(day)}/edit`}
                                    className={`
                                        block p-6 rounded-2xl border transition-all hover:scale-[1.02]
                                        ${workout
                                            ? 'bg-zinc-900 border-primary/50 hover:border-primary'
                                            : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                                        }
                                    `}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`text-lg font-bold ${workout ? 'text-white' : 'text-zinc-500'}`}>
                                            {day}
                                        </span>
                                        {workout && <Dumbbell className="w-5 h-5 text-primary" />}
                                    </div>

                                    <div className="min-h-[60px] flex items-center">
                                        {workout ? (
                                            <div className="text-sm text-zinc-300">
                                                <span className="block font-medium text-primary mb-1">Treino Definido</span>
                                                <span className="text-xs text-zinc-500">Clique para editar</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-zinc-600 group-hover:text-primary transition-colors">
                                                <Plus className="w-5 h-5" />
                                                <span className="font-medium">Adicionar Treino</span>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                                {workout && <DeleteWorkoutButton workoutId={workout.id} />}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Assessments History */}
            <div className="mt-12">
                <h2 className="text-xl font-semibold mb-6">Histórico de Avaliações</h2>
                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                    {student.assessments.length === 0 ? (
                        <p className="text-zinc-500 text-center">Nenhuma avaliação registrada.</p>
                    ) : (
                        <ul className="space-y-4">
                            {student.assessments.map((assessment) => (
                                <li key={assessment.id} className="rounded-md bg-zinc-800 p-4 border border-zinc-700 flex justify-between items-center">
                                    <span className="font-medium text-white">{new Date(assessment.date).toLocaleDateString()}</span>
                                    <span className="text-zinc-400">{assessment.weight} kg</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
