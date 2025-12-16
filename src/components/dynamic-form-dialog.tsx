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
});

const listSchema = z.object({
    listName: z.string().min(1, "List name is required"),
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
}

export function DynamicFormDialog({
    open,
    onOpenChange,
    formType,
    onSubmit,
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
                return "Create a new list.";
        }
    };

    // Get default values based on form type
    const getDefaultValues = (): any => {
        switch (formType) {
            case "company":
                return { companyName: "", location: "" };
            case "contact":
                return { email: "", firstName: "", lastName: "" };
            case "list":
                return { listName: "" };
        }
    };

    // Initialize form with appropriate schema
    const form = useForm<any>({
        resolver: zodResolver(getSchema() as any),
        defaultValues: getDefaultValues(),
    });

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
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="Enter email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter first name" {...field} />
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
                                                <Input placeholder="Enter last name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        {/* List Form Fields */}
                        {formType === "list" && (
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
                        )}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    form.reset();
                                    onOpenChange(false);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Submit</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
