import { Sidebar } from "./_components/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-muted/20">
            <Sidebar />
            <main className="flex-1 overflow-y-auto h-screen">
                {children}
            </main>
        </div>
    );
}
