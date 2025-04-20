import UpdateProduct from "@/components/admin/update-product";

export default async function Page({
    params,
}: {
    params: Promise<{ productId: string }>;
}) {
    const { productId } = await params;

    return <UpdateProduct productId={productId} />;
}
