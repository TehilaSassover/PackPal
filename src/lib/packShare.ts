import clientPromise from "@/lib/db";
import { PackShare } from "@/app/types/lists";
export async function getAllPackShares() {
  const client = await clientPromise;
  const db = client.db("packpal");
  const lists = await db
    .collection("packShare")
    .find({})
    .toArray();
    
  return lists;
}

export async function addPackShare(share: PackShare): Promise<PackShare> {
  const client = await clientPromise;
  const db = client.db("packpal");

  const result = await db.collection("packShare").insertOne(share);

  return result;
}