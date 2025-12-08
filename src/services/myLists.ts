import { List, PackList } from "@/app/types/lists";
export async function getUserLists(userId: string): Promise<PackList[]> {    
  const res = await fetch(`/api/myLists?userId=${userId}`);
  if (!res.ok)  throw new Error("Failed to fetch lists"); 
  return res.json();
}
export async function updateList(listId: string, updatedList: PackList): Promise<List> {
  const res = await fetch(`/api/myLists/`, {
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
export async function deleteListByIdAPI(id: string) {
  const res = await fetch(`/api/myLists/${id}`);
  if (!res.ok) throw new Error("Failed to fetch list");
  return res.json();
}
export async function deleteListAPI(id: string) {
  const res = await fetch(`/api/myLists/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete list");
  return res.json();
}