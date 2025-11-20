// services/listService.ts

import { log } from "console";

// ממש כאן מגדירים את ה־interface
import { List, PackList } from "@/app/types/lists";
// פונקציה לקבלת הרשימות של המשתמש
export async function getUserLists(userId: string): Promise<PackList[]> {    
  const res = await fetch(`/api/myLists?userId=${userId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch lists");
  }
  
  return res.json();
}
// פונקציה לעדכון רשימה
export async function updateList(listId: string, updatedList: PackList): Promise<List> {
  const res = await fetch(`/api/myLists`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: listId, ...updatedList }), // ID + כל השדות
  });

  if (!res.ok) {
    const errorData: { error?: string } | null = await res.json().catch(() => null);
    throw new Error(errorData?.error || "Error saving list");
  }

  const data: List = await res.json(); // תגידי ל-TypeScript שזה List
  return data;
}
