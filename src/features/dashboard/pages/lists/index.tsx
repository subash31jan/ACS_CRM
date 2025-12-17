"use client";

import { useState, useEffect } from "react";
import { type List } from "./types/list";
import { useListColumns } from "./components/lists-table-columns";
import { ListTablePagination } from "./components/lists-table-pagination";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DynamicFormDialog } from "@/components/dynamic-form-dialog";

import { createList, fetchLists } from "./services/list-api";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ListsPage() {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [lists, setLists] = useState<List[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [feedbackModal, setFeedbackModal] = useState<{
        open: boolean;
        title: string;
        description: string;
        onOk?: () => void;
    }>({
        open: false,
        title: "",
        description: "",
    });

    const columns = useListColumns();

    const loadLists = async () => {
        try {
            setIsLoading(true);
            const data = await fetchLists();
            setLists(data);
            setError(null);
        } catch (err) {
            console.error("Failed to load lists", err);
            setError("Failed to load lists");
            // setLists([]); // Keep empty or maybe fallback to empty array
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadLists();
    }, []);

    const table = useReactTable({
        data: lists,
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

    const refreshLists = () => {
        loadLists();
    };

    const handleFormSubmit = async (data: any) => {
        try {
            console.log("List form submitted:", data);
            await createList(data);

            setFeedbackModal({
                open: true,
                title: "Success",
                description: "List created successfully.",
                onOk: refreshLists,
            });
        } catch (error) {
            console.error("Error creating list:", error);
            setFeedbackModal({
                open: true,
                title: "Error",
                description: "Failed to create list. Please try again.",
            });
        }
    };

    return (
        <div className="flex flex-col gap-4 p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Lists</h1>
                    <p className="text-muted-foreground">
                        Manage your contact lists and segments
                    </p>
                </div>
                <Button onClick={() => setIsFormOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New List
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <Input
                    placeholder="Search lists..."
                    value={(table.getColumn("listName")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("listName")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>

            <div className="rounded-md border">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex flex-col items-center gap-2">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                            <p className="text-sm text-muted-foreground">Loading lists...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex flex-col items-center gap-2 text-center">
                            <p className="text-sm font-medium text-destructive">Failed to load lists</p>
                            <p className="text-xs text-muted-foreground">{error}</p>
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
                                        No lists found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>

            <ListTablePagination table={table} />

            <DynamicFormDialog
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                formType="list"
                onSubmit={handleFormSubmit}
            />

            <AlertDialog open={feedbackModal.open} onOpenChange={(open) => setFeedbackModal(prev => ({ ...prev, open }))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{feedbackModal.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {feedbackModal.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => {
                            setFeedbackModal(prev => ({ ...prev, open: false }));
                            if (feedbackModal.onOk) feedbackModal.onOk();
                        }}>
                            OK
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
