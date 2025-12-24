export const dashboardMetrics = [
    {
        title: "Total Tickets",
        value: "15,240",
        change: "+9.2%",
        trend: "up", // 'up' | 'down' | 'neutral'
    },
    {
        title: "Claimed",
        value: "3,450",
        change: "+3.5%",
        trend: "up",
    },
    {
        title: "Resolved",
        value: "11,500",
        change: "+3.5%",
        trend: "up",
    },
    {
        title: "Pending",
        value: "290",
        change: "-2.1%",
        trend: "down",
    },
];

export const ticketVolumeData = [
    { name: 'Jan', tickets: 160 },
    { name: 'Feb', tickets: 210 },
    { name: 'Mar', tickets: 90 },
    { name: 'Apr', tickets: 130 },
    { name: 'May', tickets: 110 },
    { name: 'Jun', tickets: 190 },
    { name: 'Jul', tickets: 70 },
];

export const resolutionTrendsData = [
    { day: '1', time: 16 },
    { day: '5', time: 14 },
    { day: '10', time: 22 },
    { day: '15', time: 10 },
    { day: '20', time: 18 },
    { day: '25', time: 25 },
    { day: '30', time: 15 },
];

export const recentTickets = [
    {
        id: "10235",
        subject: "Login Issue on Mobile",
        status: "Open",
        priority: "High",
        department: "IT Support",
        assignedTo: "-",
        created: "2 mins ago"
    },
    {
        id: "10234",
        subject: "Payment Failure on Checkout",
        status: "Claimed",
        priority: "Critical",
        department: "Billing",
        assignedTo: "Sarah J.",
        created: "15 mins ago"
    },
    {
        id: "10233",
        subject: "Feature Request: Dark Mode",
        status: "Resolved",
        priority: "Low",
        department: "Product",
        assignedTo: "Mike T.",
        created: "1 hour ago"
    },
    {
        id: "10232",
        subject: "Account verification email not received",
        status: "Open",
        priority: "Medium",
        department: "Support",
        assignedTo: "-",
        created: "2 hours ago"
    },
    {
        id: "10231",
        subject: "Bug in reporting module",
        status: "Claimed",
        priority: "High",
        department: "Engineering",
        assignedTo: "Alex R.",
        created: "3 hours ago"
    },
];
