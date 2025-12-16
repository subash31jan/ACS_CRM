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
                accessorKey: "location",
                header: "Location",
                cell: ({ row }) => <div>{row.getValue("location")}</div>,
            },
            {
                accessorKey: "subscription",
                header: "Subscription",
                cell: ({ row }) => <div>{row.getValue("subscription")}</div>,
            },
            {
                accessorKey: "createdAt",
                header: "Created At",
                cell: ({ row }) => format(new Date(row.getValue("createdAt")), "PP"),
            },
            {
                accessorKey: "updatedAt",
                header: "Updated At",
                cell: ({ row }) => {
                    const updatedAt = row.getValue("updatedAt") as string;
                    return updatedAt
                        ? format(new Date(updatedAt), "PP")
                        : "Never";
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
