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

export async function addContactsToList(listId: string, contactIds: string[]): Promise<any> {
    try {
        const response = await fetch("https://workflows.agilecyber.com/webhook/add-contacts-to-list", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                list_id: listId,
                contact_ids: contactIds,
            }),
        });

        if (response.status === 200) {
            try {
                return await response.json();
            } catch {
                return { success: true };
            }
        } else if (response.status === 400) {
            throw new Error("ALREADY_EXISTS");
        } else {
            throw new Error("GENERIC_ERROR");
        }
    } catch (error) {
        // console.error("Error adding contacts to list:", error); // Let the component handle logging or ignoring specific errors if needed
        throw error;
    }
}
