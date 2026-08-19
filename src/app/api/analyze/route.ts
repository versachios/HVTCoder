import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const body = await request.text();

    const proxyBase = process.env.GEMINI_PROXY_BASE_URL;
    if (!proxyBase) {
      return NextResponse.json(
        { error: "Server chưa cấu hình GEMINI_PROXY_BASE_URL." },
        { status: 500 }
      );
    }

    const res = await fetch(`${proxyBase}/api/analyze`, {
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