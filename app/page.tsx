"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

import ProductCategory from "@/components/product-category";

export default function Home() {
    const categories = useQuery(api.shoes.getShoesBy, {
        distinct: "category",
        select: ["category"],
    })?.map((o) => o["category"]) as string[];

    return (
        <div className="px-10 mt-10 mb-4 space-y-6">
            {categories &&
                categories.map((cat) => (
                    <ProductCategory key={cat} category={cat} />
                ))}
        </div>
    );
}
