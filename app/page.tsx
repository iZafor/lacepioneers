"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import ProductCategory from "@/components/product-category";
import dynamic from "next/dynamic";

const HeroSection = dynamic(() => import("@/components/hero-section"), {
    ssr: false,
});

export default function Home() {
    const categories = useQuery(api.shoes.getShoesBy, {
        distinct: "category",
        select: ["category"],
    })?.map((o) => o["category"]) as string[];

    return (
        <div className="space-y-12 py-8">
            <HeroSection />
            {categories &&
                categories.map((cat) => (
                    <ProductCategory key={cat} category={cat} />
                ))}
        </div>
    );
}
