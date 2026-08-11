'use client';

import { useState, useRef } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertTriangle, ChevronDown, Copy, Loader2, Share2 } from "lucide-react";
import { useAIAnalysis } from "@/lib/ai/client";
import Tesseract from "tesseract.js";

export default function ReviewPage() {
  const [problem, setProblem] = useState({ text: "", images: [] as string[] });
  const [constraints, setConstraints] = useState("");
  const [language, setLanguage] = useState("C++");
  const [code, setCode] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { analyze, isLoading } = useAIAnalysis();

  const handleImagePaste = async (e: ClipboardEvent) => {
    const items = (e.clipboardData || (window as any).clipboardData).items;
    let hasImage = false;

    for (const item of items) {
      if (item.type.indexOf("image") !== -1) {
        const blob = item.getAsFile();
        if (blob) {
          hasImage = true;
          const reader = new FileReader();
          reader.onload = async () => {
            const base64 = reader.result as string;
            try {
              const { data: { text } } = await Tesseract.recognize(base64, 'vie');
              // Try to split constraints if present
              let problemText = text.trim();
              let constraintsText = "";
              // Look for common constraint markers
              const constraintMarker = /(?Ràng buộc):/i;
              const split = problemText.split(constraintMarker);
              if (split.length > 1) {
                // Assume first part is problem, second part is constraints
                problemText = split[0].trim();
                constraintsText = split.slice(1).join(constraintMarker.source).trim();
              }
              setProblem(prev => ({
                text: problemText,
                images: [...prev.images, base64]
              }));
              setConstraints(constraintsText);
            } catch (err) {
              console.error('OCR error:', err);
              setProblem(prev => ({
                text: prev.text,
                images: [...prev.images, base64]
              }));
            }
          };
          reader.readAsDataURL(blob);
        }
      }
    }

    if (hasImage) {
      e.preventDefault(); // Prevent default paste behavior for images
    }
    // Allow text to be pasted normally
  };
  
  const handleAnalyze = async () => {
    if (!problem.text.trim() || !code.trim()) {
      setError("Nhập code của bạn vào đây : ");
      return;
    }
    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyze({
        problem,
        constraints,
        language,
        code
      });

      setAnalysisResult(result);
    } catch (err) {
      setError("Có lỗi xảy ra trong quá trình phân tích. Vui lòng thử lại ...");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const languages = [
    { value: "C++", label: "C++" },
    { value: "Python", label: "Python" },
    //{ value: "Java", label: "Java" }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
            Phân tích code
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Nhập đề bài, ràng buộc và code của bạn để HVTCoder phân tích:
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-inner">
            <label className="text-sm font-medium text-foreground/80 mb-2 block">De bai</label>
            <Textarea
              value={problem.text}
              onChange={(e) => setProblem(prev => ({ ...prev, text: e.target.value }))}
              onPaste={handleImagePaste}
              placeholder="Nhập đề bài tại đây (Có thể dán hình ảnh)"
              rows={6}
              className="textarea w-full"
              ref={textareaRef}
            />
            {problem.images.length > 0 && (
              <div className="mt-4 space-x-3 flex-wrap">
                {problem.images.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img}
                      alt={`Problem image ${index + 1}`}
                      className="max-w-[240px] max-h-[240px] rounded-xl border border-gray-300 dark:border-gray-600 shadow-lg transition-transform duration-200 hover:scale-105"
                    />
                    <button
                      onClick={() => {
                        setProblem(prev => ({
                          text: prev.text,
                          images: prev.images.filter((_, i) => i !== index)
                        }));
                      }}
                      className="absolute top-2 right-2 -mt-2 -mr-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-all duration-200"
                    >
                      Ãƒâ€”
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-inner">
            <label className="text-sm font-medium text-foreground/80 mb-2 block">Ngon ngu lap trinh</label>
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full textarea">
                  {language}
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.value}
                      onClick={() => setLanguage(lang.value)}
                      className={language === lang.value ? "bg-indigo-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded w-full text-left text-sm"}
                    >
                      {lang.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-inner">
            <label className="text-sm font-medium text-foreground/80 mb-2 block">Code cua ban</label>
            <div className="monaco-editor-container">
              <MonacoEditor
                height="400px"
                theme={typeof document !== 'undefined' && document.documentElement.classList.contains("dark") ? "vs-dark" : "vs"}
                language={language.toLowerCase() as any}
                value={code}
                onChange={(newCode: string | undefined) => setCode(newCode ?? "")}
                options={{
                  minimap: { enabled: true },
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  readOnly: false,
                  cursorBlinking: "solid",
                  roundedSelection: false,
                  scrollbar: {
                    verticalScrollbarSize: 10,
                    horizontalScrollbarSize: 10
                  }
                }}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center space-x-3">
              <span className="text-red-600 dark:text-red-400">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              </span>
              <span className="text-sm text-red-800 dark:text-red-200">{error}</span>
            </div>
          )}

          <div className="flex flex-wrap justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setProblem({ text: "", images: [] });
                setConstraints("");
                setLanguage("C++");
                setCode("");
                setAnalysisResult(null);
                setError(null);
              }}
              disabled={isAnalyzing || isLoading}
              className="px-4 py-2 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:scale-[1.02]"
            >
              Lam lai
            </Button>

            {analysisResult && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    // Copy analysis result to clipboard
                    navigator.clipboard.writeText(JSON.stringify(analysisResult, null, 2));
                  }}
                  title="Sao chép kết quả : "
                  className="px-3 py-2 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:scale-[1.02]"
                >
                  <Copy className="h-4 w-4 text-muted-foreground hover:text-primary" />
                  <span className="ml-1 text-xs">Sao chep</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Share analysis result (simplified)
                    if (navigator.share) {
                      navigator.share({
                        title: 'HVTCoder Analysis Result',
                        text: `Phân tích code: ${analysisResult.verdict} với độ tin cậy ${(analysisResult.confidence * 100).toFixed(0)}%`
                      }).catch(() => {
                        // Fallback to copy if share API not available
                        navigator.clipboard.writeText(`Phân tích code: ${analysisResult.verdict} với độ tin cậy ${(analysisResult.confidence * 100).toFixed(0)}%`);
                      });
                    } else {
                      navigator.clipboard.writeText(`Phân tích code: ${analysisResult.verdict} với độ tin cậy ${(analysisResult.confidence * 100).toFixed(0)}%`);
                    }
                  }}
                  title="Chia se ket qua"
                  className="px-3 py-2 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:scale-[1.02]"
                >
                  <Share2 className="h-4 w-4 text-muted-foreground hover:text-primary" />
                  <span className="ml-1 text-xs">Chia sẻ</span>
                </Button>
              </div>
            )}

            {analysisResult && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setLanguage("C++");
                    handleAnalyze();
                  }}
                  disabled={isAnalyzing || isLoading}
                  className="px-3 py-2 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-xs hover:scale-[1.02]"
                >
                  C++
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setLanguage("Python");
                    handleAnalyze();
                  }}
                  disabled={isAnalyzing || isLoading}
                  className="px-3 py-2 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-xs hover:scale-[1.02]"
                >
                  Python
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setLanguage("Java");
                    handleAnalyze();
                  }}
                  disabled={isAnalyzing || isLoading}
                  className="px-3 py-2 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-xs hover:scale-[1.02]"
                >
                  Java
                </Button>
              </div>
            )}

            <Button
              variant="default"
              onClick={handleAnalyze}
              disabled={isAnalyzing || isLoading || !problem.text.trim() || !code.trim()}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-xl hover:scale-[1.02]"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang phân tích...
                </>
              ) : (
                "Phân tích code"
              )}
            </Button>
          </div>
        </form>
      </div>

      {analysisResult && (
        <div className="space-y-6">
          <AnalysisResult result={analysisResult} />
        </div>
      )}
    </div>
  );
}

