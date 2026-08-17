import { Logo } from "@/components/ui/logo";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-row">
        <Logo />
        <span className="footer-tag">Born to Code, Built to Solve.</span>
        <a
          className="footer-tag footer-link"
          href="https://github.com/versachios/HVTCoder"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/versachios/HVTCoder
        </a>
      </div>
    </footer>
  );
}
