import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import * as React from "react";
import { analysisSchema } from "./schema";
import { systemPrompt, createAnalysisPrompt } from "./prompt";

// Initialize the OpenAI client if API key is available
let ai: ReturnType<typeof openai> | null = null;
if (process.env.OPENAI_API_KEY) {
  ai = openai("gpt-4o");
}

export type AnalysisResult = {
  verdict: string;
  confidence: number;
  complexity: {
    time: string;
    space: string;
    explanation: string;
  };
  algorithm: {
    detected: string;
    explanation: string;
    recommended: string;
  };
  issues: Array<{
    severity: string;
    title: string;
    line: number | null;
    explanation: string;
    suggestion: string;
  }>;
  edge_cases: Array<{
    case: string;
    risk: string;
    explanation: string;
  }>;
  judge_prediction: {
    correctness: string;
    tle: string;
    mle: string;
    overflow: string;
    edge_cases: string;
  };
  code_quality: {
    score: number;
    comments: string[];
  };
  hints: {
    hint1: string;
    hint2: string;
    full_explanation: string;
  };
  tests: Array<{
    input: string;
    expected_output: string;
    purpose: string;
  }>;
};

/**
 * Analyze code using the AI model
 * @param params - The problem, constraints, language, and code to analyze
 * @returns The analysis result
 */
export async function analyzeCode(params: {
  problem: { text: string; images: string[] } | string;
  constraints: string;
  language: string;
  code: string;
}): Promise<AnalysisResult> {
  // Extract text from problem (handle both string and object formats for backward compatibility)
  const problemText = typeof params.problem === 'string'
    ? params.problem
    : params.problem.text;

  // Check if API key is configured
  if (!ai) {
    // For development without API key, return a mock result
    // In a real app, you would want to handle this more gracefully
    console.warn("OPENAI_API_KEY not set, returning mock analysis");
    return mockAnalysis({ ...params, problem: problemText as string });
  }

  try {
    const prompt = createAnalysisPrompt(params);

    const result = await generateObject({
      // Cast to any to bypass TypeScript checking - the schema is valid
      schema: analysisSchema as any,
      prompt: systemPrompt + "\n\n" + prompt,
      // mode: "json" is default when schema is provided
      model: ai,
    });

    // The result.object is the validated JSON object
    return result.object as AnalysisResult;
  } catch (error) {
    console.error("AI analysis error:", error);
    // Throw a user-friendly error
    throw new Error("Khong the phan tich code. Vui long thu lai sau.");
  }
}

/**
 * Mock analysis result for development when API key is not set
 * This returns a plausible but generic analysis
 */
