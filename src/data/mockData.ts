// Mock data for the trading signals platform
// Replace with real API calls later

export const performanceSummary = {
  totalReturn: 847.32,
  winRate: 68.3,
  totalTrades: 2547,
  profitFactor: 2.14,
  maxDrawdown: 4.21,
  sharpeRatio: 1.85,
  avgReturnPerTrade: 2.45,
  dataStartDate: "2024-01-01",
  dataEndDate: "2025-12-11",
  activeSignals: 3,
};

export const performanceBySymbol = {
  SOL: {
    name: "Solana",
    symbol: "SOL",
    winRate: 72.4,
    avgReturn: 3.12,
    totalTrades: 423,
    profitFactor: 2.45,
    bestTrade: 12.8,
    worstTrade: -5.2,
    color: "#14F195",
  },
  BTC: {
    name: "Bitcoin",
    symbol: "BTC",
    winRate: 71.2,
    avgReturn: 2.45,
    totalTrades: 389,
    profitFactor: 2.28,
    bestTrade: 8.5,
    worstTrade: -3.8,
    color: "#F7931A",
  },
  ETH: {
    name: "Ethereum",
    symbol: "ETH",
    winRate: 69.8,
    avgReturn: 2.78,
    totalTrades: 412,
    profitFactor: 2.15,
    bestTrade: 9.2,
    worstTrade: -4.1,
    color: "#627EEA",
  },
  AVAX: {
    name: "Avalanche",
    symbol: "AVAX",
    winRate: 67.5,
    avgReturn: 2.95,
    totalTrades: 287,
    profitFactor: 2.08,
    bestTrade: 11.3,
    worstTrade: -4.8,
    color: "#E84142",
  },
  LTC: {
    name: "Litecoin",
    symbol: "LTC",
    winRate: 70.1,
    avgReturn: 2.21,
    totalTrades: 198,
    profitFactor: 2.12,
    bestTrade: 7.8,
    worstTrade: -3.5,
    color: "#BFBBBB",
  },
  SUI: {
    name: "Sui",
    symbol: "SUI",
    winRate: 65.8,
    avgReturn: 3.45,
    totalTrades: 156,
    profitFactor: 1.95,
    bestTrade: 14.2,
    worstTrade: -6.1,
    color: "#6FBCF0",
  },
};

export const equityCurve = [
  { date: "2024-01", equity: 1000 },
  { date: "2024-02", equity: 1085 },
  { date: "2024-03", equity: 1210 },
  { date: "2024-04", equity: 1180 },
  { date: "2024-05", equity: 1350 },
  { date: "2024-06", equity: 1520 },
  { date: "2024-07", equity: 1680 },
  { date: "2024-08", equity: 1890 },
  { date: "2024-09", equity: 2150 },
  { date: "2024-10", equity: 2480 },
  { date: "2024-11", equity: 2890 },
  { date: "2024-12", equity: 3250 },
  { date: "2025-01", equity: 3680 },
  { date: "2025-02", equity: 4120 },
  { date: "2025-03", equity: 4580 },
  { date: "2025-04", equity: 5150 },
  { date: "2025-05", equity: 5720 },
  { date: "2025-06", equity: 6380 },
  { date: "2025-07", equity: 7050 },
  { date: "2025-08", equity: 7680 },
  { date: "2025-09", equity: 8250 },
  { date: "2025-10", equity: 8780 },
  { date: "2025-11", equity: 9150 },
  { date: "2025-12", equity: 9473 },
];

export const monthlyPerformance = [
  { month: "Dec 2025", trades: 45, winRate: 71.1, pnlPct: 3.5, pnlUsd: 320 },
  { month: "Nov 2025", trades: 52, winRate: 69.2, pnlPct: 4.5, pnlUsd: 395 },
  { month: "Oct 2025", trades: 48, winRate: 68.8, pnlPct: 6.4, pnlUsd: 530 },
  { month: "Sep 2025", trades: 55, winRate: 70.9, pnlPct: 7.4, pnlUsd: 570 },
  { month: "Aug 2025", trades: 51, winRate: 66.7, pnlPct: 8.9, pnlUsd: 630 },
  { month: "Jul 2025", trades: 49, winRate: 71.4, pnlPct: 10.5, pnlUsd: 670 },
  { month: "Jun 2025", trades: 53, winRate: 67.9, pnlPct: 11.5, pnlUsd: 660 },
  { month: "May 2025", trades: 47, winRate: 72.3, pnlPct: 9.4, pnlUsd: 540 },
  { month: "Apr 2025", trades: 50, winRate: 68.0, pnlPct: 12.4, pnlUsd: 570 },
  { month: "Mar 2025", trades: 54, winRate: 70.4, pnlPct: 11.2, pnlUsd: 460 },
  { month: "Feb 2025", trades: 46, winRate: 69.6, pnlPct: 12.0, pnlUsd: 440 },
  { month: "Jan 2025", trades: 48, winRate: 68.8, pnlPct: 13.2, pnlUsd: 430 },
];

export const activeSignals = [
  {
    id: "sig_001",
    symbol: "SOL",
    direction: "LONG",
    entryPrice: 145.32,
    tpPrice: 151.13,
    tpPct: 4.0,
    holdTime: "48h",
    strength: "STRONG",
    checksPassed: 9,
    totalChecks: 11,
    status: "OPEN",
    currentPrice: 148.5,
    currentPnlPct: 2.19,
    openedAt: "2025-12-11T15:00:00Z",
    timeElapsed: "12h 35min",
  },
  {
    id: "sig_002",
    symbol: "BTC",
    direction: "LONG",
    entryPrice: 97250.0,
    tpPrice: 101140.0,
    tpPct: 4.0,
    holdTime: "72h",
    strength: "STRONG",
    checksPassed: 8,
    totalChecks: 11,
    status: "OPEN",
    currentPrice: 98450.0,
    currentPnlPct: 1.23,
    openedAt: "2025-12-10T22:00:00Z",
    timeElapsed: "28h 15min",
  },
  {
    id: "sig_003",
    symbol: "ETH",
    direction: "LONG",
    entryPrice: 3680.0,
    tpPrice: 3827.2,
    tpPct: 4.0,
    holdTime: "48h",
    strength: "STRONG",
    checksPassed: 9,
    totalChecks: 11,
    status: "OPEN",
    currentPrice: 3745.0,
    currentPnlPct: 1.77,
    openedAt: "2025-12-11T08:00:00Z",
    timeElapsed: "18h 50min",
  },
];

export const recentClosedSignals = [
  {
    id: "sig_100",
    symbol: "SOL",
    direction: "LONG",
    entryPrice: 138.5,
    exitPrice: 144.04,
    pnlPct: 4.0,
    status: "TP_HIT",
    duration: "22h 15min",
    closedAt: "2025-12-10T14:00:00Z",
  },
  {
    id: "sig_099",
    symbol: "AVAX",
    direction: "LONG",
    entryPrice: 42.8,
    exitPrice: 44.51,
    pnlPct: 4.0,
    status: "TP_HIT",
    duration: "31h 42min",
    closedAt: "2025-12-09T18:00:00Z",
  },
  {
    id: "sig_098",
    symbol: "ETH",
    direction: "LONG",
    entryPrice: 3520.0,
    exitPrice: 3591.2,
    pnlPct: 2.02,
    status: "TIME_EXIT",
    duration: "48h 00min",
    closedAt: "2025-12-08T12:00:00Z",
  },
];

export const backtestChecks = [
  {
    id: 1,
    name: "4H Trendlines & Resistance",
    shortName: "PA4H_TREND",
    description:
      "Checks if price is in an uptrend on the 4-hour chart and approaching a key resistance level.",
    importance: "Identifies breakout potential at key levels",
    icon: "TrendingUp",
  },
  {
    id: 2,
    name: "1H Strong Bullish Candle",
    shortName: "PA1H_BULL",
    description:
      "Verifies if the last 1-hour candle shows strong buying pressure with minimal upper wick.",
    importance: "Confirms buyer conviction in the current move",
    icon: "CandlestickChart",
  },
  {
    id: 3,
    name: "1H Close Above Resistance",
    shortName: "PA1H_CLOSE",
    description:
      "Confirms that the price has closed above the identified resistance level.",
    importance: "Validates breakout confirmation",
    icon: "ArrowUpCircle",
  },
  {
    id: 4,
    name: "Volume Spike",
    shortName: "VOL1H",
    description:
      "Checks if current volume is significantly above the 5-day average (1.3x-1.65x depending on asset).",
    importance: "High volume confirms genuine market interest",
    icon: "BarChart3",
  },
  {
    id: 5,
    name: "Breakout + Volume",
    shortName: "VOL_BREAK",
    description:
      "Combines green candle (close > open) with volume spike confirmation.",
    importance: "Direction + conviction = reliable signal",
    icon: "Zap",
  },
  {
    id: 6,
    name: "RSI Momentum",
    shortName: "RSI_CHECK",
    description:
      "Verifies RSI is above 50 and rising on both 1H and 4H timeframes.",
    importance: "Confirms momentum is with the buyers",
    icon: "Activity",
  },
  {
    id: 7,
    name: "MACD Bullish Crossover",
    shortName: "MACD_BULL",
    description:
      "Detects when MACD line crosses above the signal line on 1H chart.",
    importance: "Classic momentum shift indicator",
    icon: "GitBranch",
  },
  {
    id: 8,
    name: "ADX Trend Strength",
    shortName: "ADX_TREND",
    description:
      "Confirms ADX is above 20-22, indicating a strong trend is present.",
    importance: "Avoids choppy, sideways markets",
    icon: "Gauge",
  },
  {
    id: 9,
    name: "ATR Volatility Check",
    shortName: "ATR_SL",
    description:
      "Ensures volatility is reasonable for proper stop-loss placement.",
    importance: "Manages risk with appropriate stop levels",
    icon: "Shield",
  },
  {
    id: 10,
    name: "Open Interest Surge",
    shortName: "OI_CHECK",
    description:
      "Detects significant increase in Open Interest above standard deviation.",
    importance: "Shows new money entering the market",
    icon: "Users",
  },
  {
    id: 11,
    name: "Funding Rate Balance",
    shortName: "FUND_CHECK",
    description:
      "Verifies funding rate is not too high, avoiding crowded long positions.",
    importance: "Prevents entering overcrowded trades",
    icon: "Scale",
  },
];

export const faqItems = [
  {
    question: "How are the signals generated?",
    answer:
      "Our signals are generated by analyzing 11 different technical and market indicators simultaneously. When 8 or more indicators align (STRONG signal), we send an alert. This systematic approach removes emotional bias and ensures consistency.",
  },
  {
    question: "What is the average win rate?",
    answer:
      "Our overall win rate across all assets is approximately 68%. Individual assets may vary - for example, SOL has a 72.4% win rate while SUI has 65.8%. We provide full transparency on all historical performance data.",
  },
  {
    question: "How do I receive signals?",
    answer:
      "Signals are delivered instantly via Telegram and/or Email based on your preference. Each signal includes the entry price, take profit target, hold time, and signal strength rating.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes! All plans are month-to-month with no long-term commitment. You can cancel anytime from your dashboard and retain access until the end of your billing period.",
  },
  {
    question: "Is this suitable for beginners?",
    answer:
      "Yes! Our signals are straightforward - we tell you exactly when to enter and what price to target. However, we recommend understanding basic trading concepts and always using proper risk management (never risk more than 1-2% per trade).",
  },
  {
    question: "Which exchanges do you support?",
    answer:
      "Our signals work on any exchange that offers the supported trading pairs (SOL, BTC, ETH, AVAX, LTC, SUI). Popular options include Binance, Bybit, and Hyperliquid for perpetual futures.",
  },
  {
    question: "What is the hold time?",
    answer:
      "Hold time varies by asset: 48 hours for SOL, ETH, and most altcoins; 72 hours for BTC. If the take profit isn't hit within this period, we recommend closing at market price.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Yes! We offer a 7-day money-back guarantee. If you're not satisfied with the service for any reason, contact us within 7 days of your first payment for a full refund.",
  },
];

export const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    price: 49,
    period: "month",
    description: "Perfect for getting started",
    features: [
      "1 trading pair (SOL or BTC)",
      "Email notifications",
      "Basic dashboard access",
      "Email support",
      "7-day money-back guarantee",
    ],
    notIncluded: [
      "Telegram notifications",
      "All 6 trading pairs",
      "Priority support",
      "API access",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 99,
    period: "month",
    description: "Most popular choice",
    features: [
      "3 trading pairs (SOL, BTC, ETH)",
      "Telegram + Email notifications",
      "Full dashboard access",
      "Detailed performance analytics",
      "Priority support",
      "7-day money-back guarantee",
    ],
    notIncluded: ["All 6 trading pairs", "API access"],
    cta: "Start Pro",
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 199,
    period: "month",
    description: "For serious traders",
    features: [
      "All 6 trading pairs",
      "Telegram + Email notifications",
      "Full dashboard + API access",
      "Detailed performance analytics",
      "VIP support (Discord)",
      "Monthly strategy call (30min)",
      "7-day money-back guarantee",
    ],
    notIncluded: [],
    cta: "Go Premium",
    popular: false,
  },
];
