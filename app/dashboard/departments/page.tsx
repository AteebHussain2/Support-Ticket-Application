import { getDepartments } from "@/actions/departments";
import { getUsersByRoles } from "@/actions/users";
import DepartmentsClient from "./DepartmentsClient";

export default async function DepartmentsPage() {
    const departmentsData = await getDepartments();
    const staffData = await getUsersByRoles(["STAFF", "ADMIN"]);

    if (!departmentsData.success || !staffData.success) {
        return <div>Failed to load data</div>;
    }

    return (
        <DepartmentsClient
            departments={departmentsData.data || []}
            staffUsers={staffData.data || []}
        />
    );
}
