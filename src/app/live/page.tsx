"use client";

import Link from "next/link";
import {
  Activity,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
} from "lucide-react";
import SignalCard from "@/components/SignalCard";
import { activeSignals } from "@/data/mockData";

const getAveragePnl = () => {
  if (!activeSignals.length) {
    return 0;
  }
  const total = activeSignals.reduce(
    (sum, signal) => sum + (signal.currentPnlPct ?? 0),
    0
  );
  return total / activeSignals.length;
};

const getBestSignal = () => {
  if (!activeSignals.length) {
    return undefined;
  }

  return activeSignals.reduce((best, signal) => {
    if (!best) return signal;
    return (signal.currentPnlPct ?? 0) > (best.currentPnlPct ?? 0)
      ? signal
      : best;
  }, activeSignals[0]);
};

const getWorstSignal = () => {
  if (!activeSignals.length) {
    return undefined;
  }

  return activeSignals.reduce((worst, signal) => {
    if (!worst) return signal;
    return (signal.currentPnlPct ?? 0) < (worst.currentPnlPct ?? 0)
      ? signal
      : worst;
  }, activeSignals[0]);
};

export default function LivePage() {
  const avgPnl = getAveragePnl();
  const bestSignal = getBestSignal();
  const worstSignal = getWorstSignal();
  const signalsInProfit = activeSignals.filter(
    (signal) => (signal.currentPnlPct ?? 0) > 0
  ).length;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <section className="border-b border-[#2d2d3d] bg-[#12121a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#2d2d3d] rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#10b981] live-indicator" />
                <span className="text-sm text-[#9ca3af]">
                  Tracking {activeSignals.length} live signals
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Live Signal Desk
              </h1>
              <p className="text-[#9ca3af] text-lg max-w-2xl mb-8">
                Real-time performance of every open position. Updated every
                minute so you always know which trades are working, how much
                they are up, and how long they&apos;ve been active.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-4">
                  <p className="text-sm text-[#6b7280]">Active Signals</p>
                  <p className="text-2xl font-semibold">{activeSignals.length}</p>
                </div>
                <div className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-4">
                  <p className="text-sm text-[#6b7280]">Signals in Profit</p>
                  <p className="text-2xl font-semibold text-[#10b981]">
                    {signalsInProfit}
                  </p>
                </div>
                <div className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-4">
                  <p className="text-sm text-[#6b7280]">Avg P&amp;L</p>
                  <p className="text-2xl font-semibold">
                    {avgPnl >= 0 ? "+" : ""}
                    {avgPnl.toFixed(2)}%
                  </p>
                </div>
                <div className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-4">
                  <p className="text-sm text-[#6b7280]">Oldest Signal</p>
                  <p className="text-2xl font-semibold">
                    {activeSignals[0]?.timeElapsed ?? "—"}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-2xl p-6 h-fit">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#00f5ff] flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-[#9ca3af]">Live Momentum</p>
                  <p className="text-2xl font-semibold text-[#10b981]">
                    {avgPnl >= 0 ? "+" : ""}
                    {avgPnl.toFixed(2)}%
                  </p>
                </div>
              </div>
              <p className="text-sm text-[#9ca3af] mb-4">
                Weighted average return across all open signals.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#9ca3af] flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4 text-[#10b981]" />
                    Best Signal
                  </span>
                  <span className="font-semibold">
                    {bestSignal ? (
                      <>
                        {bestSignal.symbol}/USDT · +
                        {bestSignal.currentPnlPct?.toFixed(2)}%
                      </>
                    ) : (
                      "—"
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#9ca3af] flex items-center gap-2">
                    <ArrowDownRight className="w-4 h-4 text-[#ef4444]" />
                    Softest Signal
                  </span>
                  <span className="font-semibold">
                    {worstSignal ? (
                      <>
                        {worstSignal.symbol}/USDT ·{" "}
                        {worstSignal.currentPnlPct
                          ? `${worstSignal.currentPnlPct.toFixed(2)}%`
                          : "—"}
                      </>
                    ) : (
                      "—"
                    )}
                  </span>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <Link href="/pricing" className="btn-primary text-center">
                  Unlock Entry Prices
                </Link>
                <p className="text-xs text-[#6b7280] text-center">
                  Members get second-by-second updates via Telegram &amp; Email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <section>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <p className="text-sm text-[#10b981] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10b981] live-indicator" />
                LIVE FEED
              </p>
              <h2 className="text-2xl font-semibold mt-2">
                Current Open Positions
              </h2>
              <p className="text-[#9ca3af]">
                Full transparency for each idea currently being traded.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="btn-secondary text-sm px-4 py-2">Share</button>
              <button className="btn-primary text-sm px-4 py-2">
                Export Report
              </button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {activeSignals.map((signal) => (
              <SignalCard
                key={signal.id}
                symbol={signal.symbol}
                direction={signal.direction as "LONG" | "SHORT"}
                entryPrice={signal.entryPrice}
                tpPct={signal.tpPct}
                holdTime={signal.holdTime}
                strength={signal.strength}
                checksPassed={signal.checksPassed}
                totalChecks={signal.totalChecks}
                currentPnlPct={signal.currentPnlPct}
                timeElapsed={signal.timeElapsed}
                status="OPEN"
              />
            ))}
          </div>
        </section>

        <section className="grid lg:grid-cols-3 gap-6">
          <div className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-[#10b981]/10 text-[#10b981]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-[#9ca3af]">Profitability</p>
                <p className="text-xl font-semibold">
                  {signalsInProfit}/{activeSignals.length} signals green
                </p>
              </div>
            </div>
            <p className="text-sm text-[#9ca3af]">
              Majority of open positions are currently above entry. We only show
              the metrics that matter: entry, TP, and live P&amp;L.
            </p>
          </div>
          <div className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-[#00f5ff]/10 text-[#00f5ff]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-[#9ca3af]">Time In Trade</p>
                <p className="text-xl font-semibold">
                  Oldest: {worstSignal?.timeElapsed ?? "—"}
                </p>
              </div>
            </div>
            <p className="text-sm text-[#9ca3af]">
              Hold times are enforced to avoid over-trading. Current setups
              range from {activeSignals[0]?.holdTime} to{" "}
              {activeSignals[activeSignals.length - 1]?.holdTime}.
            </p>
          </div>
          <div className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-[#8b5cf6]/10 text-[#8b5cf6]">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-[#9ca3af]">Signal Strength</p>
                <p className="text-xl font-semibold">
                  {activeSignals.every((signal) => signal.strength === "STRONG")
                    ? "All Strong"
                    : "Mixed"}
                </p>
              </div>
            </div>
            <p className="text-sm text-[#9ca3af]">
              {activeSignals[0]?.checksPassed}/{activeSignals[0]?.totalChecks}{" "}
              system checks must align before a trade is deployed live.
            </p>
          </div>
        </section>

        <section className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#2d2d3d] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">Signal Telemetry</h3>
              <p className="text-sm text-[#9ca3af]">
                Snapshot of entry, current pricing, and elapsed time.
              </p>
            </div>
            <span className="text-xs text-[#6b7280]">
              Auto-refresh disabled in demo
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-[#9ca3af] uppercase tracking-wide border-b border-[#2d2d3d]">
                  <th className="px-6 py-3">Pair</th>
                  <th className="px-6 py-3 text-right">Entry</th>
                  <th className="px-6 py-3 text-right">Current</th>
                  <th className="px-6 py-3 text-right">P&amp;L</th>
                  <th className="px-6 py-3 text-right">Time Live</th>
                </tr>
              </thead>
              <tbody>
                {activeSignals.map((signal) => (
                  <tr
                    key={signal.id}
                    className="border-b border-[#2d2d3d] hover:bg-[#242442] transition-colors"
                  >
                    <td className="px-6 py-4 font-medium">
                      {signal.symbol}/USDT{" "}
                      <span className="text-xs text-[#6b7280] ml-2">
                        {signal.direction}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      ${signal.entryPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      ${signal.currentPrice?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold">
                      {signal.currentPnlPct !== undefined ? (
                        <span
                          className={
                            signal.currentPnlPct >= 0
                              ? "text-[#10b981]"
                              : "text-[#ef4444]"
                          }
                        >
                          {signal.currentPnlPct >= 0 ? "+" : ""}
                          {signal.currentPnlPct.toFixed(2)}%
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-[#9ca3af]">
                      {signal.timeElapsed}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
