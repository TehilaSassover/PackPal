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
