"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Target,
  BarChart3,
  Shield,
  Award,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
} from "lucide-react";
import StatCard from "@/components/StatCard";
import EquityChart from "@/components/EquityChart";
import {
  performanceSummary,
  performanceBySymbol,
  monthlyPerformance,
} from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function PerformancePage() {
  const [selectedPeriod, setSelectedPeriod] = useState("ALL");
  const [selectedSymbol, setSelectedSymbol] = useState("ALL");

  const periods = ["1M", "3M", "6M", "1Y", "ALL"];
  const symbols = ["ALL", "SOL", "BTC", "ETH", "AVAX", "LTC", "SUI"];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <section className="border-b border-[#2d2d3d] bg-[#12121a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Proven <span className="gradient-text">Performance</span>
          </h1>
          <p className="text-[#9ca3af] mb-8">
            Real results from 2+ years of backtested data. Full transparency.
          </p>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Period Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#6b7280]">Period:</span>
              <div className="flex bg-[#1a1a2e] rounded-lg p-1">
                {periods.map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-md transition-all",
                      selectedPeriod === period
                        ? "bg-gradient-to-r from-[#8b5cf6] to-[#00f5ff] text-white"
                        : "text-[#9ca3af] hover:text-white"
                    )}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Symbol Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#6b7280]">Asset:</span>
              <div className="flex bg-[#1a1a2e] rounded-lg p-1 flex-wrap">
                {symbols.map((symbol) => (
                  <button
                    key={symbol}
                    onClick={() => setSelectedSymbol(symbol)}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-md transition-all",
                      selectedSymbol === symbol
                        ? "bg-gradient-to-r from-[#8b5cf6] to-[#00f5ff] text-white"
                        : "text-[#9ca3af] hover:text-white"
                    )}
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          <StatCard
            label="Total Return"
            value={performanceSummary.totalReturn}
            suffix="%"
            prefix="+"
            trend="up"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <StatCard
            label="Win Rate"
            value={performanceSummary.winRate}
            suffix="%"
            trend="up"
            icon={<Target className="w-5 h-5" />}
          />
          <StatCard
            label="Total Trades"
            value={performanceSummary.totalTrades.toLocaleString()}
            trend="neutral"
            icon={<BarChart3 className="w-5 h-5" />}
          />
          <StatCard
            label="Profit Factor"
            value={performanceSummary.profitFactor}
            trend="up"
            icon={<Award className="w-5 h-5" />}
          />
          <StatCard
            label="Max Drawdown"
            value={performanceSummary.maxDrawdown}
            suffix="%"
            trend="neutral"
            icon={<Shield className="w-5 h-5" />}
          />
          <StatCard
            label="Sharpe Ratio"
            value={performanceSummary.sharpeRatio}
            trend="up"
            icon={<TrendingUp className="w-5 h-5" />}
          />
        </div>

        {/* Equity Chart */}
        <div className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-6 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Equity Curve</h2>
              <p className="text-sm text-[#9ca3af]">
                Starting capital: $1,000 → Current: $9,473
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-[#10b981]">+847.3%</p>
                <p className="text-sm text-[#9ca3af]">All-time return</p>
              </div>
              <button className="btn-secondary text-sm px-4 py-2 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
          <EquityChart height={400} />
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Monthly Performance Table */}
          <div className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#2d2d3d]">
              <h2 className="text-lg font-semibold">Monthly Performance</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2d2d3d]">
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#9ca3af] uppercase">
                      Month
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[#9ca3af] uppercase">
                      Trades
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[#9ca3af] uppercase">
                      Win Rate
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[#9ca3af] uppercase">
                      Return
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyPerformance.map((month, index) => (
                    <tr
                      key={index}
                      className="border-b border-[#2d2d3d] hover:bg-[#242442] transition-colors"
                    >
                      <td className="px-6 py-4 text-sm">{month.month}</td>
                      <td className="px-6 py-4 text-sm text-right">
                        {month.trades}
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        {month.winRate}%
                      </td>
                      <td
                        className={cn(
                          "px-6 py-4 text-sm text-right font-medium",
                          month.pnlPct >= 0 ? "text-[#10b981]" : "text-[#ef4444]"
                        )}
                      >
                        <span className="inline-flex items-center gap-1">
                          {month.pnlPct >= 0 ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4" />
                          )}
                          {month.pnlPct >= 0 ? "+" : ""}
                          {month.pnlPct}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance by Asset */}
          <div className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#2d2d3d]">
              <h2 className="text-lg font-semibold">Performance by Asset</h2>
            </div>
            <div className="p-6 space-y-4">
              {Object.values(performanceBySymbol).map((asset) => (
                <div
                  key={asset.symbol}
                  className="bg-[#12121a] rounded-lg p-4 border border-[#2d2d3d]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm"
                        style={{
                          backgroundColor: `${asset.color}20`,
                          color: asset.color,
                        }}
                      >
                        {asset.symbol.slice(0, 3)}
                      </div>
                      <div>
                        <p className="font-semibold">{asset.name}</p>
                        <p className="text-xs text-[#9ca3af]">
                          {asset.totalTrades} trades
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#10b981]">
                        {asset.winRate}%
                      </p>
                      <p className="text-xs text-[#9ca3af]">Win Rate</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 bg-[#2d2d3d] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${asset.winRate}%`,
                        background: `linear-gradient(90deg, ${asset.color} 0%, ${asset.color}80 100%)`,
                      }}
                    />
                  </div>

                  {/* Stats Row */}
                  <div className="flex justify-between mt-3 text-xs">
                    <span className="text-[#9ca3af]">
                      Avg Return:{" "}
                      <span className="text-[#10b981]">+{asset.avgReturn}%</span>
                    </span>
                    <span className="text-[#9ca3af]">
                      Best:{" "}
                      <span className="text-[#10b981]">+{asset.bestTrade}%</span>
                    </span>
                    <span className="text-[#9ca3af]">
                      Worst:{" "}
                      <span className="text-[#ef4444]">{asset.worstTrade}%</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-6 mb-12">
          <h2 className="text-lg font-semibold mb-6">Detailed Statistics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-[#9ca3af] text-sm mb-1">Avg Return/Trade</p>
              <p className="text-2xl font-bold text-[#10b981]">
                +{performanceSummary.avgReturnPerTrade}%
              </p>
            </div>
            <div>
              <p className="text-[#9ca3af] text-sm mb-1">Winning Trades</p>
              <p className="text-2xl font-bold">
                {Math.round(
                  performanceSummary.totalTrades *
                    (performanceSummary.winRate / 100)
                ).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[#9ca3af] text-sm mb-1">Losing Trades</p>
              <p className="text-2xl font-bold">
                {Math.round(
                  performanceSummary.totalTrades *
                    ((100 - performanceSummary.winRate) / 100)
                ).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[#9ca3af] text-sm mb-1">Data Period</p>
              <p className="text-2xl font-bold">
                {performanceSummary.dataStartDate.slice(0, 4)} -{" "}
                {performanceSummary.dataEndDate.slice(0, 4)}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#8b5cf6]/20 to-[#00f5ff]/20 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">
            Ready to Start <span className="gradient-text">Profiting</span>?
          </h2>
          <p className="text-[#9ca3af] mb-6">
            Join traders who rely on data-driven signals
          </p>
          <Link href="/pricing" className="btn-primary">
            View Pricing Plans
          </Link>
        </div>
      </div>
    </div>
  );
}
