"use client";

import { useState, useMemo, useEffect } from "react";
import { Campaign, CampaignFilters } from "../types/campaign";
import { SortingState, PaginationState } from "@tanstack/react-table";

export function useCampaigns() {
    const [campaignsData, setCampaignsData] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    // Fetch campaigns on mount
    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("https://workflows.agilecyber.com/webhook/fetch-campaigns");

                if (response.status === 201) {
                    setCampaignsData([]);
                    setIsLoading(false);
                    return;
                }

                if (response.status === 500) {
                    const text = await response.text();
                    // Check for empty string or empty JSON object/array
                    if (!text || text.trim() === "" || text.trim() === "{}" || text.trim() === "[]") {
                        setCampaignsData([]);
                        setIsLoading(false);
                        return;
                    }
                    throw new Error(`Failed to fetch campaigns: ${response.status}`);
                }

                if (!response.ok) {
                    throw new Error(`Failed to fetch campaigns: ${response.status}`);
                }

                const data = await response.json();

                // Check for [{}] response which indicates empty data
                if (Array.isArray(data) && data.length === 1 && Object.keys(data[0]).length === 0) {
                    setCampaignsData([]);
                }
                // Ensure data is an array
                else if (Array.isArray(data)) {
                    setCampaignsData(data);
                } else {
                    console.error("Fetched data is not an array:", data);
                    setCampaignsData([]);
                    // Optional: setError("Invalid data format received");
                }
            } catch (err) {
                console.error("Error fetching campaigns:", err);
                setError(err instanceof Error ? err.message : "Failed to fetch campaigns");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    // Filter campaigns based on current filters
    const allCampaigns = useMemo(() => {
        let filtered = [...campaignsData];

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
    }, [filters, campaignsData]);

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
        isLoading,
        error,
    };
}
