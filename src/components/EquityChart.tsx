"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { equityCurve } from "@/data/mockData";

interface EquityChartProps {
  height?: number;
  showAxis?: boolean;
}

export default function EquityChart({
  height = 300,
  showAxis = true,
}: EquityChartProps) {
  const formatValue = (value: number) => `$${value.toLocaleString()}`;

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <AreaChart data={equityCurve}>
          <defs>
            <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
              <stop offset="50%" stopColor="#00f5ff" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#00f5ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          {showAxis && (
            <>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                tickFormatter={formatValue}
                dx={-10}
                domain={["dataMin - 100", "dataMax + 500"]}
              />
            </>
          )}
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a2e",
              border: "1px solid #2d2d3d",
              borderRadius: "8px",
              color: "#fff",
            }}
            labelStyle={{ color: "#9ca3af" }}
            formatter={(value: number) => [formatValue(value), "Equity"]}
          />
          <Area
            type="monotone"
            dataKey="equity"
            stroke="url(#strokeGradient)"
            strokeWidth={2}
            fill="url(#equityGradient)"
          />
          <defs>
            <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#00f5ff" />
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
