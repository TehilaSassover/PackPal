"use client";
import ListDetails from "@/components/ListDetails";
import { useParams } from "next/navigation";
export default function MyComponent() {
  const params = useParams();
  const id = params.id as string;
  if (!id) {
    return <div>No ID provided</div>;
  }
  return <ListDetails listId={id} source="list" />;  
}

