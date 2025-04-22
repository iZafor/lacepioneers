"use client";

import { useCart } from "@/lib/store";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import Image from "next/image";
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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const formSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Invalid phone number"),
    address: z.string().min(10, "Please enter complete address"),
    city: z.string().min(2, "City is required"),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    paymentMethod: z.enum(["cod", "online"]),
    couponCode: z.string().optional(),
});

export default function Page() {
    const [couponApplied, setCouponApplied] = useState(false);
    const { products: cartProducts, updateCart } = useCart();
    const products = useQuery(api.shoes.getShoesBy, {
        field: "_id",
        values: cartProducts.map((p) => p.productId),
    }) as Doc<"shoes">[];

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
            paymentMethod: "cod",
        },
    });

    const subtotal =
        products?.reduce((acc, p) => {
            const quantity =
                cartProducts.find((cp) => cp.productId === p._id)?.count ?? 0;
            return acc + p.price * quantity;
        }, 0) ?? 0;

    const shipping = cartProducts.length > 0 ? 10 : 0;
    const discount = couponApplied ? subtotal * 0.1 : 0;
    const total = cartProducts.length > 0 ? subtotal + shipping - discount : 0;

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    return (
        <div className="px-4 w-full space-y-4">
            <h3 className="text-2xl text-prime font-semibold">Checkout</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
                <Card>
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                        <CardDescription>
                            {cartProducts.length} items in your cart
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[30rem] pr-4">
                            <AnimatePresence mode="popLayout">
                                {products?.map((p) => (
                                    <motion.div
                                        key={p._id}
                                        layout
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{
                                            opacity: 1,
                                            height: "auto",
                                        }}
                                        exit={{
                                            opacity: 0,
                                            height: 0,
                                            transition: { duration: 0.2 },
                                        }}
                                        transition={{
                                            layout: { duration: 0.2 },
                                        }}
                                        className="flex items-center gap-4 mb-4 group"
                                    >
                                        <Image
                                            src={p.defaultImage}
                                            alt={p.name}
                                            width={80}
                                            height={80}
                                            className="rounded-md"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <motion.p
                                                    layout="position"
                                                    className="font-medium"
                                                >
                                                    {p.name}
                                                </motion.p>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                                                    onClick={() =>
                                                        updateCart(p._id, 0, -1)
                                                    }
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <motion.p
                                                layout="position"
                                                className="text-sm text-muted-foreground"
                                            >
                                                Size:{" "}
                                                {
                                                    cartProducts.find(
                                                        (cp) =>
                                                            cp.productId ===
                                                            p._id
                                                    )?.size
                                                }
                                            </motion.p>
                                            <motion.div
                                                layout="position"
                                                className="flex items-center justify-between mt-1"
                                            >
                                                <p className="text-sm">
                                                    Qty:{" "}
                                                    {
                                                        cartProducts.find(
                                                            (cp) =>
                                                                cp.productId ===
                                                                p._id
                                                        )?.count
                                                    }
                                                </p>
                                                <p className="font-semibold">
                                                    ${p.price}
                                                </p>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </ScrollArea>

                        <Separator className="my-4" />

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>${shipping.toFixed(2)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-${discount.toFixed(2)}</span>
                                </div>
                            )}
                            <Separator />
                            <div className="flex justify-between font-bold">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Shipping Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4 items-baseline">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-3 gap-4 items-baseline">
                                    <FormField
                                        control={form.control}
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>City</FormLabel>
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
                                                <FormLabel>State</FormLabel>
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
                                                <FormLabel>ZIP Code</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Method</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="paymentMethod"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                    className="space-y-4"
                                                >
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="cod" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            Cash on Delivery
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="online" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            Online Payment
                                                        </FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Apply Coupon</CardTitle>
                            </CardHeader>
                            <CardContent className="flex gap-4">
                                <FormField
                                    control={form.control}
                                    name="couponCode"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter coupon code"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setCouponApplied(true)}
                                >
                                    Apply
                                </Button>
                            </CardContent>
                        </Card>

                        <Button type="submit" className="w-full">
                            Place Order (${total.toFixed(2)})
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
