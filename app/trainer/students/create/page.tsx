import StudentManager from '@/app/ui/trainer/student-manager';
import BackButton from '@/app/ui/back-button';

export default function CreateStudentPage() {
    return (
        <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center relative">
            <div className="absolute top-4 left-4">
                <BackButton href="/trainer" />
            </div>
            <div className="w-full max-w-md">
                <div className="flex w-full items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Gerenciar Alunos</h1>
                </div>
                <div className="w-full">
                    <StudentManager />
                </div>
            </div>
        </div>
    );
}
