import AuthLayout from "@/app/ui/auth-layout";

export default function SignupPage() {
    return (
        <AuthLayout
            mode="signup"
            title="Cadastre-se"
            linkText="Entrar"
            linkUrl="/login"
            linkLabel="Já tem uma conta?"
        />
    );
}
