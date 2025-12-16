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
                cell: ({ row }) => (
                    <div className="font-medium">{row.getValue("listId")}</div>
                ),
            },
            {
                accessorKey: "listName",
                header: "List Name",
                cell: ({ row }) => (
                    <div className="flex flex-col">
                        <span>{row.getValue("listName")}</span>
                        {row.original.description && (
                            <span className="text-sm text-muted-foreground">
                                {row.original.description}
                            </span>
                        )}
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
                cell: ({ row }) => format(new Date(row.getValue("creationDate")), "PP"),
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
