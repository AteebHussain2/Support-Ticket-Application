import { getUserTickets } from "@/actions/tickets";
import { getDepartments } from "@/actions/departments";
import TicketList from "./TicketList";

export default async function TicketsPage() {
    const ticketsData = await getUserTickets();
    const departmentsData = await getDepartments();

    if (!ticketsData.success || !departmentsData.success) {
        return <div>Failed to load tickets.</div>;
    }

    return (
        <TicketList
            tickets={ticketsData.data || []}
            departments={departmentsData.data || []}
        />
    );
}
