"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { TicketStatus } from "@/generated/prisma/enums";

export async function createTicket(subject: string, content: string, departmentId: string) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    if (!subject || !content || !departmentId) {
        return { success: false, error: "All fields are required" };
    }

    try {
        const ticket = await prisma.ticket.create({
            data: {
                subject,
                content,
                status: "OPENED",
                userId,
                departmentId,
            }
        });
        revalidatePath("/tickets");
        return { success: true, data: ticket };
    } catch (error) {
        return { success: false, error: "Failed to create ticket" };
    }
}

export async function getUserTickets() {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        const tickets = await prisma.ticket.findMany({
            where: {
                userId: userId
            },
            include: {
                department: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return { success: true, data: tickets };
    } catch (error) {
        return { success: false, error: "Failed to fetch tickets" };
    }
}
