export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent';

export interface Campaign {
    id: string;
    name: string;
    status: CampaignStatus;
    scheduled_at: string | null;
    sending_started_at: string | null;
    sent_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface CampaignFilters {
    status: CampaignStatus | 'all';
    search: string;
    dateRange: {
        from: Date | undefined;
        to: Date | undefined;
    };
}
