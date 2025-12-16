export type ContactStatus = 'active' | 'inactive' | 'pending' | 'blocked';

export interface Contact {
  id: string;
  contactNumber: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  totalSpent: number;
  status: ContactStatus;
  dateJoined: string;
  lastPurchase: string;
  location: string;
}

export interface ContactFilters {
  status: ContactStatus | 'all';
  search: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
} 