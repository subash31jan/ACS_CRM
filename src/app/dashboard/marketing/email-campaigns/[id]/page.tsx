import { EmailCampaignBuilder } from "@/features/dashboard/pages/marketing/email-campaigns/email-campaign-builder";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;
    return <EmailCampaignBuilder campaignId={id} />;
}
