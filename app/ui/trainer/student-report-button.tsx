'use client';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FileText } from 'lucide-react';

interface Assessment {
    date: string | Date;
    weight: number;
    height: number;
    bodyFatPercentage?: number | null;
    chest?: number | null;
    abdominal?: number | null;
    thigh?: number | null;
    tricep?: number | null;
    subscapular?: number | null;
    suprailiac?: number | null;
    midaxillary?: number | null;
}

interface Student {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    age?: number | null;
    trainingLocation?: string | null;
}

interface StudentReportButtonProps {
    student: any; // Using any to bypass potential stale Prisma types
    assessments: Assessment[];
}

export default function StudentReportButton({ student, assessments }: StudentReportButtonProps) {
    const generatePDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.setTextColor(40, 40, 40);
        doc.text('Relatório do Aluno', 14, 20);

        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 28);

        // Student Info
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('Dados Pessoais', 14, 40);

        const studentData = [
            ['Nome', student.name || 'N/A'],
            ['Email', student.email],
            ['Telefone', student.phone || 'N/A'],
            ['Idade', student.age ? `${student.age} anos` : 'N/A'],
            ['Local de Treino', student.trainingLocation || 'N/A'],
        ];

        autoTable(doc, {
            startY: 45,
            head: [],
            body: studentData,
            theme: 'plain',
            styles: { fontSize: 10, cellPadding: 2 },
            columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } },
        });

        // Assessments History
        const lastY = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(16);
        doc.text('Histórico de Avaliações', 14, lastY);

        const assessmentData = assessments.map(a => [
            new Date(a.date).toLocaleDateString('pt-BR'),
            `${a.weight} kg`,
            `${(a.height / 100).toFixed(2)} m`,
            a.bodyFatPercentage ? `${a.bodyFatPercentage.toFixed(1)}%` : '-',
            a.chest ? `${a.chest} mm` : '-',
            a.abdominal ? `${a.abdominal} mm` : '-',
            a.thigh ? `${a.thigh} mm` : '-',
        ]);

        autoTable(doc, {
            startY: lastY + 5,
            head: [['Data', 'Peso', 'Altura', 'Gordura %', 'Peitoral', 'Abdominal', 'Coxa']],
            body: assessmentData,
            theme: 'striped',
            headStyles: { fillColor: [255, 193, 7], textColor: [0, 0, 0] }, // Primary color (amber-400 equivalent)
            styles: { fontSize: 9, cellPadding: 3 },
        });

        // Save
        doc.save(`relatorio_${student.name?.replace(/\s+/g, '_').toLowerCase() || 'aluno'}.pdf`);
    };

    return (
        <button
            onClick={generatePDF}
            className="flex items-center gap-2 bg-zinc-800 text-white px-4 py-2 rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
            <FileText className="w-4 h-4" />
            Gerar Relatório
        </button>
    );
}
