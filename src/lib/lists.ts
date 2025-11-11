import clientPromise from "./db";

export async function getAllLists() {
  const client = await clientPromise;
  const db = client.db("packpal"); 
  const lists = await db.collection("lists").find({}).toArray();
  return lists;
}
