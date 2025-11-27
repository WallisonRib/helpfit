import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { BackButton } from "@/components/BackButton";
import { Dumbbell, Calendar, Repeat, Hash } from "lucide-react";

interface Exercise {
    name: string;
    sets: string;
    reps: string;
}

export default async function WorkoutViewPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.email) {
        redirect("/login");
    }

    const workout = await prisma.workout.findUnique({
        where: { id },
        include: { student: true }
    });

    if (!workout) {
        notFound();
    }

    // Verify ownership
    if (workout.student.email !== session.user.email) {
        redirect("/dashboard");
    }

    const exercises: Exercise[] = JSON.parse(workout.content);

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8">
            <BackButton href="/dashboard" />

            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
                    <Dumbbell className="w-8 h-8" />
                    {workout.title}
                </h1>
                <p className="text-zinc-400">Visualize os detalhes do seu treino abaixo.</p>
            </header>

            <div className="grid gap-6">
                {exercises.map((exercise, index) => (
                    <div key={index} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-primary font-bold">
                                {index + 1}
                            </div>
                            <h3 className="text-xl font-semibold text-white">{exercise.name}</h3>
                        </div>

                        <div className="flex items-center gap-8 text-zinc-300">
                            <div className="flex items-center gap-2">
                                <Repeat className="w-5 h-5 text-zinc-500" />
                                <span className="font-medium">{exercise.sets} séries</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Hash className="w-5 h-5 text-zinc-500" />
                                <span className="font-medium">{exercise.reps} repetições</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
