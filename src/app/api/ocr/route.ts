import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "Thiếu ảnh." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server chưa cấu hình GEMINI_API_KEY." },
        { status: 500 }
      );
    }

    // Extract base64 and mime type from data URL
    // Expected format: "data:image/png;base64,...."
    const matches = image.match(/^data:(.*?);base64,(.*)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json({ error: "Định dạng ảnh không hợp lệ." }, { status: 400 });
    }
    const mimeType = matches[1];
    const base64Image = matches[2];

    const ocrPrompt = `Bạn là hệ thống OCR chuyên nhận diện đề bài lập trình thi đấu.

Hãy đọc TOÀN BỘ nội dung văn bản trong ảnh và chuyển thành văn bản có thể chỉnh sửa.

YÊU CẦU BẮT BUỘC:
- Giữ nguyên nội dung và thứ tự của đề bài.
- Giữ nguyên các phần như "Ví dụ", "Input", "Output", "Giải thích", "Ràng buộc", v.v.
- Giữ nguyên số, ký hiệu toán học và tên biến.
- Cố gắng giữ nguyên xuống dòng và cấu trúc của đề.
- Nhận diện chính xác các ký hiệu như <=, >=, <, >, =, %, ^, *, /, [], (), {}, |.
- Với công thức như 10^5, a[i], O(n log n), hãy giữ đúng dạng văn bản.
- Không tự giải bài.
- Không tóm tắt.
- Không diễn giải.
- Không thêm thông tin không có trong ảnh.
- Không thêm markdown code fence nếu ảnh không có code.
- Nếu ảnh chứa code, giữ nguyên code và indentation tốt nhất có thể.
- Nếu có phần Input/Output mẫu, giữ nguyên từng dòng và số liệu.
- Nếu có nhiều ảnh được paste, xử lý từng ảnh theo đúng thứ tự.

CHỈ trả về nội dung đã nhận diện.
KHÔNG trả về lời giải, nhận xét hoặc lời mở đầu.`;

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: ocrPrompt }] },
          contents: [
            {
              role: "user",
              parts: [
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: base64Image,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            // We want plain text output
          },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini OCR error:", errText);
      return NextResponse.json(
        { error: "Không gọi được AI OCR. Thử lại sau.", debug: errText, status: res.status },
        { status: 502 }
      );
  }

    const data = await res.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      return NextResponse.json({ error: "AI OCR không trả về kết quả." }, { status: 502 });
    }

    // The OCR result is the content
    const ocrText = content.trim();

    return NextResponse.json({ text: ocrText });
  } catch (err) {
    console.error("OCR route error:", err);
    return NextResponse.json({ error: "Có l� lỗi xảy ra trong quá trình OCR." }, { status: 500 });
  }
}