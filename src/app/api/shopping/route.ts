import { NextRequest, NextResponse } from "next/server";
import { getShoppingListsByUserId,addShoppingListBulk,deleteShoppingListBulk } from "@/lib/shoppingIist";
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
export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json();
    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items data" }, { status: 400 });
    }
    await addShoppingListBulk(items);
    return NextResponse.json({ message: "Items added successfully" });
  }
  catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to add shopping lists" },
      { status: 500 }
    );
  }
}
export async function DELETE(req: NextRequest) {
  try {
    const { items } = await req.json();
    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items data" }, { status: 400 });
    }
    await deleteShoppingListBulk(items);
    return NextResponse.json({ message: "Items deleted successfully" });
  }
  catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete shopping lists" },
      { status: 500 }
    );
  }
}