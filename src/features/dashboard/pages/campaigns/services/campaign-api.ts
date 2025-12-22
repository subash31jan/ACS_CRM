import { Campaign } from "../types/campaign";

export async function createCampaign(data: any): Promise<Campaign> {
    // Empty function for now as requested
    console.log("Create campaign called with data:", data);
    throw new Error("Campaign creation not implemented yet");
}

export async function editCampaign(id: string, data: any): Promise<Campaign> {
    // Empty function for now
    console.log("Edit campaign called with id:", id, "data:", data);
    throw new Error("Campaign editing not implemented yet");
}

export async function deleteCampaign(id: string): Promise<void> {
    // Empty function for now
    console.log("Delete campaign called with id:", id);
    throw new Error("Campaign deletion not implemented yet");
}

export async function addListsToCampaign(campaignId: string, listIds: string[]): Promise<any> {
    try {
        const response = await fetch("https://workflows.agilecyber.com/webhook/add-lists-to-campaign", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                campaign_id: campaignId,
                list_ids: listIds,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to add lists to campaign: ${response.status}`);
        }

        // Return empty object if json parsing fails (some webhooks might return 200 OK with empty body)
        // or attempt to parse if content-length > 0
        const text = await response.text();
        return text ? JSON.parse(text) : { success: true };
    } catch (error) {
        console.error("Error adding lists to campaign:", error);
        throw error;
    }
}
