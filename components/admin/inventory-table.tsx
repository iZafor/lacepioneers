"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { columns } from "./columns";
import DataTable from "@/components/data-table";
import InventoryTableFilter from "./inventory-table-filter";
import React from "react";
import { cn } from "@/lib/utils";
import { Doc } from "@/convex/_generated/dataModel";

export default function InventoryTable({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const data = useQuery(api.shoes.getShoesBy, {}) as Doc<"shoes">[] || [];

    return (
        <div {...props} className={cn("space-y-4", className)}>
            <h3 className="text-xl font-semibold text-prime">Products</h3>
            <DataTable
                columns={columns}
                data={data}
                tableFilter={InventoryTableFilter}
                paginationDefault={{
                    pageIndex: 0,
                    pageSize: 13,
                }}
            />
        </div>
    );
}
