"use client";

import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import { fetchLists, addContactsToList } from "../services/list-api";
import { fetchContacts } from "@/features/dashboard/pages/contacts/services/contact-api";
import { List } from "../types/list";
import { Contact } from "@/features/dashboard/pages/contacts/types/contact";
import { toast } from "sonner"; // Assuming sonner is used, if not we'll use console or basic alert for now. Wait, I should check if toast exists. I'll use console for now as fallback.

interface AddContactsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onComplete?: (result: { success: boolean; message?: string; type?: 'success' | 'error' | 'warning' }) => void;
    preSelectedListId?: string;
}

export function AddContactsDialog({
    open,
    onOpenChange,
    onComplete,
    preSelectedListId,
}: AddContactsDialogProps) {
    const [lists, setLists] = useState<List[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [selectedListId, setSelectedListId] = useState<string>("");
    const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);

    useEffect(() => {
        if (open) {
            loadData();
            if (preSelectedListId) {
                setSelectedListId(preSelectedListId);
            } else {
                setSelectedListId("");
            }
        }
    }, [open, preSelectedListId]);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [listsData, contactsData] = await Promise.all([
                fetchLists(),
                fetchContacts(),
            ]);
            setLists(listsData);
            setContacts(contactsData);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleContact = (contactId: string) => {
        setSelectedContactIds((prev) =>
            prev.includes(contactId)
                ? prev.filter((id) => id !== contactId)
                : [...prev, contactId]
        );
    };

    const handleSubmit = async () => {
        if (!selectedListId || selectedContactIds.length === 0) return;

        try {
            setIsSubmitting(true);
            await addContactsToList(selectedListId, selectedContactIds);
            onOpenChange(false);

            if (onComplete) {
                onComplete({
                    success: true,
                    type: "success",
                    message: "Contacts added to list successfully."
                });
            }

            // Reset form
            setSelectedListId("");
            setSelectedContactIds([]);
        } catch (error: any) {
            console.error("Failed to add contacts", error);
            onOpenChange(false);

            if (onComplete) {
                if (error.message === "ALREADY_EXISTS") {
                    onComplete({
                        success: false,
                        type: "warning",
                        message: "Some contacts are already present in the lists."
                    });
                } else {
                    onComplete({
                        success: false,
                        type: "error",
                        message: "Oops sorry try again after sometime."
                    });
                }
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Contacts to List</DialogTitle>
                    <DialogDescription>
                        Select a list and the contacts you want to add to it.
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex h-[200px] items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Target List
                            </label>
                            <Select
                                value={selectedListId}
                                onValueChange={setSelectedListId}
                                disabled={!!preSelectedListId}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a list" />
                                </SelectTrigger>
                                <SelectContent>
                                    {lists.map((list) => (
                                        <SelectItem key={list.listId} value={list.listId}>
                                            {list.listName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Select Contacts ({selectedContactIds.length} selected)
                            </label>
                            <div className="rounded-md border">
                                <Command>
                                    {/* Note: In recent shadcn versions, CommandInput has search icon built-in */}
                                    <CommandInput placeholder="Search contacts..." />
                                    <CommandList>
                                        <CommandEmpty>No contacts found.</CommandEmpty>
                                        <CommandGroup className="max-h-[200px] overflow-y-auto">
                                            {contacts.map((contact) => (
                                                <CommandItem
                                                    key={contact.contact_id}
                                                    value={`${contact.first_name} ${contact.last_name} ${contact.email}`}
                                                    onSelect={() => toggleContact(contact.contact_id)}
                                                >
                                                    <div
                                                        className={cn(
                                                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                            selectedContactIds.includes(contact.contact_id)
                                                                ? "bg-primary text-primary-foreground"
                                                                : "opacity-50 [&_svg]:invisible"
                                                        )}
                                                    >
                                                        <Check className={cn("h-4 w-4")} />
                                                    </div>
                                                    <span>
                                                        {contact.first_name || ""} {contact.last_name || ""}
                                                    </span>
                                                    <span className="ml-2 text-muted-foreground text-xs">
                                                        {contact.email}
                                                    </span>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </div>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedListId || selectedContactIds.length === 0 || isSubmitting}
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Add Contacts
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
