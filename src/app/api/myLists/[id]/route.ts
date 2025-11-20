import { NextRequest, NextResponse } from "next/server";
import { getListById } from "@/lib/myLists"; // פונקציה שמושכת רשימות לפי userId

export async function GET(req: NextRequest) {
  try {
    const { id } = req.nextUrl.pathname.match(/\/api\/myLists\/(.+)$/)!.groups!;
    
    if (!id) {
      return NextResponse.json({ error: "Missing list id" }, { status: 400 });
    }

    const list = await getListById(id);
    if (!list) {
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }
    return NextResponse.json(list);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch list" },
      { status: 500 }
    );
  }
}
