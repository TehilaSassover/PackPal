import { ObjectId } from "mongodb";
import clientPromise from "./db";

export async function getListsByUserId(userId: string) {
  if (!userId) throw new Error("Missing userId");
  const id = new ObjectId(userId);
  const client = await clientPromise;
  const db = client.db("packpal"); // שם הדאטאבייס שלך
  const lists = await db
    .collection("usersLists")
    .find({ createdBy: id }) // רק הרשימות של המשתמש הזה
    .toArray();

  return lists;
}
export async function updateList(list: any) {
  const res = await fetch(`/api/lists/${list._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(list),
  });

  if (!res.ok) {
    throw new Error("Failed to update list");
  }

  return await res.json();
}

