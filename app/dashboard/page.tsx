"use client";

import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import { ArrowDownRight, ArrowUpRight, Search, Bell, Menu } from "lucide-react";
import { dashboardMetrics, resolutionTrendsData, ticketVolumeData, recentTickets } from "./_components/data";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function DashboardPage() {
    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Overview of your support system.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="search"
                            placeholder="Search..."
                            className="pl-9 h-9 w-64 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <Button variant="outline" size="icon" className="h-9 w-9">
                        <Bell className="h-4 w-4" />
                    </Button>
                    <ThemeToggle />
                    <UserButton />
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {dashboardMetrics.map((metric) => (
                    <div key={metric.title} className="rounded-xl border bg-card text-card-foreground shadow p-6">
                        <div className="flex flex-col space-y-1.5 ">
                            <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-2xl font-bold">{metric.value}</h3>
                                <span className={`text-xs font-medium flex items-center ${metric.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {metric.trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                                    {metric.change}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

                {/* Ticket Volume Chart */}
                <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6 pb-2">
                        <h3 className="font-semibold leading-none tracking-tight">Ticket Volume by Month</h3>
                        <p className="text-sm text-muted-foreground">Number of tickets created.</p>
                    </div>
                    <div className="p-6 pt-0 pl-0 h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ticketVolumeData}>
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Bar
                                    dataKey="tickets"
                                    fill="hsl(var(--primary))"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Resolution Trends Chart */}
                <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6 pb-2">
                        <h3 className="font-semibold leading-none tracking-tight">Avg. Resolution Time</h3>
                        <p className="text-sm text-muted-foreground">Average hours to resolve tickets (Last 30 days).</p>
                    </div>
                    <div className="p-6 pt-0 pl-0 h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={resolutionTrendsData}>
                                <defs>
                                    <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="day"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="time"
                                    stroke="hsl(var(--primary))"
                                    fillOpacity={1}
                                    fill="url(#colorTime)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Tickets Table */}
            <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="p-6 flex items-center justify-between">
                    <h3 className="font-semibold leading-none tracking-tight">Recent Tickets</h3>
                    <Button size="sm" variant="outline">View All</Button>
                </div>
                <div className="p-0">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-10 px-6 align-middle font-medium text-muted-foreground">ID</th>
                                    <th className="h-10 px-6 align-middle font-medium text-muted-foreground">Subject</th>
                                    <th className="h-10 px-6 align-middle font-medium text-muted-foreground">Status</th>
                                    <th className="h-10 px-6 align-middle font-medium text-muted-foreground">Priority</th>
                                    <th className="h-10 px-6 align-middle font-medium text-muted-foreground">Department</th>
                                    <th className="h-10 px-6 align-middle font-medium text-muted-foreground">Assigned To</th>
                                    <th className="h-10 px-6 align-middle font-medium text-muted-foreground">Created</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {recentTickets.map((ticket) => (
                                    <tr key={ticket.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-6 align-middle font-medium">{ticket.id}</td>
                                        <td className="p-6 align-middle">{ticket.subject}</td>
                                        <td className="p-6 align-middle">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                                        ${ticket.status === 'Open' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                                    ticket.status === 'Claimed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                                                        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                                                }
                                    `}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="p-6 align-middle">{ticket.priority}</td>
                                        <td className="p-6 align-middle">{ticket.department}</td>
                                        <td className="p-6 align-middle">{ticket.assignedTo}</td>
                                        <td className="p-6 align-middle text-muted-foreground">{ticket.created}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
