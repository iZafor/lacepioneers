"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/combobox";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/loading-spinner";

const formSchema = z.object({
    name: z.string().nonempty({
        message: "Product name cannot be empty.",
    }),
    brand: z.string().nonempty({
        message: "Brand name cannot be empty.",
    }),
    sizes: z.array(
        z.object({
            size: z.number().min(1, { message: "Size must be positive" }),
            stock: z.number().min(0, { message: "Stock cannot be negative" }),
        })
    ),
    price: z.number().min(1, { message: "Price must be positive." }),
    discountPrice: z
        .number()
        .min(0, { message: "Discount Price must be positive." })
        .optional()
        .or(z.literal(undefined)),
    description: z.string().optional(),
    category: z.string().nonempty({
        message: "Product name cannot be empty.",
    }),
});

export default function UpdateProduct({
    productId,
    className,
}: {
    productId: string;
    className?: string;
}) {
    const productArray = useQuery(api.shoes.getShoesBy, {
        field: "_id",
        value: productId,
    }) as Doc<"shoes">[] | undefined;
    const product = productArray?.at(0);

    const generateUploadUrl = useMutation(api.shoes.generateUploadUrl);
    const updateShoeData = useMutation(api.shoes.updateShoeData);

    const [localBrands, setLocalBrands] = useState<string[]>([]);
    const [localCategories, setLocalCategories] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const fetchedBrands = useQuery(api.shoes.getShoesBy, {
        distinct: "brand",
        select: ["brand"],
    })?.map((o) => o["brand"]) as string[] | undefined;

    const fetchedCategories = useQuery(api.shoes.getShoesBy, {
        distinct: "category",
        select: ["category"],
    })?.map((o) => o["category"]) as string[] | undefined;

    const brands = [...(fetchedBrands ?? []), ...localBrands];
    const categories = [...(fetchedCategories ?? []), ...localCategories];

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: product?.name ?? "",
            brand: product?.brand ?? "",
            sizes: product?.sizes ?? [],
            price: product?.price ?? 0,
            discountPrice: product?.discountPrice ?? 0,
            description: product?.description ?? "",
            category: product?.category ?? "",
        },
    });

    useEffect(() => {
        if (product) {
            form.reset({
                name: product?.name ?? "",
                brand: product?.brand ?? "",
                sizes: product?.sizes ?? [],
                price: product?.price ?? 0,
                discountPrice: product?.discountPrice ?? 0,
                description: product?.description ?? "",
                category: product?.category ?? "",
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product]);

    if (!productArray) {
        return (
            <div className="relative h-[calc(100dvh-6rem)] w-full">
                <LoadingSpinner />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="h-[calc(100dvh-6rem)] w-full flex justify-center items-center">
                <p className="text-2xl font-semibold text-destructive">
                    Product Not Found!
                </p>
            </div>
        );
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsUpdating(true);

        const updates: {
            field: string;
            value:
                | string
                | number
                | { size: number; stock: number }[]
                | undefined;
        }[] = [];

        const fieldsToCheck = [
            "name",
            "brand",
            "price",
            "discountPrice",
            "description",
            "category",
            "sizes",
        ] as const;

        for (const field of fieldsToCheck) {
            const oldValue = product![field];
            const newValue = values[field];

            if (Array.isArray(oldValue) && Array.isArray(newValue)) {
                if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                    updates.push({ field, value: newValue });
                }
            } else if (oldValue !== newValue) {
                updates.push({ field, value: newValue });
            }
        }

        if (selectedImage) {
            const postUrl = await generateUploadUrl();
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": selectedImage.type },
                body: selectedImage,
            });
            const { storageId } = await result.json();
            updates.push({ field: "imageId", value: storageId });
            setSelectedImage(null);
        }

        if (updates.length > 0) {
            toast("Updating", {
                description: (
                    <pre
                        className="rounded-md p-2"
                        style={{
                            backgroundColor: "var(--foreground)",
                            color: "var(--background)",
                            width: "20rem",
                            overflow: "clip",
                        }}
                    >
                        {JSON.stringify(updates, null, 4)}
                    </pre>
                ),
            });

            await updateShoeData({
                id: product!._id,
                values: updates,
            });
        }

        setIsUpdating(false);
    }

    return (
        <div className={cn("space-y-4", className)}>
            <h3 className="text-xl font-semibold text-prime">Update Product</h3>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full flex flex-col items-center gap-4"
                >
                    <div className="w-[34rem] flex flex-col gap-4">
                        <div className="relative h-[10rem]">
                            <div className="size-[200px] absolute top-1/2 left-1/2 -translate-1/2">
                                {isLoading && <LoadingSpinner />}
                                <Image
                                    width={200}
                                    height={200}
                                    objectFit="center"
                                    src={
                                        selectedImage
                                            ? URL.createObjectURL(selectedImage)
                                            : product.defaultImage
                                    }
                                    alt={product.name}
                                    onLoadingComplete={() =>
                                        setIsLoading(false)
                                    }
                                />
                            </div>
                            <div className="flex w-full justify-center">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="absolute top-0 right-0"
                                    onClick={handleImageClick}
                                >
                                    <UploadCloud className="h-4 w-4" />
                                </Button>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                    onChange={(ev) =>
                                        setSelectedImage(ev.target.files![0])
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="brand"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Brand</FormLabel>
                                        <FormControl>
                                            <Combobox
                                                name="brand"
                                                defaultValue={
                                                    product.brand ?? ""
                                                }
                                                values={brands ?? []}
                                                onChange={(value) => {
                                                    field.onChange(value);
                                                    if (
                                                        brands &&
                                                        !brands.some(
                                                            (br) => br === value
                                                        )
                                                    ) {
                                                        setLocalBrands(
                                                            (prev) => [
                                                                ...prev,
                                                                value,
                                                            ]
                                                        );
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Price"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Number(e.target.value)
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="discountPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Discount Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Discount Price"
                                                {...field}
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.value;
                                                    field.onChange(
                                                        value
                                                            ? Number(value)
                                                            : undefined
                                                    );
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <Combobox
                                                name="category"
                                                defaultValue={product.category}
                                                values={categories ?? []}
                                                onChange={(value) => {
                                                    field.onChange(value);
                                                    if (
                                                        categories &&
                                                        !categories.some(
                                                            (cat) =>
                                                                cat === value
                                                        )
                                                    ) {
                                                        setLocalCategories(
                                                            (prev) => [
                                                                ...prev,
                                                                value,
                                                            ]
                                                        );
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-sm">
                                        Sizes & Stock
                                    </h3>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const currentSizes =
                                                form.getValues("sizes");
                                            form.setValue("sizes", [
                                                ...currentSizes,
                                                { size: 0, stock: 0 },
                                            ]);
                                        }}
                                    >
                                        Add Size
                                    </Button>
                                </div>

                                <div className="flex flex-col gap-2">
                                    {form.watch("sizes").length === 0 ? (
                                        <p className="mt-4 text-sm text-muted-foreground text-center">
                                            No sizes added yet
                                        </p>
                                    ) : (
                                        form.watch("sizes").map((_, index) => (
                                            <div
                                                key={index}
                                                className="flex gap-2 justify-between items-baseline"
                                            >
                                                <FormField
                                                    control={form.control}
                                                    name={`sizes.${index}.size`}
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-0">
                                                            <FormLabel className="text-xs">
                                                                Size
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    {...field}
                                                                    className="h-8"
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        field.onChange(
                                                                            Number(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        )
                                                                    }
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`sizes.${index}.stock`}
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-0">
                                                            <FormLabel className="text-xs">
                                                                Stock
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    {...field}
                                                                    className="h-8"
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        field.onChange(
                                                                            Number(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        )
                                                                    }
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-4 relative top-9"
                                                    onClick={() => {
                                                        const currentSizes =
                                                            form.getValues(
                                                                "sizes"
                                                            );
                                                        form.setValue(
                                                            "sizes",
                                                            currentSizes.filter(
                                                                (_, i) =>
                                                                    i !== index
                                                            )
                                                        );
                                                    }}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Description"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <Button
                        className="w-[34rem]"
                        type="submit"
                        disabled={isUpdating}
                    >
                        Update
                    </Button>
                </form>
            </Form>
        </div>
    );
}
