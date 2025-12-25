"use server";

import { UserRole } from "@/generated/prisma/enums";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { getUserRole } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";

export async function getUsersByRoles(roles: UserRole[]) {
    try {
        const users = await prisma.user.findMany({
            where: {
                role: {
                    in: roles,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return { success: true, data: users };
    } catch (error) {
        console.error("Error fetching users:", error);
        return { success: false, error: "Failed to fetch users" };
    }
}

export async function updateUserRole(userId: string, newRole: UserRole) {
    const { userId: currentUserId } = await auth();

    if (!currentUserId) {
        return { success: false, error: "Unauthorized" };
    }

    const role = await getUserRole(currentUserId);
    if (role !== UserRole.ADMIN) {
        return { success: false, error: "You are not authorized to update user roles" };
    }

    if (userId === currentUserId) {
        return { success: false, error: "You cannot update your own role" };
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role: newRole },
        });

        revalidatePath("/dashboard/users");
        revalidatePath("/dashboard/roles");
        return { success: true };
    } catch (error) {
        console.error("Error updating user role:", error);
        return { success: false, error: "Failed to update role" };
    }
}
