"use client";

import { SignedIn, UserButton, SignedOut } from "@clerk/clerk-react";
import { ThemeToggle } from "../ThemeToggle";
import { ShieldCheck } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const HomeHeader = () => {
    return (
        <header className="px-12 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xl">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <span>SupportDesk</span>
                </div>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                    <Link href="#features" className="hover:text-foreground transition-colors">
                        Features
                    </Link>
                    <Link href="#pricing" className="hover:text-foreground transition-colors">
                        Pricing
                    </Link>
                    <Link href="#about" className="hover:text-foreground transition-colors">
                        About
                    </Link>
                </nav>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <SignedOut>
                        <Link href="/login">
                            <Button variant="ghost" size="sm">
                                Log in
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button size="sm">Get Started</Button>
                        </Link>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </div>
        </header>
    )
}

export default HomeHeader;