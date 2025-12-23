"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink, Link as LinkIcon } from "lucide-react";
import { LinkItem } from "../types/block-types";
import { suggestLinkLabel } from "../utils/transform-unlayer-design";

interface LinkLabelsDialogProps {
    open: boolean;
    links: LinkItem[];
    onSave: (labels: Map<string, string>) => void;
    onCancel: () => void;
}

export function LinkLabelsDialog({ open, links, onSave, onCancel }: LinkLabelsDialogProps) {
    const [labels, setLabels] = useState<Map<string, string>>(new Map());
    const [errors, setErrors] = useState<Set<string>>(new Set());

    useEffect(() => {
        // Initialize with suggested labels
        const initialLabels = new Map<string, string>();
        links.forEach((link) => {
            const suggested = suggestLinkLabel(link.url);
            initialLabels.set(link.id, link.link_label || suggested);
        });
        setLabels(initialLabels);
    }, [links]);

    const handleLabelChange = (linkId: string, value: string) => {
        const newLabels = new Map(labels);
        newLabels.set(linkId, value);
        setLabels(newLabels);

        // Remove error if value is provided
        if (value.trim()) {
            const newErrors = new Set(errors);
            newErrors.delete(linkId);
            setErrors(newErrors);
        }
    };

    const handleSave = () => {
        // Validate all links have labels
        const newErrors = new Set<string>();
        links.forEach((link) => {
            const label = labels.get(link.id);
            if (!label || !label.trim()) {
                newErrors.add(link.id);
            }
        });

        if (newErrors.size > 0) {
            setErrors(newErrors);
            return;
        }

        onSave(labels);
    };

    if (links.length === 0) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <LinkIcon className="h-5 w-5" />
                        Label Your Links
                        <Badge variant="secondary">{links.length}</Badge>
                    </DialogTitle>
                    <DialogDescription>
                        Provide descriptive labels for each link to help track engagement (e.g., "Demo", "Website", "Survey").
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[400px] pr-4">
                    <div className="space-y-4">
                        {links.map((link, index) => {
                            const hasError = errors.has(link.id);
                            return (
                                <div key={link.id} className="border rounded-lg p-4 space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant={link.type === 'button' ? 'default' : 'outline'}>
                                                    {link.type === 'button' ? 'Button' : 'Link'}
                                                </Badge>
                                                <span className="font-medium text-sm truncate" title={link.text}>
                                                    {link.text}
                                                </span>
                                            </div>
                                            <a
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 truncate"
                                                title={link.url}
                                            >
                                                {link.url}
                                                <ExternalLink className="h-3 w-3 flex-shrink-0" />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`label-${link.id}`}>
                                            Link Label <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id={`label-${link.id}`}
                                            placeholder="e.g., Demo, Website, Survey"
                                            value={labels.get(link.id) || ''}
                                            onChange={(e) => handleLabelChange(link.id, e.target.value)}
                                            className={hasError ? 'border-destructive' : ''}
                                        />
                                        {hasError && (
                                            <p className="text-xs text-destructive">
                                                Please provide a label for this link
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>

                <DialogFooter>
                    <Button variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>
                        Save & Continue
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
