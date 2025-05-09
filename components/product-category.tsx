"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Doc } from "../convex/_generated/dataModel";

import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import Product from "./product";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "./ui/button";

export default function ProductCategory({
    category,
    className,
}: {
    category: string;
    className?: string;
}) {
    const products = useQuery(api.shoes.getShoesBy, {
        field: "category",
        values: [category],
        take: 10,
    }) as Doc<"shoes">[];

    return (
        <div className={cn("space-y-4 relative ", className)}>
            <h3 className="font-semibold text-prime text-2xl capitalize border-b pb-2">
                {category}
            </h3>
            <Button className="absolute top-0 right-0 bg-prime hover:bg-amber-600 text-white border-slate-900">
                <Link
                    className="w-full font-semibold"
                    href={`/${encodeURIComponent(category)}`}
                >
                    View All
                </Link>
            </Button>
            <ScrollArea>
                <div className="flex gap-4">
                    {products?.map((shoe) => (
                        <Product key={shoe._id} product={shoe} />
                    ))}
                </div>
                <ScrollBar orientation="horizontal" className="h-0" />
            </ScrollArea>
        </div>
    );
}
