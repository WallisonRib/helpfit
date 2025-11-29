import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { BackButton } from "@/components/BackButton";
import { Dumbbell, Calendar, Repeat, Hash } from "lucide-react";
import { CompleteWorkoutButton } from "@/app/ui/complete-workout-button";

interface Exercise {
    name: string;
    sets: string;
    reps: string;
    mediaUrl?: string;
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

    // Fetch all workouts for pagination
    const allWorkouts = await prisma.workout.findMany({
        where: { studentId: workout.studentId },
        select: { id: true, title: true }
    });

    const weekDaysOrder = [
        { full: 'Segunda', short: 'S' },
        { full: 'Terça', short: 'T' },
        { full: 'Quarta', short: 'Q' },
        { full: 'Quinta', short: 'Q' },
        { full: 'Sexta', short: 'S' },
        { full: 'Sábado', short: 'S' },
        { full: 'Domingo', short: 'D' }
    ];

    const getDayIndex = (title: string) => {
        const lowerTitle = title.toLowerCase();
        const index = weekDaysOrder.findIndex(day => lowerTitle.includes(day.full.toLowerCase()));
        return index === -1 ? 999 : index;
    };

    const sortedWorkouts = allWorkouts.sort((a, b) => getDayIndex(a.title) - getDayIndex(b.title));

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8">
            <BackButton href="/dashboard" />

            {/* Pagination */}
            <div className="flex justify-center gap-2 mb-8 overflow-x-auto py-4 px-2">
                {weekDaysOrder.map((day, index) => {
                    const dayWorkout = sortedWorkouts.find(w => w.title.toLowerCase().includes(day.full.toLowerCase()));
                    const isActive = dayWorkout?.id === id;
                    const hasWorkout = !!dayWorkout;

                    if (!hasWorkout) {
                        return (
                            <div key={index} className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50 border border-transparent" title="Sem treino">
                                {day.short}
                            </div>
                        );
                    }

                    return (
                        <a
                            key={index}
                            href={`/dashboard/workout/${dayWorkout.id}`}
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${isActive
                                ? 'bg-primary text-black scale-110 shadow-lg shadow-primary/20 border-primary'
                                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white hover:scale-110 hover:shadow-md hover:shadow-zinc-700/50 border border-zinc-700'
                                }`}
                            title={dayWorkout.title}
                        >
                            {day.short}
                        </a>
                    );
                })}
            </div>

            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
                    <Dumbbell className="w-8 h-8" />
                    {workout.title}
                </h1>
                <p className="text-zinc-400">Visualize os detalhes do seu treino abaixo.</p>
            </header>

            <div className="grid gap-6">
                {exercises.map((exercise, index) => (
                    <div key={index} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-primary/50 transition-colors">
                        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-primary font-bold shrink-0">
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

                        {/* Media Display */}
                        {exercise.mediaUrl && (
                            <div className="px-6 pb-6">
                                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800">
                                    {(() => {
                                        const isYoutube = exercise.mediaUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
                                        const isVideo = exercise.mediaUrl.match(/\.(mp4|webm|ogg|mov)$/i);

                                        if (isYoutube) {
                                            const videoId = isYoutube[1];
                                            return (
                                                <iframe
                                                    src={`https://www.youtube.com/embed/${videoId}`}
                                                    className="w-full h-full"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            );
                                        }

                                        if (isVideo) {
                                            return (
                                                <video
                                                    src={exercise.mediaUrl}
                                                    controls
                                                    playsInline
                                                    preload="metadata"
                                                    className="w-full h-full object-contain"
                                                >
                                                    Seu navegador não suporta a tag de vídeo.
                                                </video>
                                            );
                                        }

                                        return (
                                            <img
                                                src={exercise.mediaUrl}
                                                alt={exercise.name}
                                                className="w-full h-full object-contain"
                                            />
                                        );
                                    })()}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="pt-8 pb-12">
                <CompleteWorkoutButton workoutId={workout.id} />
            </div>
        </div>
    );
}
