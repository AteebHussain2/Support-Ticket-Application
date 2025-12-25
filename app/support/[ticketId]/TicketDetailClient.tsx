"use client";

import { Department, Ticket, TicketStatus, User } from "@/generated/prisma/client";
import { resolveTicket } from "@/actions/tickets";
import { addComment, getTicketComments } from "@/actions/comments";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Send, Clock, User as UserIcon, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface SimpleUser {
    id: string;
    firstName: string | null;
    lastName: string | null;
    imageUrl: string;
}

interface TicketDetailProps {
    ticket: Ticket & { department: Department | null; user: User };
    currentUser: SimpleUser | null;
}

export default function TicketDetailClient({ ticket, currentUser }: TicketDetailProps) {
    const [reply, setReply] = useState("");
    const queryClient = useQueryClient();

    // Polling for comments every 5 seconds
    const { data: comments = [], isLoading } = useQuery({
        queryKey: ['comments', ticket.id],
        queryFn: async () => {
            const result = await getTicketComments(ticket.id);
            if (result.success) return result.data;
            throw new Error(result.error);
        },
        refetchInterval: 5000,
    });

    const addCommentMutation = useMutation({
        mutationFn: async (content: string) => {
            const result = await addComment(ticket.id, content);
            if (!result.success) throw new Error(result.error);
            return result.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', ticket.id] });
            setReply("");
            toast.success("Reply sent");
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const handleResolve = async () => {
        const result = await resolveTicket(ticket.id);
        if (result.success) {
            toast.success("Ticket marked as resolved");
        } else {
            toast.error(result.error);
        }
    };

    const handleSendReply = () => {
        if (!reply.trim()) return;
        addCommentMutation.mutate(reply);
    };

    const getStatusColor = (status: TicketStatus) => {
        switch (status) {
            case "OPENED": return "bg-green-100 text-green-800 border-green-200";
            case "CLAIMED": return "bg-blue-100 text-blue-800 border-blue-200";
            case "RESOLVED": return "bg-purple-100 text-purple-800 border-purple-200";
            case "CLOSED": return "bg-gray-100 text-gray-800 border-gray-200";
            case "FORWARDED": return "bg-orange-100 text-orange-800 border-orange-200";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    // Check if user has permission to reply
    const canReply = currentUser && ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' &&
        (ticket.userId === currentUser.id || ticket.claimedBy === currentUser.id);

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
            {/* Navigation */}
            <div>
                <Link href={ticket.userId === currentUser?.id ? "/support" : "/tickets"}>
                    <Button variant="ghost" size="sm" className="pl-0 gap-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4" />
                        Back to {ticket.userId === currentUser?.id ? "My Tickets" : "Ticket Panel"}
                    </Button>
                </Link>
            </div>

            {/* Header Section */}
            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 flex flex-col md:flex-row justify-between gap-4 md:items-center bg-muted/30 border-b">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Ticket #{ticket.id}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDistanceToNow(new Date(ticket.createdAt))} ago</span>
                            <span>•</span>
                            <span>{ticket.department?.name || 'General'}</span>
                        </div>
                        <h1 className="text-xl md:text-2xl font-bold">{ticket.subject}</h1>
                        <Badge variant="outline" className={getStatusColor(ticket.status)}>
                            {ticket.status}
                        </Badge>
                    </div>

                    {ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && currentUser && (
                        // Only creator can resolve? Or staff too? Usually creator confirms resolution.
                        // Let's allow creator for now as per original spec. 
                        ticket.userId === currentUser.id && (
                            <Button
                                onClick={handleResolve}
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800 gap-2"
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                Mark as Resolved
                            </Button>
                        )
                    )}
                </div>

                {/* Description / Initial Content */}
                <div className="p-6 bg-card">
                    <div className="flex gap-4">
                        <Avatar>
                            <AvatarImage src={ticket.user.imageUrl || ""} />
                            <AvatarFallback>{ticket.user.firstName?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1.5 flex-1">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-sm">{ticket.user.firstName} {ticket.user.lastName}</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {ticket.content}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Section */}
            <div className="space-y-4">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Conversation</span>
                    </div>
                </div>

                {/* Messages */}
                <div className="space-y-6 pb-4">
                    {comments.map((comment: any) => {
                        const isMe = comment.userId === currentUser?.id;
                        return (
                            <div key={comment.id} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}>
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={comment.user.imageUrl || ""} />
                                    <AvatarFallback>{comment.user.firstName?.[0]}</AvatarFallback>
                                </Avatar>
                                <div className={`space-y-1 max-w-[80%] ${isMe ? 'items-end' : ''}`}>
                                    <div className={`flex items-center gap-2 ${isMe ? 'justify-end' : ''}`}>
                                        <span className="text-sm font-semibold">{isMe ? 'You' : `${comment.user.firstName} ${comment.user.lastName}`}</span>
                                        <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                                    </div>
                                    <div className={`p-3 rounded-lg text-sm ${isMe ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted rounded-tl-none'}`}>
                                        <p>{comment.content}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {comments.length === 0 && (
                        <p className="text-center text-sm text-muted-foreground py-4">No messages yet.</p>
                    )}
                </div>

                {/* Reply Input */}
                {canReply ? (
                    <Card className="p-4 flex gap-4 items-start">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={currentUser?.imageUrl || ""} />
                            <AvatarFallback>{currentUser?.firstName?.[0] || "ME"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-4 w-full">
                            <Textarea
                                placeholder="Type your reply..."
                                className="min-h-[100px] min-w-full resize-none"
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                            />
                            <div className="flex justify-end">
                                <Button onClick={handleSendReply} disabled={addCommentMutation.isPending || !reply.trim()} className="gap-2">
                                    <Send className="h-4 w-4" />
                                    {addCommentMutation.isPending ? "Sending..." : "Send Reply"}
                                </Button>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div className="p-4 bg-muted/50 rounded-lg text-center text-sm text-muted-foreground">
                        {ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'
                            ? "This ticket is closed. No further replies can be sent."
                            : !ticket.claimedBy ? "This ticket must be claimed before replying." : "You do not have permission to reply to this ticket."}
                    </div>
                )}
            </div>
        </div>
    );
}
