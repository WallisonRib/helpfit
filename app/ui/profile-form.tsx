'use client';

import { useActionState, useState, useEffect } from 'react';
import { updateProfile } from '@/lib/actions';
import { Check } from "lucide-react";

interface ProfileFormProps {
    user: any; // Using any to avoid type issues with ungenerated client
    latestAssessment: any;
}

export default function ProfileForm({ user, latestAssessment }: ProfileFormProps) {
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [isPending, setIsPending] = useState(false);

    // Controlled states
    const [phone, setPhone] = useState(user.phone || '');
    const [name, setName] = useState(user.name || '');
    const [email, setEmail] = useState(user.email || '');
    const [address, setAddress] = useState(user.address || '');
    const [age, setAge] = useState(user.age || '');
    const [height, setHeight] = useState(user.height || '');
    const [weight, setWeight] = useState(user.weight || '');
    const [trainingLocation, setTrainingLocation] = useState(user.trainingLocation || '');

    // Initialize phone mask on mount
    useEffect(() => {
        if (user.phone) {
            applyPhoneMask(user.phone);
        }
    }, []); // Run once on mount

    const applyPhoneMask = (rawValue: string) => {
        let value = String(rawValue).replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        if (value.length > 10) {
            value = value.replace(/^(\d\d)(\d)(\d{4})(\d{4}).*/, '($1) $2 $3-$4');
        } else if (value.length > 6) {
            value = value.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, '($1) $2-$3');
        } else if (value.length > 2) {
            value = value.replace(/^(\d\d)(\d{0,5}).*/, '($1) $2');
        } else if (value.length > 0) {
            value = value.replace(/^(\d*)/, '($1');
        }
        setPhone(value);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        applyPhoneMask(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsPending(true);
        setErrors({});
        setSuccess(false);

        const formData = new FormData(e.currentTarget);
        // Ensure controlled values are in FormData (though input names should handle it)
        // Explicitly appending just in case, or relying on name attributes which is standard.
        // The inputs have name attributes, so formData will contain them.

        try {
            const result = await updateProfile(undefined, formData);

            if (result.errors && Object.keys(result.errors).length > 0) {
                setErrors(result.errors);
            } else if (result.message === 'Perfil atualizado com sucesso!') {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } else if (result.message) {
                // Handle generic error message if needed
                console.error(result.message);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="bg-zinc-900 text-white p-8 rounded-3xl shadow-lg max-w-3xl mx-auto border border-zinc-800 relative">
            {success && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-in fade-in slide-in-from-top-2 z-10">
                    Perfil atualizado com sucesso!
                </div>
            )}

            <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 rounded-full bg-zinc-800 mb-4 flex items-center justify-center border-2 border-primary">
                    <span className="text-4xl font-bold text-white">{user.name?.[0] || 'U'}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-primary mb-1">Nome</label>
                    <input
                        name="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-zinc-800 border-none rounded-lg p-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-primary"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-500">{errors.name[0]}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-primary mb-1">E-mail</label>
                    <input
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-zinc-800 border-none rounded-lg p-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-primary"
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email[0]}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-primary mb-1">Telefone</label>
                    <input
                        name="phone"
                        type="tel"
                        value={phone}
                        onChange={handlePhoneChange}
                        placeholder="(00) 0 0000-0000"
                        className="w-full bg-zinc-800 border-none rounded-lg p-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-primary mb-1">Endereço</label>
                    <input
                        name="address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Rua, Número, Bairro"
                        className="w-full bg-zinc-800 border-none rounded-lg p-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-primary mb-1">Idade</label>
                        <input
                            name="age"
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="Anos"
                            className="w-full bg-zinc-800 border-none rounded-lg p-3 text-center text-white placeholder-zinc-500 focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-primary mb-1">Altura (m)</label>
                        {user.role === 'TRAINER' ? (
                            <input
                                name="height"
                                type="number"
                                step="0.01"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                placeholder="1.75"
                                className="w-full bg-zinc-800 border-none rounded-lg p-3 text-center text-white placeholder-zinc-500 focus:ring-2 focus:ring-primary"
                            />
                        ) : (
                            <input
                                type="text"
                                defaultValue={latestAssessment?.height ? (latestAssessment.height / 100).toFixed(2) : ''}
                                className="w-full bg-zinc-800 border-none rounded-lg p-3 text-center text-white placeholder-zinc-500 cursor-not-allowed opacity-70"
                                readOnly
                                title="Atualizado via Avaliação"
                            />
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-primary mb-1">Peso (kg)</label>
                        {user.role === 'TRAINER' ? (
                            <input
                                name="weight"
                                type="number"
                                step="0.1"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                placeholder="70.5"
                                className="w-full bg-zinc-800 border-none rounded-lg p-3 text-center text-white placeholder-zinc-500 focus:ring-2 focus:ring-primary"
                            />
                        ) : (
                            <input
                                type="text"
                                defaultValue={latestAssessment?.weight || ''}
                                className="w-full bg-zinc-800 border-none rounded-lg p-3 text-center text-white placeholder-zinc-500 cursor-not-allowed opacity-70"
                                readOnly
                                title="Atualizado via Avaliação"
                            />
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-primary mb-1">Local de Treino</label>
                    <input
                        name="trainingLocation"
                        type="text"
                        value={trainingLocation}
                        onChange={(e) => setTrainingLocation(e.target.value)}
                        placeholder="Nome da Academia"
                        className="w-full bg-zinc-800 border-none rounded-lg p-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="bg-primary text-black rounded-full p-2 hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        {isPending ? (
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                        ) : (
                            <Check className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
