"use client";

import ReactECharts from "echarts-for-react";

export function LineChart(props: {
  title?: string;
  x: string[];
  series: { name: string; data: number[] }[];
  height?: number;
}) {
  const option = {
    backgroundColor: "transparent",
    title: props.title ? { text: props.title, textStyle: { color: "rgba(255,255,255,0.85)", fontSize: 12 } } : undefined,
    tooltip: { trigger: "axis" },
    grid: { left: 28, right: 18, top: props.title ? 38 : 22, bottom: 24 },
    xAxis: {
      type: "category",
      data: props.x,
      axisLabel: { color: "rgba(255,255,255,0.55)" },
      axisLine: { lineStyle: { color: "rgba(255,255,255,0.12)" } },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "rgba(255,255,255,0.55)" },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } },
    },
    series: props.series.map((s) => ({
      name: s.name,
      type: "line",
      smooth: true,
      data: s.data,
      showSymbol: false,
      lineStyle: { width: 2 },
      areaStyle: { opacity: 0.06 },
    })),
  };

  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
      <ReactECharts option={option} style={{ height: props.height ?? 220 }} />
    </div>
  );
}
