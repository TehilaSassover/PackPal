import { ObjectId } from "mongodb";
import clientPromise from "./db";

export async function getListsByUserId(userId: string) {
  if (!userId) throw new Error("Missing userId");
  const id = new ObjectId(userId);
  const client = await clientPromise;
  const db = client.db("packpal"); 
  const lists = await db
    .collection("usersLists")
    .find({ createdBy: id }) 
    .toArray();

  return lists;
}
export async function addListToUserLists(userId: string, listId: string) {
  if (!userId || !listId) throw new Error("Missing userId or listId");
  
  const userObjectId = new ObjectId(userId);
  const listObjectId = new ObjectId(listId);
  
  const client = await clientPromise;
  const db = client.db("packpal");
  
  // Fetch the original list from "lists" collection
  const originalList = await db.collection("lists").findOne({
    _id: listObjectId,
  });
  
  if (!originalList) {
    throw new Error("List not found");
  }
  
  // Create a new entry in "usersLists" collection
  const userList = {
    name: originalList.name,
    defaultItems: originalList.defaultItems,
    sourceListId: listObjectId, // Reference to original list
    createdBy: userObjectId,
    createdAt: new Date(),
  };
  
  const result = await db.collection("usersLists").insertOne(userList);
  
  return result.insertedId;
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

