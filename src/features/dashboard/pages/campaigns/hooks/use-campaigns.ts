"use client";

import { useState, useMemo } from "react";
import { Campaign, CampaignFilters } from "../types/campaign";
import { mockCampaigns } from "../data/mock-campaigns";
import { SortingState, PaginationState } from "@tanstack/react-table";

export function useCampaigns() {
    const [filters, setFilters] = useState<CampaignFilters>({
        status: "all",
        search: "",
        dateRange: {
            from: undefined,
            to: undefined,
        },
    });

    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    // Filter campaigns based on current filters
    const allCampaigns = useMemo(() => {
        let filtered = [...mockCampaigns];

        // Filter by status
        if (filters.status !== "all") {
            filtered = filtered.filter((campaign) => campaign.status === filters.status);
        }

        // Filter by search
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter((campaign) =>
                campaign.name.toLowerCase().includes(searchLower)
            );
        }

        // Filter by date range
        if (filters.dateRange.from) {
            filtered = filtered.filter(
                (campaign) => new Date(campaign.created_at) >= filters.dateRange.from!
            );
        }
        if (filters.dateRange.to) {
            filtered = filtered.filter(
                (campaign) => new Date(campaign.created_at) <= filters.dateRange.to!
            );
        }

        return filtered;
    }, [filters]);

    // Sort campaigns
    const sortedCampaigns = useMemo(() => {
        if (sorting.length === 0) return allCampaigns;

        const sorted = [...allCampaigns];
        const sort = sorting[0];

        sorted.sort((a, b) => {
            const aValue = a[sort.id as keyof Campaign];
            const bValue = b[sort.id as keyof Campaign];

            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            if (aValue < bValue) return sort.desc ? 1 : -1;
            if (aValue > bValue) return sort.desc ? -1 : 1;
            return 0;
        });

        return sorted;
    }, [allCampaigns, sorting]);

    // Paginate campaigns
    const campaigns = useMemo(() => {
        const start = pagination.pageIndex * pagination.pageSize;
        const end = start + pagination.pageSize;
        return sortedCampaigns.slice(start, end);
    }, [sortedCampaigns, pagination]);

    const pageCount = Math.ceil(sortedCampaigns.length / pagination.pageSize);

    const updateFilters = (newFilters: Partial<CampaignFilters>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    const handleSortingChange = (updater: any) => {
        setSorting(updater);
    };

    const handlePaginationChange = (updater: any) => {
        setPagination(updater);
    };

    const handleClearFilters = () => {
        setFilters({
            status: "all",
            search: "",
            dateRange: {
                from: undefined,
                to: undefined,
            },
        });
    };

    return {
        campaigns,
        allCampaigns,
        pageCount,
        filters,
        sorting,
        pagination,
        updateFilters,
        handleSortingChange,
        handlePaginationChange,
        handleClearFilters,
        isLoading: false,
        error: null,
    };
}
