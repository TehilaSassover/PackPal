import { NextResponse } from "next/server";
import {addPackShare, getAllPackShares } from "@/lib/packShare";

export async function GET() {
  try {

    const packShares = await getAllPackShares();
    return NextResponse.json(packShares, { status: 200 });
  } catch (error) {
    console.error("Error fetching pack shares:", error);
    return NextResponse.json({ error: "Failed to fetch pack shares" }, { status: 500 });
  }
}
export async function POST(request: Request) {
  try {
    const shareData = await request.json();
    const result = await addPackShare(shareData);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }}