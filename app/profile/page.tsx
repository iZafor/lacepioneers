"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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

const DUMMY_USER = {
    id: "dummy-id",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    firstName: "John",
};

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
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    zipCode: z.string().min(5, "ZIP code is required"),
});

export default function ProfilePage() {
    const user = DUMMY_USER;
    const userData = DUMMY_USER;

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            address: userData.address,
            city: userData.city,
            state: userData.state,
            zipCode: userData.zipCode,
        },
    });

    async function onSubmit(values: z.infer<typeof profileSchema>) {
        console.log("Form submitted with values:", values);
    }

    return (
        <div className="container mx-auto py-4 sm:py-8 px-4 max-w-5xl">
            <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 sm:justify-between">
                    <TabsList className="w-full sm:w-auto">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="orders">Orders</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    <Avatar className="h-12 w-12 self-center sm:self-auto">
                        <AvatarImage src={user?.imageUrl} />
                        <AvatarFallback>
                            {user?.firstName?.charAt(0)}
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
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Full Name
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
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type="email"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

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
