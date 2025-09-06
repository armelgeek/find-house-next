import { NextRequest, NextResponse } from "next/server";
import {
    createDirectus,
    rest,
    staticToken,
    readItem,
    readItems,
    createItem,
    updateItem,
    deleteItem,
} from "@directus/sdk";

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_API ?? "")
    .with(staticToken(process.env.DIRECTUS_ADMIN_TOKEN ?? ""))
    .with(rest());

export async function POST(request: NextRequest) {
    const { action, collection, data, id } = await request.json();

    try {
        let result;
        switch (action) {
            case "readOne":
                result = await directus.request(readItem(collection, id));
                break;
            case "readMany":
                result = await directus.request(readItems(collection, data));
                break;
            case "createOne":
                result = await directus.request(createItem(collection, data));
                break;
            case "updateOne":
                result = await directus.request(updateItem(collection, id, data));
                break;
            case "deleteOne":
                result = await directus.request(deleteItem(collection, id));
                break;
            default:
                return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }
        return NextResponse.json(result);
    } catch (error) {
        console.error("Directus API error:", error);
        const errorMessage =
            error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
