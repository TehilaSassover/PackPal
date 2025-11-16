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

    // מנסה למצוא את המשתמש
    let user = await getUserByUid(uid);

    if (!user) {
      // אם המשתמש לא קיים – יוצרים חדש
      const [firstName, lastName] = displayName ? displayName.split(" ") : ["", ""];
      const newUser = { uid, email, firstName, lastName };
      const result = await createUser(newUser);
      user = { ...newUser, _id: result.insertedId };
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

// import { NextResponse } from "next/server";
// import { getUserByUid } from "@/lib/users";

// export async function POST(req: Request) {
//   const { uid } = await req.json();  
//   const user = await getUserByUid(uid);
//   if (user) {
//     return NextResponse.json({ status: "existing", user });
//   } else {
//     return NextResponse.json({ status: "notFound" });
//   }
// }
