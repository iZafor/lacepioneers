import { Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SortableTableHeader<T>({
    title,
    column,
    className,
}: {
    title: string;
    column: Column<T>;
    className?: string;
}) {
    return (
        <Button
            className={className}
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            {title} <ArrowUpDown className="ml-2 size-4" />
        </Button>
    );
}
