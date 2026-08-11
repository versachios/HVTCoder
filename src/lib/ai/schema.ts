// Using 'as const' causes TypeScript to infer readonly properties which conflict with JSONSchema7 expectations
// We remove 'as const' and rely on explicit typing to ensure immutability where needed
export const analysisSchema = {
  type: "object",
  properties: {
    verdict: {
      type: "string",
      enum: [
        "LIKELY_CORRECT",
        "NEEDS_IMPROVEMENT",
        "LIKELY_WRONG",
        "LIKELY_TLE",
        "LIKELY_MLE",
        "INSUFFICIENT_INFORMATION",
      ],
    },
    confidence: { type: "number", minimum: 0, maximum: 1 },
    complexity: {
      type: "object",
      properties: {
        time: { type: "string" },
        space: { type: "string" },
        explanation: { type: "string" },
      },
      required: ["time", "space", "explanation"],
      additionalProperties: false,
    },
    algorithm: {
      type: "object",
      properties: {
        detected: { type: "string" },
        explanation: { type: "string" },
        recommended: { type: "string" },
      },
      required: ["detected", "explanation"],
      additionalProperties: false,
    },
    issues: {
      type: "array",
      items: {
        type: "object",
        properties: {
          severity: {
            type: "string",
            enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"],
          },
          title: { type: "string" },
          line: { type: "integer" },
          explanation: { type: "string" },
          suggestion: { type: "string" },
        },
        required: ["severity", "title", "explanation"],
        additionalProperties: false,
      },
    },
    edge_cases: {
      type: "array",
      items: {
        type: "object",
        properties: {
          case: { type: "string" },
          risk: { type: "string", enum: ["PASS", "RISK", "UNKNOWN"] },
          explanation: { type: "string" },
        },
        required: ["case", "risk", "explanation"],
        additionalProperties: false,
      },
    },
    judge_prediction: {
      type: "object",
      properties: {
        correctness: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
        tle: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
        mle: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
        overflow: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
        edge_cases: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
      },
      required: ["correctness", "tle", "mle", "overflow", "edge_cases"],
      additionalProperties: false,
    },
    code_quality: {
      type: "object",
      properties: {
        score: { type: "integer", minimum: 0, maximum: 100 },
        comments: {
          type: "array",
          items: { type: "string" },
        },
      },
      required: ["score"],
      additionalProperties: false,
    },
    hints: {
      type: "object",
      properties: {
        hint1: { type: "string" },
        hint2: { type: "string" },
        full_explanation: { type: "string" },
      },
      required: ["hint1", "hint2", "full_explanation"],
      additionalProperties: false,
    },
    tests: {
      type: "array",
      items: {
        type: "object",
        properties: {
          input: { type: "string" },
          expected_output: { type: "string" },
          purpose: { type: "string" },
        },
        required: ["input", "expected_output", "purpose"],
        additionalProperties: false,
      },
    },
  },
  required: [
    "verdict",
    "confidence",
    "complexity",
    "algorithm",
    "issues",
    "edge_cases",
    "judge_prediction",
    "code_quality",
    "hints",
    "tests",
  ],
  additionalProperties: false,
};
