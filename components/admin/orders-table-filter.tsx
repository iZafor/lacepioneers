"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import TableFacetedFilter from "@/components/ui/table-faceted-filter";

interface TableFilterProps<TData> {
    data: TData[];
    table: Table<TData>;
    classname?: string;
}

export default function OrdersTableFilter({
    data,
    table,
    classname,
}: TableFilterProps<Doc<"orders">>) {
    const paymentMethods = Array.from(
        new Set(data.map((r) => r.paymentMethod)).values()
    ).map((v) => ({ value: v }));

    const paymentStatues = Array.from(
        new Set(data.map((r) => r.paymentStatus)).values()
    ).map((v) => ({ value: v }));

    const orderStatues = Array.from(
        new Set(data.map((r) => r.status)).values()
    ).map((v) => ({ value: v }));

    return (
        <div className={cn("flex gap-4", classname)}>
            <Input
                className="w-[20rem]"
                placeholder="Filter order ids..."
                value={
                    (table.getColumn("orderId")?.getFilterValue() as string) ??
                    ""
                }
                onChange={(ev) =>
                    table.getColumn("orderId")?.setFilterValue(ev.target.value)
                }
            />
            <TableFacetedFilter
                title="Payment Status"
                options={paymentStatues}
                column={table.getColumn("paymentStatus")}
            />
            <TableFacetedFilter
                title="Payment Method"
                options={paymentMethods}
                column={table.getColumn("paymentMethod")}
            />
            <TableFacetedFilter
                title="Order Status"
                options={orderStatues}
                column={table.getColumn("status")}
            />
        </div>
    );
}
