"use client";

export function ContactInsightsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Contact Insights</h1>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold">Contact Analytics</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            View detailed analytics about your contacts. Understand contact behavior, preferences, and purchasing patterns.
          </p>
        </div>
      </div>
    </div>
  );
} 