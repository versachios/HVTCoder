'use client';

import Link from 'next/link';
import SiteNav from '@/components/ui/site-nav';

export default function Home() {
  return (
    <>
      <SiteNav variant="home" />

      <header className="hero">
        <div className="wrap hero-grid">
          <div>
            <div className="eyebrow"><span className="chip">AC</span> Đánh giá bởi AI, không phải giám khảo may rủi</div>
            <h1 className="headline">Từ <span className="strike">Wrong&nbsp;Answer</span><br />đến <span className="accept">Accepted.</span></h1>
            <p className="sub">HVTCoder đọc hiểu đề bài, chấm thử lời giải và chỉ đúng dòng khiến bạn WA hay TLE — trước khi phòng thi thật làm điều đó.</p>
            <div className="hero-cta">
              <Link href="/review" className="btn btn-primary">Bắt đầu phân tích →</Link>
              <a href="#features" className="btn btn-ghost">Xem cách hoạt động</a>
            </div>
            <div className="hero-cta" style={{ marginTop: 14 }}>
              <span className="hint">$ hỗ trợ C++ · Python &nbsp;|&nbsp; miễn phí cho học sinh</span>
            </div>
          </div>

          <div className="term-card">
            <div className="term-head">
              <div className="term-dots"><span></span><span></span><span></span></div>
              <div className="term-file">baitap_042.cpp</div>
              <div className="stamp stamp-sm"><span className="big">AC</span></div>
            </div>
            <div className="term-body">
              <div><span className="ln">1</span><span className="kw">#include</span> &lt;bits/stdc++.h&gt;</div>
              <div><span className="ln">2</span><span className="kw">using namespace</span> std;</div>
              <div><span className="ln">3</span></div>
              <div><span className="ln">4</span><span className="kw">int</span> <span className="fn">main</span>() {'{'}</div>
              <div><span className="ln">5</span>&nbsp;&nbsp;<span className="kw">int</span> n; cin &gt;&gt; n;</div>
              <div><span className="ln">6</span>&nbsp;&nbsp;<span className="cm">// tìm tổng con lớn nhất — O(n)</span></div>
              <div><span className="ln">7</span>&nbsp;&nbsp;<span className="kw">long long</span> best = <span className="num">-1e18</span>, cur = <span className="num">0</span>;</div>
              <div><span className="ln">8</span>&nbsp;&nbsp;...</div>
              <div><span className="ln">9</span>{'}'}</div>
            </div>
            <div className="term-meta">
              <div className="meta-pill">Độ phức tạp: <b>O(n log n)</b></div>
              <div className="meta-pill">Bộ nhớ: <b>12.4 MB</b></div>
              <div className="meta-pill">Thời gian: <b>84 ms</b></div>
            </div>
          </div>
        </div>
      </header>

      <section className="ladder">
        <div className="wrap">
          <div className="ladder-caption">// HVTCoder đồng hành cùng bạn ở mọi cấp độ</div>
          <div className="ladder-row">
            <div className="rank" style={{ ['--rc' as any]: 'var(--ink-dim)' }}><div className="node"></div><div className="label">Newbie</div></div>
            <div className="rank" style={{ ['--rc' as any]: 'var(--stamp-green)' }}><div className="node"></div><div className="label">Pupil</div></div>
            <div className="rank" style={{ ['--rc' as any]: 'var(--b-blue)' }}><div className="node"></div><div className="label">Specialist</div></div>
            <div className="rank" style={{ ['--rc' as any]: 'var(--b-teal)' }}><div className="node"></div><div className="label">Expert</div></div>
            <div className="rank" style={{ ['--rc' as any]: 'var(--b-cyan)' }}><div className="node"></div><div className="label">Cand. Master</div></div>
            <div className="rank" style={{ ['--rc' as any]: 'var(--b-yellow)' }}><div className="node"></div><div className="label">Master</div></div>
            <div className="rank" style={{ ['--rc' as any]: 'var(--stamp-red)' }}><div className="node"></div><div className="label">Grandmaster</div></div>
          </div>
        </div>
      </section>

      <section className="section" id="features">
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">Tính năng</span>
            <h2 className="h2">Mọi thứ bạn cần giữa hai lần submit</h2>
            <p>Không chỉ báo đúng/sai — HVTCoder giải thích tại sao, và giúp bạn sửa nhanh hơn cho lần sau. Sáu tính năng, sáu "bài" trong đề — như một round thi thật.</p>
          </div>

          <div className="feat-grid">
            <div className="feat-card" style={{ ['--tc' as any]: 'var(--b-blue)' }}>
              <div className="feat-icon" style={{ ['--tint' as any]: 'rgba(46,111,184,.12)', ['--tc' as any]: 'var(--b-blue)' }}>A</div>
              <h3>Phân tích bài toán</h3>
              <p>Đọc đề, xác định ràng buộc và gợi ý hướng tiếp cận trước khi bạn gõ dòng code đầu tiên.</p>
            </div>

            <div className="feat-card" style={{ ['--tc' as any]: 'var(--b-teal)' }}>
              <div className="feat-icon" style={{ ['--tint' as any]: 'rgba(44,133,119,.12)', ['--tc' as any]: 'var(--b-teal)' }}>B</div>
              <h3>Kiểm nghiệm code</h3>
              <p>Chạy thử với bộ test đa dạng, tự sinh các edge case mà bạn có thể đã bỏ sót.</p>
            </div>

            <div className="feat-card" style={{ ['--tc' as any]: 'var(--stamp-red)' }}>
              <div className="feat-icon" style={{ ['--tint' as any]: 'var(--stamp-red-tint)', ['--tc' as any]: 'var(--stamp-red)' }}>C</div>
              <h3>Phân tích lỗi</h3>
              <p>Chỉ đúng dòng gây Runtime Error, TLE hay Wrong Answer — kèm giải thích tại sao.</p>
            </div>

            <div className="feat-card" style={{ ['--tc' as any]: 'var(--b-cyan)' }}>
              <div className="feat-icon" style={{ ['--tint' as any]: 'rgba(34,211,238,.12)', ['--tc' as any]: 'var(--b-cyan)' }}>D</div>
              <h3>Theo dõi kết quả</h3>
              <p>Lưu lịch sử submit, xem tiến bộ về tốc độ giải và độ phức tạp lời giải theo thời gian.</p>
            </div>

            <div className="feat-card" style={{ ['--tc' as any]: 'var(--b-orange)' }}>
              <div className="feat-icon" style={{ ['--tint' as any]: 'rgba(194,102,30,.12)', ['--tc' as any]: 'var(--b-orange)' }}>E</div>
              <h3>Review lời giải</h3>
              <p>Nhận xét về style code, độ tối ưu, và gợi ý cách viết lại sạch hơn.</p>
            </div>

            <div className="feat-card" style={{ ['--tc' as any]: 'var(--stamp-green)' }}>
              <div className="feat-icon" style={{ ['--tint' as any]: 'var(--stamp-green-tint)', ['--tc' as any]: 'var(--stamp-green)' }}>F</div>
              <h3>AI-powered</h3>
              <p>Mô hình AI được tinh chỉnh riêng cho các dạng bài thuật toán và cấu trúc dữ liệu.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section aud-section">
        <div className="wrap aud-grid">
          <div>
            <span className="kicker">Giới thiệu</span>
            <h2 className="h2">Cho những bạn nghiêm túc với thuật toán</h2>
            <ul className="aud-list">
              <li><span className="mark">✓</span> Học sinh đang ôn thi học sinh giỏi Tin học các cấp</li>
              <li><span className="mark">✓</span> Bạn đang luyện tập cho kỳ thi lập trình / ICPC, ACM</li>
              <li><span className="mark">✓</span> Người mới học thuật toán muốn có phản hồi nhanh, không phải chờ thầy cô chữa bài</li>
              <li><span className="mark">✓</span> Bất kỳ ai muốn hiểu code của mình sai ở đâu, không chỉ biết là nó sai</li>
            </ul>
          </div>
          <div className="stat-card">
            <div className="stat-row"><div className="num" style={{ color: 'var(--b-teal)' }}>C++ / Python</div><div className="lbl">ngôn ngữ hỗ trợ phân tích</div></div>
            <div className="stat-row"><div className="num" style={{ color: 'var(--b-orange)' }}>O(n log n)</div><div className="lbl">ước lượng độ phức tạp tự động</div></div>
            <div className="stat-row"><div className="num" style={{ color: 'var(--b-blue)' }}>24/7</div><div className="lbl">phản hồi ngay khi bạn submit</div></div>
          </div>
        </div>
      </section>

      <div className="wrap">
        <div className="cta-band">
          <div className="stamp" style={{ margin: '0 auto 18px' }}><span className="big">AC</span><span className="small">Đã chấm</span></div>
          <h2>Đừng đoán mò tại sao code của bạn sai nữa.</h2>
          <p>Dán code, nhận verdict, và học được gì đó sau mỗi lần nộp bài.</p>
          <Link href="/review" className="btn btn-primary">Bắt đầu phân tích →</Link>
        </div>
      </div>

      <footer>
        <div className="wrap row">
          <div className="brand" style={{ fontSize: 15 }}><span className="dot"></span> HVTCoder</div>
          <span className="tag">Born to Code, Built to Solve.</span>
          <div className="footer-icons">
            <a
              className="footer-icon-link"
              href="https://github.com/versachios/HVTCoder"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              title="GitHub"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 5.02 3.26 9.28 7.78 10.78.57.1.78-.25.78-.55 0-.27-.01-1-.02-1.96-3.16.69-3.83-1.52-3.83-1.52-.52-1.31-1.26-1.66-1.26-1.66-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.65 1.23 3.3.94.1-.73.4-1.23.72-1.51-2.52-.29-5.17-1.26-5.17-5.6 0-1.24.44-2.25 1.17-3.04-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.14 1.16a10.9 10.9 0 0 1 5.72 0c2.18-1.47 3.13-1.16 3.13-1.16.63 1.57.24 2.73.12 3.02.73.79 1.17 1.8 1.17 3.04 0 4.35-2.66 5.31-5.19 5.59.41.35.77 1.04.77 2.11 0 1.52-.01 2.75-.01 3.12 0 .3.2.66.79.55A11.26 11.26 0 0 0 23.25 11.75C23.25 5.48 18.27.5 12 .5Z"/>
              </svg>
            </a>
            <a
              className="footer-icon-link"
              href="https://facebook.com/versachios/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              title="Facebook"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>

      </>
  );
}
