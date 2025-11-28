import AuthLayout from "@/app/ui/auth-layout";

export default function LoginPage() {
    return (
        <AuthLayout
            mode="login"
            title="Entrar"
            linkText="Cadastre-se"
            linkUrl="/signup"
            linkLabel="Não tem uma conta?"
        />
    );
}
