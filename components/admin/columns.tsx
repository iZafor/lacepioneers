"use client";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { ColumnDef } from "@tanstack/react-table";
import SortableTableHeader from "@/components/sortable-table-header";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type Sizes = Array<{
    size: number;
    stock: number;
}>;

export const columns: ColumnDef<Doc<"shoes">>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "price",
        header: ({ column }) => (
            <div className="text-center">
                <SortableTableHeader title="Price" column={column} />
            </div>
        ),
        cell: ({ row }) => (
            <div className="text-center">${row.getValue("price")}</div>
        ),
    },
    {
        accessorKey: "discountPrice",
        header: ({ column }) => (
            <div className="text-center">
                <SortableTableHeader title="Discount Price" column={column} />
            </div>
        ),
        cell: ({ row }) => (
            <div className="text-center">
                {row.getValue("discountPrice") === undefined ||
                (row.getValue("discountPrice") as number) <= 0
                    ? "-"
                    : `$${row.getValue("discountPrice")}`}
            </div>
        ),
    },
    {
        accessorKey: "category",
        header: "Category",
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        accessorKey: "brand",
        header: "Brand",
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        accessorKey: "sizes",
        header: "Stock",
        cell: ({ row }) => {
            const sizes = row.getValue("sizes") as Sizes;

            return (
                <div className="flex flex-wrap gap-1.5">
                    {sizes.map((item) => (
                        <Badge
                            key={item.size}
                            variant={item.stock > 0 ? "default" : "secondary"}
                            className="text-xs"
                        >
                            {item.size}: {item.stock}
                        </Badge>
                    ))}
                </div>
            );
        },
        filterFn: (row, id, value) =>
            value.length === 2
                ? true
                : value[0] === "In Stock"
                  ? (row.getValue(id) as Sizes).some((s) => s.stock > 0)
                  : (row.getValue(id) as Sizes).every((s) => s.stock === 0),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const product = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            <Link
                                className="w-full"
                                href={`/admin/${product._id}`}
                            >
                                Update
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive">
                            <DeleteComp id={product._id} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

function DeleteComp({
    id,
    className,
    ...props
}: { id: Id<"shoes"> } & React.ComponentProps<"span">) {
    const deleteShoeData = useMutation(api.shoes.deleteShoeData);

    return (
        <span
            {...props}
            className={cn("w-full", className)}
            onClick={async () => await deleteShoeData({ id })}
        >
            Delete
        </span>
    );
}
