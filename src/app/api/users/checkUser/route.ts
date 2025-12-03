import { NextResponse } from "next/server";
import { getUserByUid, createUser } from "@/lib/users";

export async function POST(req: Request) {
  try {
    const { uid, email, displayName } = await req.json();

    if (!uid || !email) {
      return NextResponse.json(
        { status: "error", message: "Missing uid or email" },
        { status: 400 }
      );
    }
    let user = await getUserByUid(uid);
    console.log("Found user:", user);

    if (!user) {
      // אם המשתמש לא קיים – יוצרים חדש
      const [firstName, lastName] = displayName ? displayName.split(" ") : ["", ""];
      const newUser = { uid, email, firstName, lastName };
      const result = await createUser(newUser);
      user = { ...newUser, _id: result.insertedId };
      console.log("Created new user:", user);
    }

    return NextResponse.json({ status: "success", user });
  } catch (err) {
    console.error("Error in checkOrCreate user:", err);
    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 }
    );
  }
}

