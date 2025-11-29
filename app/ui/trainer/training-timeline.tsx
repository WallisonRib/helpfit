import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Clock, CheckCircle2 } from "lucide-react";

export async function TrainingTimeline() {
    const session = await auth();
    if (!session?.user?.email) return null;

    const trainer = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            students: {
                include: {
                    logs: {
                        where: {
                            date: {
                                gte: new Date(new Date().setHours(0, 0, 0, 0)),
                            },
                        },
                        include: {
                            workout: true,
                        },
                        orderBy: {
                            date: 'desc',
                        },
                    },
                },
            },
        },
    });

    if (!trainer) return null;

    // Flatten logs from all students
    const timeline = trainer.students.flatMap(student =>
        student.logs.map(log => ({
            id: log.id,
            studentName: student.name,
            workoutTitle: log.workout?.title || 'Treino',
            time: log.date,
        }))
    ).sort((a, b) => b.time.getTime() - a.time.getTime());

    if (timeline.length === 0) {
        return (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Timeline de Hoje
                </h3>
                <p className="text-zinc-500 text-center py-4">Nenhum treino realizado hoje.</p>
            </div>
        );
    }

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Timeline de Hoje
            </h3>

            <div className="space-y-6">
                {timeline.map((item) => (
                    <div key={item.id} className="relative pl-6 border-l-2 border-zinc-800 last:border-l-0 pb-0">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-zinc-900 border-2 border-primary flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-white">{item.studentName}</span>
                                <span className="text-xs text-zinc-500">
                                    {item.time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p className="text-sm text-zinc-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                                Concluiu: <span className="text-zinc-300">{item.workoutTitle}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
