import { getStudentData } from '@/lib/data';
import { auth } from '@/lib/auth';

import { SignOutButton } from '@/app/ui/sign-out-button';
import EvolutionCharts from '@/app/ui/student/evolution-charts';
import FinishWorkoutButton from '@/app/ui/student/finish-workout-button';

export default async function StudentDashboard() {
    const student = await getStudentData();

    if (!student) {
        return <div>Aluno não encontrado</div>;
    }

    const latestAssessment = student.assessments[0];
    const latestWorkout = student.workouts[0];

    return (
        <div className="w-full">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Bem-vindo(a), {student.name}</h1>
                <SignOutButton />
            </div>
            <p className="mt-4 text-gray-600">Seus últimos resultados de avaliação e planos de treino.</p>

            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">Minha Evolução</h2>
                <EvolutionCharts assessments={student.assessments} />
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-lg bg-white p-6 shadow-md border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4">Última Avaliação</h2>
                    {latestAssessment ? (
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Data</span>
                                <span className="font-medium">{new Date(latestAssessment.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Peso</span>
                                <span className="font-medium">{latestAssessment.weight} kg</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Gordura Corporal</span>
                                <span className="font-medium text-amber-600">{latestAssessment.bodyFatPercentage?.toFixed(1)}%</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">Nenhuma avaliação registrada.</p>
                    )}
                </div>

                <div className="rounded-lg bg-white p-6 shadow-md border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4">Treino Atual</h2>
                    {latestWorkout ? (
                        <div>
                            <h3 className="font-medium text-lg mb-2">{latestWorkout.title}</h3>
                            <div className="space-y-3">
                                {/* @ts-ignore */}
                                {JSON.parse(latestWorkout.content).map((exercise, index) => (
                                    <div key={index} className="flex justify-between border-b pb-2 last:border-0">
                                        <span>{exercise.name}</span>
                                        <span className="text-gray-500">{exercise.sets} x {exercise.reps}</span>
                                    </div>
                                ))}
                                <FinishWorkoutButton
                                    studentId={student.id}
                                    workoutId={latestWorkout.id}
                                />
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">Nenhum plano de treino atribuído.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
