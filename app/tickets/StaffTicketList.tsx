"use client";

import { useState } from "react";
import { Department, Ticket, TicketStatus, User } from "@/generated/prisma/client";
import { claimTicket, forwardTicket } from "@/actions/tickets";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Clock, ArrowRightLeft, Hand, MessageSquare, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface TicketWithDetails extends Ticket {
    department: Department | null;
    user: User;
}

interface StaffTicketListProps {
    tickets: TicketWithDetails[];
    departments: Department[];
    currentUserId: string;
}

export default function StaffTicketList({ tickets, departments, currentUserId }: StaffTicketListProps) {
    const [forwardTicketId, setForwardTicketId] = useState<number | null>(null);
    const [targetDeptId, setTargetDeptId] = useState("");

    const handleClaim = async (ticketId: number) => {
        const result = await claimTicket(ticketId);
        if (result.success) {
            toast.success("Ticket claimed successfully");
        } else {
            toast.error(result.error);
        }
    };

    const handleForward = async () => {
        if (!forwardTicketId || !targetDeptId) return;
        const result = await forwardTicket(forwardTicketId, targetDeptId);
        if (result.success) {
            toast.success("Ticket forwarded successfully");
            setForwardTicketId(null);
            setTargetDeptId("");
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
            case "FORWARDED": return "bg-orange-100 text-orange-800 hover:bg-orange-100";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const myClaims = tickets.filter(t => t.claimedBy === currentUserId && t.status !== 'RESOLVED' && t.status !== 'CLOSED');
    const unclaimed = tickets.filter(t => t.status === 'OPENED' || (t.status === 'FORWARDED' && !t.claimedBy));
    const allTickets = tickets;

    const TicketCard = ({ ticket }: { ticket: TicketWithDetails }) => (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                        <CardTitle className="text-base font-semibold leading-tight">
                            #{ticket.id} - {ticket.subject}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                            </span>
                            <span>•</span>
                            <span>{ticket.user.firstName} {ticket.user.lastName}</span>
                        </div>
                    </div>
                    <Badge variant="secondary" className={getStatusColor(ticket.status)}>
                        {ticket.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {ticket.content}
                </p>
                {ticket.forwardedBy && (
                    <div className="mt-2 text-xs text-orange-600 flex items-center gap-1 bg-orange-50 p-1.5 rounded">
                        <AlertCircle className="h-3 w-3" />
                        Forwarded to your department
                    </div>
                )}
            </CardContent>
            <CardFooter className="pt-0 flex justify-end gap-2 border-t bg-muted/10 p-3">
                {/* Forward Action */}
                <Dialog open={forwardTicketId === ticket.id} onOpenChange={(open) => !open && setForwardTicketId(null)}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setForwardTicketId(ticket.id)}>
                            <ArrowRightLeft className="mr-2 h-3 w-3" /> Forward
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Forward Ticket</DialogTitle>
                            <DialogDescription>
                                Assign this ticket to another department. This will reset the claim status.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Select onValueChange={setTargetDeptId} value={targetDeptId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.filter(d => d.id !== ticket.departmentId).map(d => (
                                        <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleForward} disabled={!targetDeptId}>Confirm Forward</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Claim Action */}
                {!ticket.claimedBy && (
                    <Button size="sm" onClick={() => handleClaim(ticket.id)}>
                        <Hand className="mr-2 h-3 w-3" /> Claim
                    </Button>
                )}

                {/* Respond Action (if claimed by me) */}
                {ticket.claimedBy === currentUserId && (
                    <Link href={`/support/${ticket.id}?staff=true`}>
                        <Button size="sm" variant="default">
                            <MessageSquare className="mr-2 h-3 w-3" /> Respond
                        </Button>
                    </Link>
                )}
                {/* View only */}
                {ticket.claimedBy && ticket.claimedBy !== currentUserId && (
                    <Button size="sm" variant="ghost" disabled>
                        Claimed by {ticket.claimedBy.slice(0, 5)}...
                    </Button>
                )}
            </CardFooter>
        </Card>
    );

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Staff Support Panel</h2>
                    <p className="text-muted-foreground">Manage and resolve support tickets assigned to your department.</p>
                </div>
            </div>

            <Tabs defaultValue="unclaimed" className="w-full">
                <TabsList>
                    <TabsTrigger value="unclaimed">Unclaimed ({unclaimed.length})</TabsTrigger>
                    <TabsTrigger value="my-claims">My Claims ({myClaims.length})</TabsTrigger>
                    <TabsTrigger value="all">All Tickets ({allTickets.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="unclaimed" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {unclaimed.length === 0 && <p className="text-muted-foreground">No unclaimed tickets.</p>}
                        {unclaimed.map(t => <TicketCard key={t.id} ticket={t} />)}
                    </div>
                </TabsContent>

                <TabsContent value="my-claims" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {myClaims.length === 0 && <p className="text-muted-foreground">You haven't claimed any active tickets.</p>}
                        {myClaims.map(t => <TicketCard key={t.id} ticket={t} />)}
                    </div>
                </TabsContent>

                <TabsContent value="all" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {allTickets.map(t => <TicketCard key={t.id} ticket={t} />)}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
