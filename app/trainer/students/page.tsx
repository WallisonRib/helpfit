import { getStudents } from '@/lib/data';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

export default async function TrainerStudentsPage() {
    const students = await getStudents();

    return (
        <div className="w-full">
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
                </div>
            </div>
            <div className="mt-6 flow-root">
                <div className="inline-block min-w-full align-middle">
                    <div className="rounded-lg bg-zinc-900 p-2 md:pt-0 shadow-md border border-zinc-800">
                        <div className="md:hidden">
                            {students?.map((student) => (
                                <div
                                    key={student.id}
                                    className="mb-2 w-full rounded-md bg-zinc-900 p-4 border-b border-zinc-800 last:border-none"
                                >
                                    <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                                        <div>
                                            <div className="mb-2 flex items-center">
                                                <p className="text-white">{student.name}</p>
                                            </div>
                                            <p className="text-sm text-zinc-400">{student.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex w-full items-center justify-between pt-4">
                                        <Link href={`/trainer/students/${student.id}`} className="font-medium text-amber-500 hover:text-amber-400">
                                            Ver Detalhes
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <table className="hidden min-w-full text-white md:table">
                            <thead className="rounded-lg text-left text-sm font-normal">
                                <tr>
                                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6 text-zinc-400">
                                        Nome
                                    </th>
                                    <th scope="col" className="px-3 py-5 font-medium text-zinc-400">
                                        Email
                                    </th>
                                    <th scope="col" className="relative py-3 pl-6 pr-3">
                                        <span className="sr-only">Editar</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-zinc-900">
                                {students?.map((student) => (
                                    <tr
                                        key={student.id}
                                        className="w-full border-b border-zinc-800 py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                    >
                                        <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                            <div className="flex items-center gap-3">
                                                <p className="text-white">{student.name}</p>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3 text-zinc-300">
                                            {student.email}
                                        </td>
                                        <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                            <div className="flex justify-end gap-3">
                                                <Link href={`/trainer/students/${student.id}`} className="font-medium text-amber-500 hover:text-amber-400">
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
