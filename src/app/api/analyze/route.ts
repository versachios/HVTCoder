import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Verdict = {
  tag: string;
  tone: "teal" | "amber" | "red";
  complexity: string;
  note: string;
  issue: string;
  hint: string;
};

export async function POST(request: Request) {
  try {
    const { problem, language, code } = await request.json();

    if (!problem?.trim() || !code?.trim()) {
      return NextResponse.json({ error: "Thiếu đề bài hoặc code." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server chưa cấu hình GEMINI_API_KEY." },
        { status: 500 }
      );
    }

    const systemPrompt = `Bạn là trợ lý chấm bài lập trình thi đấu. Nhận đề bài, ngôn ngữ, và code của học sinh.
Trả lời DUY NHẤT một JSON object đúng schema sau, không thêm chữ nào khác, không markdown:
{
  "tag": string (vd "Có khả năng Accepted" / "Có khả năng TLE" / "Có khả năng Wrong Answer"),
  "tone": "teal" | "amber" | "red" (teal nếu khả năng đúng cao, amber nếu cảnh báo TLE/nghi ngờ, red nếu chắc chắn sai),
  "complexity": string (vd "O(n log n)"),
  "note": string (giải thích ngắn gọn 1-2 câu),
  "issue": string (vấn đề chính phát hiện trong code, hoặc "Không phát hiện vấn đề nào." nếu code ổn),
  "hint": string (gợi ý cải thiện cụ thể)
}
Viết bằng tiếng Việt, ngắn gọn, đúng trọng tâm, dựa trên đề bài và ràng buộc đã cho.`;

    const userPrompt = `Đề bài:\n${problem}\n\nNgôn ngữ: ${language}\n\nCode:\n${code}`;

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          generationConfig: {
            temperature: 0.3,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini error:", errText);
      return NextResponse.json({ error: "Không gọi được AI. Thử lại sau." }, { status: 502 });
    }

    const data = await res.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      return NextResponse.json({ error: "AI không trả về kết quả." }, { status: 502 });
    }

    const result = JSON.parse(content) as Verdict;
    return NextResponse.json(result);
  } catch (err) {
    console.error("Analyze error:", err);
    return NextResponse.json({ error: "Có lỗi xảy ra khi phân tích." }, { status: 500 });
  }
}
