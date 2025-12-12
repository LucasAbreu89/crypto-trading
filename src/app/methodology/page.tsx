"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  CandlestickChart,
  ArrowUpCircle,
  BarChart3,
  Zap,
  Activity,
  GitBranch,
  Gauge,
  Shield,
  Users,
  Scale,
  ChevronDown,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { backtestChecks } from "@/data/mockData";
import { cn } from "@/lib/utils";

const iconMap: { [key: string]: React.ReactNode } = {
  TrendingUp: <TrendingUp className="w-6 h-6" />,
  CandlestickChart: <CandlestickChart className="w-6 h-6" />,
  ArrowUpCircle: <ArrowUpCircle className="w-6 h-6" />,
  BarChart3: <BarChart3 className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  Activity: <Activity className="w-6 h-6" />,
  GitBranch: <GitBranch className="w-6 h-6" />,
  Gauge: <Gauge className="w-6 h-6" />,
  Shield: <Shield className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  Scale: <Scale className="w-6 h-6" />,
};

export default function MethodologyPage() {
  const [expandedCheck, setExpandedCheck] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <section className="border-b border-[#2d2d3d] bg-[#12121a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Our <span className="gradient-text">Methodology</span>
          </h1>
          <p className="text-[#9ca3af] max-w-2xl">
            100% transparent approach. Understand exactly how our signals are
            generated using 11 technical and market indicators.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Overview Section */}
        <div className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">How It Works</h2>

          {/* Flow Diagram */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            {[
              { label: "Market Data", icon: <BarChart3 className="w-8 h-8" /> },
              { label: "11 Checks", icon: <CheckCircle2 className="w-8 h-8" /> },
              { label: "Classification", icon: <Gauge className="w-8 h-8" /> },
              { label: "Signal", icon: <Zap className="w-8 h-8" /> },
            ].map((step, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#8b5cf6]/20 to-[#00f5ff]/20 flex items-center justify-center text-[#00f5ff] mb-2">
                    {step.icon}
                  </div>
                  <span className="text-sm text-[#9ca3af]">{step.label}</span>
                </div>
                {index < 3 && (
                  <ArrowRight className="w-6 h-6 text-[#2d2d3d] hidden md:block" />
                )}
              </div>
            ))}
          </div>

          <p className="text-[#9ca3af]">
            Our system analyzes real-time market data through 11 independent
            technical and market indicators. When 8 or more checks pass, we
            generate a <span className="text-[#10b981] font-semibold">STRONG</span>{" "}
            signal. This multi-factor approach ensures we only trade when
            multiple independent confirmations align.
          </p>
        </div>

        {/* Signal Classification */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#1a1a2e] border border-[#10b981]/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#10b981]/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-[#10b981]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#10b981]">STRONG Signal</h3>
                <p className="text-sm text-[#9ca3af]">8+ checks passed</p>
              </div>
            </div>
            <p className="text-sm text-[#9ca3af]">
              High probability setup. Multiple confirmations aligned. These are
              the signals we send to subscribers.
            </p>
          </div>

          <div className="bg-[#1a1a2e] border border-[#f59e0b]/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#f59e0b]/20 flex items-center justify-center">
                <Activity className="w-6 h-6 text-[#f59e0b]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#f59e0b]">MODERATE Signal</h3>
                <p className="text-sm text-[#9ca3af]">6-7 checks passed</p>
              </div>
            </div>
            <p className="text-sm text-[#9ca3af]">
              Medium confidence. Some confirmations missing. We don&apos;t trade
              these—waiting for better alignment.
            </p>
          </div>

          <div className="bg-[#1a1a2e] border border-[#ef4444]/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#ef4444]/20 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-[#ef4444]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#ef4444]">WEAK Signal</h3>
                <p className="text-sm text-[#9ca3af]">&lt;6 checks passed</p>
              </div>
            </div>
            <p className="text-sm text-[#9ca3af]">
              Low probability. Too much uncertainty. We never trade these
              setups—protecting your capital.
            </p>
          </div>
        </div>

        {/* The 11 Checks */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">The 11 Indicators</h2>
          <p className="text-[#9ca3af] mb-8">
            Each indicator evaluates a different aspect of the market. Click to
            learn more about each one.
          </p>

          <div className="space-y-4">
            {backtestChecks.map((check, index) => (
              <div
                key={check.id}
                className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedCheck(expandedCheck === index ? null : index)
                  }
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#242442] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8b5cf6]/20 to-[#00f5ff]/20 flex items-center justify-center text-[#00f5ff]">
                      {iconMap[check.icon] || <Activity className="w-5 h-5" />}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#8b5cf6] font-mono bg-[#8b5cf6]/10 px-2 py-0.5 rounded">
                          #{check.id}
                        </span>
                        <h3 className="font-semibold">{check.name}</h3>
                      </div>
                      <p className="text-sm text-[#9ca3af]">
                        {check.shortName}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-[#9ca3af] transition-transform",
                      expandedCheck === index && "rotate-180"
                    )}
                  />
                </button>

                {expandedCheck === index && (
                  <div className="px-6 pb-6 border-t border-[#2d2d3d] pt-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold text-[#9ca3af] mb-2">
                          What it checks:
                        </h4>
                        <p className="text-white">{check.description}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#9ca3af] mb-2">
                          Why it matters:
                        </h4>
                        <p className="text-[#10b981]">{check.importance}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Asset-Specific Parameters */}
        <div className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Asset-Specific Parameters</h2>
          <p className="text-[#9ca3af] mb-6">
            Each cryptocurrency has unique volatility and liquidity
            characteristics. We adjust our parameters accordingly.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2d2d3d]">
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#9ca3af] uppercase">
                    Asset
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-[#9ca3af] uppercase">
                    Vol. Mult.
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-[#9ca3af] uppercase">
                    ATR Thresh.
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-[#9ca3af] uppercase">
                    Hold Time
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-[#9ca3af] uppercase">
                    Profile
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    symbol: "BTC",
                    vol: "1.3x",
                    atr: "2.0%",
                    hold: "72h",
                    profile: "Most liquid, stable",
                    color: "#F7931A",
                  },
                  {
                    symbol: "ETH",
                    vol: "1.5x",
                    atr: "1.5%",
                    hold: "48h",
                    profile: "Balanced",
                    color: "#627EEA",
                  },
                  {
                    symbol: "SOL",
                    vol: "1.6x",
                    atr: "2.5%",
                    hold: "48h",
                    profile: "Higher volatility",
                    color: "#14F195",
                  },
                  {
                    symbol: "AVAX",
                    vol: "1.55x",
                    atr: "2.3%",
                    hold: "48h",
                    profile: "Similar to SOL",
                    color: "#E84142",
                  },
                  {
                    symbol: "LTC",
                    vol: "1.35x",
                    atr: "1.6%",
                    hold: "48h",
                    profile: "Lower volatility",
                    color: "#BFBBBB",
                  },
                  {
                    symbol: "SUI",
                    vol: "1.65x",
                    atr: "2.8%",
                    hold: "48h",
                    profile: "Most volatile",
                    color: "#6FBCF0",
                  },
                ].map((asset) => (
                  <tr
                    key={asset.symbol}
                    className="border-b border-[#2d2d3d] hover:bg-[#242442] transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
                          style={{
                            backgroundColor: `${asset.color}20`,
                            color: asset.color,
                          }}
                        >
                          {asset.symbol.slice(0, 3)}
                        </div>
                        <span className="font-medium">{asset.symbol}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center font-mono text-sm">
                      {asset.vol}
                    </td>
                    <td className="px-4 py-4 text-center font-mono text-sm">
                      {asset.atr}
                    </td>
                    <td className="px-4 py-4 text-center font-mono text-sm">
                      {asset.hold}
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-[#9ca3af]">
                      {asset.profile}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Data Sources */}
        <div className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Data Sources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Price & Volume Data</h3>
              <p className="text-sm text-[#9ca3af]">
                Real-time OHLCV data from Binance and Hyperliquid APIs. Updated
                every hour for analysis.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Funding Rate</h3>
              <p className="text-sm text-[#9ca3af]">
                Perpetual futures funding rates from Bybit. Indicates market
                sentiment and position crowding.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Open Interest</h3>
              <p className="text-sm text-[#9ca3af]">
                Total open positions data from Bybit. Shows new money entering
                or exiting the market.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-[#12121a] border border-[#2d2d3d] rounded-xl p-6 mb-12">
          <h3 className="font-semibold mb-2">Important Disclaimer</h3>
          <p className="text-sm text-[#9ca3af]">
            Backtested results do not guarantee future performance. Markets
            change, and past patterns may not repeat. Always use proper risk
            management (never risk more than 1-2% per trade) and only trade with
            capital you can afford to lose. Our signals are tools for
            analysis—not financial advice.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#8b5cf6]/20 to-[#00f5ff]/20 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">
            Convinced by Our <span className="gradient-text">Approach</span>?
          </h2>
          <p className="text-[#9ca3af] mb-6">
            Start receiving data-driven signals today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing" className="btn-primary">
              View Pricing
            </Link>
            <Link href="/performance" className="btn-secondary">
              See Results
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
