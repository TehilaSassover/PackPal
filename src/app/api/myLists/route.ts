import { NextRequest, NextResponse } from "next/server";
import { getListsByUserId } from "@/lib/myLists"; // פונקציה שמושכת רשימות לפי userId

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId"); // לוקחים את ה-ID מה־query

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const lists = await getListsByUserId(userId);
    console.log("lists!! "+lists);
    
    return NextResponse.json(lists); // מחזיר JSON ללקוח
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch user lists" },
      { status: 500 }
    );
  }
}
