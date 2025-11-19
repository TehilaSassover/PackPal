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
  return lists;
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
    name: originalList.name,
    defaultItems: originalList.defaultItems,
    sourceListId: listObjectId, 
    createdBy: userObjectId,
    createdAt: new Date(),
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
