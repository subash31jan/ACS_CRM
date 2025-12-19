"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useCampaigns } from "./hooks/use-campaigns";
import { CampaignsTable } from "./components/campaigns-table";
import { CampaignsFilters } from "./components/campaigns-filters";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Campaign } from "./types/campaign";

export function CampaignsPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
    const [deletingCampaign, setDeletingCampaign] = useState<Campaign | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedbackModal, setFeedbackModal] = useState<{
        open: boolean;
        title: string;
        description: string;
    }>({
        open: false,
        title: "",
        description: "",
    });

    const [formData, setFormData] = useState({
        name: "",
        from_name: "",
        from_email: "",
        reply_to_email: "",
        status: "draft" as const,
    });

    const {
        campaigns,
        allCampaigns,
        pageCount,
        filters,
        sorting,
        pagination,
        updateFilters,
        handleSortingChange,
        handlePaginationChange,
        handleClearFilters,
        isLoading,
        error,
    } = useCampaigns();

    const isEmpty = allCampaigns.length === 0;

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("https://workflows.agilecyber.com/webhook/create-a-campaign", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`Webhook failed with status: ${response.status}`);
            }

            // We ignore the response body for now as requested
            console.log("Campaign form submitted to webhook:", formData);

            setFeedbackModal({
                open: true,
                title: "Success",
                description: "Campaign created successfully!",
            });

            setIsFormOpen(false);
            setFormData({
                name: "",
                from_name: "",
                from_email: "",
                reply_to_email: "",
                status: "draft",
            });
        } catch (error) {
            console.error("Error submitting campaign:", error);
            setFeedbackModal({
                open: true,
                title: "Error",
                description: "Failed to create campaign. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditCampaign = (campaign: Campaign) => {
        // Empty for now
        console.log("Edit campaign:", campaign);
    };

    const handleDeleteCampaign = (campaign: Campaign) => {
        // Empty for now
        console.log("Delete campaign:", campaign);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Campaigns</h1>
                <div className="flex items-center gap-4">
                    <Button onClick={() => setIsFormOpen(true)}>
                        <Plus className="size-4" />
                        New Campaign
                    </Button>
                </div>
            </div>

            <div className="rounded-lg border bg-card">
                <div className="border-b p-4">
                    <CampaignsFilters filters={filters} onFiltersChange={updateFilters} />
                </div>
                <div className="p-3">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center gap-2">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                                <p className="text-sm text-muted-foreground">Loading campaigns...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <p className="text-sm font-medium text-destructive">Failed to load campaigns</p>
                                <p className="text-xs text-muted-foreground">{error}</p>
                            </div>
                        </div>
                    ) : (
                        <CampaignsTable
                            campaigns={campaigns}
                            totalRows={allCampaigns.length}
                            sorting={sorting}
                            onSort={handleSortingChange}
                            pagination={pagination}
                            onPaginationChange={handlePaginationChange}
                            pageCount={pageCount}
                            onEdit={handleEditCampaign}
                            onDelete={handleDeleteCampaign}
                        />
                    )}
                </div>
            </div>

            {isEmpty && (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
                    <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                        <h3 className="mt-4 text-lg font-semibold">No campaigns found</h3>
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

            {/* Create Campaign Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Campaign</DialogTitle>
                        <DialogDescription>
                            Create a new campaign. Fill in the details below.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleFormSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Campaign Name <span className="text-destructive">*</span></Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter campaign name"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="from_name">From Name <span className="text-destructive">*</span></Label>
                                <Input
                                    id="from_name"
                                    value={formData.from_name}
                                    onChange={(e) => setFormData({ ...formData, from_name: e.target.value })}
                                    placeholder="e.g. John Doe"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="from_email">From Email <span className="text-destructive">*</span></Label>
                                <Input
                                    id="from_email"
                                    type="email"
                                    value={formData.from_email}
                                    onChange={(e) => setFormData({ ...formData, from_email: e.target.value })}
                                    placeholder="e.g. john@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="reply_to_email">Reply-to Email (Optional)</Label>
                                <Input
                                    id="reply_to_email"
                                    type="email"
                                    value={formData.reply_to_email}
                                    onChange={(e) => setFormData({ ...formData, reply_to_email: e.target.value })}
                                    placeholder="e.g. support@example.com"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Create Campaign</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

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
        </div>
    );
}
