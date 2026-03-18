"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

interface MonthlyChartProps {
  data: { month: string; total: number }[];
}

function formatMonthLabel(month: string) {
  const m = parseInt(month.split("-")[1]);
  return `${m}월`;
}

export default function MonthlyChart({ data }: MonthlyChartProps) {
  const chartData = {
    labels: data.map((d) => formatMonthLabel(d.month)),
    datasets: [
      {
        data: data.map((d) => d.total),
        backgroundColor: "#2563eb",
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx: { raw: unknown }) => `${ctx.raw} km`,
        },
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { display: false }, grid: { display: false }, border: { display: false } },
      x: { grid: { display: false }, border: { display: false } },
    },
  };

  return (
    <div className="h-[160px]">
      <Bar data={chartData} options={{ ...options, maintainAspectRatio: false }} />
    </div>
  );
}
