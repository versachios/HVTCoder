'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <>
      <nav className="site">
        <div className="wrap row">
          <div className="brand"><span className="dot"></span> HVTCoder</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <a href="#features" className="btn btn-ghost btn-sm">Tính năng</a>
            <Link href="/review" className="btn btn-primary btn-sm">Bắt đầu phân tích</Link>
          </div>
        </div>
      </nav>

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
            <div className="rank" style={{ ['--rc' as any]: '#8792A3' }}><div className="node"></div><div className="label">Newbie</div></div>
            <div className="rank" style={{ ['--rc' as any]: '#1F6E48' }}><div className="node"></div><div className="label">Pupil</div></div>
            <div className="rank" style={{ ['--rc' as any]: '#2E6FB8' }}><div className="node"></div><div className="label">Specialist</div></div>
            <div className="rank" style={{ ['--rc' as any]: '#2C8577' }}><div className="node"></div><div className="label">Expert</div></div>
            <div className="rank" style={{ ['--rc' as any]: '#7B4FA0' }}><div className="node"></div><div className="label">Cand. Master</div></div>
            <div className="rank" style={{ ['--rc' as any]: '#C99312' }}><div className="node"></div><div className="label">Master</div></div>
            <div className="rank" style={{ ['--rc' as any]: '#AE3A2E' }}><div className="node"></div><div className="label">Grandmaster</div></div>
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

            <div className="feat-card" style={{ ['--tc' as any]: 'var(--b-purple)' }}>
              <div className="feat-icon" style={{ ['--tint' as any]: 'rgba(123,79,160,.12)', ['--tc' as any]: 'var(--b-purple)' }}>D</div>
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

      <section className="section" style={{ paddingTop: 0 }}>
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
            <div className="stat-row"><div className="num" style={{ color: 'var(--b-yellow)' }}>O(n log n)</div><div className="lbl">ước lượng độ phức tạp tự động</div></div>
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
          <div className="tag">Born to Code, Built to Solve.</div>
          <a className="tag" href="https://github.com/versachios/HVTCoder" target="_blank" rel="noopener noreferrer">github.com/versachios/HVTCoder</a>
        </div>
      </footer>

      </>
  );
}
