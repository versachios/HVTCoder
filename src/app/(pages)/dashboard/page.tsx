
import Link from "next/link";
import { useQuery, useState } from "@tanstack/react-query";
import { prisma } from "@/lib/db/prisma";
import { BarChart2, Database, TrendingUp, Users, AlertCircle, List, Settings } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";


export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<string>("7"); // 7, 30, 90 days

  const fetchDashboardStats = async () => {
    // Calculate date based on timeRange
    let daysAgo = 7;
    if (timeRange === "30") daysAgo = 30;
    else if (timeRange === "90") daysAgo = 90;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    const [totalAnalyses, recentAnalyses, allAnalyses] = await Promise.all([
      prisma.analysis.count(),
      prisma.analysis.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      prisma.analysis.findMany({
        select: {
          codeQuality: true,
          verdict: true,
          language: true,
          confidence: true,
          algorithm: true,
          createdAt: true,
        },
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      }),
    ]);

    // Calculate average quality score from codeQuality.score
    const qualityScores = allAnalyses
      .map((a) => a.codeQuality)
      .filter((cq): cq is { score: number } => cq !== null && typeof cq === 'object' && 'score' in cq && typeof (cq as any).score === 'number')
      .map((cq) => (cq as any).score);
    const avgQuality =
      qualityScores.length > 0
        ? qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length
        : 0;

    // Calculate average confidence
    const confidenceScores = allAnalyses
      .map((a) => a.confidence)
      .filter((c): c is number => typeof c === 'number');
    const avgConfidence =
      confidenceScores.length > 0
        ? confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length
        : 0;

    // Most common verdict
    const verdictCountMap = new Map<string, number>();
    allAnalyses.forEach((a) => {
      const count = verdictCountMap.get(a.verdict) ?? 0;
      verdictCountMap.set(a.verdict, count + 1);
    });
    let mostCommonIssue = "Không có dữ liệu";
    let maxVerdictCount = 0;
    verdictCountMap.forEach((count, verdict) => {
      if (count > maxVerdictCount) {
        maxVerdictCount = count;
        mostCommonIssue = verdict;
      }
    });

    // Most common algorithm
    const algorithmCountMap = new Map<string, number>();
    allAnalyses.forEach((a) => {
      if (a.algorithm && typeof a.algorithm === 'object' && 'detected' in a.algorithm) {
        const detected = (a.algorithm as any).detected;
        const count = algorithmCountMap.get(detected) ?? 0;
        algorithmCountMap.set(detected, count + 1);
      }
    });
    let mostCommonAlgorithm = "Không có dữ liệu";
    let maxAlgorithmCount = 0;
    algorithmCountMap.forEach((count, algorithm) => {
      if (count > maxAlgorithmCount) {
        maxAlgorithmCount = count;
        mostCommonAlgorithm = algorithm;
      }
    });

    // Most common language
    const languageCountMap = new Map<string, number>();
    allAnalyses.forEach((a) => {
      const count = languageCountMap.get(a.language) ?? 0;
      languageCountMap.set(a.language, count + 1);
    });
    let mostCommonLanguage = "Không có dữ liệu";
    let maxLanguageCount = 0;
    languageCountMap.forEach((count, language) => {
      if (count > maxLanguageCount) {
        maxLanguageCount = count;
        mostCommonLanguage = language;
      }
    });

    // Chart data: analyses per day for the selected time range
    const filteredAnalyses = allAnalyses.filter(
      (analysis) => new Date(analysis.createdAt) >= startDate
    );

    // Group by day
    const grouped = filteredAnalyses.reduce((acc, analysis) => {
      const date = new Date(analysis.createdAt);
      const dayString = date.toISOString().split('T')[0]; // YYYY-MM-DD
      acc[dayString] = (acc[dayString] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Create array for the selected time range, filling in missing days with 0
    const chartData: { date: string; count: number }[] = [];
    for (let i = daysAgo - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      chartData.push({
        date: dateString,
        count: grouped[dateString] || 0,
      });
    }

    return {
      totalAnalyses,
      avgQuality: Number(avgQuality.toFixed(1)),
      avgConfidence: Number((avgConfidence * 100).toFixed(1)),
      mostCommonIssue,
      mostCommonAlgorithm,
      mostCommonLanguage,
      recentAnalyses,
      chartData,
    };
  };

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["dashboard", timeRange],
    queryFn: fetchDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="grid gap-6">
        <div className="card p-6">
          <div className="flex items-start space-x-4">
            <div className="h-6 w-6 bg-gray-200 rounded flex-shrink-0" />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground h-4 bg-gray-200 rounded w-1/2"></h3>
              <p className="text-sm text-muted-foreground h-3 bg-gray-200 rounded w-1/3"></p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-start space-x-4">
            <div className="h-6 w-6 bg-gray-200 rounded flex-shrink-0" />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground h-4 bg-gray-200 rounded w-1/2"></h3>
              <p className="text-sm text-muted-foreground h-3 bg-gray-200 rounded w-1/3"></p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-start space-x-4">
            <div className="h-6 w-6 bg-gray-200 rounded flex-shrink-0" />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground h-4 bg-gray-200 rounded w-1/2"></h3>
              <p className="text-sm text-muted-foreground h-3 bg-gray-200 rounded w-1/3"></p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-start space-x-4">
            <div className="h-6 w-6 bg-gray-200 rounded flex-shrink-0" />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground h-4 bg-gray-200 rounded w-1/2"></h3>
              <p className="text-sm text-muted-foreground h-3 bg-gray-200 rounded w-1/3"></p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-start space-x-4">
            <div className="h-6 w-6 bg-gray-200 rounded flex-shrink-0" />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground h-4 bg-gray-200 rounded w-1/2"></h3>
              <p className="text-sm text-muted-foreground h-3 bg-gray-200 rounded w-1/3"></p>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground mb-4 h-4 bg-gray-200 rounded w-1/3"></h2>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-5">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-medium text-foreground h-4 bg-gray-200 rounded w-1/2"></h3>
                  <p className="text-sm text-muted-foreground h-3 bg-gray-200 rounded w-1/3"></p>
                </div>
                <div className="text-xs px-2 py-0.5 rounded h-4 bg-gray-200"></div>
              </div>
              <div className="text-sm text-muted-foreground h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-bold text-foreground mb-4 h-4 bg-gray-200 rounded w-1/3"></h2>
          <div className="h-96">
            <div className="bg-gray-200 rounded h-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-destructive">Có lỗi xảy ra!</div>;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] px-6 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Tổng quan</h1>
        <div className="flex items-center space-x-3">
          <ButtonVariant
            value="7"
            label="7 ngày"
            active={timeRange === "7"}
            onChange={(val) => { setTimeRange(val); refetch(); }}
          />
          <ButtonVariant
            value="30"
            label="30 ngày"
            active={timeRange === "30"}
            onChange={(val) => { setTimeRange(val); refetch(); }}
          />
          <ButtonVariant
            value="90"
            label="90 ngày"
            active={timeRange === "90"}
            onChange={(val) => { setTimeRange(val); refetch(); }}
          />
        </div>
      </div>

      <div className="grid gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-start space-x-4">
            <Users className="h-6 w-6 text-primary flex-shrink-0" />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">{data?.totalAnalyses ?? 0}</h3>
              <p className="text-sm text-muted-foreground">Tổng số lần phân tích</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-start space-x-4">
            <TrendingUp className="h-6 w-6 text-primary flex-shrink-0" />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">
                {data?.avgQuality ?? 0}
              </h3>
              <p className="text-sm text-muted-foreground">Điểm chất lượng trung bình</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-start space-x-4">
            <AlertCircle className="h-6 w-6 text-primary flex-shrink-0" />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">
                {data?.avgConfidence ?? 0}%
              </h3>
              <p className="text-sm text-muted-foreground">Độ tin cậy trung bình</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-start space-x-4">
            <Database className="h-6 w-6 text-primary flex-shrink-0" />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">
                {data?.mostCommonIssue ?? "Không có dữ liệu"}
              </h3>
              <p className="text-sm text-muted-foreground">Kết quả thường gặp</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-start space-x-4">
            <List className="h-6 w-6 text-primary flex-shrink-0" />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">
                {data?.mostCommonAlgorithm ?? "Không có dữ liệu"}
              </h3>
              <p className="text-sm text-muted-foreground">Thuật toán phổ biến nhất</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-start space-x-4">
            <Settings className="h-6 w-6 text-primary flex-shrink-0" />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">
                {data?.mostCommonLanguage ?? "Không có dữ liệu"}
              </h3>
              <p className="text-sm text-muted-foreground">Ngôn ngữ phổ biến nhất</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-foreground mb-4">
          Phân tích gần đây
        </h2>
        {data?.recentAnalyses?.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Chưa có phân tích nào.</p>
        ) : (
          <div className="space-y-4">
            {data?.recentAnalyses?.map((analysis) => {
              const verdictClass = analysis.verdict === "LIKELY_CORRECT"
                ? "bg-green-100 text-green-800"
                : analysis.verdict === "LIKELY_WRONG"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800";
              return (
                <div key={analysis.id} className="card p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{analysis.language}</h3>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {analysis.problem.substring(0, 100)}{analysis.problem.length > 100 ? "..." : ""}
                      </p>
                    </div>
                    <div className="text-xs px-2 py-0.5 rounded">
                      <span className={verdictClass}>
                        {analysis.verdict}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(analysis.createdAt).toLocaleDateString("vi-VN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {data?.chartData && (
        <div className="card p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Hoạt động theo thời gian
          </h2>
          <div className="relative">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getDate()}/${d.getMonth() + 1}`;
                }} />
                <YAxis
                  domain={[0, 'auto']}
                  tickCount={5}
                />
                <Tooltip
                  labelFormatter={(date) => {
                    const d = new Date(date);
                    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
                  }}
                  formatter={(value) => `${value} lần phân tích`}
                  contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white', padding: '8px', borderRadius: '4px' }}
                  separator=" : "
                  labelStyle={{ fontWeight: 600 }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </div>
  );
}


// Helper component for time range buttons
function ButtonVariant({ value, label, active, onChange }: {
  value: string;
  label: string;
  active: boolean;
  onChange: (value: string) => void
}) {
  return (
    <button
      onClick={() => onChange(value)}
      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200
        ${active
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "bg-border text-muted-foreground hover:bg-accent border border-input"}
      `}
    >
      {label}
    </button>
  );
}