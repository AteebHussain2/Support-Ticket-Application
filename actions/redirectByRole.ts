"use server";

import { UserRole } from "@/generated/prisma/enums";
import { getUserRole } from "@/lib/helpers";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function redirectByRole() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("User Unauthenticated!")
    };

    const userRole = await getUserRole(userId);

    switch (userRole) {
        case UserRole.ADMIN:
            redirect("/dashboard");
        case UserRole.STAFF:
            redirect("/tickets");
        case UserRole.USER:
            redirect("/support");
        default:
            redirect("/unauthorized");
    }
}