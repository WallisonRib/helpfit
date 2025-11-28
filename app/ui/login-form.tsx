'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { authenticate, register } from '@/lib/actions';
import { AtSymbolIcon, KeyIcon, ExclamationCircleIcon, UserIcon, PhoneIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import UserTypeToggle from './user-type-toggle';
import SocialLogin from './social-login';

export default function LoginForm({
    mode = 'login',
    userType,
    onUserTypeChange
}: {
    mode?: 'login' | 'signup',
    userType: boolean,
    onUserTypeChange: (type: boolean) => void
}) {
    const action = mode === 'login' ? authenticate : register;
    const [state, dispatch, isPending] = useActionState(action, { message: null, errors: {} });

    return (
        <div className="space-y-3">
            <form action={dispatch}>
                <div className="flex-1 px-6 pt-8">
                    <div className="w-full space-y-4">
                        {mode === 'signup' && (
                            <div>
                                <label
                                    className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                                    htmlFor="name"
                                >
                                    Nome
                                </label>
                                <div className="relative">
                                    <input
                                        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 bg-gray-100 text-black"
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder="Digite seu nome"
                                        required
                                    />
                                    <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
                                <div id="name-error" aria-live="polite" aria-atomic="true">
                                    {state.errors?.name &&
                                        state.errors.name.map((error: string) => (
                                            <p className="mt-2 text-sm text-red-500" key={error}>
                                                {error}
                                            </p>
                                        ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <label
                                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                                htmlFor="email"
                            >
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 bg-gray-100 text-black"
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Digite seu email"
                                    required
                                />
                                <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                            </div>
                            <div id="email-error" aria-live="polite" aria-atomic="true">
                                {state.errors?.email &&
                                    state.errors.email.map((error: string) => (
                                        <p className="mt-2 text-sm text-red-500" key={error}>
                                            {error}
                                        </p>
                                    ))}
                            </div>
                        </div>

                        {mode === 'signup' && (
                            <div>
                                <label
                                    className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                                    htmlFor="phone"
                                >
                                    Telefone
                                </label>
                                <div className="relative">
                                    <input
                                        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 bg-gray-100 text-black"
                                        id="phone"
                                        type="tel"
                                        name="phone"
                                        placeholder="Digite seu telefone"
                                    />
                                    <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
                                <div id="phone-error" aria-live="polite" aria-atomic="true">
                                    {state.errors?.phone &&
                                        state.errors.phone.map((error: string) => (
                                            <p className="mt-2 text-sm text-red-500" key={error}>
                                                {error}
                                            </p>
                                        ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <label
                                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                                htmlFor="password"
                            >
                                Senha
                            </label>
                            <div className="relative">
                                <input
                                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 bg-gray-100 text-black"
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Digite sua senha"
                                    required
                                    minLength={6}
                                />
                                <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                            </div>
                            <div id="password-error" aria-live="polite" aria-atomic="true">
                                {state.errors?.password &&
                                    state.errors.password.map((error: string) => (
                                        <p className="mt-2 text-sm text-red-500" key={error}>
                                            {error}
                                        </p>
                                    ))}
                            </div>
                        </div>

                        {mode === 'signup' && userType && (
                            <div>
                                <label
                                    className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                                    htmlFor="cref"
                                >
                                    CREF
                                </label>
                                <div className="relative">
                                    <input
                                        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 bg-gray-100 text-black"
                                        id="cref"
                                        type="text"
                                        name="cref"
                                        placeholder="Digite seu CREF"
                                        required
                                    />
                                    <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
                                <div id="cref-error" aria-live="polite" aria-atomic="true">
                                    {state.errors?.cref &&
                                        state.errors.cref.map((error: string) => (
                                            <p className="mt-2 text-sm text-red-500" key={error}>
                                                {error}
                                            </p>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <LoginButton text={mode === 'login' ? 'Entrar' : 'Cadastrar'} />

                    <UserTypeToggle isPersonal={userType} onToggle={onUserTypeChange} />

                    <div
                        className="flex h-8 items-end space-x-1"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {state.message && Object.keys(state.errors || {}).length === 0 && (
                            <>
                                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                                <p className="text-sm text-red-500">{state.message}</p>
                            </>
                        )}
                    </div>
                </div>
            </form>
            <div className="px-6 pb-4">
                <SocialLogin />
            </div>
        </div>
    );
}

function LoginButton({ text }: { text: string }) {
    const { pending } = useFormStatus();

    return (
        <button
            className="mt-8 w-full flex justify-center items-center rounded-full bg-primary px-4 py-3 text-black font-bold transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-primary-dark aria-disabled:cursor-not-allowed aria-disabled:opacity-50 uppercase tracking-wide"
            aria-disabled={pending}
        >
            {text}
        </button>
    );
}
