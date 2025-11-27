import { ObjectId } from "mongodb";
import clientPromise from "./db";

export async function getListsByUserId(userId: string) {
  if (!userId) throw new Error("Missing userId");
  const id = new ObjectId(userId);
  const client = await clientPromise;
  const db = client.db("packpal"); 
  const lists = await db
    .collection("usersLists")
    .find({ createdBy: userId }) 
    .toArray();
console.log(JSON.stringify(lists, null, 2));
    
  return lists;
}
export async function getListById(listId: string) {
  if (!listId) throw new Error("Missing listId");

  const client = await clientPromise;
  const db = client.db("packpal");
  const list = await db
    .collection("usersLists")
    .findOne({ _id: new ObjectId(listId) });

  if (!list) return null;

  return {
    _id: list._id.toString(),
    title: list.title,
    description: list.description || "",
    createdBy: list.createdBy?.toString?.() ?? list.createdBy,
    dateOfTrip: list.dateOfTrip ? list.dateOfTrip.toString() : null,
    items: list.items || [],
    createdAt: list.createdAt?.toISOString?.() || null,
    updatedAt: list.updatedAt?.toISOString?.() || null,
  };
}

export async function addListToUserLists(userId: string, listId: string) {
  if (!userId || !listId) throw new Error("Missing userId or listId"); 
  const userObjectId = new ObjectId(userId);
  const listObjectId = new ObjectId(listId);
  const client = await clientPromise;
  const db = client.db("packpal");
  const originalList = await db.collection("lists").findOne({
    _id: listObjectId,
  });
  
  if (!originalList) {
    throw new Error("List not found");
  }
    const userList = {
    title: originalList.name,
    description: "",
    createdBy: userObjectId.toString(),
    dateOfTrip: originalList.dateOfTrip,
    items: originalList.defaultItems,
    createdAt: new Date(),
    updatedAt: new Date(),
  }; 
  const result = await db.collection("usersLists").insertOne(userList);
  return result.insertedId;
}
export async function updateListById(listId: string, updatedList: any) {
  if (!listId) throw new Error("Missing listId");
  const client = await clientPromise;
  const db = client.db("packpal");
  const listsCollection = db.collection("usersLists");
  const result = await listsCollection.findOneAndUpdate(
    { _id: new ObjectId(listId) },
    { $set: updatedList },
    { returnDocument: "after" }
  );
  if (!result || !result.value) {
    console.error("❌ No document found to update");
    return null;
  }
  return {
    ...result.value,
    _id: result.value._id.toString(),
  };
}
