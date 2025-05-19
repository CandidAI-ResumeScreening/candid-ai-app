"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

export default function ExperienceLevelChart({ data }) {
  if (!data) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const { entryCandidates, intermediateCandidates, expertCandidates } = data;
  const totalCandidates =
    entryCandidates + intermediateCandidates + expertCandidates;

  // If no candidates, show empty state
  if (totalCandidates === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-gray-500">No candidate data available</p>
      </div>
    );
  }

  const chartData = [
    { name: "Entry Level", value: entryCandidates },
    { name: "Intermediate", value: intermediateCandidates },
    { name: "Expert", value: expertCandidates },
  ];

  // Filter out zero values
  const filteredChartData = chartData.filter((item) => item.value > 0);

  const COLORS = ["#22c55e", "#3b82f6", "#8b5cf6"];

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Only show percentage label if it's significant enough
    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-blue-600">
            Count: {payload[0].value} (
            {((payload[0].value / totalCandidates) * 100).toFixed(0)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={
              filteredChartData.length > 0
                ? filteredChartData
                : [{ name: "No Data", value: 1 }]
            }
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {filteredChartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
            {filteredChartData.length === 0 && <Cell fill="#d1d5db" />}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
