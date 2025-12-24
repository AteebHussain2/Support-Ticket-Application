"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    Shield,
    Layers,
    Settings,
} from "lucide-react";

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Users",
        href: "/dashboard/users",
        icon: Users,
    },
    {
        title: "Roles",
        href: "/dashboard/roles",
        icon: Shield,
    },
    {
        title: "Departments",
        href: "/dashboard/departments",
        icon: Layers,
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-background border-r h-screen sticky top-0 flex-col hidden md:flex">
            <div className="h-16 flex items-center px-6 border-b">
                <h1 className="text-xl font-bold tracking-tight text-primary flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground p-1 rounded-md">SF</span> SupportFlow
                </h1>
            </div>

            <div className="flex-1 py-6 px-4 space-y-1">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t">
                <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground">
                    {/* Placeholder for User Profile or Logout if needed specially here, 
                 though usually handled by UserButton in Layout Header */}
                </div>
            </div>
        </aside>
    );
}
