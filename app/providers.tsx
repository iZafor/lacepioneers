"use client";

import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ThemeProvider } from "next-themes";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <ConvexProvider client={convex}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                {children}
            </ThemeProvider>
        </ConvexProvider>
    );
}
