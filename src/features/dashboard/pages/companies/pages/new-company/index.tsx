"use client";

export function NewCompanyPage() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">New Company</h1>
            </div>

            <div className="bg-card rounded-lg border p-6">
                <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                    <h3 className="text-lg font-semibold">New Company</h3>
                    <p className="text-muted-foreground mt-2 max-w-md text-sm">
                        This page allows you to add a new company to the system. Fill in
                        the company details and submit to create a new record.
                    </p>
                </div>
            </div>
        </div>
    );
}
