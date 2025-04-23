"use client";

import Image from "next/image";
import { Shield } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export default function HeroSection({ className }: { className?: string }) {
    const { theme } = useTheme();

    return (
        <section className={cn("container mx-auto px-4", className)}>
            <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative w-24 h-24 md:w-32 md:h-32">
                    <Image
                        src={
                            theme === "light"
                                ? "/sneaker.png"
                                : "/sneaker-white.png"
                        }
                        alt="Lace Pioneers Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold">
                        Lace Pioneers
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                        Your destination for authentic sneakers. Every pair is
                        verified for authenticity, ensuring you get nothing but
                        the real deal.
                    </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4" />
                    <span>100% Authenticity Guaranteed</span>
                </div>
            </div>
        </section>
    );
}
