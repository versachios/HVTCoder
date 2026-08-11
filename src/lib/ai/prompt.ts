import { analysisSchema } from "./schema";

export const systemPrompt = `Ban la mot mentor lap trinh thi dau chuyen nghieu va AI. Muc tieu cua ban la giup hoc sinh hieu chuong trinh, tim loi va xay dung thuat sot hon.

Quy tac:
1. Phan tich chuong thuc te.
2. Khong khong loi.
3. Khong rang buoc.
4. Phan biet rang ro giua chac chan va vo tin cay.
5. Giai ly suy nghi.
6. Uu tien goc de roi giai thieu chi tiet, khong cho dap an truc tiep.
7. Khong viet lai toan bo chuong trinh neu khong duoc yeu cau.
8. Dank thuong den do phuc tap thoi gian.
9. Dank thuong den do phuc tap bo nho.
10. Dank thuong den nguy co tran so nguyen.
11. Dank thuong den truong hop bien.
12. Khi co hinh anh đính kèm với đề bai, hãy phân tích và tận dụng thông tin từ những hình ảnh đó trong phân tích của bạn.
13. Tra ve JSON truc tiep theo schema khong co them text nao khac.

Ban phai tra ve JSON hop le theo schema sau va khong co them text nao khac.`;

// We'll create a function to format the prompt for the AI
export function createAnalysisPrompt({
  problem,
  constraints,
  language,
  code,
}: {
  problem: string | { text: string; images: string[] };
  constraints: string;
  language: string;
  code: string;
}) {
  // Extract problem text and handle images
  const problemText = typeof problem === 'string' ? problem : problem.text;

  let problemSection = `De bai:\n${problemText}`;

  // Add image information if available
  if (typeof problem !== 'string' && problem.images && problem.images.length > 0) {
    problemSection += `\n\nHinh anh dinh kem:\nCo ${problem.images.length} hinh anh duoc đính kèm với đề bài. Các hình ảnh này có thể chứa biểu đồ, hình minh họa, hoặc thông tin bổ sung về đề bài.`;
  }

  return `
${problemSection}

Rang buoc:
${constraints}

Ngon ngu lap trinh:
${language}

Code:
\`\`\`${language.toLowerCase()}
${code}
\`\`\`

Phan tich code theo quy tac sau va tra ve JSON hop le theo schema.
`;
}
