"use client";

import { useState } from "react";
import { Company } from "@/features/dashboard/pages/companies/types/company";
import {
    MoreHorizontal,
    Eye,
    Edit,
    Trash,
    ShoppingCart,
    Mail,
    FileText,
    Ban,
    UserCheck
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DynamicFormDialog } from "@/components/dynamic-form-dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { editCompany, deleteCompany } from "../services/company-api";

interface CompanyActionsProps {
    company: Company;
}

export function CompanyActionsDropdown({ company }: CompanyActionsProps) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [feedbackModal, setFeedbackModal] = useState<{
        open: boolean;
        title: string;
        description: string;
    }>({
        open: false,
        title: "",
        description: "",
    });

    const handleViewDetails = () => {
        // Implement view details functionality
        console.log("View company details", company.companyNumber);
    };

    const handleEditCompany = () => {
        setIsEditDialogOpen(true);
    };

    const handleEditSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            console.log("Editing company:", company.id, data);

            // Transform form data to match API expectations
            const apiData = {
                company_name: data.companyName,
                location: data.location,
            };

            await editCompany(company.id, apiData);

            setFeedbackModal({
                open: true,
                title: "Company Updated",
                description: "The company has been successfully updated.",
            });
            setIsEditDialogOpen(false);

            // Refresh the page to show updated data
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error("Error editing company:", error);
            setFeedbackModal({
                open: true,
                title: "Error",
                description: "Failed to update company. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewOrders = () => {
        // Implement view orders functionality
        console.log("View orders for", company.companyNumber);
    };

    const handleSendEmail = () => {
        // Implement email functionality
        console.log("Email company", company.email);
    };

    const handleCreateOrder = () => {
        // Implement new order functionality
        console.log("Create order for", company.companyNumber);
    };

    const handleViewInvoices = () => {
        // Implement view invoices functionality
        console.log("View invoices for", company.companyNumber);
    };

    const handleActivateCompany = () => {
        // Implement activation functionality
        console.log("Activate company", company.companyNumber);
    };

    const handleBlockCompany = () => {
        // Implement block functionality
        console.log("Block company", company.companyNumber);
    };

    const handleDeleteCompany = () => {
        setIsDeleteDialogOpen(true);
    };

    const confirmDeleteCompany = async () => {
        setIsLoading(true);
        try {
            console.log("Deleting company:", company.id);
            await deleteCompany(company.id);

            setFeedbackModal({
                open: true,
                title: "Company Deleted",
                description: "The company has been successfully deleted.",
            });
            setIsDeleteDialogOpen(false);

            // Refresh the page to show updated data
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error("Error deleting company:", error);
            setFeedbackModal({
                open: true,
                title: "Error",
                description: "Failed to delete company. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={handleViewDetails}>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleEditCompany}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit Company</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleViewOrders}>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            <span>View Orders</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleViewInvoices}>
                            <FileText className="mr-2 h-4 w-4" />
                            <span>View Invoices</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleCreateOrder}>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            <span>Create Order</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleSendEmail}>
                            <Mail className="mr-2 h-4 w-4" />
                            <span>Send Email</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {(company.status === "inactive" || company.status === "blocked") && (
                            <DropdownMenuItem onClick={handleActivateCompany}>
                                <UserCheck className="mr-2 h-4 w-4" />
                                <span>Activate Company</span>
                            </DropdownMenuItem>
                        )}
                        {company.status !== "blocked" && (
                            <DropdownMenuItem onClick={handleBlockCompany} className="text-amber-600">
                                <Ban className="mr-2 h-4 w-4" />
                                <span>Block Company</span>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleDeleteCompany}
                            className="text-red-600"
                        >
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete Company</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Edit Dialog */}
            <DynamicFormDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                formType="company"
                onSubmit={handleEditSubmit}
                defaultValues={{
                    companyName: company.companyName,
                    location: company.location,
                }}
                isSubmitting={isLoading}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete <strong>{company.companyName}</strong>.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDeleteCompany}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Feedback Modal */}
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
        </>
    );
}
