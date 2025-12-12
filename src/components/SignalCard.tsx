"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, Clock, Target, Zap } from "lucide-react";

interface SignalCardProps {
  symbol: string;
  direction: "LONG" | "SHORT";
  entryPrice: number;
  tpPct: number;
  holdTime: string;
  strength: string;
  checksPassed: number;
  totalChecks: number;
  currentPnlPct?: number;
  timeElapsed?: string;
  status: "OPEN" | "CLOSED";
  blurred?: boolean;
}

export default function SignalCard({
  symbol,
  direction,
  entryPrice,
  tpPct,
  holdTime,
  strength,
  checksPassed,
  totalChecks,
  currentPnlPct,
  timeElapsed,
  status,
  blurred = false,
}: SignalCardProps) {
  const isPositive = currentPnlPct && currentPnlPct >= 0;

  return (
    <div className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-5 card-hover">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm",
              direction === "LONG"
                ? "bg-[#10b981]/20 text-[#10b981]"
                : "bg-[#ef4444]/20 text-[#ef4444]"
            )}
          >
            {symbol.slice(0, 3)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{symbol}/USDT</span>
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  direction === "LONG"
                    ? "bg-[#10b981]/20 text-[#10b981]"
                    : "bg-[#ef4444]/20 text-[#ef4444]"
                )}
              >
                {direction}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#9ca3af]">
              <Zap className="w-3 h-3 text-[#f59e0b]" />
              <span>{strength}</span>
              <span className="text-[#6b7280]">
                ({checksPassed}/{totalChecks} checks)
              </span>
            </div>
          </div>
        </div>
        {status === "OPEN" && (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#10b981] live-indicator" />
            <span className="text-xs text-[#10b981]">LIVE</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[#9ca3af] text-sm flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" />
            Entry
          </span>
          <span className={cn("font-mono", blurred && "blur-sm select-none")}>
            ${entryPrice.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[#9ca3af] text-sm flex items-center gap-1.5">
            <Target className="w-4 h-4" />
            Take Profit
          </span>
          <span className="text-[#10b981] font-mono">+{tpPct}%</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[#9ca3af] text-sm flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            Hold Time
          </span>
          <span className="font-mono">{holdTime}</span>
        </div>

        {status === "OPEN" && currentPnlPct !== undefined && timeElapsed && (
          <>
            <div className="border-t border-[#2d2d3d] my-3" />
            <div className="flex justify-between items-center">
              <span className="text-[#9ca3af] text-sm">Current P&L</span>
              <span
                className={cn(
                  "font-bold font-mono",
                  isPositive ? "text-[#10b981]" : "text-[#ef4444]"
                )}
              >
                {isPositive ? "+" : ""}
                {currentPnlPct.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#9ca3af] text-sm">Time Elapsed</span>
              <span className="text-[#9ca3af] font-mono text-sm">
                {timeElapsed}
              </span>
            </div>
          </>
        )}
      </div>

      {blurred && (
        <div className="mt-4 pt-4 border-t border-[#2d2d3d]">
          <p className="text-center text-sm text-[#9ca3af]">
            <span className="text-[#00f5ff]">Subscribe</span> to see entry prices
          </p>
        </div>
      )}
    </div>
  );
}
