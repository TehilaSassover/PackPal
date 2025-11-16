import clientPromise from "./db";

export async function getUserByUid(uid: string) {
  const client = await clientPromise;
  const db = client.db("packpal");
  const user = await db.collection("users").findOne({ uid });
  return user;
}

export async function createUser(user: { uid: string; email: string; displayName?: string }) {
  const client = await clientPromise;
  const db = client.db("packpal");
  const result = await db.collection("users").insertOne(user);
  return result;
}
