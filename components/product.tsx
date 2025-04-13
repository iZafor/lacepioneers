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
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

import { Doc } from "@/convex/_generated/dataModel";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip";

export default function Product({
    product,
    className,
}: {
    product: Doc<"shoes">;
    className?: string;
}) {
    const [size, setSize] = useState<number | null>(0);
    const isAvailable = product.sizes.some((s) => s.stock > 0);

    return (
        <div
            className={cn(
                "relative w-[24rem] h-[23rem] overflow-hidden flex flex-col items-center justify-center group",
                className
            )}
        >
            <ExternalLink className="absolute right-[10%] top-0 group-hover:opacity-100 opacity-0" />
            <Image
                className="transition-all duration-500 ease-in-out group-hover:scale-[1.35] group-hover:rotate-3 cursor-pointer"
                width={200}
                height={200}
                src={
                    "/images/" + product.name.split(" ").join("_") + "_base.png"
                }
                alt={product.alt}
            />
            <Card
                className={cn(
                    "w-4/5 translate-y-[-3rem] gap-2",
                    "transition-transform duration-300 ease-in-out",
                    "group-hover:translate-y-[-2.5rem]",
                    "z-10",
                    "bg-gradient-to-br from-violet-500 via-fuchsia-400 to-amber-300",
                    "border-2 border-slate-900"
                )}
            >
                <CardHeader>
                    <CardTitle className="text-center font-bold text-white">
                        {product.name}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p className="text-center font-mono text-white">
                        ${product.price}
                    </p>
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
                                                    "bg-amber-500 dark:bg-amber-500 text-white ring-2 ring-offset-2 ring-amber-600":
                                                        size === s.size,
                                                }
                                            )}
                                            size="icon"
                                            onClick={() => setSize(s.size)}
                                        >
                                            {s.size}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gradient-to-br from-violet-500 via-fuchsia-400 to-amber-300 border-2 border-slate-900">
                                        <p className="font-mono text-white">
                                            Just {s.stock} pairs remaining
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Button
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white border-2 border-slate-900"
                        variant="secondary"
                        disabled={!isAvailable}
                    >
                        Add to cart
                    </Button>
                    <Button
                        className="w-full border-2 border-slate-900 bg-white text-slate-900 hover:bg-slate-100"
                        disabled={!isAvailable}
                    >
                        Buy Now
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
