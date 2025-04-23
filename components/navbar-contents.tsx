import { Home, ListTree, LucideIcon, Wrench } from "lucide-react";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    useSidebar,
} from "./ui/sidebar";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface SidebarItems {
    title: string;
    url?: string;
    icon: LucideIcon;
    items?: {
        title: string;
        url: string;
    }[];
}

const defaultItems: SidebarItems[] = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    },
];

export default function NavbarContents() {
    const [items, setItems] = useState(defaultItems);
    const categories = useQuery(api.shoes.getShoesBy, {
        distinct: "category",
        select: ["category"],
    })?.map((o) => o["category"]) as string[];
    const { setOpen } = useSidebar();

    const user = useQuery(api.users.getUser);

    useEffect(() => {
        if (categories && items.every((i) => i.title !== "Categories")) {
            setItems((prev) => [
                ...prev,
                {
                    title: "Categories",
                    icon: ListTree,
                    items: categories.map((c) => ({
                        title: c,
                        url: encodeURIComponent(c),
                    })),
                },
            ]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categories]);

    useEffect(() => {
        if (
            user &&
            user.role === "admin" &&
            items.every((i) => i.title !== "Manage Operations")
        ) {
            setItems((prev) => [
                ...prev,
                {
                    title: "Manage Operations",
                    icon: Wrench,
                    items: [
                        {
                            title: "Manage Inventory",
                            url: "/admin",
                        },
                        {
                            title: "Manage Orders",
                            url: "/admin/orders",
                        },
                    ],
                },
            ]);
        } else {
            setItems((prev) =>
                prev.filter((i) => i.title !== "Manage Operations")
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Contents</SidebarGroupLabel>
            <SidebarGroupContent>
                {items.map((item) => (
                    <SidebarMenu key={item.title}>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={item.title}>
                                {item.url ? (
                                    <Link href={item.url}>
                                        <item.icon className="text-prime" />
                                        <span>{item.title}</span>
                                    </Link>
                                ) : (
                                    <div
                                        className="cursor-pointer"
                                        onClick={() => setOpen(true)}
                                    >
                                        <item.icon className="text-prime" />
                                        <span>{item.title}</span>
                                    </div>
                                )}
                            </SidebarMenuButton>
                            {item.items && (
                                <SidebarMenuSub>
                                    {item.items.map((ii) => (
                                        <SidebarMenuSubItem key={ii.title}>
                                            <SidebarMenuSubButton asChild>
                                                <Link href={ii.url}>
                                                    {ii.title}
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            )}
                        </SidebarMenuItem>
                    </SidebarMenu>
                ))}
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
