"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, ClipboardList, User, Headphones, Home, Users, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/actions";

const studentNavItems = [
    { name: "Treino", href: "/dashboard", icon: Dumbbell },
    { name: "Avaliação", href: "/dashboard/assessment", icon: ClipboardList },
    { name: "Treinadores", href: "/dashboard/trainers", icon: Users },
    { name: "Perfil", href: "/dashboard/profile", icon: User },
    { name: "Suporte", href: "/dashboard/support", icon: Headphones },
];

const trainerNavItems = [
    { name: "Dashboard", href: "/trainer", icon: Home },
    { name: "Alunos", href: "/trainer/students", icon: Users },
    { name: "Perfil", href: "/trainer/profile", icon: User },
];

interface SidebarProps {
    role?: string;
}

export function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();
    const isTrainer = role === 'TRAINER' || pathname.startsWith("/trainer");
    const navItems = isTrainer ? trainerNavItems : studentNavItems;

    return (
        <aside className="w-20 bg-zinc-900 flex flex-col items-center py-8 border-r border-zinc-800 h-screen fixed left-0 top-0 z-50">
            <div className="mb-8">
                <Link href={isTrainer ? "/trainer" : "/dashboard"} className="text-primary hover:text-primary/80 transition-colors">
                    <Home className="w-8 h-8" />
                </Link>
            </div>
            <nav className="flex flex-col gap-6 w-full px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/trainer" && item.href !== "/dashboard" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center p-3 rounded-xl transition-all group",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                            )}
                        >
                            <item.icon className={cn("w-6 h-6 mb-1", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto w-full px-2">
                <button
                    onClick={() => logout()}
                    className="flex flex-col items-center justify-center p-3 rounded-xl transition-all group w-full text-zinc-400 hover:bg-zinc-800 hover:text-red-500"
                >
                    <LogOut className="w-6 h-6 mb-1 stroke-[2px]" />
                    <span className="text-[10px] font-medium">Sair</span>
                </button>
            </div>
        </aside>
    );
}
