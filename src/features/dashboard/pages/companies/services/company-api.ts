export interface CompanyApiResponse {
    company_id: string;
    company_name: string;
    location: string;
    created_at: string;
    updated_at: string;
}

export async function fetchCompanies(): Promise<CompanyApiResponse[]> {
    try {
        const response = await fetch("https://workflows.agilecyber.com/webhook/fetch", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: "companies"
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch companies: ${response.status}`);
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
        console.error("Error fetching companies:", error);
        throw error;
    }
}

export function mapApiResponseToCompany(apiCompany: CompanyApiResponse): import("../types/company").Company {
    return {
        id: apiCompany.company_id,
        companyNumber: apiCompany.company_id.substring(0, 8).toUpperCase(),
        companyName: apiCompany.company_name,
        email: "", // Not provided by API
        phone: "", // Not provided by API
        industry: "", // Not provided by API
        revenue: 0, // Not provided by API
        status: "active" as const,
        subscription: "Email", // Default value
        createdAt: apiCompany.created_at,
        updatedAt: apiCompany.updated_at,
        location: apiCompany.location,
    };
}


export async function createCompany(companyData: any): Promise<any> {
    try {
        const response = await fetch("https://workflows.agilecyber.com/webhook/create-contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(companyData),
        });

        if (!response.ok) {
            throw new Error(`Failed to create company: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating company:", error);
        throw error;
    }
}
