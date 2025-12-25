import { getStaffTickets } from "@/actions/tickets";
import { getDepartments } from "@/actions/departments";
import { auth } from "@clerk/nextjs/server";
import StaffTicketList from "./StaffTicketList";

export default async function StaffTicketsPage() {
    const { userId } = await auth();
    const ticketsData = await getStaffTickets();
    const departmentsData = await getDepartments();

    if (!ticketsData.success || !departmentsData.success) {
        return <div>Failed to load tickets.</div>;
    }

    return (
        <StaffTicketList
            tickets={ticketsData.data || []}
            departments={departmentsData.data || []}
            currentUserId={userId || ""}
        />
    );
}
