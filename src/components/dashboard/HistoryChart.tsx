import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useMemo } from 'react'
import { useHistoryStore } from '../../store/historyStore'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

export function HistoryChart() {
  const results = useHistoryStore((s) => s.results)

  const data = useMemo(() => {
    const last = [...results].slice(0, 30).reverse()
    return {
      labels: last.map((r) => new Date(r.finishedAt).toLocaleDateString()),
      datasets: [
        {
          label: 'WPM',
          data: last.map((r) => r.wpm),
          borderColor: '#4f46e5',
          backgroundColor: 'rgba(79,70,229,0.15)',
          tension: 0.35,
        },
        {
          label: 'Accuracy %',
          data: last.map((r) => r.accuracy),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.12)',
          tension: 0.35,
          yAxisID: 'y1',
        },
      ],
    }
  }, [results])

  return (
    <div className="card p-4">
      <div className="mb-2 flex items-baseline justify-between">
        <div className="text-sm font-medium">History</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Last 30 tests
        </div>
      </div>
      <Line
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true },
            y1: {
              beginAtZero: true,
              position: 'right',
              grid: { drawOnChartArea: false },
              suggestedMax: 100,
            },
          },
        }}
        height={260}
      />
    </div>
  )
}

