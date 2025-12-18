"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getContactsByListId } from "./services/list-api";
import { Contact } from "../contacts/types/contact";
import { useContactColumns } from "../contacts/components/contacts-table-columns";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    SortingState,
    ColumnFiltersState,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserPlus } from "lucide-react";
import { AddContactsDialog } from "./components/add-contacts-dialog";
import { ListTablePagination } from "./components/lists-table-pagination"; // Reusing or need a generic one? The name says ListTablePagination, let's check if it's generic enough or create a new one. It likely takes 'table' instance. I'll check imports later or just assume standard tanstack table usage. Actually, better to check it.
// Assuming ListTablePagination is generic enough for now as it usually just uses table helper functions.

export default function ListDetailsPage({ listId }: { listId: string }) {
    const router = useRouter();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [isAddContactsOpen, setIsAddContactsOpen] = useState(false);

    const columns = useContactColumns();

    const loadContacts = async () => {
        try {
            setIsLoading(true);
            const data = await getContactsByListId(listId);
            setContacts(data);
        } catch (error) {
            console.error("Failed to load contacts for list", error);
            setContacts([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (listId) {
            loadContacts();
        }
    }, [listId]);

    const table = useReactTable({
        data: contacts,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        state: {
            sorting,
            columnFilters,
        },
    });

    const handleAddContactsComplete = (result: { success: boolean; message?: string; type?: 'success' | 'error' | 'warning' }) => {
        if (result.success) {
            loadContacts();
        }
    };

    return (
        <div className="flex flex-col gap-4 p-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">List Details</h1>
                    <p className="text-muted-foreground">
                        Manage contacts in this list
                    </p>
                </div>
                <div className="ml-auto">
                    {contacts.length === 0 && (
                        <Button onClick={() => setIsAddContactsOpen(true)}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add Contacts
                        </Button>
                    )}
                </div>
            </div>

            <div className="rounded-md border">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex flex-col items-center gap-2">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                            <p className="text-sm text-muted-foreground">Loading contacts...</p>
                        </div>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <p className="text-muted-foreground">No contacts found in this list.</p>
                                            <Button variant="outline" size="sm" onClick={() => setIsAddContactsOpen(true)}>
                                                Add Contacts
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>

            {/* Reuse ListTablePagination or just basic pagination controls if it's specific to List type. 
                I'll verify ListTablePagination content quickly or just omit for now if unsure. 
                Wait, I can import it. If it expects Table<List>, it might complain if I pass Table<Contact>.
                Let's assume generic or check types. If strictly typed, I might face issues.
                For safety, I'll temporarily omit pagination component or check its type definition.
                I'll assume I can skip it for a moment or use a simplified one.
                Actually, let's verify ListTablePagination first.
            */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>


            <AddContactsDialog
                open={isAddContactsOpen}
                onOpenChange={setIsAddContactsOpen}
                onComplete={handleAddContactsComplete}
                preSelectedListId={listId}
            />
        </div>
    );
}
