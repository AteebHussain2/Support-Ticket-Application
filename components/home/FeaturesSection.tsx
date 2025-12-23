import { BarChart3, Users, Zap } from 'lucide-react'

const FeaturesSection = () => {
    return (
        <section id="features" className="py-24 bg-muted/50">
            <div className="px-12 container">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Everything needed for world-class support</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Powerful tools to help your team resolve tickets faster and keep customers happy.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="flex flex-col gap-4 p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <Zap className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold">Real-time Updates</h3>
                        <p className="text-muted-foreground">
                            Get instant notifications when tickets are created or updated. Never miss a customer query again.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <Users className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold">Team Collaboration</h3>
                        <p className="text-muted-foreground">
                            Assign tickets, leave internal notes, and collaborate with your team to solve complex issues efficiently.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <BarChart3 className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold">Advanced Analytics</h3>
                        <p className="text-muted-foreground">
                            Track response times, ticket volume, and customer satisfaction scores with detailed reports.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection