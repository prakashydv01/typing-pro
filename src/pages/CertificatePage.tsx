import { useMemo, useState } from 'react'
import { useHistoryStore } from '../store/historyStore'

export function CertificatePage() {
  const results = useHistoryStore((s) => s.results)
  const best = useMemo(() => {
    return [...results].sort((a, b) => b.wpm - a.wpm)[0]
  }, [results])
  const [name, setName] = useState('Your Name')

  const generate = () => {
    if (!best) return
    const popup = window.open('', '_blank', 'width=1200,height=800')
    if (!popup) return

    const safeName = name || 'Your Name'
    const safeFileName = `TypingPro-Certificate-${safeName.replaceAll(' ', '_')}`
    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${safeFileName}</title>
    <style>
      @page { size: A4 landscape; margin: 0; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        width: 100vw;
        height: 100vh;
        background: #0f172a;
        color: #ffffff;
        font-family: Inter, Arial, sans-serif;
        display: grid;
        place-items: center;
      }
      .certificate {
        width: 100%;
        max-width: 1100px;
        height: min(100vh, 760px);
        border: 2px solid #334155;
        padding: 64px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
        text-align: center;
      }
      .title { font-size: 48px; font-weight: 700; }
      .subtitle { font-size: 24px; color: #cbd5e1; }
      .name { font-size: 56px; font-weight: 700; }
      .score { font-size: 28px; }
      .meta { font-size: 18px; color: #94a3b8; }
      .footer { margin-top: 28px; font-size: 14px; color: #94a3b8; }
      @media print {
        body { width: auto; height: auto; }
        .certificate { width: 100vw; height: 100vh; max-width: none; border: none; }
      }
    </style>
  </head>
  <body>
    <div class="certificate">
      <div class="title">Certificate of Typing Achievement</div>
      <div class="subtitle">This certifies that</div>
      <div class="name">${safeName}</div>
      <div class="score">achieved ${best.wpm} WPM with ${best.accuracy}% accuracy</div>
      <div class="meta">Mode: ${best.mode} · Difficulty: ${best.difficulty}</div>
      <div class="footer">Made With I Love Typing</div>
    </div>
    <script>
      window.onload = () => {
        window.print();
      };
    </script>
  </body>
</html>`

    popup.document.open()
    popup.document.write(html)
    popup.document.close()
  }

  return (
    <div className="grid gap-4">
      <div className="card p-4">
        <div className="text-lg font-semibold">Certificate Generator</div>
        <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Generates a PDF certificate from your best local results.
        </div>
      </div>

      <div className="card p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Name
            </div>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex items-end justify-between gap-3">
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Best result:{' '}
              <span className="font-semibold">
                {best ? `${best.wpm} WPM / ${best.accuracy}%` : 'No history yet'}
              </span>
            </div>
            <button className="btn-primary" onClick={generate} disabled={!best}>
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

