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
        backgroundColor: data.map((_, i) =>
          i === data.length - 1 ? "#0d9668" : "#d1d5db"
        ),
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        backgroundColor: "#1a1a1a",
        titleFont: { family: "'Pretendard Variable', sans-serif", size: 12 },
        bodyFont: { family: "'Pretendard Variable', sans-serif", size: 13, weight: "bold" as const },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx: { raw: unknown }) => `${ctx.raw} km`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { display: false },
        grid: { display: false },
        border: { display: false },
      },
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          font: { family: "'Pretendard Variable', sans-serif", size: 12 },
          color: "#a3a3a3",
        },
      },
    },
  };

  return (
    <div className="h-[160px]">
      <Bar
        data={chartData}
        options={{ ...options, maintainAspectRatio: false }}
      />
    </div>
  );
}
