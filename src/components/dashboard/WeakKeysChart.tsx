import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useMemo } from 'react'
import { useAnalysisStore } from '../../store/analysisStore'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export function WeakKeysChart() {
  const keys = useAnalysisStore((s) => s.keys)

  const data = useMemo(() => {
    const list = Object.values(keys)
      .filter((k) => k.presses >= 5)
      .map((k) => ({ key: k.key, rate: k.mistakes / k.presses, presses: k.presses }))
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 10)

    return {
      labels: list.map((x) => (x.key === ' ' ? '␠' : x.key)),
      datasets: [
        {
          label: 'Mistake rate',
          data: list.map((x) => Math.round(x.rate * 100)),
          backgroundColor: 'rgba(244,63,94,0.35)',
          borderColor: '#f43f5e',
        },
      ],
    }
  }, [keys])

  return (
    <div className="card p-4">
      <div className="mb-2 flex items-baseline justify-between">
        <div className="text-sm font-medium">Weak keys</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Based on local analysis
        </div>
      </div>
      <Bar
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true, suggestedMax: 100 } },
        }}
        height={260}
      />
    </div>
  )
}

