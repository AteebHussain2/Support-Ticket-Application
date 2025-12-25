import { getTicketById } from "@/actions/tickets";
import TicketDetailClient from "./TicketDetailClient";
import { currentUser } from "@clerk/nextjs/server";

interface PageProps {
    params: {
        ticketId: string;
    }
}

export default async function TicketDetailPage({ params }: PageProps) {
    const { ticketId } = await params;
    const ticketData = await getTicketById(ticketId);
    const user = await currentUser();

    if (!ticketData.success || !ticketData.data) {
        return <div className="p-8 text-center">Ticket not found</div>;
    }

    const simpleUser = user ? {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
    } : null;

    return (
        <TicketDetailClient
            ticket={ticketData.data}
            currentUser={simpleUser}
        />
    );
}
