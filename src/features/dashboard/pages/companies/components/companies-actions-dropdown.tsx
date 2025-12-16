"use client";

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

interface CompanyActionsProps {
    company: Company;
}

export function CompanyActionsDropdown({ company }: CompanyActionsProps) {
    const handleViewDetails = () => {
        // Implement view details functionality
        console.log("View company details", company.companyNumber);
    };

    const handleEditCompany = () => {
        // Implement edit company functionality
        console.log("Edit company", company.companyNumber);
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
        // Implement delete functionality
        console.log("Delete company", company.companyNumber);
    };

    return (
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
    );
}
