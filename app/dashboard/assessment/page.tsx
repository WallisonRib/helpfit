import { Dumbbell, ClipboardList } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AssessmentCharts } from "./AssessmentCharts";

export default async function AssessmentPage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            assessments: {
                orderBy: { date: 'desc' },
                take: 1
            }
        }
    });

    if (!user) {
        redirect("/login");
    }

    const latestAssessment = user.assessments[0];

    if (!latestAssessment) {
        return (
            <div className="space-y-8">
                <header className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary bg-zinc-800 flex items-center justify-center">
                        <span className="text-xl font-bold text-white">{user.name?.[0] || 'U'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-semibold">{user.name?.split(' ')[0] || 'Aluno'}.</span>
                        <Dumbbell className="w-6 h-6 text-primary" />
                    </div>
                </header>
                <div className="text-center py-12 bg-zinc-900 rounded-2xl border border-zinc-800">
                    <ClipboardList className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                    <p className="text-zinc-400">Nenhuma avaliação encontrada.</p>
                </div>
            </div>
        );
    }

    return <AssessmentCharts user={user} assessment={latestAssessment} />;
}
