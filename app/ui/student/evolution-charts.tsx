'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

interface Assessment {
    id: string;
    date: Date;
    weight: number;
    bodyFatPercentage: number | null;
}

export default function EvolutionCharts({ assessments }: { assessments: Assessment[] }) {
    if (!assessments || assessments.length === 0) {
        return <p className="text-gray-500">Dados insuficientes para gerar gráficos.</p>;
    }

    // Sort assessments by date ascending
    const data = [...assessments]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((a) => {
            const weight = a.weight;
            const bodyFat = a.bodyFatPercentage || 0;
            // Calculate Lean Body Mass (Muscle Mass approximation)
            // LBM = Weight * (1 - BodyFat%)
            const muscleMass = bodyFat > 0 ? weight * (1 - bodyFat / 100) : null;

            return {
                date: new Date(a.date).toLocaleDateString(),
                weight: weight,
                bodyFat: bodyFat,
                muscleMass: muscleMass ? parseFloat(muscleMass.toFixed(2)) : null,
            };
        });

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
            {/* Weight Chart */}
            <div className="rounded-lg bg-white p-4 shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-center">Evolução de Peso (kg)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" fontSize={12} />
                            <YAxis domain={['auto', 'auto']} fontSize={12} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="weight" name="Peso" stroke="#f59e0b" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Body Fat Chart */}
            <div className="rounded-lg bg-white p-4 shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-center">Percentual de Gordura (%)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" fontSize={12} />
                            <YAxis domain={[0, 'auto']} fontSize={12} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="bodyFat" name="Gordura" stroke="#ef4444" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Muscle Mass Chart */}
            <div className="rounded-lg bg-white p-4 shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-center">Massa Magra Estimada (kg)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" fontSize={12} />
                            <YAxis domain={['auto', 'auto']} fontSize={12} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="muscleMass" name="Massa Magra" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
