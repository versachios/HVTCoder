import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST() {
  return NextResponse.json({ marker: "TEST_V2_MOI_NHAT" });
}