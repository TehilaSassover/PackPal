import { NextResponse } from "next/server";
import { getUserByUid, createUser } from "@/lib/users";

export async function POST(req: Request) {
  try {
    const { uid, email, displayName, photoURL } = await req.json();

    if (!uid || !email) return NextResponse.json({ status: "error", message: "Missing uid or email" }, { status: 400 });

    let user = await getUserByUid(uid);

    if (!user) {
      const [firstName, lastName] = displayName ? displayName.split(" ") : ["", ""];
      const newUser = { uid, email, firstName, lastName, photoURL };
      const result = await createUser(newUser);
      user = { ...newUser, _id: result.insertedId };
    }

    return NextResponse.json({ status: "success", user });
  } catch (err) {
    console.error("Error in checkOrCreateUser:", err);
    return NextResponse.json({ status: "error", message: "Server error" }, { status: 500 });
  }
}
