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
import { format, parseISO } from "date-fns";

type Sizes = Array<{
    size: number;
    stock: number;
}>;

export const inventoryTableColumns: ColumnDef<Doc<"shoes">>[] = [
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
                            <DeleteCompShoes id={product._id} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export const ordersTableColumns: ColumnDef<Doc<"orders">>[] = [
    {
        accessorKey: "orderId",
        header: "Order ID",
        cell: ({ row }) => {
            return <div>#{row.original._id.slice(-6)}</div>;
        },
        filterFn: (row, _, value) =>
            row.original._id
                .toLowerCase()
                .includes((value as string).toLowerCase()),
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "address",
        header: "Address",
        cell: ({ row }) => {
            const order = row.original;
            return (
                <div className="space-y-1">
                    <p className="text-sm">{order.address}</p>
                    <p className="text-xs text-muted-foreground">
                        {[order.city, order.state, order.zipCode]
                            .filter((s) => s)
                            .join(", ")}
                    </p>
                </div>
            );
        },
    },
    {
        accessorKey: "orderDate",
        header: ({ column }) => (
            <SortableTableHeader title="Order Date" column={column} />
        ),
        cell: ({ row }) => {
            const date = row.getValue("orderDate") as string;
            return (
                <div className="space-y-1">
                    <p className="text-sm font-medium">
                        {format(parseISO(date), "MMM d, yyyy")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {format(parseISO(date), "h:mm a")}
                    </p>
                </div>
            );
        },
    },
    {
        accessorKey: "deliveryDate",
        header: ({ column }) => (
            <SortableTableHeader title="Delivery Date" column={column} />
        ),
        cell: ({ row }) => {
            const date = row.getValue("deliveryDate") as string | undefined;
            if (!date) return <div>-</div>;

            return (
                <div className="space-y-1">
                    <p className="text-sm font-medium">
                        {format(parseISO(date), "MMM d, yyyy")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {format(parseISO(date), "h:mm a")}
                    </p>
                </div>
            );
        },
    },
    {
        accessorKey: "paymentMethod",
        header: "Payment Method",
        cell: ({ row }) => {
            return (
                <Badge variant="outline" className="capitalize">
                    {(row.getValue("paymentMethod") as string).replace(
                        "-",
                        " "
                    )}
                </Badge>
            );
        },
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        accessorKey: "paymentStatus",
        header: "Payment",
        cell: ({ row }) => {
            const status = row.getValue("paymentStatus") as string;
            return (
                <Badge
                    variant={
                        status === "paid"
                            ? "success"
                            : status === "pending"
                              ? "warning"
                              : "destructive"
                    }
                    className="capitalize"
                >
                    {status}
                </Badge>
            );
        },
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        accessorKey: "status",
        header: "Order Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <Badge
                    variant={
                        status === "delivered"
                            ? "default"
                            : status === "in-transit"
                              ? "warning"
                              : status === "confirmed"
                                ? "success"
                                : "secondary"
                    }
                    className="capitalize"
                >
                    {status.replace("-", " ")}
                </Badge>
            );
        },
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        accessorKey: "items",
        header: "Items",
        cell: ({ row }) => {
            const items = row.getValue("items") as Array<{
                productId: Id<"shoes">;
                price: number;
                size: number;
                quantity: number;
            }>;
            const totalItems = items.reduce(
                (acc, item) => acc + item.quantity,
                0
            );
            const totalAmount = items.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );

            return (
                <div className="space-y-1">
                    <div className="text-sm font-medium">
                        {totalItems} {totalItems === 1 ? "item" : "items"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Total: ${totalAmount.toFixed(2)}
                    </div>
                </div>
            );
        },
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
                        <DropdownMenuItem variant="destructive">
                            <DeleteCompOrders id={product._id} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

function DeleteCompShoes({
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

function DeleteCompOrders({
    id,
    className,
    ...props
}: { id: Id<"orders"> } & React.ComponentProps<"span">) {
    const deleteOrderData = useMutation(api.orders.deleteOrder);

    return (
        <span
            {...props}
            className={cn("w-full", className)}
            onClick={async () => await deleteOrderData({ id })}
        >
            Delete
        </span>
    );
}
