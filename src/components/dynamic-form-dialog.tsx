"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";

import { Textarea } from "@/components/ui/textarea";

// Define form types
type FormType = "company" | "contact" | "list";

// Define schemas for each form type
const companySchema = z.object({
    companyName: z.string().min(1, "Company name is required"),
    location: z.string().min(1, "Location is required"),
});

const contactSchema = z.object({
    email: z.string().email("Invalid email address"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    companyId: z.string().max(200).optional(), // Assuming ID or just string for now.
    subscription: z.boolean().default(false),
});

const listSchema = z.object({
    listName: z.string().min(1, "List name is required"),
    description: z.string().optional(),
});

// Type for form data based on schema
type CompanyFormData = z.infer<typeof companySchema>;
type ContactFormData = z.infer<typeof contactSchema>;
type ListFormData = z.infer<typeof listSchema>;
type FormData = CompanyFormData | ContactFormData | ListFormData;

interface DynamicFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    formType: FormType;
    onSubmit: (data: FormData) => void;
    companies?: { id: string; name: string }[]; // New prop for company dropdown
    onAddCompany?: () => void; // Callback to trigger company creation
    defaultValues?: Partial<FormData>; // Optional default values for editing
    isSubmitting?: boolean; // Loading state for submit button
}

export function DynamicFormDialog({
    open,
    onOpenChange,
    formType,
    onSubmit,
    companies = [],
    onAddCompany,
    defaultValues,
    isSubmitting = false,
}: DynamicFormDialogProps) {
    // Get schema based on form type
    const getSchema = () => {
        switch (formType) {
            case "company":
                return companySchema;
            case "contact":
                return contactSchema;
            case "list":
                return listSchema;
        }
    };

    // Get title based on form type
    const getTitle = () => {
        switch (formType) {
            case "company":
                return "Add Company";
            case "contact":
                return "Add Contact";
            case "list":
                return "Add List";
        }
    };

    // Get description based on form type
    const getDescription = () => {
        switch (formType) {
            case "company":
                return "Add a new company to your CRM.";
            case "contact":
                return "Add a new contact to your CRM.";
            case "list":
                return "Create a new list for your contacts.";
        }
    };

    // Get default values based on form type
    const getDefaultValues = (): any => {
        switch (formType) {
            case "company":
                return { companyName: "", location: "" };
            case "contact":
                return { email: "", firstName: "", lastName: "", companyId: undefined, subscription: false };
            case "list":
                return { listName: "", description: "" };
        }
    };

    // Initialize form with appropriate schema
    const form = useForm<any>({
        resolver: zodResolver(getSchema() as any),
        defaultValues: defaultValues || getDefaultValues(),
    });

    // Reset form when defaultValues change (for editing)
    useEffect(() => {
        if (defaultValues) {
            form.reset(defaultValues);
        } else {
            form.reset(getDefaultValues());
        }
    }, [defaultValues, open]);

    const handleSubmit = (data: any) => {
        onSubmit(data);
        form.reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{getTitle()}</DialogTitle>
                    <DialogDescription>{getDescription()}</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        {/* Company Form Fields */}
                        {formType === "company" && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="companyName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Company Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter company name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Location</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter location" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        {/* Contact Form Fields */}
                        {formType === "contact" && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>First Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="John" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Last Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Doe" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="john.doe@example.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="companyId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Company</FormLabel>
                                            <div className="flex gap-2">
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="flex-1">
                                                            <SelectValue placeholder="Select a company" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {companies?.map((company) => (
                                                            <SelectItem key={company.id} value={company.id}>
                                                                {company.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {onAddCompany && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={onAddCompany}
                                                        title="Add New Company"
                                                    >
                                                        <span className="sr-only">Add Company</span>
                                                        +
                                                    </Button>
                                                )}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="subscription"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Subscription</FormLabel>
                                                <DialogDescription>
                                                    Is this contact subscribed?
                                                </DialogDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        {/* List Form Fields */}
                        {formType === "list" && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="listName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>List Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter list name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description (Optional)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter list description"
                                                    className="resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    form.reset();
                                    onOpenChange(false);
                                }}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
