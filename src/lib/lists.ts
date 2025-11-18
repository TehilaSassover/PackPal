import clientPromise from "./db";
import { ObjectId } from "mongodb";

export async function getAllLists() {
  const client = await clientPromise;
  const db = client.db("packpal"); 
  const lists = await db.collection("lists").find({}).toArray();
  return lists;
}

export async function getListById(id: string) {
  const client = await clientPromise;
  const db = client.db("packpal");
  
  try {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const list = await db.collection("lists").findOne({
      _id: new ObjectId(id),
    });

    return list;
  } catch (error) {
    console.error("Error fetching list by ID:", error);
    return null;
  }
}
