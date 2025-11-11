import { NextResponse } from "next/server";
import { getAllLists } from "@/lib/lists"; // הפונקציה שמושכת את הקטגוריות ממונגו

export async function GET() {
  try {
    const categories = await getAllLists(); // שולף את כל הקטגוריות
    return NextResponse.json(categories);         // מחזיר JSON ללקוח
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },   // הודעת שגיאה אם משהו השתבש
      { status: 500 }
    );
  }
}
