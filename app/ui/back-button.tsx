'use client';

import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function BackButton({ href }: { href?: string }) {
    const router = useRouter();

    const handleBack = () => {
        if (href) {
            router.push(href);
        } else {
            router.back();
        }
    };

    return (
        <button
            onClick={handleBack}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4 cursor-pointer"
        >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Voltar
        </button>
    );
}
