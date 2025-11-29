import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserIcon } from '@heroicons/react/24/outline';

export default async function StudentTrainersPage() {
    const session = await auth();
    if (!session?.user?.email) return null;

    const student = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { trainers: true },
    });

    const trainers = student?.trainers || [];

    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold mb-6">Meus Treinadores</h1>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {trainers.length > 0 ? (
                    trainers.map((trainer) => (
                        <div key={trainer.id} className="rounded-lg bg-zinc-900 p-6 shadow-md border border-zinc-800 flex items-center">
                            <div className="p-3 rounded-full bg-amber-900/20 text-amber-400 mr-4">
                                <UserIcon className="h-8 w-8" />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-white">{trainer.name}</p>
                                <p className="text-sm text-zinc-400">{trainer.email}</p>
                                {trainer.cref && (
                                    <p className="text-xs text-zinc-500 mt-1">CREF: {trainer.cref}</p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
                        <p className="text-zinc-400">Você ainda não possui treinadores vinculados.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
