"use client";

import { ShieldCheck, CheckCircle2, Server, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function UserSetup() {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        { text: "Connecting to secure server...", icon: Server },
        { text: "Verifying user credentials...", icon: User },
        { text: "Personalizing your dashboard...", icon: ShieldCheck },
        { text: "Finalizing setup...", icon: Loader2 },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentStep((prev) => {
                if (prev < steps.length) {
                    return prev + 1;
                }
                return prev;
            });
        }, 1500);

        return () => clearInterval(timer);
    }, [steps.length]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary mb-6"
                    >
                        <ShieldCheck className="h-10 w-10" />
                    </motion.div>
                    <motion.h2
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl font-bold tracking-tight"
                    >
                        Hi! Setting up your workspace
                    </motion.h2>
                    <motion.p
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-2 text-muted-foreground"
                    >
                        Please wait while we prepare everything for you.
                    </motion.p>
                </div>

                <div className="mt-8 space-y-4">
                    <AnimatePresence mode="wait">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = index === currentStep;
                            const isCompleted = index < currentStep;

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.4 }}
                                    className={`flex items-center gap-4 rounded-lg border p-4 transition-colors ${isActive
                                        ? "bg-primary/5 border-primary/20"
                                        : isCompleted
                                            ? "bg-muted/40 border-transparent opacity-50"
                                            : "bg-background border-transparent opacity-30"
                                        }`}
                                >
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${isActive
                                            ? "bg-primary text-primary-foreground"
                                            : isCompleted
                                                ? "bg-primary/20 text-primary"
                                                : "bg-muted text-muted-foreground"
                                            }`}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle2 className="h-5 w-5" />
                                        ) : (
                                            <Icon className={`h-5 w-5 ${isActive ? "animate-pulse" : ""}`} />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p
                                            className={`font-medium ${isActive ? "text-foreground" : "text-muted-foreground"
                                                }`}
                                        >
                                            {step.text}
                                        </p>
                                    </div>
                                    {isActive && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="h-2 w-2 rounded-full bg-primary"
                                        />
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {currentStep >= steps.length && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-sm text-green-500 font-medium"
                    >
                        Setup Complete! Redirecting...
                    </motion.div>
                )}
            </div>
        </div>
    );
}