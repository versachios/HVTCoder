import { ArrowRightCircle, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-12 space-y-8 text-center bg-gradient-to-b from-background/50 to-background">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
          HVTCoder
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Born to Code, Built to Solve.
        </p>
        <p className="text-lg text-muted-foreground max-w-xl">
          Phân tích AI đóng vai trò chính cải thiện kĩ năng
            lập trình - thuật toán cho học sinh
        </p>
      </div>
      
      <div className="flex flex-col items-center sm:flex-row sm:justify-center sm:space-x-4 space-y-4 sm:space-y-0">
        <Button
          variant="default"
          asChild
          className="text-lg"
        >
          <a href="/review" className="flex items-center justify-center px-8 py-4 text-lg font-semibold">
            <ArrowRightCircle className="mr-3 h-5 w-5" />
            Bắt đầu phân tích
          </a>
        </Button>
      </div>
      
      <div className="mt-8 text-sm text-muted-foreground">
        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-6">
          <span>•</span>
          <span>Các ngôn ngữ hỗ trợ : C++ , Python </span>
          {/*<span>•</span>*/}
          <span>Phân tích độ phức tạp thời gian và lỗi biên</span>
          {/*<span>•</span>*/}
          <span>Giúp học sinh cải thiện kỹ năng lập trình</span>
        </div>
      </div>
    </div>
  );
}