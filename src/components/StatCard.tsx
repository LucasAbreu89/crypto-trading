"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  suffix?: string;
  prefix?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  delay?: number;
}

export default function StatCard({
  label,
  value,
  suffix = "",
  prefix = "",
  trend = "neutral",
  icon,
  delay = 0,
}: StatCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const trendColor = {
    up: "text-[#10b981]",
    down: "text-[#ef4444]",
    neutral: "text-white",
  };

  return (
    <div
      className={cn(
        "stat-card card-hover",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
      style={{ transition: "all 0.5s ease-out" }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[#9ca3af] text-sm mb-1">{label}</p>
          <p className={cn("text-3xl font-bold", trendColor[trend])}>
            {prefix}
            {value}
            {suffix}
          </p>
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-[#242442] flex items-center justify-center text-[#8b5cf6]">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
