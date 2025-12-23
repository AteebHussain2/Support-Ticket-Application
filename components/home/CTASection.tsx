import { Button } from '../ui/button'
import Link from 'next/link'

const CTASection = () => {
    return (
        <section className="px-12 py-24">
            <div className="container">
                <div className="rounded-3xl bg-primary px-6 py-16 md:px-16 md:py-24 text-center text-primary-foreground relative overflow-hidden">
                    <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold">Ready to transform your support?</h2>
                        <p className="text-primary-foreground/80 text-lg md:text-xl">
                            Join thousands of companies using SupportDesk to deliver exceptional customer experiences.
                        </p>
                        <Button size="lg" variant="secondary" className="h-12 px-8 text-base">
                            <Link href="/signup">Get Started for Free</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CTASection