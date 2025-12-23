import { BarChart3 } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'

const HeroSection = () => {
    return (
        <section className="px-12 relative overflow-hidden py-24 md:py-32">
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px]"></div>
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>

            <div className="container flex flex-col items-center text-center gap-8">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    New Feature: AI-Powered Responses
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance max-w-4xl">
                    Streamline Your Customer Support with <span className="text-primary">Intelligent Ticketing</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl text-balance">
                    Manage queries, track issues, and delight customers with our all-in-one support platform designed for modern teams.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/signup">
                        <Button size="lg" className="h-12 px-8 text-base">
                            Start Free Trial
                        </Button>
                    </Link>
                    <Link href="#demo">
                        <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                            View Demo
                        </Button>
                    </Link>
                </div>

                {/* Abstract UI Representation */}
                <div className="mt-12 w-full max-w-5xl rounded-xl border bg-card text-card-foreground shadow-xl overflow-hidden p-2 md:p-4">
                    <div className="rounded-lg bg-muted/50 aspect-video w-full flex items-center justify-center border border-dashed">
                        <div className="text-muted-foreground flex flex-col items-center gap-2">
                            <BarChart3 className="h-12 w-12 opacity-50" />
                            <span className="text-sm font-medium">Dashboard Preview</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection 