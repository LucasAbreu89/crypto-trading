"use client";

import Link from "next/link";
import {
  TrendingUp,
  BarChart3,
  Zap,
  Target,
  Shield,
  Clock,
  ChevronRight,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Database,
  Brain,
  Bell,
} from "lucide-react";
import StatCard from "@/components/StatCard";
import SignalCard from "@/components/SignalCard";
import EquityChart from "@/components/EquityChart";
import {
  performanceSummary,
  performanceBySymbol,
  activeSignals,
  faqItems,
} from "@/data/mockData";
import { useState } from "react";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center grid-pattern overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#8b5cf6] rounded-full filter blur-[128px] opacity-20" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00f5ff] rounded-full filter blur-[128px] opacity-15" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              {/* Live Badge */}
              <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#2d2d3d] rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#10b981] live-indicator" />
                <span className="text-sm text-[#9ca3af]">
                  <span className="text-[#10b981] font-medium">
                    {performanceSummary.activeSignals} signals
                  </span>{" "}
                  currently active
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Trading Signals{" "}
                <span className="gradient-text">Powered by Data</span>, Not
                Guesswork
              </h1>

              <p className="text-lg text-[#9ca3af] mb-8 max-w-xl">
                11 technical indicators analyzed simultaneously. 2 years of
                backtested data. Join traders who rely on quantitative analysis,
                not speculation.
              </p>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-[#10b981]">
                    {performanceSummary.winRate}%
                  </p>
                  <p className="text-sm text-[#9ca3af]">Win Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-[#00f5ff]">
                    +{performanceSummary.totalReturn}%
                  </p>
                  <p className="text-sm text-[#9ca3af]">Total Return</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold">
                    {performanceSummary.totalTrades.toLocaleString()}
                  </p>
                  <p className="text-sm text-[#9ca3af]">Trades Analyzed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold">2+</p>
                  <p className="text-sm text-[#9ca3af]">Years of Data</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/pricing" className="btn-primary text-center">
                  Get Started
                  <ChevronRight className="w-4 h-4 inline ml-1" />
                </Link>
                <Link href="/performance" className="btn-secondary text-center">
                  View Performance
                </Link>
              </div>
            </div>

            {/* Right Content - Signal Preview */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Glow effect behind cards */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#8b5cf6]/20 to-[#00f5ff]/20 blur-3xl" />

                <div className="relative space-y-4">
                  {activeSignals.slice(0, 2).map((signal, index) => (
                    <div
                      key={signal.id}
                      className="transform"
                      style={{
                        transform: `translateX(${index * 20}px)`,
                      }}
                    >
                      <SignalCard
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
                        status={signal.status as "OPEN" | "CLOSED"}
                        blurred={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="border-y border-[#2d2d3d] bg-[#12121a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 text-[#6b7280]">
            <span className="text-sm">Supported Exchanges:</span>
            <span className="font-semibold text-[#9ca3af]">Binance</span>
            <span className="font-semibold text-[#9ca3af]">Bybit</span>
            <span className="font-semibold text-[#9ca3af]">Hyperliquid</span>
            <span className="font-semibold text-[#9ca3af]">OKX</span>
          </div>
        </div>
      </section>

      {/* Why We're Different Section */}
      <section className="py-20 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why <span className="gradient-text">Axiom</span> is Different
            </h2>
            <p className="text-[#9ca3af] max-w-2xl mx-auto">
              We don&apos;t rely on &quot;gut feelings&quot; or social media hype. Every
              signal is backed by quantitative analysis and rigorous backtesting.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature Cards */}
            {[
              {
                icon: <Database className="w-6 h-6" />,
                title: "Data-Driven Analysis",
                description:
                  "11 technical indicators analyzed simultaneously for every potential signal. No guesswork involved.",
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Transparent Backtest",
                description:
                  "2+ years of historical data publicly available. Verify our methodology and results yourself.",
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Real-Time Alerts",
                description:
                  "Instant notifications via Telegram and Email. Never miss a signal again.",
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: "Clear Entry & Exit",
                description:
                  "Every signal includes specific entry price, take profit target, and holding period.",
              },
              {
                icon: <Brain className="w-6 h-6" />,
                title: "No Emotions",
                description:
                  "Systematic approach removes emotional bias. Objective criteria for every trade.",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Risk Controlled",
                description:
                  "Parameters adjusted for each asset's volatility. Reasonable stop-loss levels built-in.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-6 card-hover"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#8b5cf6]/20 to-[#00f5ff]/20 flex items-center justify-center text-[#00f5ff] mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-[#9ca3af] text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Preview Section */}
      <section className="py-20 bg-[#12121a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Proven <span className="gradient-text">Performance</span>
              </h2>
              <p className="text-[#9ca3af]">
                Real results from 2+ years of backtested data
              </p>
            </div>
            <Link
              href="/performance"
              className="flex items-center gap-2 text-[#00f5ff] hover:underline"
            >
              View Full Performance
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <StatCard
              label="Total Return"
              value={performanceSummary.totalReturn}
              suffix="%"
              prefix="+"
              trend="up"
              icon={<TrendingUp className="w-5 h-5" />}
              delay={0}
            />
            <StatCard
              label="Win Rate"
              value={performanceSummary.winRate}
              suffix="%"
              trend="up"
              icon={<Target className="w-5 h-5" />}
              delay={100}
            />
            <StatCard
              label="Profit Factor"
              value={performanceSummary.profitFactor}
              trend="up"
              icon={<BarChart3 className="w-5 h-5" />}
              delay={200}
            />
            <StatCard
              label="Max Drawdown"
              value={performanceSummary.maxDrawdown}
              suffix="%"
              trend="neutral"
              icon={<Shield className="w-5 h-5" />}
              delay={300}
            />
          </div>

          {/* Equity Chart */}
          <div className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold mb-1">Equity Curve</h3>
                <p className="text-sm text-[#9ca3af]">
                  $1,000 initial capital → ${(9473).toLocaleString()} today
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#10b981]">+847.3%</p>
                <p className="text-sm text-[#9ca3af]">All-time return</p>
              </div>
            </div>
            <EquityChart height={350} />
          </div>

          {/* Performance by Symbol */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-6">Performance by Asset</h3>
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.values(performanceBySymbol).map((asset) => (
                <div
                  key={asset.symbol}
                  className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-4 card-hover text-center"
                >
                  <div
                    className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center font-bold text-sm"
                    style={{ backgroundColor: `${asset.color}20`, color: asset.color }}
                  >
                    {asset.symbol.slice(0, 3)}
                  </div>
                  <p className="font-semibold">{asset.symbol}</p>
                  <p className="text-[#10b981] font-bold">{asset.winRate}%</p>
                  <p className="text-xs text-[#9ca3af]">Win Rate</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-[#9ca3af] max-w-2xl mx-auto">
              Start receiving profitable signals in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: <CheckCircle2 className="w-8 h-8" />,
                title: "Subscribe",
                description:
                  "Choose a plan that fits your trading style. All plans include our 7-day money-back guarantee.",
              },
              {
                step: "02",
                icon: <Bell className="w-8 h-8" />,
                title: "Receive Signals",
                description:
                  "Get instant alerts via Telegram and Email when our system identifies a high-probability trade.",
              },
              {
                step: "03",
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Execute & Profit",
                description:
                  "Follow the signal with the provided entry, take profit, and holding period. Watch your portfolio grow.",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-[2px] bg-gradient-to-r from-[#8b5cf6] to-[#00f5ff] opacity-30" />
                )}

                <div className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-8 text-center relative z-10">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#8b5cf6] to-[#00f5ff] text-white text-sm font-bold px-4 py-1 rounded-full">
                    Step {item.step}
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8b5cf6]/20 to-[#00f5ff]/20 flex items-center justify-center text-[#00f5ff] mx-auto mt-4 mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-[#9ca3af]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Signals Preview */}
      <section className="py-20 bg-[#12121a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#10b981] live-indicator" />
                <span className="text-sm text-[#10b981] font-medium">
                  Live Signals
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Currently <span className="gradient-text">Active</span>
              </h2>
              <p className="text-[#9ca3af]">
                Real signals from our system, updated in real-time
              </p>
            </div>
            <Link href="/pricing" className="btn-primary">
              Subscribe to See Prices
              <ChevronRight className="w-4 h-4 inline ml-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                status={signal.status as "OPEN" | "CLOSED"}
                blurred={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-[#0a0a0f]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#242442] transition-colors"
                >
                  <span className="font-medium">{item.question}</span>
                  <ChevronRight
                    className={`w-5 h-5 text-[#9ca3af] transition-transform ${
                      openFaq === index ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-[#9ca3af]">{item.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#8b5cf6]/20 to-[#00f5ff]/20" />
        <div className="absolute inset-0 grid-pattern" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Trade with{" "}
            <span className="gradient-text">Confidence</span>?
          </h2>
          <p className="text-[#9ca3af] text-lg mb-8 max-w-2xl mx-auto">
            Join traders who rely on data, not luck. Start receiving profitable
            signals backed by 2 years of proven results.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/pricing" className="btn-primary text-lg px-8 py-4">
              Get Started Now
              <ChevronRight className="w-5 h-5 inline ml-1" />
            </Link>
            <Link
              href="/methodology"
              className="btn-secondary text-lg px-8 py-4"
            >
              Learn Our Method
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-[#9ca3af]">
            <Shield className="w-4 h-4 text-[#10b981]" />
            <span>7-day money-back guarantee • Cancel anytime</span>
          </div>
        </div>
      </section>
    </div>
  );
}
