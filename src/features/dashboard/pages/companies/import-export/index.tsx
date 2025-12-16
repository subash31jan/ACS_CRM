"use client";

export function ImportExportPage() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Import/Export Companies</h1>
            </div>

            <div className="bg-card rounded-lg border p-6">
                <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                    <h3 className="text-lg font-semibold">Import/Export Companies</h3>
                    <p className="text-muted-foreground mt-2 max-w-md text-sm">
                        This page allows you to import companies from CSV or Excel files,
                        and export your company data for backup or analysis purposes.
                    </p>
                </div>
            </div>
        </div>
    );
}
