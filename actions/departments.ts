"use server";

import { UserRole } from "@/generated/prisma/enums";
import { getUserRole } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getDepartments() {
    try {
        const departments = await prisma.department.findMany({
            include: {
                users: true, // We need to display staff members
                _count: {
                    select: { users: true }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });
        return { success: true, data: departments };
    } catch (error) {
        return { success: false, error: "Failed to fetch departments" };
    }
}

export async function createDepartment(name: string) {
    const { userId } = await auth();
    if (!userId) {
        return { success: false, error: "Unauthorized" };
    }

    const role = await getUserRole(userId);
    if (role !== UserRole.ADMIN) {
        return { success: false, error: "You are not authorized to update user roles" };
    }

    if (!name) return { success: false, error: "Name is required" };

    // Simple slug generator
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    try {
        const dept = await prisma.department.create({
            data: {
                name,
                slug,
            }
        });
        revalidatePath("/dashboard/departments");
        return { success: true, data: dept };
    } catch (error) {
        return { success: false, error: "Department already exists or invalid data" };
    }
}

export async function assignStaffToDepartment(userId: string, departmentId: string) {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
        return { success: false, error: "Unauthorized" };
    }

    const role = await getUserRole(currentUserId);
    if (role !== UserRole.ADMIN) {
        return { success: false, error: "You are not authorized to update user roles" };
    }

    if (!userId || !departmentId) return { success: false, error: "Missing data" };

    try {
        // First check if user is STAFF or ADMIN (optional but good practice)
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user?.role === 'USER') {
            return { success: false, error: "Only Staff or Admin can be assigned to departments" };
        }

        await prisma.user.update({
            where: { id: userId },
            data: { departmentId: departmentId }
        });

        revalidatePath("/dashboard/departments");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to assign staff" };
    }
}

export async function removeStaffFromDepartment(userId: string) {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
        return { success: false, error: "Unauthorized" };
    }

    const role = await getUserRole(currentUserId);
    if (role !== UserRole.ADMIN) {
        return { success: false, error: "You are not authorized to update user roles" };
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { departmentId: null }
        });
        revalidatePath("/dashboard/departments");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to remove staff" };
    }
}
