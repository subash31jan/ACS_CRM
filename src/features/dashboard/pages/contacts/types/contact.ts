export type ContactStatus = 'active' | 'inactive' | 'pending' | 'blocked'; // Keeping for now if needed, but interface won't use it directly unless we map 'subscription' to it or similar. Actually, let's remove it if not used. But wait, filters might use it. 

// User didn't specify filters changes but "contact table... we do not need...".
// I'll define the interface as requested.

export interface Contact {
  contact_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  subscription: boolean;
  company_id: string | null;
  created_at: string;
  updated_at: string;

  // Optional for UI display if API returns joined data
  company_name?: string;
}

export interface ContactFilters {
  status: 'all' | 'subscribed' | 'unsubscribed'; // Adapted for subscription
  search: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
} 