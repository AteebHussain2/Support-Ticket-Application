import { UserRoleTable } from "../_components/UserRoleTable";
import { getUsersByRoles } from "@/actions/users";
import { auth } from "@clerk/nextjs/server";

export default async function UsersPage() {
    const { userId } = await auth();
    const result = await getUsersByRoles(["USER"]);

    if (!result.success || !result.data) {
        return <div>Error loading users</div>;
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Users</h2>
                    <p className="text-muted-foreground">Manage end users of the application.</p>
                </div>
            </div>

            <UserRoleTable users={result.data} currentUserId={userId || ""} />
        </div>
    );
}
