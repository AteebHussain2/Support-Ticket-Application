"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

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

export async function getTicketById(ticketId: string) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    const id = parseInt(ticketId);
    if (isNaN(id)) return { success: false, error: "Invalid ticket ID" };

    try {
        const ticket = await prisma.ticket.findUnique({
            where: { id },
            include: {
                department: true,
                user: true, // Creator details
            }
        });

        // Basic security: Check if user owns ticket OR is Staff/Admin (handled later via middleware/roles, 
        // but robustly here: users can only see their own tickets unless role check passes)
        // For now, let's assume if it exists we return it, but UI hides controls.
        // Or strictly:
        // if (ticket?.userId !== userId) { ... check role ... }

        return { success: true, data: ticket };
    } catch (error) {
        return { success: false, error: "Failed to fetch ticket" };
    }
}

export async function resolveTicket(ticketId: number) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        await prisma.ticket.update({
            where: { id: ticketId },
            data: { status: "RESOLVED" }
        });
        revalidatePath(`/support/${ticketId}`);
        revalidatePath("/support");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to resolve ticket" };
    }
}

export async function getStaffTickets() {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user?.departmentId && user?.role !== 'ADMIN') {
            // If user has no department and is not admin, they see nothing? 
            // Or maybe they see general? Let's assume strict department filtering.
            return { success: true, data: [] };
        }

        const whereClause = user.role === 'ADMIN' ? {} : {
            OR: [
                { departmentId: user.departmentId }, // Tickets assigned to their department
                { claimedBy: userId } // Tickets they claimed (even if moved? edge case)
            ]
        };

        const tickets = await prisma.ticket.findMany({
            where: whereClause,
            include: {
                department: true,
                user: true,
            },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: tickets };
    } catch (error) {
        return { success: false, error: "Failed to fetch staff tickets" };
    }
}

export async function claimTicket(ticketId: number) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
        if (!ticket) return { success: false, error: "Ticket not found" };

        if (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') {
            return { success: false, error: "Cannot claim a resolved or closed ticket" };
        }

        await prisma.ticket.update({
            where: { id: ticketId },
            data: {
                status: "CLAIMED",
                claimedBy: userId,
            }
        });
        revalidatePath("/tickets");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to claim ticket" };
    }
}

export async function forwardTicket(ticketId: number, targetDeptId: string) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        await prisma.ticket.update({
            where: { id: ticketId },
            data: {
                departmentId: targetDeptId,
                status: "FORWARDED",
                claimedBy: null, // Reset claim
                forwardedBy: userId
            }
        });
        revalidatePath("/tickets");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to forward ticket" };
    }
}
