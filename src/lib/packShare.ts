import clientPromise from "@/lib/db";
import { PackShare } from "@/app/types/lists";
import { ObjectId, UpdateResult } from "mongodb";
export async function getAllPackShares() {
  const client = await clientPromise;
  const db = client.db("packpal");
  const lists = await db
    .collection("packShare")
    .find({})
    .toArray();
    
  return lists;
}

export async function addPackShare(share: PackShare) {
  const client = await clientPromise;
  const db = client.db("packpal");

  const result = await db.collection("packShare").insertOne(share);

  return result;
}
export async function updateReactionsPackShare(
  shareId: ObjectId,
  userEmail: string,
  type: "like" | "dislike"
): Promise<UpdateResult<Document>> {
  console.log("Updating reactions for shareId:", shareId, "userEmail:", userEmail, "type:", type);
  const client = await clientPromise;
  const db = client.db("packpal");
  const updateField = type;
  const existing = await db.collection("packShare").findOne({
    _id: shareId,
    [updateField]: userEmail,
  });
  if (existing) {
    throw new Error(`User already ${type}d.`); // ניתן גם לזרוק שגיאה
  }
  const result = await db.collection("packShare").updateOne(
    { _id: shareId },
    { $addToSet: { [updateField]: userEmail } }
  );
  return result;
}