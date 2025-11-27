import { Sidebar } from "@/components/Sidebar";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const role = session?.user?.role;

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Sidebar role={role} />
            <main className="pl-20 min-h-screen">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
