import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="brand" aria-label="HVTCoder — Trang chủ">
      <span className="logo-mark" aria-hidden="true">
        AC
      </span>
      <span className="brand-name">HVTCoder</span>
    </Link>
  );
}
