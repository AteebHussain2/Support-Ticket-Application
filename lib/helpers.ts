import { UserRole } from "@/generated/prisma/enums";
import { prisma } from "./prisma";

export async function getUserRole(userId: string): Promise<UserRole | undefined> {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            role: true,
        }
    })

    return user?.role;
}