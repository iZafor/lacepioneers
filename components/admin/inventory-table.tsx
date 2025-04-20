"use client";

import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { columns } from "./columns";
import DataTable from "@/components/data-table";
import InventoryTableFilter from "./inventory-table-filter";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

export default function InventoryTable({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const { results, status, loadMore } = usePaginatedQuery(api.shoes.getShoesPaginated, {}, { initialNumItems: 13 });
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 13,
    });

    function canPrevPage() {
        return pagination.pageIndex > 0;
    }

    function onPrevPage() {
        if (canPrevPage()) {
            setPagination(prev => ({...prev, pageIndex: prev.pageIndex - 1}));
        }
    }

    function canNextPage() {
        const remaining = results.length % ((pagination.pageIndex + 1) * pagination.pageSize);
        return status === "CanLoadMore" || (remaining > 0 && remaining != results.length); 
    }

    function onNextPage() {
        const remaining = results.length % ((pagination.pageIndex + 1) * pagination.pageSize);
        if (remaining > 0 && remaining != results.length) {
            setPagination(prev => ({...prev, pageIndex: prev.pageIndex + 1}));
            return;
        }

        if (status === "CanLoadMore") {
            loadMore(13);
            setPagination(prev => ({...prev, pageIndex: prev.pageIndex + 1}));
        }
    }

    return (
        <div {...props} className={cn("space-y-4", className)}>
            <h3 className="text-xl font-semibold text-prime">Products</h3>
            <DataTable
                columns={columns}
                data={results}
                tableFilter={InventoryTableFilter}
                pagination={pagination}
                canPrevPage={canPrevPage}
                onPrevPage={onPrevPage}
                canNextPage={canNextPage}
                onNextPage={onNextPage}
            />
        </div>
    );
}
