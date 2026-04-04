import { useMemo, useState } from 'react'
import { jsPDF } from 'jspdf'
import { useHistoryStore } from '../store/historyStore'

export function CertificatePage() {
  const results = useHistoryStore((s) => s.results)
  const best = useMemo(() => {
    return [...results].sort((a, b) => b.wpm - a.wpm)[0]
  }, [results])
  const [name, setName] = useState('Your Name')

  const generate = () => {
    if (!best) return
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
    const w = doc.internal.pageSize.getWidth()
    const h = doc.internal.pageSize.getHeight()

    doc.setFillColor(15, 23, 42)
    doc.rect(0, 0, w, h, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(36)
    doc.text('Certificate of Typing Achievement', w / 2, 120, { align: 'center' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(18)
    doc.text('This certifies that', w / 2, 180, { align: 'center' })

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(32)
    doc.text(name, w / 2, 230, { align: 'center' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(16)
    doc.text(
      `achieved ${best.wpm} WPM with ${best.accuracy}% accuracy`,
      w / 2,
      280,
      { align: 'center' },
    )

    doc.setTextColor(148, 163, 184)
    doc.setFontSize(12)
    doc.text(`Mode: ${best.mode} · Difficulty: ${best.difficulty}`, w / 2, 320, {
      align: 'center',
    })
    doc.text(`Made With I Love Typing`, w / 2, h - 80, { align: 'center' })

    doc.save(`TypingPro-Certificate-${name.replaceAll(' ', '_')}.pdf`)
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

