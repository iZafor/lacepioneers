import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <Card className="h-[100dvh] px-4">
            <ScrollArea className="h-full">{children}</ScrollArea>;
        </Card>
    );
}
