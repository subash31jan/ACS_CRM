"use client";

import { Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ListTableHeaderCellProps<TData, TValue> {
    column: Column<TData, TValue>;
    title: string;
}

export function ListTableHeaderCell<TData, TValue>({
    column,
    title,
}: ListTableHeaderCellProps<TData, TValue>) {
    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            {title}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    );
}
