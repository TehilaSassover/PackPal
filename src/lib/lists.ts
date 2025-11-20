import clientPromise from "./db";
import { ObjectId } from "mongodb";
import { PackList } from "@/app/types/lists";

export async function getAllLists() {
  const client = await clientPromise;
  const db = client.db("packpal"); 
  const lists = await db.collection("lists").find({}).toArray();
  return lists;
}

export async function getListById(id: string): Promise<PackList | null> {
  console.log("Fetching list with ID:", id);
  if (!id || !ObjectId.isValid(id)) {
    console.warn("Invalid list ID:", id);
    return null;
  }

  try {
    const client = await clientPromise;
    const db = client.db("packpal");

    const list = await db.collection("usersLists").findOne({ _id: new ObjectId(id) });
console.log("Fetched list:", list);
    return list as PackList | null;
  } catch (error) {
    console.error("Error fetching list by ID:", error);
    return null;
  }
}
