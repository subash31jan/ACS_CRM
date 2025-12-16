"use client";

export function SegmentsPage() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Company Segments</h1>
            </div>

            <div className="bg-card rounded-lg border p-6">
                <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                    <h3 className="text-lg font-semibold">Company Segments</h3>
                    <p className="text-muted-foreground mt-2 max-w-md text-sm">
                        This page allows you to create and manage company segments based on
                        industry, revenue, location, or custom criteria for targeted
                        marketing and analysis.
                    </p>
                </div>
            </div>
        </div>
    );
}
