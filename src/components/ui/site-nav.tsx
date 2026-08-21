'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function BrandLogo() {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      // already on the homepage — just scroll back to the top instead of reloading
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/');
    }
  };

  return (
    <Link
      href="/"
      className="brand brand-btn"
      onClick={handleClick}
      aria-label="HVTCoder — về đầu trang / trang chủ"
      title="Về đầu trang"
    >
      <span className="dot" aria-hidden="true"></span>
      HVTCoder
    </Link>
  );
}

export default function SiteNav({ variant = 'home' }: { variant?: 'home' | 'review' }) {
  return (
    <nav className="site">
      <div className="wrap row">
        <BrandLogo />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {variant === 'home' && (
            <a href="#features" className="btn btn-ghost btn-sm">
              Tính năng
            </a>
          )}
          <ThemeToggle />
          {variant === 'home' && (
            <Link href="/review" className="btn btn-primary btn-sm">
              Bắt đầu phân tích
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
