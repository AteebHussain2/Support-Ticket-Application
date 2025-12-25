"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { createDepartment, assignStaffToDepartment, removeStaffFromDepartment } from "@/actions/departments";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Users, Trash2, UserPlus } from "lucide-react";
import { Department, User } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

interface DepartmentWithUsers extends Department {
    users: User[];
    _count: { users: number };
}

interface DepartmentsPageClientProps {
    departments: DepartmentWithUsers[];
    staffUsers: User[];
}

export default function DepartmentsClient({ departments, staffUsers }: DepartmentsPageClientProps) {
    const [newDeptName, setNewDeptName] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedStaffId, setSelectedStaffId] = useState<string>("");

    const handleCreate = async () => {
        const result = await createDepartment(newDeptName);
        if (result.success) {
            toast.info(`Department Created ${newDeptName} has been added.`);
            setIsCreateOpen(false);
            setNewDeptName("");
        } else {
            toast.error(result.error);
        }
    };

    const handleAssign = async (deptId: string) => {
        if (!selectedStaffId) return;
        const result = await assignStaffToDepartment(selectedStaffId, deptId);
        if (result.success) {
            toast.info("Staff Assigned User has been added to the department.");
            setSelectedStaffId("");
        } else {
            toast.error(result.error);
        }
    }

    const handleRemove = async (userId: string) => {
        const result = await removeStaffFromDepartment(userId);
        if (result.success) {
            toast.info("Staff Removed User has been removed from the department.");
        } else {
            toast.error(result.error);
        }
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Departments</h2>
                    <p className="text-muted-foreground">Manage support departments and assign staff.</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Create Department
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create Department</DialogTitle>
                            <DialogDescription>
                                Add a new department to categorize tickets.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    value={newDeptName}
                                    onChange={(e) => setNewDeptName(e.target.value)}
                                    className="col-span-3"
                                    placeholder="e.g. IT Support"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={handleCreate}>Create</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {departments.map((dept) => (
                    <Card key={dept.id}>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                {dept.name}
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardTitle>
                            <CardDescription>{dept._count.users} Staff Members</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* List of current staff */}
                            <div className="space-y-4">
                                <div className="flex flex-col gap-2">
                                    {dept.users.length === 0 && <p className="text-sm text-muted-foreground italic">No staff assigned.</p>}
                                    {dept.users.map(u => (
                                        <div key={u.id} className="flex items-center justify-between text-sm bg-muted/40 p-2 rounded-md">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src={u.imageUrl || ""} />
                                                    <AvatarFallback>{u.firstName?.[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{u.firstName} {u.lastName}</span>
                                                    <span className="text-xs text-muted-foreground">@{u.username}</span>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => handleRemove(u.id)}>
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-3 border-t bg-muted/10 p-4">
                            <div className="w-full flex items-center gap-2">
                                <Select onValueChange={setSelectedStaffId}>
                                    <SelectTrigger className="w-full h-8 text-xs">
                                        <SelectValue placeholder="Assign Staff..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {staffUsers.filter(u => u.departmentId !== dept.id).map(u => (
                                            <SelectItem key={u.id} value={u.id}>
                                                {u.firstName} {u.lastName} (@{u.username}) {u.departmentId ? '(Move)' : ''}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button size="sm" onClick={() => handleAssign(dept.id)} disabled={!selectedStaffId}>
                                    <UserPlus className="h-3 w-3" />
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
