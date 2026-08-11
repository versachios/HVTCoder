import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import { prisma } from "@/lib/db/prisma";
import { Trash2, RefreshCw, CheckCircle2 } from "lucide-react";
import React from "react";

export default function HistoryPage() {
  const fetchHistory = async ({ pageParam = 0 }) => {
    const analyses = await prisma.analysis.findMany({
      take: 10,
      skip: pageParam * 10,
      orderBy: { createdAt: "desc" },
    });

    return {
      items: analyses,
      nextPage: analyses.length === 10 ? pageParam + 1 : null,
    };
  };

  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["history"],
    queryFn: fetchHistory,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });

  // State for deletion confirmation and success message
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<number | null>(null);
  const [deleteSuccess, setDeleteSuccess] = React.useState<string | null>(null);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);

  // State for bulk selection
  const [selectedIds, setSelectedIds] = React.useState<Set<number>>(new Set());

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="card p-6">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (error) return <div className="text-center py-12 text-destructive">Co loi xay ra!</div>;

  return (
    <div className="min-h-[calc(100vh-4rem)] px-6 py-8">
      {deleteSuccess && (
        <div className="mb-4 p-4 bg-green-50 text-green-800 rounded-lg">
          {deleteSuccess}
          <button
            onClick={() => setDeleteSuccess(null)}
            className="ml-2 text-sm underline hover:text-green-600"
          >
            Dong
          </button>
        </div>
      )}
      {deleteError && (
        <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg">
          {deleteError}
          <button
            onClick={() => setDeleteError(null)}
            className="ml-2 text-sm underline hover:text-red-600"
          >
            Dong
          </button>
        </div>
      )}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex-1">
          {selectedIds.size > 0 ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground">
                {selectedIds.size} chon
              </span>
              <Button
                variant="outline"
                onClick={() => {
                  // Select all on current page
                  const currentPageIds = new Set();
                  data?.pages.flatMap((page) => page.items)?.forEach((analysis) => {
                    currentPageIds.add(analysis.id);
                  });
                  setSelectedIds(currentPageIds);
                }}
                disabled={isFetchingNextPage}
                className="text-xs"
              >
                Chon tat ca trang nay
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedIds(new Set());
                }}
                className="text-xs"
              >
                Bo chon
              </Button>
              <Button
                variant="destructive"
                onChunk={async () => {
                  if (selectedIds.size === 0) return;

                  if (!window.confirm(`Ban co chac chan muon xoa ${selectedIds.size} phan tich da chon?`)) {
                    return;
                  }

                  try {
                    // Delete all selected analyses
                    const deletePromises = Array.from(selectedIds).map(id =>
                      fetch(`/api/analysis/${id}`, { method: "DELETE" })
                    );
                    await Promise.all(deletePromises);

                    setSelectedIds(new Set());
                    setDeleteSuccess(`Da xoa ${selectedIds.size} phan tich thanh cong!`);
                    refetch();
                  } catch (error) {
                    console.error("Error bulk deleting analyses:", error);
                    setDeleteError("Khong the xoa cac phan tich da chon. Vui long thu lai sau.");
                  }
                }}
                className="text-xs"
              >
                Xoa da chon
              </Button>
            </div>
          ) : (
            <h1 className="text-2xl font-bold text-foreground">Lich su phan tich</h1>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => { refetch(); }} className="btn-secondary">
            <RefreshCw className="mr-2 h-4 w-4" /> Tai lai
          </Button>
          <Link href="/review" className="btn-primary">
            Phan tich moi
          </Link>
        </div>
      </div>

      {data?.pages.flatMap((page) => page.items).length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Chua co lich su phan tich nao.</p>
          <Link href="/review" className="btn-primary mt-4">
            Bat dau phan tich
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {data?.pages.flatMap((page) => page.items)?.map((analysis) => (
              <div key={analysis.id} className="card p-6 hover:shadow-md transition-shadow duration-200 hover:scale-[1.02]">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(analysis.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(prev => new Set(prev).add(analysis.id));
                        } else {
                          setSelectedIds(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(analysis.id);
                            return newSet;
                          });
                        }
                      }}
                      className="h-4 w-4 text-primary-foreground"
                    />
                    <div>
                      <h3 className="font-medium text-foreground">{analysis.language} Phan tich</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(analysis.createdAt).toLocaleDateString("vi-VN", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      analysis.verdict === "LIKELY_CORRECT"
                        ? "bg-green-100 text-green-800"
                        : analysis.verdict === "LIKELY_WRONG"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {analysis.verdict}
                    </span>
                    {!confirmDeleteId && (
                      <button
                        onClick={() => setConfirmDeleteId(analysis.id)}
                        className="p-1 rounded hover:bg-accent/20"
                        aria-label="Xóa"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    )}
                    {confirmDeleteId === analysis.id && (
                      <>
                        <button
                          onClick={() => {
                            setConfirmDeleteId(null);
                          }}
                          className="p-1 rounded hover:bg-red-50 text-red-600"
                          aria-label="Huy bo"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              const response = await fetch(`/api/analysis/${analysis.id}`, {
                                method: "DELETE",
                              });

                              if (!response.ok) {
                                throw new Error("Failed to delete analysis");
                              }

                              setConfirmDeleteId(null);
                              setDeleteSuccess("Da xoa phan tich thanh cong!");
                              refetch();
                            } catch (error) {
                              console.error("Error deleting analysis:", error);
                              setConfirmDeleteId(null);
                              setDeleteError("Khong the xoa phan tich. Vui long thu lai sau.");
                            }
                          }}
                          className="p-1 rounded hover:bg-red-100 text-red-800"
                        >
                          <CheckCircle2 className="h-4 w-4 text-red-600" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-foreground">Do phuc tap:</p>
                  <p className="text-muted-foreground">
                    Thoi gian: {analysis.complexity && typeof analysis.complexity === 'object' && 'time' in analysis.complexity ? String(analysis.complexity.time) : "Khong xac dinh"}
                  </p>
                  <p className="text-muted-foreground">
                    Bo nho: {analysis.complexity && typeof analysis.complexity === 'object' && 'space' in analysis.complexity ? String(analysis.complexity.space) : "Khong xac dinh"}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-input">
                  <Link
                    href={`/review/?id=${analysis.id}`}
                    className="text-primary hover:underline"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center py-6">
              <Button
                variant="outline"
                onClick={() => {
                  fetchNextPage();
                }}
                disabled={isFetchingNextPage}
                className="btn-secondary"
              >
                {isFetchingNextPage ? "Dang tai..." : "Tai them"}
                <RefreshCw className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}

function Button({ variant = "default", children, ...props }: ButtonProps): React.ReactElement {
  return (
    <button
      className={`
        px-4 py-2 rounded-md font-medium transition-colors duration-200 hover:scale-[1.02]
        ${variant === "default"
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "bg-border text-muted-foreground hover:bg-accent border border-input"}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

// Delete analysis function
const deleteAnalysis = async (id: number) => {
  try {
    const response = await fetch(`/api/analysis/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete analysis");
    }

    // Refetch the data to update the list
    refetch();
  } catch (error) {
    console.error("Error deleting analysis:", error);
    // Optionally, show an error message to the user
    alert("Khong the xoa phan tich. Vui long thu lai sau.");
  }
};
