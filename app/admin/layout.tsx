import {
    SidebarProvider,
    SidebarTrigger,
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarFooter,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

const baseUrl = "/admin";

const items = [
    {
        title: "Manage Inventory",
        url: baseUrl,
        icon: Package,
    },
];

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider defaultOpen={false}>
            <Sidebar variant="floating" collapsible="icon">
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip={item.title}
                                        >
                                            <Link href={item.url}>
                                                <item.icon className="text-prime" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter />
            </Sidebar>
            <main className="w-full">
                <SidebarTrigger />
                <Card
                    className="px-4"
                    style={{
                        height: "calc(100dvh - 2.25rem)",
                    }}
                >
                    <ScrollArea className="h-full">{children}</ScrollArea>
                </Card>
            </main>
        </SidebarProvider>
    );
}
