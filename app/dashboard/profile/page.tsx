

import { Check, Dumbbell } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
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

            <div className="bg-white text-black p-8 rounded-3xl shadow-lg max-w-3xl mx-auto">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 rounded-full bg-zinc-800 mb-4 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">{user.name?.[0] || 'U'}</span>
                    </div>
                </div>

                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-primary mb-1">Nome</label>
                        <input type="text" defaultValue={user.name || ''} className="w-full bg-gray-100 border-none rounded-lg p-3 text-black" readOnly />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-primary mb-1">E-mail</label>
                        <input type="email" defaultValue={user.email} className="w-full bg-gray-100 border-none rounded-lg p-3 text-black" readOnly />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-primary mb-1">Telefone</label>
                        <input type="tel" defaultValue="(38) 9 9999-9999" className="w-full bg-gray-100 border-none rounded-lg p-3 text-black" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-primary mb-1">Endereço</label>
                        <input type="text" defaultValue="Rua Dom Pedro II, n 123, Centro" className="w-full bg-gray-100 border-none rounded-lg p-3 text-black" />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-primary mb-1">Idade</label>
                            <input type="text" defaultValue="25" className="w-full bg-gray-100 border-none rounded-lg p-3 text-center text-black" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-primary mb-1">Altura</label>
                            <input type="text" defaultValue={latestAssessment?.height ? (latestAssessment.height / 100).toFixed(2) : ''} className="w-full bg-gray-100 border-none rounded-lg p-3 text-center text-black" readOnly />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-primary mb-1">Peso</label>
                            <input type="text" defaultValue={latestAssessment?.weight || ''} className="w-full bg-gray-100 border-none rounded-lg p-3 text-center text-black" readOnly />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-primary mb-1">Local de Treino</label>
                        <input type="text" defaultValue="Academia Unimontes" className="w-full bg-gray-100 border-none rounded-lg p-3 text-black" />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="button" className="bg-primary text-black rounded-full p-2 hover:bg-primary/90 transition-colors">
                            <Check className="w-6 h-6" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
