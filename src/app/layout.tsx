import './globals.css';
import { Navbar } from "@/components/navbar";
import * as NextThemes from 'next-themes';
import { ThemeProvider as NextThemesProvider } from "next-themes";

export const metadata = {
  title: 'HVTCoder',
  description: 'Hành trình vạn dặm bắt đầu từ những bước chân.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen transition-colors duration-200 font-[Inter] relative overflow-hidden">
        <div className="fixed inset-0 -z-10 bg-network-grid opacity-10"></div>
        <div className="fixed inset-0 -z-10 animate-gradientShift opacity-15"></div>
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)] relative z-10">{children}</main>
        </NextThemesProvider>
      </body>
    </html>
  );
}