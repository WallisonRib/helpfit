import { WorkoutCard } from "@/components/WorkoutCard";
import { Dumbbell } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            workouts: {
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!user) {
        redirect("/login");
    }

    if (user.role === 'TRAINER') {
        redirect("/trainer");
    }

    // Map workouts to display
    // For now, we'll just list them. In a real app, we might map them to days of the week based on title or content.
    // Let's assume the title contains the day or we just list available workouts.
    // If no workouts, we can show a placeholder or the static list as fallback for demo if needed, but goal is real data.

    const weekDaysOrder = [
        'Segunda', 'Segunda-feira',
        'Terça', 'Terça-feira',
        'Quarta', 'Quarta-feira',
        'Quinta', 'Quinta-feira',
        'Sexta', 'Sexta-feira',
        'Sábado',
        'Domingo'
    ];

    const getDayIndex = (title: string) => {
        const lowerTitle = title.toLowerCase();
        const index = weekDaysOrder.findIndex(day => lowerTitle.includes(day.toLowerCase()));
        return index === -1 ? 999 : index;
    };

    const workouts = user.workouts.length > 0 ? user.workouts.map(w => ({
        day: w.title, // Using title as the "Day" or name of workout
        id: w.id
    })).sort((a, b) => getDayIndex(a.day) - getDayIndex(b.day)) : [];

    return (
        <div className="space-y-8">
            {/* Header */}
            <header className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary bg-zinc-800 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">{user.name?.[0] || 'U'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xl font-semibold">Bem vindo, {user.name?.split(' ')[0] || 'Aluno'}.</span>
                    <Dumbbell className="w-6 h-6 text-primary" />
                </div>
            </header>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {workouts.length > 0 ? (
                    workouts.map((workout) => (
                        <WorkoutCard key={workout.id} day={workout.day} href={`/dashboard/workout/${workout.id}`} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 bg-zinc-900 rounded-2xl border border-zinc-800">
                        <Dumbbell className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                        <p className="text-zinc-400">Nenhum treino atribuído ainda.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
