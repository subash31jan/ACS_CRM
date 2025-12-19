"use client";

import {
    CampaignFilters,
    CampaignStatus,
} from "@/features/dashboard/pages/campaigns/types/campaign";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/shared/date-picker-with-range";
import { Search } from "lucide-react";

interface CampaignsFiltersProps {
    filters: CampaignFilters;
    onFiltersChange: (filters: Partial<CampaignFilters>) => void;
}

const STATUS_OPTIONS: { label: string; value: CampaignStatus | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Draft", value: "draft" },
    { label: "Scheduled", value: "scheduled" },
    { label: "Sending", value: "sending" },
    { label: "Sent", value: "sent" },
];

export function CampaignsFilters({
    filters,
    onFiltersChange,
}: CampaignsFiltersProps) {
    return (
        <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
            <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                    placeholder="Search campaigns..."
                    value={filters.search}
                    onChange={(e) => onFiltersChange({ search: e.target.value })}
                    className="pl-9"
                />
            </div>
            <div className="flex flex-wrap gap-4">
                <Select
                    value={filters.status}
                    onValueChange={(value) =>
                        onFiltersChange({ status: value as CampaignStatus | "all" })
                    }
                >
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        {STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <DatePickerWithRange
                    className="w-full md:w-auto"
                    value={{
                        from: filters.dateRange.from,
                        to: filters.dateRange.to,
                    }}
                    onChange={(dateRange) =>
                        onFiltersChange({
                            dateRange: dateRange
                                ? { from: dateRange.from, to: dateRange.to }
                                : { from: undefined, to: undefined },
                        })
                    }
                />
            </div>
        </div>
    );
}
