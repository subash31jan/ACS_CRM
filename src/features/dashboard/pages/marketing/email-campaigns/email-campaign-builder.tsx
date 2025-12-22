"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchLists } from "@/features/dashboard/pages/lists/services/list-api";
import { addListsToCampaign } from "@/features/dashboard/pages/campaigns/services/campaign-api";
import { List } from "@/features/dashboard/pages/lists/types/list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface EmailCampaignBuilderProps {
    campaignId: string;
}

export function EmailCampaignBuilder({ campaignId }: EmailCampaignBuilderProps) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [lists, setLists] = useState<List[]>([]);
    const [selectedListIds, setSelectedListIds] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadLists = async () => {
            try {
                setIsLoading(true);
                const data = await fetchLists();
                setLists(data);
            } catch (err) {
                console.error("Failed to load lists", err);
                setError("Failed to load lists. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        if (currentStep === 1) {
            loadLists();
        }
    }, [currentStep]);

    const toggleList = (listId: string) => {
        setSelectedListIds(prev =>
            prev.includes(listId)
                ? prev.filter(id => id !== listId)
                : [...prev, listId]
        );
    };

    const handleNext = async () => {
        if (currentStep === 1 && selectedListIds.length > 0) {
            try {
                setIsSubmitting(true);
                await addListsToCampaign(campaignId, selectedListIds);

                console.log(`Lists ${selectedListIds.join(', ')} added to campaign ${campaignId}`);
                // toast.success("Lists added to campaign successfully"); // Assuming toast is available, or use console for now

                setCurrentStep(prev => prev + 1);
            } catch (err) {
                console.error("Error adding lists to campaign:", err);
                // toast.error("Failed to add lists. Please try again.");
                setError("Failed to update campaign. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    return (
        <div className="container mx-auto max-w-5xl py-6 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Campaign Builder</h1>
                    <p className="text-muted-foreground">Setup your email campaign options</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-sm py-1">Draft</Badge>
                </div>
            </div>

            {/* Steps Indicator */}
            <div className="flex items-center gap-4 border-b pb-4 overflow-x-auto">
                {['Audience', 'Setup', 'Design', 'Review'].map((step, index) => {
                    const stepNum = index + 1;
                    const isActive = stepNum === currentStep;
                    const isCompleted = stepNum < currentStep;

                    return (
                        <div key={step} className={cn("flex items-center gap-2", isActive ? "text-primary font-semibold" : "text-muted-foreground")}>
                            <div className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-full border text-sm",
                                isActive ? "border-primary bg-primary text-primary-foreground" :
                                    isCompleted ? "border-primary bg-primary/10 text-primary" : "border-muted"
                            )}>
                                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
                            </div>
                            <span className="whitespace-nowrap">{step}</span>
                            {index < 3 && <div className="h-[1px] w-8 bg-border hidden sm:block" />}
                        </div>
                    );
                })}
            </div>

            <div className="grid gap-6">
                {currentStep === 1 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Select Audience</CardTitle>
                            <CardDescription>
                                Choose the contact lists you want to send this campaign to.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : error ? (
                                <div className="flex items-center justify-center py-12 text-destructive">
                                    {error}
                                </div>
                            ) : lists.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
                                    <p className="text-muted-foreground">No lists found. Please create a list first.</p>
                                    <Button variant="outline" onClick={() => router.push('/dashboard/lists')}>
                                        Go to Lists
                                    </Button>
                                </div>
                            ) : (
                                <ScrollArea className="h-[400px] pr-4">
                                    <div className="grid gap-3">
                                        {lists.map((list) => {
                                            const isSelected = selectedListIds.includes(list.listId);
                                            return (
                                                <div key={list.listId}
                                                    onClick={() => toggleList(list.listId)}
                                                    className={cn(
                                                        "flex items-start space-x-3 border p-4 rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                                                        isSelected ? "border-primary bg-primary/5" : ""
                                                    )}
                                                >
                                                    <Checkbox
                                                        id={list.listId}
                                                        checked={isSelected}
                                                        onCheckedChange={() => toggleList(list.listId)}
                                                    />
                                                    <div className="grid gap-1.5 w-full">
                                                        <Label htmlFor={list.listId} className="font-semibold text-base cursor-pointer pointer-events-none">
                                                            {list.listName}
                                                        </Label>
                                                        <div className="flex items-center gap-4 text-sm text-muted-foreground pointer-events-none">
                                                            <span>{list.contactsCount} contacts</span>
                                                            <span>•</span>
                                                            <span>Created on {new Date(list.creationDate).toLocaleDateString()}</span>
                                                        </div>
                                                        {list.description && (
                                                            <p className="text-sm text-muted-foreground line-clamp-1 pointer-events-none">{list.description}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </ScrollArea>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-between border-t p-6">
                            <Button variant="outline" onClick={() => router.back()} disabled={isSubmitting}>Cancel</Button>
                            <Button onClick={handleNext} disabled={selectedListIds.length === 0 || isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Next Step <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {currentStep > 1 && (
                    <div className="flex flex-col items-center justify-center py-12 border rounded-lg border-dashed">
                        <p className="text-muted-foreground">Next steps coming soon...</p>
                        <Button variant="outline" className="mt-4" onClick={() => setCurrentStep(1)}>Back to Audience</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
