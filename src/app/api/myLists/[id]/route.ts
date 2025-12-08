import { NextRequest, NextResponse } from "next/server";
import { getListById ,deleteListById} from "@/lib/myLists";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
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
export async function DELETE(req: NextRequest,
  context: { params: Promise<{ id: string }> }) 
  {
  try {
    const { id } = await context.params;  
    if (!id) {
      return NextResponse.json({ error: "Missing list id" }, { status: 400 });}
      const deletedList = await deleteListById(id);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete list" },
      { status: 500 }
    );
  }
}