'use client';

import { useActionState } from 'react';
import { upsertWorkout } from '@/lib/actions';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';

interface Exercise {
    name: string;
    sets: string;
    reps: string;
}

export default function WorkoutForm({ studentId, day, initialData }: { studentId: string, day: string, initialData?: Exercise[] }) {
    const initialState = { message: '', errors: {} };
    const upsertWorkoutWithIdAndDay = upsertWorkout.bind(null, studentId, day);
    const [state, dispatch, isPending] = useActionState(upsertWorkoutWithIdAndDay, initialState);

    const [exercises, setExercises] = useState<Exercise[]>(initialData || [{ name: '', sets: '', reps: '' }]);

    const addExercise = () => {
        setExercises([...exercises, { name: '', sets: '', reps: '' }]);
    };

    const removeExercise = (index: number) => {
        const newExercises = [...exercises];
        newExercises.splice(index, 1);
        setExercises(newExercises);
    };

    const handleExerciseChange = (index: number, field: keyof Exercise, value: string) => {
        const newExercises = [...exercises];
        newExercises[index][field] = value;
        setExercises(newExercises);
    };

    return (
        <form action={dispatch} className="space-y-6">
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6">
                <div className="mb-8">
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        <button
                            type="button"
                            onClick={() => setExercises([
                                { name: 'Supino Reto', sets: '3', reps: '10' },
                                { name: 'Supino Inclinado', sets: '3', reps: '10' },
                                { name: 'Crucifixo', sets: '3', reps: '12' },
                                { name: 'Tríceps Testa', sets: '3', reps: '12' },
                                { name: 'Tríceps Corda', sets: '3', reps: '15' },
                            ])}
                            className="whitespace-nowrap rounded-full bg-zinc-800 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-700 transition-colors border border-zinc-700"
                        >
                            Template Peito/Tríceps
                        </button>
                        <button
                            type="button"
                            onClick={() => setExercises([
                                { name: 'Agachamento Livre', sets: '4', reps: '8' },
                                { name: 'Leg Press', sets: '3', reps: '10' },
                                { name: 'Cadeira Extensora', sets: '3', reps: '15' },
                                { name: 'Stiff', sets: '3', reps: '10' },
                                { name: 'Panturrilha', sets: '4', reps: '15' },
                            ])}
                            className="whitespace-nowrap rounded-full bg-zinc-800 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-700 transition-colors border border-zinc-700"
                        >
                            Template Pernas
                        </button>
                        <button
                            type="button"
                            onClick={() => setExercises([
                                { name: 'Puxada Alta', sets: '4', reps: '10' },
                                { name: 'Remada Curvada', sets: '3', reps: '10' },
                                { name: 'Serrote', sets: '3', reps: '12' },
                                { name: 'Rosca Direta', sets: '3', reps: '12' },
                                { name: 'Rosca Martelo', sets: '3', reps: '12' },
                            ])}
                            className="whitespace-nowrap rounded-full bg-zinc-800 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-700 transition-colors border border-zinc-700"
                        >
                            Template Costas/Bíceps
                        </button>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium text-zinc-300">Exercícios</label>
                        <button
                            type="button"
                            onClick={addExercise}
                            className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                        >
                            <PlusIcon className="h-4 w-4 mr-1" /> Adicionar Exercício
                        </button>
                    </div>

                    <div className="space-y-3">
                        {exercises.map((exercise, index) => (
                            <div key={index} className="flex gap-2 items-start group">
                                <div className="flex-grow grid grid-cols-12 gap-2">
                                    <div className="col-span-6">
                                        <input
                                            type="text"
                                            placeholder="Nome do Exercício"
                                            className="block w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2 px-3 text-sm text-white placeholder:text-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                            value={exercise.name}
                                            onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <input
                                            type="text"
                                            placeholder="Séries"
                                            className="block w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2 px-3 text-sm text-white placeholder:text-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                            value={exercise.sets}
                                            onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <input
                                            type="text"
                                            placeholder="Reps"
                                            className="block w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2 px-3 text-sm text-white placeholder:text-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                            value={exercise.reps}
                                            onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                {exercises.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeExercise(index)}
                                        className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    {/* Hidden input to pass exercises data to server action */}
                    <input type="hidden" name="exercises" value={JSON.stringify(exercises)} />
                </div>

                <div id="form-error" aria-live="polite" aria-atomic="true">
                    {state.message && (
                        <p className="mt-2 text-sm text-red-500">
                            {state.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href={`/trainer/students/${studentId}`}
                    className="flex h-10 items-center rounded-lg bg-zinc-800 px-4 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
                >
                    Cancelar
                </Link>
                <button
                    type="submit"
                    className="flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-bold text-black transition-colors hover:bg-primary/90"
                >
                    Salvar Treino
                </button>
            </div>
        </form>
    );
}
