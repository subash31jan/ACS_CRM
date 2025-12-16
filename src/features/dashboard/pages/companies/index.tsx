"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useCompanies } from "./hooks/use-companies";
import { CompaniesTable } from "./components/companies-table";
import { CompaniesFilters } from "./components/companies-filters";
import { Button } from "@/components/ui/button";
import { DynamicFormDialog } from "@/components/dynamic-form-dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function CompaniesPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [feedbackModal, setFeedbackModal] = useState<{
        open: boolean;
        title: string;
        description: React.ReactNode;
    }>({
        open: false,
        title: "",
        description: "",
    });

    const {
        companies,
        allCompanies,
        pageCount,
        filters,
        sorting,
        pagination,
        updateFilters,
        handleSortingChange,
        handlePaginationChange,
        handleClearFilters,
    } = useCompanies();

    const isEmpty = allCompanies.length === 0;

    const handleFormSubmit = async (data: any) => {
        try {
            console.log("Company form submitted:", data);

            // Send data to local API route (which will forward to webhook)
            const response = await fetch("/api/webhook/create-contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            console.log("Response status:", response.status);
            const responseData = await response.json();
            console.log("Response data:", responseData);

            if (!response.ok) {
                // Check for "already exists" in 400 Bad Request
                const responseString = JSON.stringify(responseData).toLowerCase();
                if (response.status === 400 && responseString.includes("already exists")) {
                    console.log("Duplicate company detected, showing modal");
                    setFeedbackModal({
                        open: true,
                        title: "Duplicate Company",
                        description: (
                            <div className="flex flex-col gap-2">
                                <p>This company already exists in the database.</p>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>You cannot create a new company with the same name.</li>
                                    <li>Try editing the existing entry if you need to update it.</li>
                                </ul>
                            </div>
                        ),
                    });
                    return;
                }

                throw new Error(responseData.message || `Webhook request failed: ${response.status}`);
            }

            console.log("Webhook triggered successfully");
            setFeedbackModal({
                open: true,
                title: "Company Created",
                description: "The company has been successfully created.",
            });
            // TODO: Refresh companies list
        } catch (error) {
            console.error("Error triggering webhook:", error);
            setFeedbackModal({
                open: true,
                title: "Error",
                description: "Failed to create company. Please try again.",
            });
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Companies</h1>
                <div className="flex items-center gap-4">
                    <Button onClick={() => setIsFormOpen(true)}>
                        <Plus className="size-4" />
                        New Company
                    </Button>
                </div>
            </div>

            <div className="rounded-lg border bg-card">
                <div className="border-b p-4">
                    <CompaniesFilters filters={filters} onFiltersChange={updateFilters} />
                </div>
                <div className="p-3">
                    <CompaniesTable
                        companies={companies}
                        totalRows={allCompanies.length}
                        sorting={sorting}
                        onSort={handleSortingChange}
                        pagination={pagination}
                        onPaginationChange={handlePaginationChange}
                        pageCount={pageCount}
                    />
                </div>
            </div>

            {isEmpty && (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
                    <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                        <h3 className="mt-4 text-lg font-semibold">No companies found</h3>
                        <p className="mb-4 mt-2 text-sm text-muted-foreground">
                            Try adjusting your search or filter to find what you are looking
                            for.
                        </p>
                        <Button variant="outline" onClick={handleClearFilters}>
                            Clear Filters
                        </Button>
                    </div>
                </div>
            )}

            <DynamicFormDialog
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                formType="company"
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
                        <AlertDialogAction onClick={() => setFeedbackModal(prev => ({ ...prev, open: false }))}>
                            OK
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
