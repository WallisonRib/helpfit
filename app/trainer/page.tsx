import { getStudents, getTrainerStats } from '@/lib/data';
import Link from 'next/link';
import { PlusIcon, UserGroupIcon, ClipboardDocumentCheckIcon, FireIcon } from '@heroicons/react/24/outline';

import { SignOutButton } from '@/app/ui/sign-out-button';

export default async function TrainerDashboard() {
    const students = await getStudents();
    const stats = await getTrainerStats();

    return (
        <div className="w-full">
            {/* Stats Dashboard */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                <div className="rounded-lg bg-white p-6 shadow-md border border-gray-200 flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                        <UserGroupIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total de Alunos</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.totalStudents || 0}</p>
                    </div>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-md border border-gray-200 flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                        <ClipboardDocumentCheckIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Avaliações Realizadas</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.totalAssessments || 0}</p>
                    </div>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-md border border-gray-200 flex items-center">
                    <div className="p-3 rounded-full bg-amber-100 text-amber-600 mr-4">
                        <FireIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Treinos Hoje</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.workoutsCompletedToday || 0}</p>
                    </div>
                </div>
            </div>

            <div className="flex w-full items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Meus Alunos</h1>
                <div className="flex gap-4">
                    <Link
                        href="/trainer/students/create"
                        className="flex h-10 items-center rounded-lg bg-amber-500 px-4 text-sm font-medium text-white transition-colors hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                    >
                        <span className="hidden md:block">Adicionar Aluno</span>{' '}
                        <PlusIcon className="h-5 md:ml-4" />
                    </Link>
                    <SignOutButton />
                </div>
            </div>
            <div className="mt-6 flow-root">
                <div className="inline-block min-w-full align-middle">
                    <div className="rounded-lg bg-white p-2 md:pt-0 shadow-md border border-gray-200">
                        <div className="md:hidden">
                            {students?.map((student) => (
                                <div
                                    key={student.id}
                                    className="mb-2 w-full rounded-md bg-white p-4"
                                >
                                    <div className="flex items-center justify-between border-b pb-4">
                                        <div>
                                            <div className="mb-2 flex items-center">
                                                <p>{student.name}</p>
                                            </div>
                                            <p className="text-sm text-gray-500">{student.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex w-full items-center justify-between pt-4">
                                        <Link href={`/trainer/students/${student.id}`} className="font-medium text-amber-600 hover:text-amber-500">
                                            Ver Detalhes
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <table className="hidden min-w-full text-gray-900 md:table">
                            <thead className="rounded-lg text-left text-sm font-normal">
                                <tr>
                                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                        Nome
                                    </th>
                                    <th scope="col" className="px-3 py-5 font-medium">
                                        Email
                                    </th>
                                    <th scope="col" className="relative py-3 pl-6 pr-3">
                                        <span className="sr-only">Editar</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {students?.map((student) => (
                                    <tr
                                        key={student.id}
                                        className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                    >
                                        <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                            <div className="flex items-center gap-3">
                                                <p>{student.name}</p>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3">
                                            {student.email}
                                        </td>
                                        <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                            <div className="flex justify-end gap-3">
                                                <Link href={`/trainer/students/${student.id}`} className="font-medium text-amber-600 hover:text-amber-500">
                                                    Ver Detalhes
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
