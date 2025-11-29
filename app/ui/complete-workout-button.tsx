'use client';

import { useState, useTransition } from 'react';
import { Check } from 'lucide-react';
import { completeWorkout } from '@/lib/actions';

export function CompleteWorkoutButton({ workoutId }: { workoutId: string }) {
    const [isPending, startTransition] = useTransition();
    const [completed, setCompleted] = useState(false);

    const handleComplete = () => {
        startTransition(async () => {
            try {
                await completeWorkout(workoutId);
                setCompleted(true);
            } catch (error) {
                console.error('Failed to complete workout:', error);
            }
        });
    };

    if (completed) {
        return (
            <div className="w-full bg-green-500/20 text-green-500 p-4 rounded-xl flex items-center justify-center gap-2 font-bold border border-green-500/50">
                <Check className="w-6 h-6" />
                Treino Concluído!
            </div>
        );
    }

    return (
        <button
            onClick={handleComplete}
            disabled={isPending}
            className="w-full bg-primary text-black font-bold text-lg p-4 rounded-xl hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            {isPending ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-black border-t-transparent" />
            ) : (
                <>
                    <Check className="w-6 h-6" />
                    Concluir Treino
                </>
            )}
        </button>
    );
}
