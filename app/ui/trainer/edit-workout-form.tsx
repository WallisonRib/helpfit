'use client';

import { useActionState } from 'react';
import { updateWorkout } from '@/lib/actions';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';

export default function EditWorkoutForm({
    studentId,
    workoutId,
    initialData
}: {
    studentId: string;
    workoutId: string;
    initialData: { title: string; exercises: any[] }
}) {
    const initialState = { message: null, errors: {} };
    const updateWorkoutWithIds = updateWorkout.bind(null, workoutId, studentId);
    const [state, dispatch, isPending] = useActionState(updateWorkoutWithIds, initialState);

    const [exercises, setExercises] = useState(initialData.exercises);

    const addExercise = () => {
        setExercises([...exercises, { name: '', sets: '', reps: '' }]);
    };

    const removeExercise = (index: number) => {
        const newExercises = [...exercises];
        newExercises.splice(index, 1);
        setExercises(newExercises);
    };

    const handleExerciseChange = (index: number, field: string, value: string) => {
        const newExercises = [...exercises];
        newExercises[index][field] = value;
        setExercises(newExercises);
    };

    return (
        <form action={dispatch} className="space-y-6">
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                <div className="mb-4">
                    <label htmlFor="title" className="mb-2 block text-sm font-medium">
                        Título do Treino
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        defaultValue={initialData.title}
                        placeholder="ex: Treino A"
                        className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500 text-black"
                        required
                    />
                </div>

                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium">Exercícios</label>
                        <button
                            type="button"
                            onClick={addExercise}
                            className="flex items-center text-sm text-amber-600 hover:text-amber-500"
                        >
                            <PlusIcon className="h-4 w-4 mr-1" /> Adicionar Exercício
                        </button>
                    </div>

                    <div className="space-y-3">
                        {exercises.map((exercise, index) => (
                            <div key={index} className="flex gap-2 items-start">
                                <div className="flex-grow grid grid-cols-12 gap-2">
                                    <div className="col-span-6">
                                        <input
                                            type="text"
                                            placeholder="Nome do Exercício"
                                            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500 text-black"
                                            value={exercise.name}
                                            onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <input
                                            type="text"
                                            placeholder="Séries"
                                            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500 text-black"
                                            value={exercise.sets}
                                            onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <input
                                            type="text"
                                            placeholder="Repetições"
                                            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500 text-black"
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
                                        className="p-2 text-red-500 hover:text-red-700"
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
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancelar
                </Link>
                <button
                    type="submit"
                    className="flex h-10 items-center rounded-lg bg-amber-500 px-4 text-sm font-medium text-white transition-colors hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                >
                    Salvar Alterações
                </button>
            </div>
        </form>
    );
}
