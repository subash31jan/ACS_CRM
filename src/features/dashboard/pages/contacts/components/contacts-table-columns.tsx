"use client";

import { useMemo } from "react";
import { Contact, ContactStatus } from "@/features/dashboard/pages/contacts/types/contact";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { ContactActionsDropdown } from "./contacts-actions-dropdown";

export const statusColors: Record<ContactStatus, string> = {
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

export const useContactColumns = (
  onEdit?: (contact: Contact) => void,
  onDelete?: (contact: Contact) => void
) => {
  return useMemo<ColumnDef<Contact>[]>(
    () => [
      {
        accessorKey: "contact_id",
        header: "Contact ID",
        cell: ({ row }) => (
          <div className="font-medium text-xs truncate max-w-[80px]" title={row.getValue("contact_id")}>
            {row.getValue("contact_id")}
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("email")}</div>
        ),
      },
      {
        accessorKey: "first_name",
        header: "First Name",
        cell: ({ row }) => (
          <div>{row.getValue("first_name")}</div>
        ),
      },
      {
        accessorKey: "last_name",
        header: "Last Name",
        cell: ({ row }) => (
          <div>{row.getValue("last_name")}</div>
        ),
      },
      {
        accessorKey: "company_name", // Using the optional field for display
        header: "Company",
        cell: ({ row }) => <div>{row.getValue("company_name") || "N/A"}</div>,
      },
      {
        accessorKey: "subscription",
        header: "Subscription",
        cell: ({ row }) => {
          const isSubscribed = row.getValue("subscription") as boolean;
          return (
            <Badge variant={isSubscribed ? "default" : "secondary"} className={isSubscribed ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}>
              {isSubscribed ? "Subscribed" : "Not Subscribed"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: "Created At",
        cell: ({ row }) => format(new Date(row.getValue("created_at")), "PP"),
      },
      {
        accessorKey: "updated_at",
        header: "Updated At",
        cell: ({ row }) => format(new Date(row.getValue("updated_at")), "PP"),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => <ContactActionsDropdown contact={row.original} onEdit={onEdit} onDelete={onDelete} />,
      },
    ],
    [onEdit, onDelete]
  );
}; 