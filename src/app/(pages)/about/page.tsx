import { Activity, BookOpen, Code, GraduationCap, HelpCircle, ShieldCheck } from "lucide-react";


export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] px-6 py-8">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            Giới thiệu về HVTCoder
          </h1>
          <p className="text-muted-foreground max-w-4xl">
            HVTCoder là mentor lập trình thi đấu có trợ giúp AI, giúp các học sinh hiểu
            chương trình, tìm lỗi và xây dựng thuật toán tốt hơn.
          </p>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">
            Về HVTCoder
          </h2>
          <p className="text-muted-foreground">
            HVTCoder không phải là một chatbot AI chung. Nó được thiết kế như
            một mentor lập trình thi đấu giàu kinh nghiệm, tập trung vào:
          </p>
          <div className="grid gap-4 mt-4">
            <div className="flex items-start space-x-3">
              <Code className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-foreground">Phân tích thuật toán</h3>
                <p className="text-sm text-muted-foreground">
                  Xác định thuật toán đang được sử dụng và giải thích tại sao nó hoạt động
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ShieldCheck className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-foreground">Phát hiện lỗi</h3>
                <p className="text-sm text-muted-foreground">
                  Tìm kiếm lỗi logic, truy cập mảng không hợp lệ và các vấn đề khác
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <GraduationCap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-foreground">Chế độ học tập</h3>
                <p className="text-sm text-muted-foreground">
                  Gợi ý để định hướng rồi giải thích chi tiết, không cho đáp án trực tiếp
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">
            Triết lý
          </h2>
          <p className="text-muted-foreground">
            <strong>Không chỉ lấy đáp án. Hiểu thuật toán.</strong>
          </p>
          <p className="text-muted-foreground">
            HVTCoder không chỉ là một công cụ giải quyết bài tập - nó là một
            giáo viên tương tác giúp học sinh phát triển kỹ năng lập trình thi đấu thông
            qua:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
            <li>Phân tích chương trình thực tế thay vì sinh ra đáp án có sẵn</li>
            <li>Giải thích tại sao một cách tiếp cận là tốt và tại sao một cách khác có thể tốt hơn</li>
            <li>Dạy học sinh suy nghĩ như một lập trình viên thi đấu chuyên nghiệp</li>
            <li>Không chỉ đưa ra lời giải, mà còn giúp học sinh tự hiểu và ghi nhớ kiến thức</li>
          </ul>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">
            Tài nguyên
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card p-6">
              <div className="flex items-start space-x-3">
                <HelpCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h3 className="font-medium text-foreground">Trợ giúp học tập</h3>
                  <p className="text-sm text-muted-foreground">
                    HVTCoder giải đáp các bài tập thi đấu, cung cấp phân tích chi tiết
                    về thuật toán, độ phức tạp và lỗi có thể xảy ra.
                  </p>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-start space-x-3">
                <BookOpen className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h3 className="font-medium text-foreground">Nâng cao kỹ năng</h3>
                  <p className="text-sm text-muted-foreground">
                    Bằng cách xác định suy nghĩ của mình và so sánh với giải pháp tốt hơn,
                    học sinh bắt đầu hiểu thuật toán và cách tư duy ở mức độ cao hơn.
                  </p>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-start space-x-3">
                <Activity className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h3 className="font-medium text-foreground">Thực hành liên tục</h3>
                  <p className="text-sm text-muted-foreground">
                    Lịch sử phân tích giúp học sinh theo dõi tiến trình và nhận ra những
                    điểm mà mình cần cải thiện theo thời gian.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">
            Thành phần kỹ thuật
          </h2>
          <p className="text-muted-foreground max-w-3xl">
            HVTCoder được xây dựng với mục tiêu trở thành một công cụ học tập chuyên
            nghiệp giúp học sinh nâng cao kỹ năng lập trình thi đấu. Nó kế thừa tinh
            hoa của các công cụ lập trình truyền thống trong khi tận dụng các tính năng
            của AI hiện đại để tạo ra trải nghiệm học tập tốt hơn.
          </p>
        </div>
      </div>
    </div>
  );
}