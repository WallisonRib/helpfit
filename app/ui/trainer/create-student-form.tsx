'use client';

import { useActionState } from 'react';
import { createStudent } from '@/lib/actions';
import { UserIcon, EnvelopeIcon, KeyIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function CreateStudentForm() {
    const initialState = { message: null, errors: {} };
    const [state, dispatch, isPending] = useActionState(createStudent, initialState);

    return (
        <form action={dispatch} className="max-w-md space-y-4">
            <div className="rounded-md bg-zinc-900 p-4 md:p-6 border border-zinc-800">
                {/* Name */}
                <div className="mb-4">
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-white">
                        Nome
                    </label>
                    <div className="relative">
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Nome do Aluno"
                            className="peer block w-full rounded-md border border-zinc-700 bg-zinc-800 py-2 pl-10 text-sm outline-2 placeholder:text-zinc-500 text-white focus:border-primary focus:ring-primary"
                            aria-describedby="name-error"
                        />
                        <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-zinc-500" />
                    </div>
                    <div id="name-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.name &&
                            state.errors.name.map((error: string) => (
                                <p key={error} className="mt-2 text-sm text-red-500">
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-white">
                        Email
                    </label>
                    <div className="relative">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="aluno@exemplo.com"
                            className="peer block w-full rounded-md border border-zinc-700 bg-zinc-800 py-2 pl-10 text-sm outline-2 placeholder:text-zinc-500 text-white focus:border-primary focus:ring-primary"
                            aria-describedby="email-error"
                        />
                        <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-zinc-500" />
                    </div>
                    <div id="email-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.email &&
                            state.errors.email.map((error: string) => (
                                <p key={error} className="mt-2 text-sm text-red-500">
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Password */}
                <div className="mb-4">
                    <label htmlFor="password" className="mb-2 block text-sm font-medium text-white">
                        Senha Inicial
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Digite a senha"
                            className="peer block w-full rounded-md border border-zinc-700 bg-zinc-800 py-2 pl-10 text-sm outline-2 placeholder:text-zinc-500 text-white focus:border-primary focus:ring-primary"
                            aria-describedby="password-error"
                            minLength={6}
                        />
                        <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-zinc-500" />
                    </div>
                    <div id="password-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.password &&
                            state.errors.password.map((error: string) => (
                                <p key={error} className="mt-2 text-sm text-red-500">
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                <div id="form-error" aria-live="polite" aria-atomic="true">
                    {state.message && (
                        <p className="mt-2 text-sm text-red-500">
                            {state.message}
                        </p>
                    )}
                </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/trainer"
                    className="flex h-10 items-center rounded-lg bg-zinc-800 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-700 border border-zinc-700"
                >
                    Cancelar
                </Link>
                <button
                    type="submit"
                    className="flex h-10 items-center rounded-lg bg-amber-500 px-4 text-sm font-medium text-white transition-colors hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                >
                    Criar Aluno
                </button>
            </div>
        </form>
    );
}
