export interface ListApiResponse {
    list_id: string;
    list_name: string;
    list_description: string;
    contacts_count: number;
    created_at: string;
    updated_at: string;
}
// ...




// ... (fetchLists remains the same)



export async function fetchLists(): Promise<import("../types/list").List[]> {
    try {
        const response = await fetch("https://workflows.agilecyber.com/webhook/fetch-all-lists", {
            method: "POST", // Most of these webhooks seem to be POST
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch lists: ${response.status}`);
        }

        const data = await response.json();

        let lists: ListApiResponse[] = [];
        if (Array.isArray(data)) {
            lists = data;
        } else if (data && typeof data === 'object') {
            lists = [data]; // Handle single object response if necessary
        }

        return lists.map(mapApiResponseToList);
    } catch (error) {
        console.error("Error fetching lists:", error);
        throw error;
    }
}

export function mapApiResponseToList(apiList: ListApiResponse): import("../types/list").List {
    return {
        listId: apiList.list_id,
        listName: apiList.list_name,
        contactsCount: apiList.contacts_count,
        creationDate: apiList.created_at,
        updatedAt: apiList.updated_at,
        description: apiList.list_description,
        tags: [],
    };
}

export async function createList(listData: any): Promise<any> {
    try {
        const response = await fetch("https://workflows.agilecyber.com/webhook/create-a-list", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(listData),
        });

        if (!response.ok) {
            throw new Error(`Failed to create list: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating list:", error);
        throw error;
    }
}
