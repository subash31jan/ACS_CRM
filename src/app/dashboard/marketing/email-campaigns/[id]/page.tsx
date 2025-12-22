import { EmailCampaignBuilder } from "@/features/dashboard/pages/marketing/email-campaigns/email-campaign-builder";

interface PageProps {
    params: {
        id: string;
    };
}

export default function Page({ params }: PageProps) {
    return <EmailCampaignBuilder campaignId={params.id} />;
}
