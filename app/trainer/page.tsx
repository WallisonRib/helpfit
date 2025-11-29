import { getTrainerStats } from '@/lib/data';
import Link from 'next/link';
import { PlusIcon, UserGroupIcon, ClipboardDocumentCheckIcon, FireIcon } from '@heroicons/react/24/outline';



import { TrainingTimeline } from '@/app/ui/trainer/training-timeline';

export default async function TrainerDashboard() {
    const stats = await getTrainerStats();

    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            {/* Stats Dashboard */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                <div className="rounded-lg bg-zinc-900 p-6 shadow-md border border-zinc-800 flex items-center">
                    <div className="p-3 rounded-full bg-blue-900/20 text-blue-400 mr-4">
                        <UserGroupIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-zinc-400 font-medium">Total de Alunos</p>
                        <p className="text-2xl font-bold text-white">{stats?.totalStudents || 0}</p>
                    </div>
                </div>
                <div className="rounded-lg bg-zinc-900 p-6 shadow-md border border-zinc-800 flex items-center">
                    <div className="p-3 rounded-full bg-green-900/20 text-green-400 mr-4">
                        <ClipboardDocumentCheckIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-zinc-400 font-medium">Avaliações Realizadas</p>
                        <p className="text-2xl font-bold text-white">{stats?.totalAssessments || 0}</p>
                    </div>
                </div>
                <div className="rounded-lg bg-zinc-900 p-6 shadow-md border border-zinc-800 flex items-center">
                    <div className="p-3 rounded-full bg-amber-900/20 text-amber-400 mr-4">
                        <FireIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-zinc-400 font-medium">Treinos Hoje</p>
                        <p className="text-2xl font-bold text-white">{stats?.workoutsCompletedToday || 0}</p>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="mb-8">
                <TrainingTimeline />
            </div>
        </div>
    );
}
