import { ShieldCheck } from "lucide-react";
import Link from "next/link";

const HomeFooter = () => {
    return (
        <footer className="px-12 border-t py-12 bg-muted/30">
            <div className="container grid md:grid-cols-4 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <span>SupportDesk</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Making customer support easier, faster, and more human.
                    </p>
                </div>

                <div>
                    <h4 className="font-semibold mb-4">Product</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><Link href="#" className="hover:text-foreground">Features</Link></li>
                        <li><Link href="#" className="hover:text-foreground">Pricing</Link></li>
                        <li><Link href="#" className="hover:text-foreground">API</Link></li>
                        <li><Link href="#" className="hover:text-foreground">Integrations</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-4">Company</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><Link href="#" className="hover:text-foreground">About Us</Link></li>
                        <li><Link href="#" className="hover:text-foreground">Careers</Link></li>
                        <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
                        <li><Link href="#" className="hover:text-foreground">Contact</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><Link href="#" className="hover:text-foreground">Privacy Policy</Link></li>
                        <li><Link href="#" className="hover:text-foreground">Terms of Service</Link></li>
                        <li><Link href="#" className="hover:text-foreground">Cookie Policy</Link></li>
                    </ul>
                </div>
            </div>
            <div className="container mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} SupportDesk Inc. All rights reserved.
            </div>
        </footer>
    )
}

export default HomeFooter;