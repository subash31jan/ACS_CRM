"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink, Copy, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

export interface CampaignLink {
    id: string;
    label: string;
    destination_url: string;
    link_key: string;
}

interface CampaignLinksPanelProps {
    links: CampaignLink[];
    campaignId: string;
}

export function CampaignLinksPanel({ links, campaignId }: CampaignLinksPanelProps) {
    const copyLinkKey = (linkKey: string) => {
        navigator.clipboard.writeText(linkKey);
        toast.success("Link key copied to clipboard");
    };

    if (links.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <LinkIcon className="h-5 w-5" />
                        Tracked Links
                        <Badge variant="secondary">0</Badge>
                    </CardTitle>
                    <CardDescription>
                        No links found in your email. Links will be automatically tracked when you save.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <LinkIcon className="h-5 w-5" />
                    Tracked Links
                    <Badge variant="secondary">{links.length}</Badge>
                </CardTitle>
                <CardDescription>
                    All links in your email will be tracked for clicks and engagement.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-3">
                        {links.map((link, index) => (
                            <div
                                key={link.id || index}
                                className="border rounded-lg p-3 space-y-2 hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate" title={link.label}>
                                            {link.label || "Untitled Link"}
                                        </p>
                                        <a
                                            href={link.destination_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 truncate"
                                            title={link.destination_url}
                                        >
                                            {link.destination_url}
                                            <ExternalLink className="h-3 w-3 flex-shrink-0" />
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 text-xs bg-muted px-2 py-1 rounded truncate" title={link.link_key}>
                                        {link.link_key}
                                    </code>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => copyLinkKey(link.link_key)}
                                        className="h-7 px-2"
                                    >
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
