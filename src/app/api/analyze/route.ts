import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { analyzeCode } from "@/lib/ai/client";
import { analysisRequestSchema } from "@/lib/validation/schemas";

// Helper function to determine if error is transient and worth retrying
const isTransientError = (error: any): boolean => {
  // Network errors, timeouts, and certain HTTP status codes are often transient
  if (error?.name === "FetchError" || error?.name === "TimeoutError") {
    return true;
  }

  // HTTP 429 (Rate Limit) and 5xx errors are often transient
  if (error?.status === 429 || (error?.status >= 500 && error?.status < 600)) {
    return true;
  }

  // Some specific error messages that indicate transient issues
  const errorMessage = error?.message?.toLowerCase() || "";
  return (
    errorMessage.includes("rate limit") ||
    errorMessage.includes("timeout") ||
    errorMessage.includes("network") ||
    errorMessage.includes("temporary") ||
    errorMessage.includes("overloaded")
  );
};

// Helper function to get user-friendly error message
const getUserFriendlyErrorMessage = (error: any): string => {
  // Rate limit errors
  if (error?.status === 429) {
    return "Quá nhiều yêu cầu. Vui lòng thử lại sau một vài giây.";
  }

  // Authentication errors
  if (error?.status === 401) {
    return "Lỗi xác thực API. Vui lòng liên hệ với ban kỹ thuật.";
  }

  // Model not found or access denied
  if (error?.status === 404) {
    return "Lỗi xác thực model AI. Vui lòng liên hệ với ban kỹ thuật.";
  }

  // Server errors (5xx)
  if (error?.status >= 500 && error?.status < 600) {
    return "Dịch vụ AI hiện tại không ổn định. Vui lòng thử lại sau hoặc liên hệ với ban kỹ thuật.";
  }

  // Validation errors from AI
  if (error?.message?.includes("validation")) {
    return "Dữ liệu nhập vào không đúng yêu cầu.";
  }

  // Timeout errors
  if (error?.message?.includes("timeout") || error?.name === "TimeoutError") {
    return "Yêu cầu đã bị timeout.";
  }

  // Network errors
  if (error?.name === "FetchError" || error?.message?.includes("network")) {
    return "Lỗi internet. Kiểm tra lại mạng liên thông và thử lại.";
  }

  // Default error message
  return "Không thể phân tích code. Liên hệ với ban kỹ thuật để giải quyết sự cố.";
}
/*
// Helper function to determine if error is transient and worth retrying
const isTransientError = (error: any): boolean => {
  // Network errors, timeouts, and certain HTTP status codes are often transient
  if (error?.name === "FetchError" || error?.name === "TimeoutError") {
    return true;
  }

  // HTTP 429 (Rate Limit) and 5xx errors are often transient
  if (error?.status === 429 || (error?.status >= 500 && error?.status < 600)) {
    return true;
  }

  // Some specific error messages that indicate transient issues
  const errorMessage = error?.message?.toLowerCase() || "";
  return (
    errorMessage.includes("rate limit") ||
    errorMessage.includes("timeout") ||
    errorMessage.includes("network") ||
    errorMessage.includes("temporary") ||
    errorMessage.includes("overloaded")
  );
};

// Helper function to get user-friendly error message
const getUserFriendlyErrorMessage = (error: any): string => {
  // Rate limit errors
  if (error?.status === 429) {
    return "Qua nhieu yeu cau. Vui long thu lai sau mot vai giay.";
  }

  // Authentication errors
  if (error?.status === 401) {
    return "Loi xac thuc API. Vui lon he thong admin.";
  }

  // Model not found or access denied
  if (error?.status === 404) {
    return "Khong tim thay model AI. Vui lon lien he admin.";
  }

  // Server errors (5xx)
  if (error?.status >= 500 && error?.status < 600) {
    return "Dich vu AI tam thoi khong disponible. Vui long thu lai sau.";
  }

  // Validation errors from AI
  if (error?.message?.includes("validation")) {
    return "Du lieu dau vao khong hop le. Vui long kiem tra lai.";
  }

  // Timeout errors
  if (error?.message?.includes("timeout") || error?.name === "TimeoutError") {
    return "Yeu cau het gio. Vui long thu lai voi code ngan hon.";
  }

  // Network errors
  if (error?.name === "FetchError" || error?.message?.includes("network")) {
    return "Loi mang meryet. Vui long kiem tra ket noi internet va thu lai.";
  }

  // Default error message
  return "Khong the phan tich code. Vui long thu lai sau.";
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body using the schema
    const validationResult = analysisRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request data", issues: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { problem, constraints, language, code } = validationResult.data;

    // Call the AI analysis function with retry logic for transient errors
    let result;
    let lastError;

    // Try up to 2 times for transient errors
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        result = await analyzeCode({ problem, constraints: constraints ?? "", language, code });
        break; // Success, exit retry loop
      } catch (error) {
        lastError = error;

        // If this is the last attempt or error is not transient, break
        if (attempt === 1 || !isTransientError(error)) {
          break;
        }

        // Wait a bit before retrying (exponential backoff: 100ms, 200ms)
        await new Promise(resolve => setTimeout(resolve, 100 * Math.pow(2, attempt)));
      }
    }

    // If we exhausted retries and still have an error, throw it
    if (!result && lastError) {
      throw lastError;
    }

    // Save the analysis to the database
    const analysis = await prisma.analysis.create({
      data: {
        problem,
        constraints: constraints ?? null,
        language,
        code,
        verdict: result.verdict,
        confidence: result.confidence,
        complexity: result.complexity,
        algorithm: result.algorithm,
        issues: result.issues,
        edgeCases: result.edge_cases,
        judgePrediction: result.judge_prediction,
        codeQuality: result.code_quality,
        hints: result.hints,
        tests: result.tests,
      },
    });

    // Return the result with the analysis ID
    return NextResponse.json({
      id: analysis.id,
      ...result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", issues: error.issues },
        { status: 400 }
      );
    }

    console.error("Analysis error:", error);

    // Return user-friendly error message
    const userFriendlyMessage = getUserFriendlyErrorMessage(error);
    return NextResponse.json(
      { error: userFriendlyMessage },
      { status: error?.status >= 400 && error?.status < 500 ? error?.status : 500 }
    );
  }
}
*/