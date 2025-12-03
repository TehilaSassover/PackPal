import { NextRequest, NextResponse } from "next/server";
import { getShoppingListsByUserId } from "@/lib/shoppingIist";
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    console.log("userId:", userId);
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    const lists = await getShoppingListsByUserId(userId);
    return NextResponse.json(lists);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch user lists" },
      { status: 500 }
    );
  }
}