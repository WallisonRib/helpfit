"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteWorkout } from "@/lib/actions";
import { useState } from "react";

export function DeleteWorkoutButton({ workoutId }: { workoutId: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowModal(true);
    };

    const handleConfirm = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDeleting(true);
        try {
            await deleteWorkout(workoutId);
        } catch (error) {
            console.error("Failed to delete workout:", error);
            alert("Erro ao excluir treino.");
        } finally {
            setIsDeleting(false);
            setShowModal(false);
        }
    };

    const handleCancel = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowModal(false);
    };

    return (
        <>
            <button
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="absolute bottom-4 right-4 p-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors z-10"
                title="Excluir treino"
            >
                {isDeleting ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                    <TrashIcon className="w-5 h-5" />
                )}
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={handleCancel}>
                    <div
                        className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-sm w-full shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold text-white mb-2">Excluir Treino</h3>
                        <p className="text-zinc-400 mb-6">Tem certeza que deseja excluir este treino?</p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition-colors font-medium"
                            >
                                Não
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={isDeleting}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                            >
                                {isDeleting && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                                Sim
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
