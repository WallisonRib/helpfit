'use client';

import { useState, useTransition } from 'react';
import { Check } from 'lucide-react';
import { completeWorkout } from '@/lib/actions';

export function CompleteWorkoutButton({ workoutId }: { workoutId: string }) {
    const [isPending, startTransition] = useTransition();
    const [isCompleted, setIsCompleted] = useState(false);

    const handleComplete = () => {
        startTransition(async () => {
            try {
                await completeWorkout(workoutId);
                setIsCompleted(true);
            } catch (error) {
                console.error('Failed to complete workout:', error);
            }
        });
    };

    return (
        <button
            onClick={handleComplete}
            disabled={isPending || isCompleted}
            className={`
                w-full py-4 rounded-xl font-bold text-lg uppercase tracking-wider transition-all duration-300
                flex items-center justify-center gap-2 cursor-pointer
                ${isCompleted
                    ? 'bg-green-500 text-white cursor-default'
                    : 'bg-primary text-black hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20'
                }
                ${isPending ? 'opacity-70 cursor-not-allowed' : ''}
            `}
        >
            {isPending ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-black border-t-transparent" />
            ) : (
                <>
                    <Check className="w-6 h-6" />
                    {isCompleted ? 'Treino Concluído!' : 'Concluir Treino'}
                </>
            )}
        </button>
    );
}
