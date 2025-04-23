"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import OrdersTableFilter from "@/components/admin/orders-table-filter";
import { ordersTableColumns } from "@/components/admin/columns";
import DataTable from "@/components/data-table";
import React from "react";
import { Doc } from "@/convex/_generated/dataModel";

export default function InventoryTable() {
    const data = (useQuery(api.orders.getOrders) as Doc<"orders">[]) || [];

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-prime">Orders</h3>
            <DataTable
                columns={ordersTableColumns}
                data={data}
                tableFilter={OrdersTableFilter}
                paginationDefault={{
                    pageIndex: 0,
                    pageSize: 13,
                }}
            />
        </div>
    );
}
