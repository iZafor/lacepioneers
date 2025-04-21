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

export default function InventoryTableFilter({
    data,
    table,
    classname,
}: TableFilterProps<Doc<"shoes">>) {
    const categories = Array.from(
        new Set(data.map((r) => r.category)).values()
    ).map((v) => ({ value: v }));

    const brands = Array.from(new Set(data.map((r) => r.brand)).values()).map(
        (v) => ({ value: v })
    );

    return (
        <div className={cn("flex gap-4", classname)}>
            <Input
                className="w-[20rem]"
                placeholder="Filter names..."
                value={
                    (table.getColumn("name")?.getFilterValue() as string) ?? ""
                }
                onChange={(ev) =>
                    table.getColumn("name")?.setFilterValue(ev.target.value)
                }
            />
            <TableFacetedFilter
                title="Category"
                options={categories}
                column={table.getColumn("category")}
            />
            <TableFacetedFilter
                title="Brand"
                options={brands}
                column={table.getColumn("brand")}
            />
        </div>
    );
}
