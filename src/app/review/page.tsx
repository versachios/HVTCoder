'use client';

import { useState, useCallback } from 'react';
import SiteNav from '@/components/ui/site-nav';

type Verdict = {
  tag: string;
  tone: 'teal' | 'amber' | 'red';
  complexity: string;
  note: string;
  issue: string;
  hint: string;
};

export default function ReviewPage() {
  const [problem, setProblem] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isOcr, setIsOcr] = useState(false);
  const [language, setLanguage] = useState<'C++' | 'Python'>('C++');
  const [code, setCode] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Verdict | null>(null);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        const blob = item.getAsFile();
        if (!blob) continue;
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = async () => {
          const dataUrl = reader.result as string;
          setImages((prev) => [...prev, dataUrl]);
          setIsOcr(true);
          try {
            const res = await fetch('/api/ocr', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image: dataUrl }),
            });
            const data = await res.json();
            if (!res.ok) {
              throw new Error(data.error || 'OCR failed');
            }
            const text = data.text.trim();
            if (text) {
              setProblem((prev) => (prev ? prev + '\n\n' + text : text));
            }
          } catch (err) {
            console.error('OCR error:', err);
            setError('Không đọc được ảnh, thử ảnh khác hoặc gõ tay đề bài.');
          } finally {
            setIsOcr(false);
          }
        };
        reader.readAsDataURL(blob);
        break;
      }
    }
  }, []);

  const handleSubmit = async () => {
    if (!problem.trim() || !code.trim()) {
      setError('Nhập cả đề bài và code trước khi gửi nhé.');
      return;
    }
    setError(null);
    setIsAnalyzing(true);
    setResult(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem, language, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Có lỗi xảy ra, thử lại sau.');
      } else {
        setResult(data as Verdict);
      }
    } catch (err) {
      console.error('Analyze fetch error:', err);
      setError('Không kết nối được tới server, kiểm tra lại mạng.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <SiteNav variant="review" />

      <div className="wrap review-wrap">
        <div className="section-head" style={{ marginBottom: 32 }}>
          <span className="kicker">Phân tích</span>
          <h1 className="h2">Nhập đề bài và code của bạn</h1>
          <p>Dán đề bài (có thể paste ảnh), chọn ngôn ngữ, dán code — rồi bấm phân tích.</p>
        </div>

        <div className="review-grid">
          <div className="panel">
            <label className="panel-label">Đề bài</label>
            <textarea
              className="problem-input"
              placeholder="Nhập đề bài tại đây, hoặc dán (Ctrl+V) một ảnh chụp đề..."
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              onPaste={handlePaste}
              rows={7}
            />
            {isOcr && <div className="ocr-status">Đang nhận diện ảnh...</div>}
            {images.length > 0 && (
              <div className="img-row">
                {images.map((src, i) => (
                  <div className="img-thumb" key={i}>
                    <img src={src} alt={`Ảnh đề bài ${i + 1}`} />
                    <button
                      type="button"
                      className="img-remove"
                      onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                      aria-label="Xóa ảnh"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="panel-label" style={{ marginTop: 20 }}>Ngôn ngữ</label>
            <div className="lang-toggle">
              {(['C++', 'Python'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  className={`lang-pill ${language === lang ? 'active' : ''}`}
                  onClick={() => setLanguage(lang)}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="term-card review-term">
            <div className="term-head">
              <div className="term-dots"><span></span><span></span><span></span></div>
              <div className="term-file">solution.{language === 'C++' ? 'cpp' : 'py'}</div>
            </div>
            <textarea
              className="code-input"
              placeholder={language === 'C++' ? '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  ...\n}' : 'def solve():\n    ...\n'}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
            />
            <div className="term-meta">
              <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={isAnalyzing}>
                {isAnalyzing ? 'Đang phân tích...' : 'Gửi code →'}
              </button>
              {error && <span className="err-text">{error}</span>}
            </div>
          </div>
        </div>

        {result && (
          <div className="result-card">
            <div className="result-head">
              <div className={`stamp stamp-sm ${result.tone === 'red' ? 'tone-red' : ''}`}><span className="big">{result.tone === 'teal' ? 'AC' : result.tone === 'amber' ? '?!' : 'WA'}</span></div>
              <span className={`verdict tone-${result.tone}`}>{result.tag}</span>
              <span className="meta-pill">Độ phức tạp: <b>{result.complexity}</b></span>
            </div>
            <p className="result-note">{result.note}</p>
            <div className="result-grid">
              <div>
                <div className="kicker" style={{ marginBottom: 8 }}>Vấn đề phát hiện</div>
                <p className="result-text">{result.issue}</p>
              </div>
              <div>
                <div className="kicker" style={{ marginBottom: 8 }}>Gợi ý</div>
                <p className="result-text">{result.hint}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
