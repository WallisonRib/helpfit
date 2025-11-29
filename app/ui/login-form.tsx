'use client';

import { useActionState, useState } from 'react';
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

    const [phone, setPhone] = useState('');
    const [cref, setCref] = useState('');

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        if (value.length > 10) {
            value = value.replace(/^(\d\d)(\d)(\d{4})(\d{4}).*/, '($1) $2 $3-$4');
        } else if (value.length > 6) {
            value = value.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, '($1) $2-$3');
        } else if (value.length > 2) {
            value = value.replace(/^(\d\d)(\d{0,5}).*/, '($1) $2');
        } else if (value.length > 0) {
            value = value.replace(/^(\d*)/, '($1');
        }
        setPhone(value);
    };

    const handleCrefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.toUpperCase();
        // Remove invalid characters (only numbers, letters, hyphen, slash)
        value = value.replace(/[^A-Z0-9\-\/]/g, '');

        // Enforce structure: NNNNNN-LL/LL
        // 1. First 6 must be digits
        // 2. Then hyphen
        // 3. Then 1 or 2 letters
        // 4. Then slash
        // 5. Then 2 letters

        // Simple mask logic for typing
        let raw = value.replace(/[^A-Z0-9]/g, ''); // Get only alphanum

        let formatted = '';
        if (raw.length > 0) {
            // First 6 digits
            const digits = raw.slice(0, 6).replace(/\D/g, '');
            formatted += digits;

            if (digits.length === 6) {
                formatted += '-';
                const remainder = raw.slice(6);

                // Up to 2 letters before slash
                // But wait, user said "first two L's can be both LL or L only".
                // And then "last sequence of L's is steady" (meaning 2 letters for UF).
                // So we expect NNNNNN-L/LL or NNNNNN-LL/LL.

                // Let's try to detect if we have enough chars for the suffix
                // We can just let them type letters and insert slash before the last 2 if length is sufficient?
                // Or simpler: let them type up to 4 letters after hyphen, and format it?

                // Let's use a simpler approach:
                // 6 digits + hyphen + up to 4 letters.
                // If we have 3 letters after hyphen, format as L/LL? No, could be LL/L (invalid).
                // User said: NNNNNN-LL/LL (max).

                // Let's just allow typing and insert symbols if they match position?
                // But length varies.

                // Alternative:
                // 1. Get digits (max 6).
                // 2. Get letters (max 4).

                const letters = remainder.replace(/[^A-Z]/g, '').slice(0, 4);

                if (letters.length > 0) {
                    if (letters.length <= 2) {
                        // Just letters: NNNNNN-L or NNNNNN-LL
                        formatted += letters;
                    } else {
                        // More than 2 letters: NNNNNN-L/LL or NNNNNN-LL/LL
                        // If 3 letters: L/LL
                        // If 4 letters: LL/LL
                        const prefix = letters.slice(0, letters.length - 2);
                        const suffix = letters.slice(letters.length - 2);
                        formatted += prefix + '/' + suffix;
                    }
                }
            }
        }

        // However, the above logic is tricky for backspacing.
        // Let's try a more direct approach that allows typing naturally.

        // If user types: 123456GSP -> 123456-G/SP
        // If user types: 123456GLSP -> 123456-GL/SP

        // Let's just enforce the hyphen after 6 digits.
        // And let the user type the rest, but maybe help with the slash?
        // The slash position depends on total length.

        // Let's stick to a simpler mask that just enforces the hyphen.
        // And maybe the slash if they type it or if we can infer it.

        // Let's try this:
        // 1. Digits (max 6)
        // 2. Hyphen
        // 3. Letters (max 4)
        // 4. Insert slash before last 2 letters if total letters > 2?

        // Let's refine the raw processing:
        const digits = raw.slice(0, 6).replace(/\D/g, '');
        const letters = raw.slice(6).replace(/[^A-Z]/g, '').slice(0, 4);

        let result = digits;
        if (digits.length === 6) {
            result += '-';
            if (letters.length > 0) {
                if (letters.length > 2) {
                    result += letters.slice(0, letters.length - 2) + '/' + letters.slice(letters.length - 2);
                } else {
                    result += letters;
                }
            }
        }

        setCref(result);
    };

    return (
        <div className="space-y-3">
            <form action={dispatch}>
                <div className="flex-1 px-6 pt-8">
                    <div className="w-full space-y-4">
                        <input type="hidden" name="userType" value={userType ? 'personal' : 'student'} />
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
                                        placeholder="(99) 9 9999-9999"
                                        value={phone}
                                        onChange={handlePhoneChange}
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
                                        placeholder="000000-G/SP"
                                        value={cref}
                                        onChange={handleCrefChange}
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
