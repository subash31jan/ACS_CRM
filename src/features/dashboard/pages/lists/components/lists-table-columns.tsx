"use client";

import { useMemo } from "react";
import { List } from "@/features/dashboard/pages/lists/types/list";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { ListActionsDropdown } from "./lists-actions-dropdown";

export const useListColumns = () => {
    return useMemo<ColumnDef<List>[]>(
        () => [
            {
                accessorKey: "listId",
                header: "List ID",
                cell: ({ row }) => {
                    const id = row.getValue("listId") as string;
                    return (
                        <div className="font-medium" title={id}>
                            {id ? `${id.substring(0, 8)}...` : ""}
                        </div>
                    );
                },
            },
            {
                accessorKey: "listName",
                header: "List Name",
                cell: ({ row }) => (
                    <div className="font-medium">{row.getValue("listName")}</div>
                ),
            },
            {
                accessorKey: "description",
                header: "Description",
                cell: ({ row }) => (
                    <div className="text-muted-foreground truncate max-w-[300px]" title={row.getValue("description")}>
                        {row.getValue("description") || "-"}
                    </div>
                ),
            },
            {
                accessorKey: "contactsCount",
                header: "Contacts",
                cell: ({ row }) => (
                    <div className="font-medium">
                        {(row.getValue("contactsCount") as number).toLocaleString()}
                    </div>
                ),
            },
            {
                accessorKey: "creationDate",
                header: "Creation Date",
                cell: ({ row }) => {
                    const dateValue = row.getValue("creationDate");
                    if (!dateValue) return "-";
                    const date = new Date(dateValue as string | number | Date);
                    if (isNaN(date.getTime())) return "-";
                    return format(date, "PP");
                },
            },
            {
                accessorKey: "updatedAt",
                header: "Updated At",
                cell: ({ row }) => {
                    const dateValue = row.getValue("updatedAt");
                    if (!dateValue) return "-";
                    const date = new Date(dateValue as string | number | Date);
                    if (isNaN(date.getTime())) return "-";
                    return format(date, "PP");
                },
            },
            {
                id: "actions",
                header: "",
                cell: ({ row }) => <ListActionsDropdown list={row.original} />,
            },
        ],
        []
    );
};
