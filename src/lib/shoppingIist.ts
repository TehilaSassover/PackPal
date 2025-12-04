import { NewShoppingList} from "@/app/types/lists";
import clientPromise from "./db";
export async function getShoppingListsByUserId(userId: string) {
  const client = await clientPromise;
  const db = client.db("packpal");
  const shoppingLists = await db
    .collection("shoppingList")
    .find({ userId })
    .toArray();
  console.log("RESULT:", shoppingLists);
  return shoppingLists;
}
export async function addShoppingListBulk(items: NewShoppingList[]) {
  const client = await clientPromise;
  const db = client.db("packpal");

  if (items.length === 0) return; // אם אין פריטים – לא נכנס כלום

  const result = await db.collection("shoppingList").insertMany(items);
  return result;
}


export async function deleteShoppingListBulk(items: NewShoppingList[]) {
  const client = await clientPromise;
  const db = client.db("packpal");

  if (items.length === 0) return;

  // יוצרים array של תנאים למחיקה
  const conditions = items.map((item) => ({
    name: item.name,
    listId: item.listId,
    userId: item.userId,
  }));

  const result = await db.collection("shoppingList").deleteMany({
    $or: conditions,
  });

  return result;
}
