"use client";

import ProductCategory from "@/components/product-category";
import ThemeSwitcher from "@/components/theme-switcher";

export default function Home() {
    return (
        <div className="px-10 mt-10">
            <ThemeSwitcher className="absolute top-5 right-5" />
            <ProductCategory category="Sneakers" />
        </div>
    );
}
