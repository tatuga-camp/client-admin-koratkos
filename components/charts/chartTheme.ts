import { Chart, ChartOptions } from "chart.js";
import { useEffect } from "react";

export const chartColors = {
  main: "#597E52",
  brown: "#5C430D",
  grid: "#F1E4C3",
};

export const barChartOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: chartColors.brown,
      padding: 10,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { color: chartColors.grid },
      ticks: { color: chartColors.brown, maxRotation: 45, autoSkip: true },
    },
    y: {
      beginAtZero: true,
      grid: { color: chartColors.grid },
      border: { display: false },
      ticks: { color: "rgba(92, 67, 13, 0.8)", precision: 0 },
    },
  },
};

/**
 * Canvas text can't read CSS variables, so copy the resolved page font in.
 * Also honours the OS "reduce motion" setting, which Chart.js ignores.
 */
export const useChartFont = () => {
  useEffect(() => {
    Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      Chart.defaults.animation = false;
    }
  }, []);
};
