import { useState, useMemo, useEffect } from "react";
import { Contact, ContactFilters } from "@/features/dashboard/pages/contacts/types/contact";
import { fetchContacts, mapApiResponseToContact } from "../services/contact-api";
import {
  SortingState,
  PaginationState,
  OnChangeFn,
} from "@tanstack/react-table";

interface UseContactsProps {
  initialContacts?: Contact[];
}

export function useContacts({ initialContacts }: UseContactsProps = {}) {
  // Initialize with empty array or props, no mock data fallback
  const [contacts, setContacts] = useState<Contact[]>(initialContacts || []);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<ContactFilters>({
    status: "all",
    search: "",
    dateRange: {
      from: undefined,
      to: undefined,
    },
  });

  const [sorting, setSorting] = useState<SortingState>([
    { id: "created_at", desc: true },
  ]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Fetch contacts from API on mount
  useEffect(() => {
    const loadContacts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const apiContacts = await fetchContacts();
        const mappedContacts = apiContacts.map(mapApiResponseToContact);
        setContacts(mappedContacts);
      } catch (err) {
        console.error("Failed to fetch contacts:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch contacts");
        // Do NOT fallback to mock data
        setContacts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadContacts();
  }, []);

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      // Status filter (Subscription)
      if (filters.status !== "all") {
        const isSubscribed = contact.subscription;
        if (filters.status === "subscribed" && !isSubscribed) return false;
        if (filters.status === "unsubscribed" && isSubscribed) return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const searchableFields = [
          contact.contact_id,
          contact.first_name || '',
          contact.last_name || '',
          contact.email,
          contact.company_name || '', // Use company_name for search if available
        ].map((field) => field.toLowerCase());

        if (!searchableFields.some((field) => field.includes(searchLower))) {
          return false;
        }
      }

      // Date range filter - using created_at
      if (filters.dateRange.from || filters.dateRange.to) {
        const contactCreatedDate = new Date(contact.created_at);
        if (filters.dateRange.from && contactCreatedDate < filters.dateRange.from) {
          return false;
        }
        if (filters.dateRange.to && contactCreatedDate > filters.dateRange.to) {
          return false;
        }
      }

      return true;
    });
  }, [contacts, filters]);

  // For TanStack table, we need to handle pagination and sorting separately
  const paginatedAndSortedContacts = useMemo(() => {
    // Early return if no filters
    if (filteredContacts.length === 0) return [];

    // Skip sorting if no sort criteria
    if (sorting.length === 0) {
      // Just apply pagination
      const startIdx = pagination.pageIndex * pagination.pageSize;
      const endIdx = startIdx + pagination.pageSize;
      return filteredContacts.slice(startIdx, endIdx);
    }

    // Create a sorting function that makes comparisons based on field type
    const compareValues = (
      a: number | string | Date | boolean | null | undefined,
      b: number | string | Date | boolean | null | undefined,
      desc: boolean
    ): number => {
      const direction = desc ? -1 : 1;

      // Handle different value types
      if (a === b) return 0;

      // Handle null/undefined values
      if (a == null) return direction; // null or undefined comes after non-null/undefined
      if (b == null) return -direction; // non-null/undefined comes before null/undefined

      // Check if values are dates (try to detect ISO strings)
      if (typeof a === "string" && typeof b === "string") {
        // ISO date format detection (more reliable than checking for "T")
        const isDateA = /^\d{4}-\d{2}-\d{2}(T|\s)/.test(a);
        const isDateB = /^\d{4}-\d{2}-\d{2}(T|\s)/.test(b);

        if (isDateA && isDateB) {
          const dateA = new Date(a).getTime();
          const dateB = new Date(b).getTime();
          return (dateA - dateB) * direction;
        }

        // Regular string comparison
        return a.localeCompare(b) * direction;
      }

      // Number comparison
      if (typeof a === "number" && typeof b === "number") {
        return (a - b) * direction;
      }

      // Boolean comparison
      if (typeof a === "boolean" && typeof b === "boolean") {
        return (a === b ? 0 : a ? 1 : -1) * direction;
      }

      // Default comparison (converts to string)
      return String(a).localeCompare(String(b)) * direction;
    };

    // Apply sorting
    const sortedContacts = [...filteredContacts].sort((a, b) => {
      // Handle multi-sorting using sortingState array
      for (const sort of sorting) {
        // Special handling for computed/joined fields if needed, 
        // e.g. "name" which isn't a direct field but can be sorted by first_name usually?
        // Tanstack table sends the accessorKey or id. 
        // If sorting by "name" column (which has no accessorKey but id="name"), we need to handle it.
        // But our Columns have ids matching keys mostly.

        // If sorting by "name", use first_name
        let key = sort.id;
        if (key === 'name') key = 'first_name'; // approximation

        const keyTyped = key as keyof Contact;
        if (!(keyTyped in a)) continue; // Skip if key invalid

        const valA = a[keyTyped];
        const valB = b[keyTyped];

        const compared = compareValues(valA, valB, sort.desc);
        if (compared !== 0) return compared;
      }
      return 0;
    });

    // Apply pagination
    const startIdx = pagination.pageIndex * pagination.pageSize;
    const endIdx = startIdx + pagination.pageSize;
    return sortedContacts.slice(startIdx, endIdx);
  }, [filteredContacts, sorting, pagination]);

  const updateFilters = (newFilters: Partial<ContactFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    // Reset to first page when filters change
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
    setSorting(
      updaterOrValue instanceof Function
        ? updaterOrValue(sorting)
        : updaterOrValue
    );
  };

  const handlePaginationChange: OnChangeFn<PaginationState> = (
    updaterOrValue
  ) => {
    setPagination(
      updaterOrValue instanceof Function
        ? updaterOrValue(pagination)
        : updaterOrValue
    );
  };

  const handleClearFilters = () => {
    setFilters({
      status: "all",
      search: "",
      dateRange: { from: undefined, to: undefined },
    });
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  return {
    // Raw filtered contacts (no pagination applied)
    allContacts: filteredContacts,
    // Contacts with pagination and sorting applied
    contacts: paginatedAndSortedContacts,
    // Total count for pagination
    pageCount: Math.ceil(filteredContacts.length / pagination.pageSize),
    // States
    filters,
    sorting,
    pagination,
    isLoading, // Export isLoading
    error, // Export error
    // Update handlers
    updateFilters,
    handleSortingChange,
    handlePaginationChange,
    handleClearFilters,
  };
}