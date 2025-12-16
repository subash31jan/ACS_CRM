import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        console.log("API route received data:", body);

        // Forward the request to the webhook
        const webhookResponse = await fetch(
            "https://workflows.agilecyber.com/webhook/create-contact",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            }
        );

        const responseText = await webhookResponse.text();
        console.log("Webhook response:", responseText);

        if (!webhookResponse.ok) {
            return NextResponse.json(
                { error: "Webhook request failed", details: responseText },
                { status: webhookResponse.status }
            );
        }

        return NextResponse.json(
            { success: true, message: "Webhook triggered successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in webhook API route:", error);
        return NextResponse.json(
            { error: "Internal server error", details: String(error) },
            { status: 500 }
        );
    }
}
