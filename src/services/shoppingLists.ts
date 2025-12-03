import { ShoppingList } from "@/app/types/lists";

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
