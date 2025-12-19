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
