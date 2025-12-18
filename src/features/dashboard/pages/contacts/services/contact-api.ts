import { Contact } from "../types/contact";

export interface ContactApiResponse {
    contact_id: string;
    email: string;
    first_name: string;
    last_name: string;
    subscription: boolean;
    company_id: string;
    created_at: string;
    updated_at: string;
    // Optional joined fields if API returns them
    company_name?: string;
}

export async function fetchContacts(): Promise<ContactApiResponse[]> {
    try {
        const response = await fetch("https://workflows.agilecyber.com/webhook/fetch", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: "contacts"
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch contacts: ${response.status}`);
        }

        const data = await response.json();

        // Handle both array and single object responses
        if (Array.isArray(data)) {
            return data;
        } else if (data && typeof data === 'object') {
            return [data];
        }

        return [];
    } catch (error) {
        console.error("Error fetching contacts:", error);
        throw error;
    }
}

export function mapApiResponseToContact(apiContact: ContactApiResponse): Contact {
    return {
        contact_id: apiContact.contact_id,
        email: apiContact.email,
        first_name: apiContact.first_name,
        last_name: apiContact.last_name,
        subscription: apiContact.subscription,
        company_id: apiContact.company_id,
        created_at: apiContact.created_at,
        updated_at: apiContact.updated_at,
        company_name: apiContact.company_name, // Map if available
    };
}

export async function createContact(contactData: any): Promise<any> {
    try {
        const response = await fetch("https://workflows.agilecyber.com/webhook/create-a-contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...contactData,
                cred: "create"
            }),
        });

        if (!response.ok) {
            let errorMessage = `Failed to create contact: ${response.status}`;
            try {
                const errorData = await response.json(); // Try to parse JSON error response
                if (typeof errorData === 'string') {
                    errorMessage = errorData;
                } else if (errorData?.message) {
                    errorMessage = errorData.message;
                } else {
                    errorMessage = JSON.stringify(errorData);
                }
            } catch (e) {
                // If text response
                try {
                    const textError = await response.text();
                    if (textError) errorMessage = textError;
                } catch (textErr) {
                    // ignore
                }
            }

            if (response.status === 400 && errorMessage.toLowerCase().includes("already exists")) {
                throw new Error("DUPLICATE_CONTACT");
            }

            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating contact:", error);
        throw error;
    }
}

export async function editContact(contactId: string, contactData: any): Promise<any> {
    try {
        const response = await fetch("https://workflows.agilecyber.com/webhook/create-a-contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...contactData,
                contact_id: contactId,
                cred: "edit"
            }),
        });

        if (!response.ok) {
            let errorMessage = `Failed to edit contact: ${response.status}`;
            try {
                const errorData = await response.json();
                if (typeof errorData === 'string') {
                    errorMessage = errorData;
                } else if (errorData?.message) {
                    errorMessage = errorData.message;
                } else {
                    errorMessage = JSON.stringify(errorData);
                }
            } catch (e) {
                try {
                    const textError = await response.text();
                    if (textError) errorMessage = textError;
                } catch (textErr) {
                    // ignore
                }
            }

            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error editing contact:", error);
        throw error;
    }
}

export async function deleteContact(contactId: string): Promise<any> {
    try {
        const response = await fetch("https://workflows.agilecyber.com/webhook/create-a-contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contact_id: contactId,
                cred: "delete"
            }),
        });

        if (!response.ok) {
            let errorMessage = `Failed to delete contact: ${response.status}`;
            try {
                const errorData = await response.json();
                if (typeof errorData === 'string') {
                    errorMessage = errorData;
                } else if (errorData?.message) {
                    errorMessage = errorData.message;
                } else {
                    errorMessage = JSON.stringify(errorData);
                }
            } catch (e) {
                try {
                    const textError = await response.text();
                    if (textError) errorMessage = textError;
                } catch (textErr) {
                    // ignore
                }
            }

            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error deleting contact:", error);
        throw error;
    }
}
