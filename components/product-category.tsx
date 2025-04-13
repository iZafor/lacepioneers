"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import Product from "./product";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export default function ProductCategory({
    category,
    className,
}: {
    category: string;
    className?: string;
}) {
    const products = useQuery(api.shoes.getByCategory, { category });
    const ref = useRef<HTMLDivElement>(null);

    return (
        <div className={cn("space-y-4", className)}>
            <h3 className="font-semibold text-2xl capitalize border-b pb-2">
                {category}
            </h3>
            <div className="relative">
                <ScrollArea className="h-[400px]">
                    <div ref={ref} className="flex w-full gap-4">
                        {products?.map((shoe) => (
                            <Product key={shoe._id} product={shoe} />
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="h-0" />
                </ScrollArea>
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none" />
            </div>
        </div>
    );
}
