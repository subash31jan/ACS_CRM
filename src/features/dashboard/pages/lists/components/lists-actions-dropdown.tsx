"use client";

import { List } from "@/features/dashboard/pages/lists/types/list";
import {
    MoreHorizontal,
    Eye,
    Edit,
    Trash,
    UserPlus,
    Download,
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

interface ListActionsProps {
    list: List;
}

export function ListActionsDropdown({ list }: ListActionsProps) {
    const handleViewDetails = () => {
        console.log("View list details", list.listId);
    };

    const handleEditList = () => {
        console.log("Edit list", list.listId);
    };

    const handleAddContacts = () => {
        console.log("Add contacts to", list.listId);
    };

    const handleExportList = () => {
        console.log("Export list", list.listId);
    };

    const handleDeleteList = () => {
        console.log("Delete list", list.listId);
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
                    <DropdownMenuItem onClick={handleEditList}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit List</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleAddContacts}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        <span>Add Contacts</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportList}>
                        <Download className="mr-2 h-4 w-4" />
                        <span>Export List</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={handleDeleteList}
                        className="text-red-600"
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete List</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
