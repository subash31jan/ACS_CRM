export type CompanyStatus = 'active' | 'inactive' | 'pending' | 'blocked';

export interface Company {
    id: string;
    companyNumber: string;
    companyName: string;
    email: string;
    phone: string;
    industry: string;
    revenue: number;
    status: CompanyStatus;
    subscription: string;
    createdAt: string;
    updatedAt: string;
    location: string;
}

export interface CompanyFilters {
    status: CompanyStatus | 'all';
    search: string;
    dateRange: {
        from: Date | undefined;
        to: Date | undefined;
    };
}
