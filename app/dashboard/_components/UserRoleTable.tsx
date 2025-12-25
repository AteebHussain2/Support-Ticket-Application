"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Loader2, ShieldAlert, ShieldCheck, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRole } from "@/generated/prisma/enums";
import { updateUserRole } from "../../../actions/users";
import { User } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";

interface UserRoleTableProps {
    users: User[];
    currentUserId: string;
}

export function UserRoleTable({ users, currentUserId }: UserRoleTableProps) {
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleRoleUpdate = async (userId: string, newRole: UserRole) => {
        setLoadingId(userId);
        try {
            const result = await updateUserRole(userId, newRole);
            if (result.success) {
                toast.success("User role updated successfully.");
            } else {
                toast.error(result.error || "Failed to update role.");
            }
        } catch (error) {
            toast("An unexpected error occurred.");
        } finally {
            setLoadingId(null);
        }
    };

    const getRoleIcon = (role: UserRole) => {
        switch (role) {
            case "ADMIN":
                return <ShieldAlert className="h-4 w-4 text-red-500" />;
            case "STAFF":
                return <ShieldCheck className="h-4 w-4 text-blue-500" />;
            default:
                return <UserIcon className="h-4 w-4 text-gray-500" />;
        }
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Current Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.imageUrl || ""} />
                                    <AvatarFallback>{user.firstName?.[0]}{user.lastName?.[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="font-medium">{user.firstName} {user.lastName}</span>
                                    <span className="text-xs text-muted-foreground">@{user.username}</span>
                                </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    {getRoleIcon(user.role)}
                                    <Badge variant={user.role === 'ADMIN' ? 'destructive' : user.role === 'STAFF' ? 'default' : 'secondary'}>
                                        {user.role}
                                    </Badge>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={loadingId === user.id || user.id === currentUserId}>
                                            <span className="sr-only">Open menu</span>
                                            {loadingId === user.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <MoreHorizontal className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleRoleUpdate(user.id, "USER")}>
                                            Set to User
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleRoleUpdate(user.id, "STAFF")}>
                                            Set to Staff
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleRoleUpdate(user.id, "ADMIN")}>
                                            Set to Admin
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
