import { signOut } from '@/lib/auth';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';

export function SignOutButton() {
    return (
        <form
            action={async () => {
                'use server';
                await signOut();
            }}
        >
            <button className="flex h-10 grow items-center justify-center gap-2 rounded-md bg-zinc-900 border border-zinc-800 p-3 text-sm font-medium text-white hover:bg-zinc-800 hover:text-amber-500 md:flex-none md:justify-start md:p-2 md:px-3 transition-colors">
                <ArrowRightStartOnRectangleIcon className="w-6" />
                <div className="hidden md:block">Sair</div>
            </button>
        </form>
    );
}
