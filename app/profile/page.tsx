"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";

const DUMMY_ORDERS = [
    {
        id: "ord_1",
        date: "2024-04-20",
        status: "Delivered",
        total: 299.99,
        items: [{ name: "Nike Air Max", quantity: 1, price: 299.99 }],
    },
    {
        id: "ord_2",
        date: "2024-04-15",
        status: "Processing",
        total: 399.98,
        items: [{ name: "Adidas Ultra Boost", quantity: 2, price: 199.99 }],
    },
];

const profileSchema = z.object({
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
});

const TAB_VALUES = ["profile", "orders", "settings"] as const;
type TabValue = (typeof TAB_VALUES)[number];

export default function ProfilePage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const initialTab = searchParams.get("tab");
    const validatedTab: TabValue = TAB_VALUES.includes(initialTab as TabValue)
        ? (initialTab as TabValue)
        : "profile";

    const [tabValue, setTabValue] = useState<TabValue>(validatedTab);

    const handleTabChange = (value: string) => {
        const newTab = TAB_VALUES.includes(value as TabValue)
            ? value
            : "profile";

        const params = new URLSearchParams(searchParams);
        params.set("tab", newTab);

        router.push(`${pathname}?${params.toString()}`);
        setTabValue(newTab as TabValue);
    };

    const userData = useQuery(api.users.getUser);
    const updateUser = useMutation(api.users.updateUser);

    const [isUpdating, setIsUpdating] = useState(false);

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            phone: userData?.phone || "",
            address: userData?.address || "",
            city: userData?.city || "",
            state: userData?.state || "",
            zipCode: userData?.zipCode || "",
        },
    });

    useEffect(() => {
        if (userData) {
            form.reset({
                phone: userData?.phone || "",
                address: userData?.address || "",
                city: userData?.city || "",
                state: userData?.state || "",
                zipCode: userData?.zipCode || "",
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData]);

    async function onSubmit(values: z.infer<typeof profileSchema>) {
        setIsUpdating(true);

        const updates: { field: string; value: string }[] = [];
        (Object.keys(values) as Array<keyof typeof values>).forEach((field) => {
            if (values[field] && values[field] !== userData![field]) {
                updates.push({ field, value: values[field] });
            }
        });

        if (updates.length > 0) {
            await updateUser({ id: userData!._id, values: updates });
        }
        form.reset();

        setIsUpdating(false);
    }

    if (!userData) {
        return <ProfileSkeleton />;
    }

    return (
        <div className="container mx-auto py-4 sm:py-8 px-4 max-w-5xl">
            <Tabs
                value={tabValue}
                onValueChange={handleTabChange}
                className="space-y-4 sm:space-y-6"
            >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 sm:justify-between">
                    <TabsList className="w-full sm:w-auto">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="orders">Orders</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    <Avatar className="h-12 w-12 self-center sm:self-auto">
                        <AvatarImage src={userData.profileImage} />
                        <AvatarFallback>
                            {userData.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                </div>

                <TabsContent value="profile" className="space-y-4 sm:space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Update your personal information here.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-6 space-y-4">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Full Name
                                    </p>
                                    <p className="text-sm">{userData.name}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Email
                                    </p>
                                    <p className="text-sm">{userData.email}</p>
                                </div>
                            </div>
                            <Separator className="mb-6" />

                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-4"
                                >
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Phone Number
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="tel"
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Used for order updates and
                                                    delivery
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="address"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Street Address
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="city"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            City
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="state"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            State
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="zipCode"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            ZIP Code
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <Button
                                            type="submit"
                                            className="w-full sm:w-auto"
                                            disabled={isUpdating}
                                        >
                                            Save Changes
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="orders">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order History</CardTitle>
                            <CardDescription>
                                View your past orders
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {DUMMY_ORDERS.map((order) => (
                                    <Card key={order.id}>
                                        <CardContent className="p-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 sm:justify-between">
                                                <div>
                                                    <p className="font-medium">
                                                        Order #{order.id}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {new Date(
                                                            order.date
                                                        ).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
                                                    <p className="font-medium">
                                                        $
                                                        {order.total.toFixed(2)}
                                                    </p>
                                                    <Badge
                                                        variant={
                                                            order.status ===
                                                            "Delivered"
                                                                ? "default"
                                                                : "secondary"
                                                        }
                                                    >
                                                        {order.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <Separator className="my-4" />
                                            <div className="space-y-2">
                                                {order.items.map(
                                                    (item, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex flex-col sm:flex-row sm:justify-between text-sm"
                                                        >
                                                            <span className="font-medium sm:font-normal">
                                                                {item.quantity}x{" "}
                                                                {item.name}
                                                            </span>
                                                            <span>
                                                                $
                                                                {item.price.toFixed(
                                                                    2
                                                                )}
                                                            </span>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Settings</CardTitle>
                            <CardDescription>
                                Manage your account preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent></CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function ProfileSkeleton() {
    return (
        <div className="container max-w-4xl mx-auto py-8 px-4">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-10 w-[300px]" />
                    <Skeleton className="h-12 w-12 rounded-full" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-[200px] mb-2" />
                        <Skeleton className="h-4 w-[300px]" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-[100px]" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ))}
                        <Skeleton className="h-10 w-[100px]" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
