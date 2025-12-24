"use client";

import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const RedirectUserAnimation = () => {
    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center gap-6"
        >
            <div className="relative">
                <motion.div
                    animate={{
                        boxShadow: ["0 0 0 0px rgba(var(--primary), 0.2)", "0 0 0 20px rgba(var(--primary), 0)"]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="rounded-full"
                >
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                        <ShieldCheck className="h-10 w-10" />
                    </div>
                </motion.div>
            </div>

            <div className="flex flex-col items-center gap-2 text-center">
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold tracking-tight"
                >
                    Redirecting to Dashboard
                </motion.h1>
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-muted-foreground"
                >
                    Please wait while we secure your session...
                </motion.p>
            </div>
        </motion.div>
    )
}

export default RedirectUserAnimation