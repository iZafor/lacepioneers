"use client";

import { ReactNode } from "react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { ConvexReactClient } from "convex/react";
import SyncUser from "@/components/sync-user";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <ClerkProvider>
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                <SyncUser />
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    {children}
                    <Toaster />
                </ThemeProvider>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    );
}
