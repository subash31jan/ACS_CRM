"use client";

import { Company } from "@/features/dashboard/pages/companies/types/company";
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
import { CompaniesTablePagination } from "./companies-table-pagination";
import { useCompanyColumns } from "./companies-table-columns";
import { CompaniesTableHeaderCell } from "./companies-table-header-cell";
import { Separator } from "@/components/ui/separator";

interface CompaniesTableProps {
    companies: Company[];
    totalRows: number;
    sorting: SortingState;
    onSort: OnChangeFn<SortingState>;
    pagination: PaginationState;
    onPaginationChange: OnChangeFn<PaginationState>;
    pageCount: number;
}

export function CompaniesTable({
    companies,
    totalRows,
    sorting,
    onSort,
    pagination,
    onPaginationChange,
    pageCount,
}: CompaniesTableProps) {
    const columns = useCompanyColumns();

    const table = useReactTable({
        data: companies,
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
                                <CompaniesTableHeaderCell key={header.id} header={header} />
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
            <CompaniesTablePagination table={table} totalRows={totalRows} />
        </div>
    );
}
