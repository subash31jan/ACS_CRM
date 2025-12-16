import { useState, useMemo } from "react";
import { Company, CompanyFilters } from "@/features/dashboard/pages/companies/types/company";
import { mockCompanies } from "../data/mock-companies";
import {
    SortingState,
    PaginationState,
    OnChangeFn,
} from "@tanstack/react-table";

interface UseCompaniesProps {
    initialCompanies?: Company[];
}

export function useCompanies({ initialCompanies = mockCompanies }: UseCompaniesProps = {}) {
    const [filters, setFilters] = useState<CompanyFilters>({
        status: "all",
        search: "",
        dateRange: {
            from: undefined,
            to: undefined,
        },
    });

    const [sorting, setSorting] = useState<SortingState>([
        { id: "dateAdded", desc: true },
    ]);

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const filteredCompanies = useMemo(() => {
        return initialCompanies.filter((company) => {
            // Status filter
            if (filters.status !== "all" && company.status !== filters.status) {
                return false;
            }

            // Search filter
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const searchableFields = [
                    company.companyNumber,
                    company.companyName,
                    company.email,
                    company.industry,
                    company.location,
                ].map((field) => field.toLowerCase());

                if (!searchableFields.some((field) => field.includes(searchLower))) {
                    return false;
                }
            }

            // Date range filter - using dateAdded for filtering
            if (filters.dateRange.from || filters.dateRange.to) {
                const companyAddedDate = new Date(company.dateAdded);
                if (filters.dateRange.from && companyAddedDate < filters.dateRange.from) {
                    return false;
                }
                if (filters.dateRange.to && companyAddedDate > filters.dateRange.to) {
                    return false;
                }
            }

            return true;
        });
    }, [initialCompanies, filters]);

    // For TanStack table, we need to handle pagination and sorting separately
    const paginatedAndSortedCompanies = useMemo(() => {
        // Early return if no filters
        if (filteredCompanies.length === 0) return [];

        // Skip sorting if no sort criteria
        if (sorting.length === 0) {
            // Just apply pagination
            const startIdx = pagination.pageIndex * pagination.pageSize;
            const endIdx = startIdx + pagination.pageSize;
            return filteredCompanies.slice(startIdx, endIdx);
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
        const sortedCompanies = [...filteredCompanies].sort((a, b) => {
            // Handle multi-sorting using sortingState array
            for (const sort of sorting) {
                const key = sort.id as keyof Company;
                const compared = compareValues(a[key], b[key], sort.desc);
                if (compared !== 0) return compared;
            }
            return 0;
        });

        // Apply pagination
        const startIdx = pagination.pageIndex * pagination.pageSize;
        const endIdx = startIdx + pagination.pageSize;
        return sortedCompanies.slice(startIdx, endIdx);
    }, [filteredCompanies, sorting, pagination]);

    const updateFilters = (newFilters: Partial<CompanyFilters>) => {
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
        // Raw filtered companies (no pagination applied)
        allCompanies: filteredCompanies,
        // Companies with pagination and sorting applied
        companies: paginatedAndSortedCompanies,
        // Total count for pagination
        pageCount: Math.ceil(filteredCompanies.length / pagination.pageSize),
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
