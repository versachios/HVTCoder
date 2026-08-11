'use client';

import Link from "next/link";
import { useTheme } from "next-themes";
import { GitBranch as GitHub, Moon, Sun } from "lucide-react";

export function Navbar() {
  const { setTheme, theme } = useTheme();

  return (
    <nav className="flex h-14 w-full items-center justify-between px-4 py-2 bg-[hsl(var(--background))]/80 backdrop-blur-md border-b border-input">
      <div className="flex items-center space-x-4">
        <Link href="/" className="flex items-center space-x-3">
          <span className="text-xl font-bold text-[hsl(var(--primary))] animate-fontSwap">HVTCoder</span>
        </Link>
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/review" className="hover:text-primary transition-colors duration-200 hover:scale-[1.05]">
            Review
          </Link>
          <Link href="/history" className="hover:text-primary transition-colors duration-200 hover:scale-[1.05]">
            Lịch sử
          </Link>
          <Link href="/dashboard" className="hover:text-primary transition-colors duration-200 hover:scale-[1.05]">
            Tổng quan
          </Link>
          <Link href="/about" className="hover:text-primary transition-colors duration-200 hover:scale-[1.05]">
            Giới thiệu
          </Link>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Link href="https://github.com/versachios" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-200 hover:scale-[1.05]">
          <GitHub className="h-5 w-5" />
        </Link>

        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-md hover:bg-accent transition-colors duration-200 hover:scale-[1.05]"
                aria-label={theme === "dark" ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}>
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </nav>
  );
}