"use client";

import {
    SidebarProvider,
    SidebarTrigger,
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarSeparator,
} from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import NavbarQuickActions from "./navbar-quick-actions";
import NavbarContents from "./navbar-contents";
import { NavUser } from "./navbar-user";

export default function AppSidebar({
    children,
}: {
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const [width, setWidth] = useState("100dvw - 4rem");

    useEffect(() => {
        if (open) {
            setWidth("100dvw - 16rem");
        } else {
            setWidth("100dvw - 4rem");
        }
    }, [open]);

    return (
        <SidebarProvider open={open} onOpenChange={setOpen} defaultOpen={false}>
            <Sidebar variant="floating" collapsible="icon">
                <SidebarContent>
                    <NavbarContents />
                    <SidebarSeparator />
                    <NavbarQuickActions />
                </SidebarContent>

                <SidebarFooter>
                    <NavUser />
                </SidebarFooter>
            </Sidebar>
            <main className="w-full">
                <SidebarTrigger className="fixed" />
                <Card
                    className="mt-2"
                    style={{
                        height: "calc(100dvh - 1rem)",
                        width: `calc(${width})`,
                    }}
                >
                    <ScrollArea className="h-full">
                        <div
                            className="px-10 mt-10 mb-4 space-y-6"
                            style={{
                                width: `calc(${width})`,
                            }}
                        >
                            {children}
                        </div>
                    </ScrollArea>
                </Card>
            </main>
        </SidebarProvider>
    );
}
