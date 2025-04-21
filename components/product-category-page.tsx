"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { cn } from "@/lib/utils";
import { Doc } from "@/convex/_generated/dataModel";
import Product from "./product";
import LoadingSpinner from "./ui/loading-spinner";

interface ProductCategoryPageProps {
    category: string;
    className?: string;
}

export default function ProductCategoryPage({
    category,
    className,
}: ProductCategoryPageProps) {
    const products = useQuery(api.shoes.getShoesBy, {
        field: "category",
        values: [category],
    }) as Doc<"shoes">[];

    if (!products) {
        return (
            <div className="h-[100dvh] w-full relative">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className={cn("w-full space-y-4", className)}>
            <h3 className="text-2xl font-semibold capitalize text-prime">
                {category}
            </h3>
            <div className="grid grid-cols-4 gap-x-4 gap-y-6">
                {products?.map((shoe) => (
                    <Product className="w-full" key={shoe._id} product={shoe} />
                ))}
            </div>
        </div>
    );
}
