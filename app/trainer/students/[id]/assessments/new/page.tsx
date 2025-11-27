import AssessmentForm from '@/app/ui/trainer/assessment-form';
import { getStudent } from '@/lib/data';
import { notFound } from 'next/navigation';

export default async function NewAssessmentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const student = await getStudent(id);

    if (!student) {
        notFound();
    }

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl font-bold">New Assessment: {student.name}</h1>
            </div>
            <div className="mt-6">
                <AssessmentForm studentId={student.id} />
            </div>
        </div>
    );
}
