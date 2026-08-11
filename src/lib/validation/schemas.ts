import { z } from "zod";

// Validation schema for analysis request
export const analysisRequestSchema = z.object({
  problem: z.union([
    z.string().min(1, "Problem statement is required"),
    z.object({
      text: z.string().min(1, "Problem statement is required"),
      images: z.array(z.string()).default([]),
    }),
  ]),
  constraints: z.string().optional(),
  language: z.enum(["C++", "Python", "Java"]),
  code: z.string().min(1, "Code is required"),
});

// Validation schema for analysis response (based on our AI schema)
export const analysisResponseSchema = z.object({
  id: z.string(),
  verdict: z.enum([
    "LIKELY_CORRECT",
    "NEEDS_IMPROVEMENT",
    "LIKELY_WRONG",
    "LIKELY_TLE",
    "LIKELY_MLE",
    "INSUFFICIENT_INFORMATION",
  ]),
  confidence: z.number().min(0).max(1),
  complexity: z.object({
    time: z.string(),
    space: z.string(),
    explanation: z.string(),
  }),
  algorithm: z.object({
    detected: z.string(),
    explanation: z.string(),
    recommended: z.string(),
  }),
  issues: z.array(
    z.object({
      severity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"]),
      title: z.string(),
      line: z.number().int().nullable(),
      explanation: z.string(),
      suggestion: z.string(),
    })
  ),
  edge_cases: z.array(
    z.object({
      case: z.string(),
      risk: z.enum(["PASS", "RISK", "UNKNOWN"]),
      explanation: z.string(),
    })
  ),
  judge_prediction: z.object({
    correctness: z.enum(["LOW", "MEDIUM", "HIGH"]),
    tle: z.enum(["LOW", "MEDIUM", "HIGH"]),
    mle: z.enum(["LOW", "MEDIUM", "HIGH"]),
    overflow: z.enum(["LOW", "MEDIUM", "HIGH"]),
    edge_cases: z.enum(["LOW", "MEDIUM", "HIGH"]),
  }),
  code_quality: z.object({
    score: z.number().int().min(0).max(100),
    comments: z.array(z.string()),
  }),
  hints: z.object({
    hint1: z.string(),
    hint2: z.string(),
    full_explanation: z.string(),
  }),
  tests: z.array(
    z.object({
      input: z.string(),
      expected_output: z.string(),
      purpose: z.string(),
    })
  ),
});
