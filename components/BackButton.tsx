import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function BackButton({ href }: { href: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6 w-fit"
        >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
        </Link>
    );
}
