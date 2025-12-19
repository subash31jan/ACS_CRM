export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent';

export interface Campaign {
    id: string;
    name: string;
    status: CampaignStatus;
    scheduled_at: string | null;
    created_at: string;
}

export interface CampaignFilters {
    status: CampaignStatus | 'all';
    search: string;
    dateRange: {
        from: Date | undefined;
        to: Date | undefined;
    };
}
