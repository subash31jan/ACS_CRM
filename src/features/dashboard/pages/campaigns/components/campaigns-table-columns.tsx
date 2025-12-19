"use client";

import { useMemo } from "react";
import { Campaign, CampaignStatus } from "@/features/dashboard/pages/campaigns/types/campaign";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { CampaignsActionsDropdown } from "./campaigns-actions-dropdown";

export const statusColors: Record<CampaignStatus, string> = {
    draft: "bg-gray-100 text-gray-800",
    scheduled: "bg-blue-100 text-blue-800",
    sending: "bg-yellow-100 text-yellow-800",
    sent: "bg-green-100 text-green-800",
};

export const useCampaignColumns = (
    onEdit?: (campaign: Campaign) => void,
    onDelete?: (campaign: Campaign) => void
) => {
    return useMemo<ColumnDef<Campaign>[]>(
        () => [
            {
                accessorKey: "id",
                header: "ID",
                cell: ({ row }) => (
                    <div className="font-medium text-xs truncate max-w-[80px]" title={row.getValue("id")}>
                        {row.getValue("id")}
                    </div>
                ),
            },
            {
                accessorKey: "name",
                header: "Campaign Name",
                cell: ({ row }) => (
                    <div className="font-medium">{row.getValue("name")}</div>
                ),
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => {
                    const status = row.getValue("status") as CampaignStatus;
                    return (
                        <Badge variant="secondary" className={statusColors[status]}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: "scheduled_at",
                header: "Scheduled",
                cell: ({ row }) => {
                    const scheduledAt = row.getValue("scheduled_at") as string | null;
                    return <div>{scheduledAt ? format(new Date(scheduledAt), "PPp") : "N/A"}</div>;
                },
            },
            {
                accessorKey: "sending_started_at",
                header: "Sending Started",
                cell: ({ row }) => {
                    const date = row.getValue("sending_started_at") as string | null;
                    return <div>{date ? format(new Date(date), "PPp") : "N/A"}</div>;
                },
            },
            {
                accessorKey: "sent_at",
                header: "Sent",
                cell: ({ row }) => {
                    const date = row.getValue("sent_at") as string | null;
                    return <div>{date ? format(new Date(date), "PPp") : "N/A"}</div>;
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
                cell: ({ row }) => <CampaignsActionsDropdown campaign={row.original} onEdit={onEdit} onDelete={onDelete} />,
            },
        ],
        [onEdit, onDelete]
    );
};
