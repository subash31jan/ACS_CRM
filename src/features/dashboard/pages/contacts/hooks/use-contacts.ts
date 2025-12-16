import { useState, useMemo } from "react";
import { Contact, ContactFilters } from "@/features/dashboard/pages/contacts/types/contact";
import { mockContacts } from "../data/mock-contacts";
import {
  SortingState,
  PaginationState,
  OnChangeFn,
} from "@tanstack/react-table";

interface UseContactsProps {
  initialContacts?: Contact[];
}

export function useContacts({ initialContacts = mockContacts }: UseContactsProps = {}) {
  const [filters, setFilters] = useState<ContactFilters>({
    status: "all",
    search: "",
    dateRange: {
      from: undefined,
      to: undefined,
    },
  });

  const [sorting, setSorting] = useState<SortingState>([
    { id: "dateJoined", desc: true },
  ]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const filteredContacts = useMemo(() => {
    return initialContacts.filter((contact) => {
      // Status filter
      if (filters.status !== "all" && contact.status !== filters.status) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const searchableFields = [
          contact.contactNumber,
          contact.fullName,
          contact.email,
          contact.company,
          contact.location,
        ].map((field) => field.toLowerCase());

        if (!searchableFields.some((field) => field.includes(searchLower))) {
          return false;
        }
      }

      // Date range filter - using dateJoined for filtering
      if (filters.dateRange.from || filters.dateRange.to) {
        const contactJoinDate = new Date(contact.dateJoined);
        if (filters.dateRange.from && contactJoinDate < filters.dateRange.from) {
          return false;
        }
        if (filters.dateRange.to && contactJoinDate > filters.dateRange.to) {
          return false;
        }
      }

      return true;
    });
  }, [initialContacts, filters]);

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
      a: number | string | Date,
      b: number | string | Date,
      desc: boolean
    ): number => {
      const direction = desc ? -1 : 1;

      // Handle different value types
      if (a === b) return 0;

      // Handle null/undefined values
      if (a == null) return direction;
      if (b == null) return -direction;

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

      // Default comparison (converts to string)
      return String(a).localeCompare(String(b)) * direction;
    };

    // Apply sorting
    const sortedContacts = [...filteredContacts].sort((a, b) => {
      // Handle multi-sorting using sortingState array
      for (const sort of sorting) {
        const key = sort.id as keyof Contact;
        const compared = compareValues(a[key], b[key], sort.desc);
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
    // Update handlers
    updateFilters,
    handleSortingChange,
    handlePaginationChange,
    handleClearFilters,
  };
} 