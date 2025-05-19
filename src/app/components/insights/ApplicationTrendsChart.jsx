"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ApplicationTrendsChart({ data, activeView }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!data) return;

    let formattedData = [];

    if (activeView === "daily") {
      // Use days of the week
      const daysOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      formattedData = daysOrder.map((day) => ({
        name: day,
        applications: data.applicationsByDate[day] || 0,
      }));
    } else if (activeView === "monthly") {
      // Use months of the year
      const monthsOrder = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      formattedData = monthsOrder.map((month) => ({
        name: month,
        applications: data.applicationsByMonth[month] || 0,
      }));
    } else if (activeView === "yearly") {
      // Get current year and create range of 2 years before and 2 years after
      const currentYear = new Date().getFullYear();
      const years = [
        currentYear - 2,
        currentYear - 1,
        currentYear,
        currentYear + 1,
        currentYear + 2,
      ];

      formattedData = years.map((year) => ({
        name: year.toString(),
        applications: data.applicationsByYear[year] || 0,
      }));
    }

    setChartData(formattedData);
  }, [data, activeView]);

  if (!data) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">Applications: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        {activeView === "yearly" ? (
          // Bar chart for yearly view
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="applications"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              name="Applications"
            />
          </BarChart>
        ) : (
          // Line chart for daily and monthly views
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="applications"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Applications"
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
