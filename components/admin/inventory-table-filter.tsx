"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TableFilterProps<TData> {
    table: Table<TData>;
    classname?: string;
}

export default function InventoryTableFilter({
    table,
    classname,
}: TableFilterProps<Doc<"shoes">>) {
    return (
        <div className={cn(classname)}>
            <Input
                className="w-[8rem]"
                placeholder="Filter names..."
                value={
                    (table.getColumn("name")?.getFilterValue() as string) ?? ""
                }
                onChange={(ev) =>
                    table.getColumn("name")?.setFilterValue(ev.target.value)
                }
            />
        </div>
    );
}
