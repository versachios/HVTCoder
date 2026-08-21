import Link from 'next/link';
import SiteNav from '@/components/ui/site-nav';

export default function NotFound() {
  return (
    <>
      <SiteNav variant="review" />
      <div className="wrap notfound-wrap">
        <img src="/404-terminal.png" alt="Lỗi 404 — không tìm thấy trang" />
        <span className="kicker">404 — Wrong Answer</span>
        <h1>Trang bạn tìm không tồn tại.</h1>
        <p>
          Có thể đường link đã sai, hoặc trang này chưa từng được submit. Quay lại trang chủ hoặc
          bắt đầu phân tích code mới nhé.
        </p>
        <div className="hero-cta">
          <Link href="/" className="btn btn-primary">
            Về trang chủ →
          </Link>
          <Link href="/review" className="btn btn-ghost">
            Bắt đầu phân tích
          </Link>
        </div>
      </div>
    </>
  );
}
