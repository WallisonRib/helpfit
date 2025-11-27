"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Dumbbell } from "lucide-react";

interface AssessmentChartsProps {
    user: {
        name: string | null;
    };
    assessment: {
        weight: number;
        bodyFatPercentage: number | null;
        chest: number | null;
        abdominal: number | null;
        thigh: number | null;
        tricep: number | null;
        subscapular: number | null;
        suprailiac: number | null;
        midaxillary: number | null;
    };
}

export function AssessmentCharts({ user, assessment }: AssessmentChartsProps) {
    const bodyFat = assessment.bodyFatPercentage || 0;
    const leanMass = 100 - bodyFat;

    const pieData = [
        { name: "Peso Gordo", value: parseFloat(bodyFat.toFixed(1)), color: "#3b82f6" },
        { name: "Peso Magro", value: parseFloat(leanMass.toFixed(1)), color: "#4ade80" },
    ];

    return (
        <div className="space-y-8">
            <header className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary bg-zinc-800 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">{user.name?.[0] || 'U'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xl font-semibold">{user.name?.split(' ')[0] || 'Aluno'}.</span>
                    <Dumbbell className="w-6 h-6 text-primary" />
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pie Chart Section */}
                <div className="bg-white text-black p-6 rounded-3xl shadow-lg flex flex-col items-center">
                    <h3 className="text-lg font-bold mb-4 text-primary self-start">Composição Corporal</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Legend */}
                    <div className="w-full space-y-2 mt-4">
                        {pieData.map((item) => (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-sm font-medium">{item.name}</span>
                                </div>
                                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full"
                                        style={{ width: `${item.value}%`, backgroundColor: item.color }}
                                    />
                                </div>
                                <span className="text-sm font-bold">{item.value}%</span>
                            </div>
                        ))}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <span className="text-sm font-medium">Peso Total</span>
                            <span className="text-sm font-bold">{assessment.weight} kg</span>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="bg-white text-black p-6 rounded-3xl shadow-lg">
                    <h3 className="text-lg font-bold mb-4 text-primary">Medidas (mm)</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Peitoral</span>
                            <span className="text-sm font-bold bg-zinc-100 px-2 py-1 rounded">{assessment.chest || '-'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Abdominal</span>
                            <span className="text-sm font-bold bg-zinc-100 px-2 py-1 rounded">{assessment.abdominal || '-'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Coxa</span>
                            <span className="text-sm font-bold bg-zinc-100 px-2 py-1 rounded">{assessment.thigh || '-'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Tríceps</span>
                            <span className="text-sm font-bold bg-zinc-100 px-2 py-1 rounded">{assessment.tricep || '-'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Subescapular</span>
                            <span className="text-sm font-bold bg-zinc-100 px-2 py-1 rounded">{assessment.subscapular || '-'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Supra-ilíaca</span>
                            <span className="text-sm font-bold bg-zinc-100 px-2 py-1 rounded">{assessment.suprailiac || '-'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Axilar Média</span>
                            <span className="text-sm font-bold bg-zinc-100 px-2 py-1 rounded">{assessment.midaxillary || '-'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
