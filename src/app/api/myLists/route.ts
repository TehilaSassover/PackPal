import { NextRequest, NextResponse } from "next/server";
import { getListsByUserId, addListToUserLists } from "@/lib/myLists"; // פונקציה שמושכת רשימות לפי userId
import { updateListById } from "@/lib/myLists"; // פונקציה שמושכת רשימות לפי userId
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId"); // לוקחים את ה-ID מה־query
    console.log("userId from query:", userId);
    
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const lists = await getListsByUserId(userId);    
    return NextResponse.json(lists); // מחזיר JSON ללקוח
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch user lists" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, listId } = body;

    if (!userId || !listId) {
      return NextResponse.json(
        { error: "Missing userId or listId" },
        { status: 400 }
      );
    }

    const addedListId = await addListToUserLists(userId, listId);

    return NextResponse.json({
      success: true,
      addedListId,
      message: "List added to your personal lists",
    });
  } catch (error) {
    console.error("Error adding list to my lists:", error);
    return NextResponse.json(
      { error: "Failed to add list to your personal lists" },
      { status: 500 }
    );}}
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json(); // ✅ רק פעם אחת
    const id = data.id || data._id;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const { id: _, _id: __, ...updatedList } = data;

    const updated = await updateListById(id, updatedList);

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Failed to update list" }, { status: 500 });
  }
}
