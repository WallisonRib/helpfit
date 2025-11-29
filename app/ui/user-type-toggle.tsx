'use client';

import React from 'react';

interface UserTypeToggleProps {
    isPersonal: boolean;
    onToggle: (isPersonal: boolean) => void;
}

export default function UserTypeToggle({ isPersonal, onToggle }: UserTypeToggleProps) {
    return (
        <div className="flex items-center justify-center gap-3 mt-4">
            <span className={`text-sm font-bold uppercase tracking-wider transition-colors ${isPersonal ? 'text-primary' : 'text-gray-400'}`}>
                Personal
            </span>

            <button
                type="button"
                onClick={() => onToggle(!isPersonal)}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-primary"
            >
                <span
                    className={`${!isPersonal ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-black transition-transform`}
                />
            </button>
            <input type="hidden" name="userType" value={isPersonal ? 'personal' : 'student'} />

            <span className={`text-sm font-bold uppercase tracking-wider transition-colors ${!isPersonal ? 'text-primary' : 'text-gray-400'}`}>
                Aluno
            </span>
        </div>
    );
}
