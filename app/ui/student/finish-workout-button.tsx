'use client';

import { logWorkout } from '@/lib/actions';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { useTransition } from 'react';

export default function FinishWorkoutButton({
    studentId,
    workoutId
}: {
    studentId: string;
    workoutId: string;
}) {
    const [isPending, startTransition] = useTransition();

    const handleFinish = () => {
        startTransition(async () => {
            await logWorkout(studentId, workoutId);
            alert('Treino finalizado com sucesso!');
        });
    };

    return (
        <button
            onClick={handleFinish}
            disabled={isPending}
            className="mt-4 flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500 disabled:bg-green-400"
        >
            <CheckCircleIcon className="mr-2 h-5 w-5" />
            {isPending ? 'Finalizando...' : 'Finalizar Treino'}
        </button>
    );
}