// Enhanced AnalysisResult component to display full analysis
function AnalysisResult({ result }: { result: any }) {
  // Helper function to get verdict badge class
  const getVerdictClass = (verdict: string) => {
    switch (verdict) {
      case "LIKELY_CORRECT": return "bg-green-100 text-green-800";
      case "LIKELY_WRONG": return "bg-red-100 text-red-800";
      case "LIKELY_TLE": return "bg-orange-100 text-orange-800";
      case "LIKELY_MLE": return "bg-yellow-100 text-yellow-800";
      case "NEEDS_IMPROVEMENT": return "bg-blue-100 text-blue-800";
      case "INSUFFICIENT_INFORMATION": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to get risk class for edge cases
  const getRiskClass = (risk: string) => {
    switch (risk) {
      case "PASS": return "bg-green-100 text-green-800";
      case "RISK": return "bg-red-100 text-red-800";
      case "UNKNOWN": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to get severity class for issues
  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return "bg-red-100 text-red-800";
      case "HIGH": return "bg-orange-100 text-orange-800";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800";
      case "LOW": return "bg-green-100 text-green-800";
      case "INFO": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-inner">
        <h2 className="text-2xl font-bold text-foreground mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
          Ket qua phan tich
        </h2>

        {/* Verdict and Confidence */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4 bg-white/50 dark:bg-gray-800/50 rounded-xl p-3">
            <span className={`px-3 py-1 rounded text-sm font-medium ${getVerdictClass(result.verdict)}`}>
              {result.verdict}
            </span>
            <div className="text-base text-muted-foreground flex-1">
              Do tin cay: <span className="font-medium">{(result.confidence * 100).toFixed(0)}%</span>
            </div>
          </div>

          <div className="border-t border-input pt-4"></div>

          {/* Complexity */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Do phuc tap</h3>
            <div className="space-y-3 bg-white/50 dark:bg-gray-800/50 rounded-xl p-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Thoi gian:</p>
                  <p className="text-base font-mono text-foreground">{result.complexity.time}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Bo nho:</p>
                  <p className="text-base font-mono text-foreground">{result.complexity.space}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {result.complexity.explanation}
              </p>
            </div>
          </div>

          <div className="border-t border-input pt-4"></div>

          {/* Algorithm */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Thuat toan</h3>
            <div className="space-y-3 bg-white/50 dark:bg-gray-800/50 rounded-xl p-3">
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Da phat hien:</p>
                <p className="text-base font-medium text-foreground">{result.algorithm.detected}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Gia thuyet:</p>
                <p className="text-sm text-muted-foreground">{result.algorithm.explanation}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Khuyen nghiep:</p>
                <p className="text-base font-medium text-foreground">{result.algorithm.recommended}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-input pt-4"></div>

          {/* Issues */}
          {result.issues.length > 0 && (
            <>
              <h3 className="text-lg font-semibold text-foreground">Van de phat hien</h3>
              <div className="space-y-3">
                {result.issues.map((issue: any, index: number) => (
                  <div key={index} className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{issue.title}</h4>
                        {issue.line !== null && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Dong <span className="font-medium">{issue.line}</span>
                          </p>
                        )}
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs ${getSeverityClass(issue.severity)}`}>
                        {issue.severity}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {issue.explanation}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Giai phap:</span> {issue.suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          {!result.issues.length > 0 && (
            <p className="text-sm text-muted-foreground text-center py-4 bg-white/50 dark:bg-gray-800/50 rounded-xl">
              Không phát hiện vấn đề nào trong code.
            </p>
          )}

          <div className="border-t border-input pt-4"></div>

          {/* Edge Cases */}
          {result.edge_cases.length > 0 && (
            <>
              <h3 className="text-lg font-semibold text-foreground">Truong hop dac biet</h3>
              <div className="space-y-3">
                {result.edge_cases.map((edgeCase: any, index: number) => (
                  <div key={index} className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{edgeCase.case}</h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs ${getRiskClass(edgeCase.risk)}`}>
                        {edgeCase.risk}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {edgeCase.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="border-t border-input pt-4"></div>

          {/* Judge Prediction */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Du doan kiem thu</h3>
            <div className="space-y-3 bg-white/50 dark:bg-gray-800/50 rounded-xl p-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Chính xác:</p>
                  <p className="text-base font-medium text-foreground">{result.judge_prediction.correctness}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">TLE:</p>
                  <p className="text-base font-medium text-foreground">{result.judge_prediction.tle}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">MLE:</p>
                  <p className="text-base font-medium text-foreground">{result.judge_prediction.mle}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Tràn số:</p>
                  <p className="text-base font-medium text-foreground">{result.judge_prediction.overflow}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Trường hợp đặc biệt (Case phản):</p>
                  <p className="text-base font-medium text-foreground">{result.judge_prediction.edge_cases}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-input pt-4"></div>

          {/* Code Quality */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Chất lượng code</h3>
            <div className="space-y-3 bg-white/50 dark:bg-gray-800/50 rounded-xl p-3">
              <div className="flex items-center space-x-4">
                <div className="w-24">
                  <div className="h-9 w-full bg-gradient-to-r from-green-400 to-green-500 rounded-full relative">
                    <div className={`absolute left-0 top-0 h-full w-[${result.code_quality.score}%] bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-xs font-medium leading-none`}>
                      {result.code_quality.score}
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">Điểm:</div>
                  <div className="text-base font-medium text-foreground">{result.code_quality.score}/100</div>
                </div>
              </div>
              {result.code_quality.comments.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-foreground">Ghi chú:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {result.code_quality.comments.map((comment: string, index: number) => (
                      <li key={index}>!?! {comment}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-input pt-4"></div>

          {/* Hints */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Goi y hoc tap</h3>
            <div className="space-y-3 bg-white/50 dark:bg-gray-800/50 rounded-xl p-3">
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground"><strong>Goi y 1:</strong></p>
                <p className="text-sm text-muted-foreground">{result.hints.hint1}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground"><strong>Goi y 2:</strong></p>
                <p className="text-sm text-muted-foreground">{result.hints.hint2}</p>
              </div>
              <div className="mt-4 pt--3 bg-white/50 dark:bg-gray-800/50 rounded-xl p-3">
                <p className="text-sm text-muted-foreground">
                  {result.hints.full_explanation}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-input pt-4"></div>

          {/* Test Cases */}
          {result.tests.length > 0 && (
            <>
              <h3 className="text-lg font-semibold text-foreground">Bộ test mẫu</h3>
              <div className="space-y-3">
                {result.tests.map((test: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-foreground">Test #{index + 1}</h4>
                      <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                        {test.purpose}
                      </span>
                    </div>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-foreground">Input:</span>
                        <p className="text-base font-mono text-muted-foreground">{test.input}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-foreground">Output chuẩn:</span>
                        <p className="text-base font-mono text-muted-foreground">{test.expected_output}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}



