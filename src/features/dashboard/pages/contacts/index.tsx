"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useContacts } from "./hooks/use-contacts";
import { createContact } from "@/features/dashboard/pages/contacts/services/contact-api";
import { useCompanies } from "@/features/dashboard/pages/companies/hooks/use-companies";
import { ContactsTable } from "./components/contacts-table";
import { ContactsFilters } from "./components/contacts-filters";
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

export function ContactsPage() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [isCompanyFormOpen, setIsCompanyFormOpen] = useState(false);
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

  const {
    contacts,
    allContacts,
    pageCount,
    filters,
    sorting,
    pagination,
    updateFilters,
    handleSortingChange,
    handlePaginationChange,
    handleClearFilters,
  } = useContacts();

  // Fetch companies for the dropdown
  const { allCompanies } = useCompanies();

  // We need a way to refresh contacts. 
  // Since useContacts fetches on mount, we might need to expose a refresh method or trigger re-fetch.
  // For now, we will just log success or maybe we can create a way to force refresh.
  // Actually, useContacts doesn't expose refresh. I should update useContacts to expose it or just reload page/state.
  // I'll assume for this step I just implement the submit logic.

  const refreshContacts = () => {
    window.location.reload(); // Simple brute force refresh for now or I can update useContacts.
    // Better: Update useContacts to return a refetch function.
  };

  const isEmpty = allContacts.length === 0;

  const handleContactFormSubmit = async (data: any) => {
    try {
      console.log("Contact form submitted:", data);
      await createContact(data);

      setFeedbackModal({
        open: true,
        title: "Success",
        description: "Contact created successfully.",
        onOk: refreshContacts,
      });
    } catch (error) {
      console.error("Error creating contact:", error);
      if (error instanceof Error && error.message === "DUPLICATE_CONTACT") {
        setFeedbackModal({
          open: true,
          title: "Contact Already Exists",
          description: "The contact with the provided email already exists. You can edit the contact if needed.",
        });
      } else {
        setFeedbackModal({
          open: true,
          title: "Error",
          description: "Failed to create contact. Please try again.",
        });
      }
    }
  };

  const handleCompanyFormSubmit = (data: any) => {
    console.log("Company form submitted:", data);
    // TODO: Add logic to save the company (webhook, etc.)
    // Ideally, after success, we refresh the companies list so it appears in the dropdown.
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Contacts</h1>
        <div className="flex items-center gap-4">
          <Button onClick={() => setIsContactFormOpen(true)}>
            <Plus className="size-4" />
            New Contact
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="border-b p-4">
          <ContactsFilters filters={filters} onFiltersChange={updateFilters} />
        </div>
        <div className="p-3">
          <ContactsTable
            contacts={contacts}
            totalRows={allContacts.length}
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
            <h3 className="mt-4 text-lg font-semibold">No contacts found</h3>
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
        open={isContactFormOpen}
        onOpenChange={setIsContactFormOpen}
        formType="contact"
        onSubmit={handleContactFormSubmit}
        companies={allCompanies.map(c => ({ id: c.id, name: c.companyName }))}
        onAddCompany={() => setIsCompanyFormOpen(true)}
      />

      <DynamicFormDialog
        open={isCompanyFormOpen}
        onOpenChange={setIsCompanyFormOpen}
        formType="company"
        onSubmit={handleCompanyFormSubmit}
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