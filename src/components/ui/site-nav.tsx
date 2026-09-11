'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const TABS = [
  { href: '/', label: 'trang_chu.tsx' },
  { href: '/review', label: 'cham_bai.tsx' },
];

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
  const pathname = usePathname();

  return (
    <nav className="site">
      <div className="wrap row">
        <div className="tabstrip">
          <span className="win-dots" aria-hidden="true">
            <span></span><span></span><span></span>
          </span>
          {TABS.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`filetab${active ? ' active' : ''}`}
              >
                <span className="filetab-dot" aria-hidden="true"></span>
                {tab.label}
                <span className="filetab-close" aria-hidden="true">×</span>
              </Link>
            );
          })}
        </div>
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
