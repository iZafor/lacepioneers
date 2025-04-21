"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ShoppingCart, X } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCart } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

export default function Cart({ className }: { className?: string }) {
    const pathname = usePathname();
    const isAdmin = pathname.toLowerCase().includes("admin");
    const {
        products: cartProducts,
        updateCart,
        setCount,
    } = useCart((state) => state);
    const products = useQuery(api.shoes.getShoesBy, {
        field: "_id",
        values: cartProducts.map((p) => p.productId),
    }) as Doc<"shoes">[];

    const totalItems = cartProducts.reduce((acc, item) => acc + item.count, 0);
    const totalPrice = products?.reduce((acc, p) => {
        const quantity =
            cartProducts.find((cp) => cp.productId === p._id)?.count ?? 0;
        return acc + p.price * quantity;
    }, 0);

    if (isAdmin) return null;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className={cn("relative", className)}
                >
                    <ShoppingCart className="size-5" />
                    {totalItems > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                        >
                            {totalItems}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className={cn("p-0 w-[20rem] overflow-hidden", className)}
                align="end"
            >
                <div className="p-4 flex items-center justify-between border-b">
                    <h2 className="font-semibold">Shopping Cart</h2>
                    <Badge variant="secondary">{totalItems} items</Badge>
                </div>

                {cartProducts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-8 text-center text-muted-foreground"
                    >
                        <ShoppingCart className="mx-auto h-12 w-12 mb-3 opacity-50" />
                        <p>Your cart is empty</p>
                    </motion.div>
                ) : (
                    <div className="flex flex-col h-[32rem]">
                        <ScrollArea className="h-[24rem] flex-1">
                            <div className="divide-y">
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
                                        >
                                            <Card className="p-0 pb-4 border-0 rounded-none flex items-center gap-4">
                                                <Image
                                                    width={80}
                                                    height={80}
                                                    src={p.defaultImage}
                                                    alt={p.name}
                                                    className="rounded-md object-cover"
                                                />
                                                <div className="flex-1 space-y-1 text-center">
                                                    <p className="text-sm text-muted-foreground">
                                                        {p.brand}
                                                    </p>
                                                    <p className="font-medium">
                                                        {p.name}
                                                    </p>
                                                    <div className="flex justify-center gap-2 text-sm">
                                                        <span>
                                                            Size:{" "}
                                                            {
                                                                cartProducts.find(
                                                                    (cp) =>
                                                                        cp.productId ===
                                                                        p._id
                                                                )?.size
                                                            }
                                                        </span>
                                                        <span>${p.price}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        className="w-16 h-8"
                                                        value={
                                                            cartProducts.find(
                                                                (cp) =>
                                                                    cp.productId ===
                                                                    p._id
                                                            )?.count
                                                        }
                                                        onChange={(e) => {
                                                            const value =
                                                                Math.max(
                                                                    1,
                                                                    parseInt(
                                                                        e.target
                                                                            .value
                                                                    ) || 0
                                                                );
                                                            setCount(
                                                                p._id,
                                                                value
                                                            );
                                                        }}
                                                    />
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                        onClick={() =>
                                                            updateCart(
                                                                p._id,
                                                                0,
                                                                -1
                                                            )
                                                        }
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </ScrollArea>

                        <motion.div layout className="p-4 border-t">
                            <div className="flex items-center justify-between mb-4">
                                <span className="font-medium">Total</span>
                                <span className="font-semibold">
                                    ${totalPrice?.toFixed(2)}
                                </span>
                            </div>
                            <Button className="w-full">Checkout</Button>
                        </motion.div>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
