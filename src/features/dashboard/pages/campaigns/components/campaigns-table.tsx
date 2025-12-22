"use client";

import { useRouter } from "next/navigation";
import { Campaign } from "@/features/dashboard/pages/campaigns/types/campaign";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    PaginationState,
    OnChangeFn,
} from "@tanstack/react-table";
import { CampaignsTablePagination } from "./campaigns-table-pagination";
import { useCampaignColumns } from "./campaigns-table-columns";
import { CampaignsTableHeaderCell } from "./campaigns-table-header-cell";
import { Separator } from "@/components/ui/separator";

interface CampaignsTableProps {
    campaigns: Campaign[];
    totalRows: number;
    sorting: SortingState;
    onSort: OnChangeFn<SortingState>;
    pagination: PaginationState;
    onPaginationChange: OnChangeFn<PaginationState>;
    pageCount: number;
    onEdit?: (campaign: Campaign) => void;
    onDelete?: (campaign: Campaign) => void;
}

export function CampaignsTable({
    campaigns,
    totalRows,
    sorting,
    onSort,
    pagination,
    onPaginationChange,
    pageCount,
    onEdit,
    onDelete,
}: CampaignsTableProps) {
    const router = useRouter();
    const columns = useCampaignColumns(onEdit, onDelete);

    const table = useReactTable({
        data: campaigns,
        columns,
        state: {
            sorting,
            pagination,
        },
        pageCount,
        onSortingChange: onSort,
        onPaginationChange: onPaginationChange,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        manualSorting: true,
    });

    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <CampaignsTableHeaderCell key={header.id} header={header} />
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => router.push(`/dashboard/marketing/email-campaigns/${row.original.id}`)}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Separator />
            <CampaignsTablePagination table={table} totalRows={totalRows} />
        </div>
    );
}
