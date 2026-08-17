import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export default function Navbar() {
  return (
    <nav className="site-nav">
      <div className="wrap nav-row">
        <Logo />
        <div className="nav-links">
          <Link href="#features" className="nav-link">
            Tính năng
          </Link>
        </div>
        <Link href="/review" className="btn btn-default btn-sm">
          Bắt đầu phân tích
        </Link>
      </div>
    </nav>
  );
}
