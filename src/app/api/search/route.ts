import { NextResponse } from "next/server";
import { searchCatalog } from "@/lib/search";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q") ?? "";
  return NextResponse.json(searchCatalog(q));
}
