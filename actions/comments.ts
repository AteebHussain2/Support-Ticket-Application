"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addComment(ticketId: number, content: string) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId },
            select: { userId: true, claimedBy: true, status: true }
        });

        if (!ticket) return { success: false, error: "Ticket not found" };

        if (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') {
            return { success: false, error: "Cannot comment on resolved/closed tickets" };
        }

        // Logic: if claimed, only claimer OR ticket creator can comment? 
        // User requested: "If one claims the ticket, no one else should be able to respond to it" - usually means other staff. Created user should definitely be able to respond.

        if (ticket.claimedBy && ticket.claimedBy !== userId && ticket.userId !== userId) {
            return { success: false, error: "This ticket is claimed by another staff member." };
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                ticketId,
                userId
            },
            include: {
                user: true
            }
        });

        return { success: true, data: comment };
    } catch (error) {
        return { success: false, error: "Failed to add comment" };
    }
}

export async function getTicketComments(ticketId: number) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        const comments = await prisma.comment.findMany({
            where: { ticketId },
            include: {
                user: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
        return { success: true, data: comments };
    } catch (error) {
        return { success: false, error: "Failed to fetch comments" };
    }
}
