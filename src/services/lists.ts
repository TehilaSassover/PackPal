// services/listService.ts
import { List } from "@/app/types/lists";

// פונקציה לקבלת כל הרשימות
export async function getAllLists(): Promise<List[]> {
  const res = await fetch("/api/lists");
  if (!res.ok) {
    throw new Error("Failed to fetch lists");
  }
  return res.json();
}


// פונקציה לקבלת רשימה לפי ID
export async function getListById(listId: string): Promise<List> {
  const res = await fetch(`/api/lists/${listId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch list: ${res.status}`);
  }
  return res.json();
}