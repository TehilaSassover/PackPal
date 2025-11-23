import { NextResponse, NextRequest } from "next/server";
import { getListById, updateListById } from "@/lib/myLists";
// @ts-ignore
// GET request ל‑/api/myLists/[id]
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id; // ה‑ID מגיע ישירות מה‑dynamic route
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
// export async function PUT(req: NextRequest) {
//   try {
//     const data = await req.json();
//     const id = data.id || data._id;
//     if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
//     const { id: _, _id: __, ...updatedList } = data;

//     const updated = await updateListById(id, updatedList);

//     return NextResponse.json(updated);
//   } catch (error: any) {
//     console.error(error);
//     return NextResponse.json({ error: error.message || "Failed to update list" }, { status: 500 });
//   }
// }
