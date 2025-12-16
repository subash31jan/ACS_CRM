"use client";

import { useMemo } from "react";
import { Company, CompanyStatus } from "@/features/dashboard/pages/companies/types/company";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { CompanyActionsDropdown } from "./companies-actions-dropdown";

export const statusColors: Record<CompanyStatus, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
    blocked: "bg-red-100 text-red-800",
};

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
};

export const useCompanyColumns = () => {
    return useMemo<ColumnDef<Company>[]>(
        () => [
            {
                accessorKey: "companyNumber",
                header: "Company ID",
                cell: ({ row }) => (
                    <div className="font-medium">{row.getValue("companyNumber")}</div>
                ),
            },
            {
                accessorKey: "companyName",
                header: "Company Name",
                cell: ({ row }) => (
                    <div className="flex flex-col">
                        <span>{row.getValue("companyName")}</span>
                        <span className="text-sm text-muted-foreground">
                            {row.original.email}
                        </span>
                    </div>
                ),
            },
            {
                accessorKey: "industry",
                header: "Industry",
                cell: ({ row }) => <div>{row.getValue("industry")}</div>,
            },
            {
                accessorKey: "dateAdded",
                header: "Date Added",
                cell: ({ row }) => format(new Date(row.getValue("dateAdded")), "PP"),
            },
            {
                accessorKey: "revenue",
                header: "Revenue",
                cell: ({ row }) => formatCurrency(row.getValue("revenue")),
            },
            {
                accessorKey: "lastContact",
                header: "Last Contact",
                cell: ({ row }) => {
                    const lastContact = row.getValue("lastContact") as string;
                    return lastContact
                        ? format(new Date(lastContact), "PP")
                        : "No contact yet";
                },
            },
            {
                accessorKey: "location",
                header: "Location",
                cell: ({ row }) => <div>{row.getValue("location")}</div>,
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => {
                    const status = row.getValue("status") as CompanyStatus;
                    return (
                        <Badge className={statusColors[status]}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                    );
                },
            },
            {
                id: "actions",
                header: "",
                cell: ({ row }) => <CompanyActionsDropdown company={row.original} />,
            },
        ],
        []
    );
};
