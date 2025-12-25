import { UserRoleTable } from "../_components/UserRoleTable";
import { getUsersByRoles } from "@/actions/users";
import { auth } from "@clerk/nextjs/server";

export default async function RolesPage() {
    const { userId } = await auth();
    const result = await getUsersByRoles(["ADMIN", "STAFF"]);

    if (!result.success || !result.data) {
        return <div>Error loading staff</div>;
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Roles & Staff</h2>
                    <p className="text-muted-foreground">Manage administrators and support staff.</p>
                </div>
            </div>

            <UserRoleTable users={result.data} currentUserId={userId || ""} />
        </div>
    );
}
