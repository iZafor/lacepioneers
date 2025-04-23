"use client";

import Image from "next/image";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

import { Doc } from "@/convex/_generated/dataModel";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip";
import { Input } from "./ui/input";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { SquareArrowOutUpRight } from "lucide-react";
import { useCart } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function Product({
    product,
    className,
}: {
    product: Doc<"shoes">;
    className?: string;
}) {
    const { products, updateCart } = useCart((state) => state);
    const [size, setSize] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(
        products.find((p) => p.productId === product._id)?.count ?? 1
    );
    const [isLoading, setIsLoading] = useState(true);
    const isAvailable = product.sizes.some((s) => s.stock > 0);
    const router = useRouter();

    return (
        <Card
            className={cn(
                "relative w-[20rem] h-[20rem] overflow-hidden flex flex-col items-center justify-center group cursor-pointer",
                className
            )}
        >
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="icon"
                            variant="outline"
                            className="absolute right-2 top-2"
                            onClick={() => {
                                console.log("clicked");
                            }}
                        >
                            <SquareArrowOutUpRight />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>View product details</TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <CardHeader className="w-full">
                <CardTitle>
                    <h4 className="text-prime text-sm">{product.brand}</h4>
                    <h3>{product.name}</h3>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="size-[200px] relative">
                    {isLoading && <LoadingSpinner />}
                    <Image
                        className="transition-all duration-500 ease-in-out group-hover:scale-[1.35]"
                        width={200}
                        height={200}
                        src={product.defaultImage}
                        alt={product.name}
                        onLoad={() => setIsLoading(false)}
                    />
                </div>
            </CardContent>
            <Card
                className={cn(
                    "w-[90%] translate-y-[5rem] gap-2",
                    "transition-transform duration-300 ease-in-out",
                    "group-hover:translate-y-[2rem]",
                    "z-10",
                    "border-none",
                    "absolute",
                    "bg-transparent hidden group-hover:block"
                )}
            >
                <CardContent className="space-y-2">
                    <div className="w-full flex justify-center gap-2 text-center font-mono">
                        <p
                            className={cn({
                                "line-through":
                                    product.discountPrice != null &&
                                    product.discountPrice > 0,
                            })}
                        >
                            ${product.price}
                        </p>
                        {product.discountPrice != null &&
                            product.discountPrice > 0 && (
                                <p>${product.discountPrice}</p>
                            )}
                    </div>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        {product.sizes.map((s) => (
                            <TooltipProvider
                                key={s.size + product.name + s.stock}
                            >
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            disabled={s.stock === 0}
                                            variant="outline"
                                            className={cn(
                                                "rounded-full focus:outline-none border-2 border-slate-900 bg-white dark:bg-slate-800",
                                                {
                                                    "bg-prime text-white ring-2 ring-offset-2 ring-prime":
                                                        size === s.size,
                                                    "diagonal-line-through":
                                                        s.stock === 0,
                                                }
                                            )}
                                            size="icon"
                                            onClick={() => setSize(s.size)}
                                        >
                                            {s.size}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Just {s.stock} pairs remaining
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))}
                        <Input
                            className="border-2 border-accent-foreground mb-2"
                            disabled={!isAvailable || size === null}
                            value={quantity}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if (isNaN(value) || value < 0) {
                                    setQuantity(0);
                                } else {
                                    setQuantity(value);
                                }
                            }}
                            placeholder="Quantity"
                            type="number"
                            min={0}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Button
                        className="w-full border-2 bg-prime hover:bg-amber-600 text-white border-slate-900"
                        disabled={!isAvailable}
                        variant="secondary"
                        onClick={() => {
                            if (size && isAvailable) {
                                updateCart(product._id, quantity, size);
                                router.push("/checkout");
                            }
                        }}
                    >
                        Buy Now
                    </Button>
                    <Button
                        className="w-full border-2"
                        disabled={!isAvailable}
                        onClick={() => {
                            if (size && isAvailable) {
                                updateCart(product._id, quantity, size);
                            }
                        }}
                    >
                        Add to cart
                    </Button>
                </CardFooter>
            </Card>
        </Card>
    );
}
