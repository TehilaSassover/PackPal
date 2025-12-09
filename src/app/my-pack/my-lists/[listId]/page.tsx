"use client";
import ListDetails from "@/components/ListDetails";
import { useParams } from "next/navigation";

export default function MyComponent() {
const params = useParams();
const id = params.listId as string;

// אם רוצים לוודא שזה string ולא array:
    if (!id) {
        return <div>No ID provided</div>;
    }

    return <ListDetails listId={id} source="my-lists"/>; // שולחים את id כפרופס
}
