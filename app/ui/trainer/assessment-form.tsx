'use client';

import { useActionState } from 'react';
import { createAssessment } from '@/lib/actions';
import { CalculatorIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function AssessmentForm({ studentId }: { studentId: string }) {
    const initialState = { message: null, errors: {} };
    const createAssessmentWithId = createAssessment.bind(null, studentId);
    const [state, dispatch, isPending] = useActionState(createAssessmentWithId, initialState);

    return (
        <form action={dispatch} className="space-y-6">
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Basic Stats */}
                    <div>
                        <label htmlFor="weight" className="mb-2 block text-sm font-medium">
                            Peso (kg)
                        </label>
                        <input
                            id="weight"
                            name="weight"
                            type="number"
                            step="0.1"
                            placeholder="0.0"
                            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="height" className="mb-2 block text-sm font-medium">
                            Altura (cm)
                        </label>
                        <input
                            id="height"
                            name="height"
                            type="number"
                            step="0.1"
                            placeholder="0.0"
                            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                            required
                        />
                    </div>
                </div>

                <h3 className="mt-6 mb-4 text-lg font-medium">Dobras Cutâneas (mm)</h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[
                        { id: 'chest', label: 'Peitoral' },
                        { id: 'abdominal', label: 'Abdominal' },
                        { id: 'thigh', label: 'Coxa' },
                        { id: 'tricep', label: 'Tríceps' },
                        { id: 'subscapular', label: 'Subescapular' },
                        { id: 'suprailiac', label: 'Supra-ilíaca' },
                        { id: 'midaxillary', label: 'Axilar Média' },
                    ].map((fold) => (
                        <div key={fold.id}>
                            <label htmlFor={fold.id} className="mb-2 block text-sm font-medium">
                                {fold.label}
                            </label>
                            <input
                                id={fold.id}
                                name={fold.id}
                                type="number"
                                step="0.1"
                                placeholder="0.0"
                                className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                                required
                            />
                        </div>
                    ))}
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
                    <CalculatorIcon className="mr-2 h-5 w-5" />
                    Calcular e Salvar
                </button>
            </div>
        </form>
    );
}
