import ProductCategoryPage from "@/components/product-category-page";

export default async function Page({
    params,
}: {
    params: Promise<{ category: string }>;
}) {
    const { category } = await params;

    return <ProductCategoryPage category={decodeURIComponent(category)} />;
}
