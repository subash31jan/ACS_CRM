"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";

export default function ListsImportExportPage() {
    const handleImport = () => {
        console.log("Import lists");
        // Add import logic here
    };

    const handleExport = () => {
        console.log("Export lists");
        // Add export logic here
    };

    return (
        <div className="flex flex-col gap-4 p-8">
            <div>
                <h1 className="text-3xl font-bold">Import/Export Lists</h1>
                <p className="text-muted-foreground">
                    Import or export your contact lists
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Import Lists</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Upload a CSV or Excel file to import lists into your CRM.
                        </p>
                        <Button onClick={handleImport} className="w-full">
                            <Upload className="mr-2 h-4 w-4" />
                            Import Lists
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Export Lists</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Download all your lists as a CSV or Excel file.
                        </p>
                        <Button onClick={handleExport} className="w-full" variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Export Lists
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
