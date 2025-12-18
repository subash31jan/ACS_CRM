"use client";

import { Contact } from "@/features/dashboard/pages/contacts/types/contact";
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

interface ContactActionsProps {
  contact: Contact;
}

export function ContactActionsDropdown({ contact }: ContactActionsProps) {
  const handleViewDetails = () => {
    // Implement view details functionality
    console.log("View contact details", contact.contact_id);
  };

  const handleEditContact = () => {
    // Implement edit contact functionality
    console.log("Edit contact", contact.contact_id);
  };

  const handleViewPurchases = () => {
    // Implement view purchases functionality
    console.log("View purchases for", contact.contact_id);
  };

  const handleSendEmail = () => {
    // Implement email functionality
    console.log("Email contact", contact.email);
  };

  const handleCreateOrder = () => {
    // Implement new order functionality
    console.log("Create order for", contact.contact_id);
  };

  const handleViewInvoices = () => {
    // Implement view invoices functionality
    console.log("View invoices for", contact.contact_id);
  };

  const handleActivateContact = () => {
    // Implement activation functionality
    console.log("Activate contact", contact.contact_id);
  };

  const handleBlockContact = () => {
    // Implement block functionality
    console.log("Block contact", contact.contact_id);
  };

  const handleDeleteContact = () => {
    // Implement delete functionality
    console.log("Delete contact", contact.contact_id);
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
          <DropdownMenuItem onClick={handleEditContact}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit Contact</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleViewPurchases}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span>View Purchases</span>
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
          {/* {(contact.status === "inactive" || contact.status === "blocked") && (
            <DropdownMenuItem onClick={handleActivateContact}>
              <UserCheck className="mr-2 h-4 w-4" />
              <span>Activate Contact</span>
            </DropdownMenuItem>
          )} */}
          {/* {contact.status !== "blocked" && (
            <DropdownMenuItem onClick={handleBlockContact} className="text-amber-600">
              <Ban className="mr-2 h-4 w-4" />
              <span>Block Contact</span>
            </DropdownMenuItem>
          )} */}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDeleteContact}
            className="text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete Contact</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 