function mockAnalysis(params: {
  problem: string;
  constraints: string;
  language: string;
  code: string;
}): AnalysisResult {
  // Determine a simple verdict based on code length and presence of loops
  const hasLoop = /for\s*\(|while\s*\(/.test(params.code);
  const hasNestedLoop = /for\s*\([\s\S]*for\s*\(|while\s*\([\s\S]*while\s*\(/.test(params.code);

  let verdict: AnalysisResult["verdict"];
  let confidence: number;

  if (hasNestedLoop) {
    verdict = "LIKELY_TLE";
    confidence = 0.85;
  } else if (hasLoop) {
    verdict = "NEEDS_IMPROVEMENT";
    confidence = 0.75;
  } else {
    verdict = "LIKELY_CORRECT";
    confidence = 0.9;
  }

  return {
    verdict,
    confidence,
    complexity: {
      time: hasNestedLoop ? "O(n^2)" : hasLoop ? "O(n)" : "O(1)",
      space: "O(1)",
      explanation: hasNestedLoop
        ? "Code contains nested loops, resulting in quadratic time complexity."
        : hasLoop
        ? "Code contains a single loop, resulting in linear time complexity."
        : "Code does not contain loops, resulting in constant time complexity.",
    },
    algorithm: {
      detected: hasNestedLoop
        ? "Brute Force"
        : hasLoop
        ? "Iteration"
        : "Direct Computation",
      explanation: hasNestedLoop
        ? "The solution uses nested loops to check all pairs."
        : hasLoop
        ? "The solution uses a single loop to iterate through the input."
        : "The solution computes the result directly without iteration.",
      recommended: hasNestedLoop
        ? "Consider using a hash map or sorting to reduce complexity."
        : hasLoop
        ? "The current approach is appropriate for this problem."
        : "No change needed.",
    },
    issues: [
      {
        severity: hasNestedLoop ? "HIGH" : hasLoop ? "MEDIUM" : "LOW",
        title: hasNestedLoop
          ? "Nested loops detected"
          : hasLoop
          ? "Consider edge cases"
          : "No issues detected",
        line: hasNestedLoop ? 10 : hasLoop ? 15 : null,
        explanation: hasNestedLoop
          ? "The nested loops will cause performance issues for large inputs."
          : hasLoop
          ? "The loop may not handle all edge cases correctly."
          : "No issues detected in the code.",
        suggestion: hasNestedLoop
          ? "Replace the nested loop with a more efficient algorithm such as using a hash map to store frequencies."
          : hasLoop
          ? "Add additional checks for edge cases such as empty input or negative numbers."
          : "No changes needed.",
      },
    ],
    edge_cases: [
      {
        case: "Empty input",
        risk: params.code.includes("return") || params.code.includes("print") ? "PASS" : "RISK",
        explanation: params.code.includes("return") || params.code.includes("print")
          ? "The code handles empty input by returning early or printing a default value."
          : "The code may not handle empty input correctly.",
      },
      {
        case: "Single element",
        risk: "PASS",
        explanation: "The code should handle single element input correctly.",
      },
      {
        case: "All equal values",
        risk: "PASS",
        explanation: "The code should work correctly when all input values are equal.",
      },
    ],
    judge_prediction: {
      correctness: verdict === "LIKELY_CORRECT" ? "HIGH" : verdict === "LIKELY_WRONG" ? "LOW" : "MEDIUM",
      tle: verdict === "LIKELY_TLE" ? "HIGH" : hasNestedLoop ? "MEDIUM" : "LOW",
      mle: "LOW",
      overflow: "LOW",
      edge_cases: "LOW",
    },
    code_quality: {
      score: hasNestedLoop ? 60 : hasLoop ? 75 : 90,
      comments: [
        hasNestedLoop
          ? "Consider refactoring to reduce time complexity."
          : hasLoop
          ? "Code is readable but could benefit from better variable names."
          : "Code is clean and concise.",
        "Add comments to explain the algorithm.",
      ],
    },
    hints: {
      hint1: hasNestedLoop
        ? "Can you reduce the number of iterations through the data?"
        : hasLoop
        ? "Think about what information you need to store while processing the input."
        : "The solution is already optimal.",
      hint2: hasNestedLoop
        ? "Consider using a hash map to store frequencies of elements."
        : hasLoop
        ? "Look for patterns that allow you to process the data in a single pass."
        : "No further hints needed.",
      full_explanation: hasNestedLoop
        ? "The current solution uses nested loops which results in O(n^2) time complexity. "
          + "For problems that involve checking pairs or relationships between elements, "
          + "consider using a hash map to store frequencies or sorting the array first. "
          + "This can often reduce the complexity to O(n log n) or O(n)."
        : hasLoop
        ? "The solution uses a single loop to process the input. "
          + "Ensure that the loop handles all edge cases such as empty input, single element, "
          + "and large values. The time complexity is O(n) which is efficient for most constraints."
        : "The solution computes the result directly without iteration. "
          + "This is the most efficient approach for this problem.",
    },
    tests: [
      {
        input: "1\n5\n1 2 3 4 5",
        expected_output: "15",
        purpose: "Normal case with increasing numbers",
      },
      {
        input: "1\n0\n",
        expected_output: "0",
        purpose: "Edge case with empty array",
      },
      {
        input: "1\n3\n5 5 5",
        expected_output: "15",
        purpose: "Edge case with all equal values",
      },
    ],
  };
}

/**
 * Hook to use the AI analysis with loading state
 */
export const useAIAnalysis = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const analyze = async (
    params: Parameters<typeof analyzeCode>[0]
  ): Promise<ReturnType<typeof analyzeCode>> => {
    setIsLoading(true);
    try {
      return await analyzeCode(params);
    } finally {
      setIsLoading(false);
    }
  };

  return { analyze, isLoading };
};