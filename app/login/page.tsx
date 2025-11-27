import LoginForm from "@/app/ui/login-form";
import { Dumbbell } from "lucide-react";

export default function LoginPage() {
    return (
        <main className="flex min-h-screen w-full">
            {/* Left Side - Dark with Logo */}
            <div className="hidden lg:flex w-1/2 bg-zinc-900 items-center justify-center relative overflow-hidden">
                {/* Decorative Curve */}
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-white rounded-l-[100px] translate-x-16" />

                <div className="flex flex-col items-center gap-4 z-10">
                    <div className="w-32 h-32 border-4 border-primary rounded-3xl flex items-center justify-center">
                        <Dumbbell className="w-20 h-20 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold text-primary tracking-widest">HELP FIT</h1>
                </div>
            </div>

            {/* Right Side - White with Form */}
            <div className="flex-1 bg-white flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:hidden mb-8">
                        <div className="inline-flex w-20 h-20 border-4 border-primary rounded-2xl items-center justify-center mb-4">
                            <Dumbbell className="w-12 h-12 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-primary tracking-widest">HELP FIT</h1>
                    </div>

                    <div className="bg-white p-8">
                        <h2 className="text-2xl font-bold text-primary mb-6 text-center">Cadastre-se</h2>
                        <LoginForm />
                    </div>
                </div>
            </div>
        </main>
    );
}
