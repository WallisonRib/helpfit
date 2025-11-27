import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface WorkoutCardProps {
    day: string;
    href: string;
}

export function WorkoutCard({ day, href }: WorkoutCardProps) {
    return (
        <Link
            href={href}
            className="relative h-40 w-full rounded-2xl overflow-hidden group cursor-pointer border border-zinc-800 block"
        >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 bg-zinc-900">
                {/* Placeholder for image if not provided */}
                <div className="w-full h-full bg-zinc-800 opacity-50" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 p-6 flex items-center justify-between z-10">
                <h3 className="text-primary text-2xl font-bold tracking-wide uppercase">{day}</h3>

                <div className="bg-primary rounded-full p-1 transition-transform group-hover:scale-110">
                    <ChevronRight className="w-6 h-6 text-black" />
                </div>
            </div>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
    );
}
