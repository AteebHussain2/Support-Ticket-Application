"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Department, Ticket, TicketStatus } from "@/generated/prisma/client";
import { Plus, MessageSquare, Clock, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createTicket } from "@/actions/tickets";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

interface TicketWithDept extends Ticket {
    department: Department | null;
}

interface TicketListProps {
    tickets: TicketWithDept[];
    departments: Department[];
}

export default function TicketList({ tickets, departments }: TicketListProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [departmentId, setDepartmentId] = useState("");

    const handleCreate = async () => {
        const result = await createTicket(subject, content, departmentId);
        if (result.success) {
            toast.success("Ticket Created Successfully");
            setIsCreateOpen(false);
            setSubject("");
            setContent("");
            setDepartmentId("");
        } else {
            toast.error(result.error);
        }
    };

    const getStatusColor = (status: TicketStatus) => {
        switch (status) {
            case "OPENED": return "bg-green-100 text-green-800 hover:bg-green-100";
            case "CLAIMED": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
            case "RESOLVED": return "bg-purple-100 text-purple-800 hover:bg-purple-100";
            case "CLOSED": return "bg-gray-100 text-gray-800 hover:bg-gray-100";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Home
                            </Button>
                        </Link>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">My Support Tickets</h2>
                    <p className="text-muted-foreground">View and manage your support requests.</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button size="lg" className="gap-2">
                            <Plus className="h-4 w-4" /> Create New Ticket
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Create New Ticket</DialogTitle>
                            <DialogDescription>
                                Describe your issue and select the relevant department.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                    id="subject"
                                    placeholder="Brief summary of the issue"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="department">Department</Label>
                                <Select onValueChange={setDepartmentId} value={departmentId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map((dept) => (
                                            <SelectItem key={dept.id} value={dept.id}>
                                                {dept.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2 w-full">
                                <Label htmlFor="content">Description</Label>
                                <Textarea
                                    id="content"
                                    placeholder="Detailed explanation..."
                                    className="min-h-[100px] w-full"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={handleCreate}>Submit Ticket</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tickets.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        You haven't created any tickets yet.
                    </div>
                )}
                {tickets.map((ticket) => (
                    <Link href={`/support/${ticket.id}`} key={ticket.id} className="block group">
                        <Card className="hover:shadow-md transition-shadow h-full">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="space-y-1">
                                        <CardTitle className="text-base font-semibold leading-tight group-hover:text-primary transition-colors">
                                            #{ticket.id} - {ticket.subject}
                                        </CardTitle>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                    <Badge variant="secondary" className={getStatusColor(ticket.status)}>
                                        {ticket.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                    {ticket.content}
                                </div>
                                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/50 p-2 rounded w-fit">
                                    Department: <span className="text-foreground">{ticket.department?.name || 'General'}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
