import { NewShoppingList, ShoppingList } from "@/app/types/lists";

export async function getAllShoppingListAPI(userId: string): Promise<ShoppingList[]> {
  const res = await fetch(`/api/shopping?userId=${encodeURIComponent(userId)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorData: { error?: string } | null = await res.json().catch(() => null);
    throw new Error(errorData?.error || "Error fetching shopping lists");
  }

  const data: ShoppingList[] = await res.json();
  return data;
}
export async function addShoppingListAPI(items:NewShoppingList []): Promise<void> {
  const res = await fetch(`/api/shopping`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  if (!res.ok) {
    const errorData: { error?: string } | null = await res.json().catch(() => null);
    throw new Error(errorData?.error || "Error adding shopping lists");
  }
  const data = await res.json();
  return data;
}
export async function deleteShoppingListAPI(items: NewShoppingList[]): Promise<void> {
  const res = await fetch(`/api/shopping`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  if (!res.ok) {
    const errorData: { error?: string } | null = await res.json().catch(() => null);
    throw new Error(errorData?.error || "Error deleting shopping lists");
  }
  const data = await res.json();
  return data;
}