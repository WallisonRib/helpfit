'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Dumbbell } from 'lucide-react';
import LoginForm from './login-form';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface AuthLayoutProps {
    mode: 'login' | 'signup';
    title: string;
    linkText: string;
    linkUrl: string;
    linkLabel: string;
}

function AuthLayoutContent({ mode, title, linkText, linkUrl, linkLabel }: AuthLayoutProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Initialize from URL or default to false (Student)
    const initialType = searchParams.get('type') === 'personal';
    const [isPersonal, setIsPersonal] = useState(initialType);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isContentVisible, setIsContentVisible] = useState(true);

    // Sync state with URL when it changes (e.g. back button)
    useEffect(() => {
        const type = searchParams.get('type');
        setIsPersonal(type === 'personal');
    }, [searchParams]);

    const handleUserTypeChange = (newIsPersonal: boolean) => {
        // 1. Fade Out
        setIsContentVisible(false);

        setTimeout(() => {
            // 2. Expand
            setIsExpanded(true);

            setTimeout(() => {
                // 3. Switch State
                setIsPersonal(newIsPersonal);
                const params = new URLSearchParams(searchParams);
                if (newIsPersonal) {
                    params.set('type', 'personal');
                } else {
                    params.delete('type');
                }
                router.replace(`${pathname}?${params.toString()}`);

                // 4. Shrink (after a brief hold to ensure full coverage is perceived)
                setTimeout(() => {
                    setIsExpanded(false);

                    setTimeout(() => {
                        // 5. Fade In
                        setIsContentVisible(true);
                    }, 500); // Wait for shrink (duration-500)
                }, 50);
            }, 500); // Wait for expand (duration-500)
        }, 200); // Wait for fade out (duration-200)
    };

    // Construct link URL preserving current type
    const getLinkUrl = () => {
        const params = new URLSearchParams(searchParams);
        return `${linkUrl}?${params.toString()}`;
    };

    return (
        <main className="flex min-h-screen w-full relative overflow-hidden bg-white">
            {/* Banner Section (Color Part) - z-10 (Behind) */}
            <div
                className={`absolute top-0 bottom-0 w-1/2 flex items-center justify-center transition-all duration-700 cubic-bezier(0.68, -0.55, 0.265, 1.55) z-10 ${isPersonal
                    ? 'translate-x-[100%] bg-primary' // Personal: Right side, Yellow
                    : 'translate-x-0 bg-zinc-900'      // Student: Left side, Dark
                    }`}
            >
                {/* Decorative Curve */}
                <div
                    className={`absolute top-[-1%] bottom-[-1%] w-32 transition-all duration-700 ${isPersonal
                        ? 'left-0 bg-white rounded-r-[100px] -translate-x-16' // Curve on left when banner is right
                        : 'right-0 bg-white rounded-l-[100px] translate-x-16' // Curve on right when banner is left
                        }`}
                />

                <div className="flex flex-col items-center gap-4 z-10">
                    <div className={`w-32 h-32 border-4 rounded-3xl flex items-center justify-center transition-colors duration-700 ${isPersonal ? 'border-black' : 'border-primary'
                        }`}>
                        <Dumbbell className={`w-20 h-20 transition-colors duration-700 ${isPersonal ? 'text-black' : 'text-primary'
                            }`} />
                    </div>
                    <h1 className={`text-4xl font-bold tracking-widest transition-colors duration-700 ${isPersonal ? 'text-black' : 'text-primary'
                        }`}>
                        HELP FIT
                    </h1>
                </div>
            </div>

            {/* Form Section (White Part) - z-20 (Front) */}
            <div
                className={`absolute top-0 bottom-0 flex items-center justify-center p-8 transition-all duration-500 ease-in-out z-20 bg-white ${isExpanded ? 'w-full translate-x-0' : 'w-1/2'
                    } ${!isExpanded && isPersonal ? 'translate-x-0' : ''
                    } ${!isExpanded && !isPersonal ? 'translate-x-[100%]' : ''
                    }`}
            >
                <div className={`w-full max-w-md space-y-8 transition-opacity duration-200 ${isContentVisible ? 'opacity-100' : 'opacity-0'}`}>
                    {/* Mobile Logo */}
                    <div className="text-center lg:hidden mb-8">
                        <div className="inline-flex w-20 h-20 border-4 border-primary rounded-2xl items-center justify-center mb-4">
                            <Dumbbell className="w-12 h-12 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-primary tracking-widest">HELP FIT</h1>
                    </div>

                    {/* Content */}
                    <div className="bg-white p-8">
                        <h2 className="text-2xl font-bold text-primary mb-6 text-center">{title}</h2>

                        <LoginForm
                            mode={mode}
                            userType={isPersonal}
                            onUserTypeChange={handleUserTypeChange}
                        />

                        <div className="mt-4 text-center text-sm">
                            <span className="text-gray-500">{linkLabel} </span>
                            <Link href={getLinkUrl()} className="text-primary font-bold hover:underline">
                                {linkText}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Fallback */}
            <style jsx global>{`
                @media (max-width: 1024px) {
                    .min-h-screen {
                        flex-direction: column;
                    }
                    /* Hide banner on mobile for now, or stack it */
                    div[class*="absolute"] {
                        position: relative !important;
                        width: 100% !important;
                        transform: none !important;
                    }
                    /* Hide the decorative curve on mobile */
                    div[class*="rounded-l-[100px]"], div[class*="rounded-r-[100px]"] {
                        display: none;
                    }
                }
            `}</style>
        </main>
    );
}

export default function AuthLayout(props: AuthLayoutProps) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthLayoutContent {...props} />
        </Suspense>
    );
}
