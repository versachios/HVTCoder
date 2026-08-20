import { NextResponse } from "next/server";

export const runtime = "edge";

const GEMINI_PROXY_BASE_URL = "https://hvt-coder.vercel.app";

export async function POST(request: Request) {
  try {
    const body = await request.text();

    const res = await fetch(`${GEMINI_PROXY_BASE_URL}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Analyze proxy error:", err);
    return NextResponse.json({ error: "Có lỗi xảy ra khi phân tích." }, { status: 500 });
  }
}