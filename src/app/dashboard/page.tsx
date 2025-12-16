"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Profile,
  Subscription,
  UserPreferences,
  Signal,
  PLAN_DETAILS,
  AVAILABLE_PAIRS,
} from "@/lib/types";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  Crown,
  Bell,
  Send,
  ChevronRight,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/login");
        return;
      }

      // Load profile, subscription, preferences, and signals in parallel
      const [profileRes, subscriptionRes, preferencesRes, signalsRes] =
        await Promise.all([
          supabase.from("profiles").select("*").eq("id", user.id).single(),
          supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", user.id)
            .single(),
          supabase
            .from("user_preferences")
            .select("*")
            .eq("user_id", user.id)
            .single(),
          supabase
            .from("signals")
            .select("*")
            .eq("status", "active")
            .order("opened_at", { ascending: false })
            .limit(10),
        ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (subscriptionRes.data) setSubscription(subscriptionRes.data);
      if (preferencesRes.data) setPreferences(preferencesRes.data);
      if (signalsRes.data) setSignals(signalsRes.data);
    } catch {
      setError("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return "Just now";
    if (diffHours === 1) return "1 hour ago";
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  const getTimeRemaining = (openedAt: string, holdTimeHours: number) => {
    const opened = new Date(openedAt);
    const expires = new Date(opened.getTime() + holdTimeHours * 60 * 60 * 1000);
    const now = new Date();
    const remainingMs = expires.getTime() - now.getTime();

    if (remainingMs <= 0) return "Expired";

    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    if (hours < 1) {
      const mins = Math.floor(remainingMs / (1000 * 60));
      return `${mins}m left`;
    }
    return `${hours}h left`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#6366f1]" />
          <p className="text-[#a1a1aa]">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const planDetails = subscription
    ? PLAN_DETAILS[subscription.plan]
    : PLAN_DETAILS.free;

  // Filter signals based on user's selected pairs
  const userSignals =
    subscription?.plan === "free"
      ? [] // Free users don't see signals
      : signals.filter(
          (s) =>
            !preferences?.selected_pairs ||
            preferences.selected_pairs.includes(s.symbol)
        );

  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-[#f43f5e]/10 border border-[#f43f5e]/20 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#f43f5e]" />
            <p className="text-[#f43f5e]">{error}</p>
            <button
              onClick={loadUserData}
              className="ml-auto text-[#f43f5e] hover:text-white transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">
            Welcome back,{" "}
            <span className="gradient-text">
              {profile?.full_name?.split(" ")[0] || "Trader"}
            </span>
          </h1>
          <p className="text-[#a1a1aa]">
            Here&apos;s your trading signals overview
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          {/* Plan Card */}
          <div className="bg-[#111114] border border-[#27272a] rounded-2xl p-6 card-hover">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#71717a] text-sm">Current Plan</span>
              <Crown
                className={`w-5 h-5 ${
                  subscription?.plan === "premium"
                    ? "text-[#f59e0b]"
                    : subscription?.plan === "pro"
                    ? "text-[#6366f1]"
                    : "text-[#52525b]"
                }`}
              />
            </div>
            <p className="text-2xl font-bold tracking-tight">{planDetails.name}</p>
            <p className="text-sm text-[#71717a]">
              {planDetails.maxPairs === 0
                ? "No pairs included"
                : `${planDetails.maxPairs} pair${
                    planDetails.maxPairs > 1 ? "s" : ""
                  } included`}
            </p>
            {subscription?.plan === "free" && (
              <Link
                href="/pricing"
                className="mt-4 block text-center text-sm btn-primary py-2"
              >
                Upgrade Now
              </Link>
            )}
          </div>

          {/* Active Signals */}
          <div className="bg-[#111114] border border-[#27272a] rounded-2xl p-6 card-hover">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#71717a] text-sm">Active Signals</span>
              <Zap className="w-5 h-5 text-[#22d3ee]" />
            </div>
            <p className="text-2xl font-bold tracking-tight">{userSignals.length}</p>
            <p className="text-sm text-[#71717a]">
              {userSignals.length > 0 ? "Trading opportunities" : "No active signals"}
            </p>
          </div>

          {/* Notification Status */}
          <div className="bg-[#111114] border border-[#27272a] rounded-2xl p-6 card-hover">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#71717a] text-sm">Notifications</span>
              <Bell className="w-5 h-5 text-[#6366f1]" />
            </div>
            <div className="flex items-center gap-2">
              {profile?.notify_email && (
                <span className="px-2 py-1 rounded-md bg-[#10b981]/10 text-[#10b981] text-xs border border-[#10b981]/20">
                  Email
                </span>
              )}
              {profile?.notify_telegram && subscription?.has_telegram && (
                <span className="px-2 py-1 rounded-md bg-[#0088cc]/10 text-[#0088cc] text-xs border border-[#0088cc]/20">
                  Telegram
                </span>
              )}
              {!profile?.notify_email &&
                (!profile?.notify_telegram || !subscription?.has_telegram) && (
                  <span className="text-[#71717a] text-sm">Disabled</span>
                )}
            </div>
            <Link
              href="/settings"
              className="mt-2 text-sm text-[#6366f1] hover:text-[#818cf8]"
            >
              Manage →
            </Link>
          </div>

          {/* Selected Pairs */}
          <div className="bg-[#111114] border border-[#27272a] rounded-2xl p-6 card-hover">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#71717a] text-sm">Your Pairs</span>
              <TrendingUp className="w-5 h-5 text-[#10b981]" />
            </div>
            <div className="flex flex-wrap gap-2">
              {preferences?.selected_pairs?.length ? (
                preferences.selected_pairs.map((pair) => (
                  <span
                    key={pair}
                    className="px-2 py-1 rounded-md bg-[#6366f1]/10 text-[#6366f1] text-xs font-mono border border-[#6366f1]/20"
                  >
                    {pair}
                  </span>
                ))
              ) : (
                <span className="text-[#71717a] text-sm">None selected</span>
              )}
            </div>
          </div>
        </div>

        {/* Active Signals Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-tight">Active Signals</h2>
            <button
              onClick={loadUserData}
              className="flex items-center gap-2 text-sm text-[#71717a] hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {subscription?.plan === "free" ? (
            <div className="bg-[#111114] border border-[#27272a] rounded-2xl p-8 text-center">
              <Crown className="w-12 h-12 text-[#f59e0b] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 tracking-tight">
                Upgrade to See Signals
              </h3>
              <p className="text-[#a1a1aa] mb-6 max-w-md mx-auto">
                Free accounts can explore our platform but don&apos;t receive
                trading signals. Upgrade to start receiving data-driven
                opportunities.
              </p>
              <Link href="/pricing" className="btn-primary inline-block">
                View Plans
              </Link>
            </div>
          ) : userSignals.length === 0 ? (
            <div className="bg-[#111114] border border-[#27272a] rounded-2xl p-8 text-center">
              <Zap className="w-12 h-12 text-[#52525b] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 tracking-tight">No Active Signals</h3>
              <p className="text-[#a1a1aa]">
                We&apos;re analyzing the market. You&apos;ll be notified when a
                new signal is generated.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {userSignals.map((signal) => (
                <div
                  key={signal.id}
                  className="bg-[#111114] border border-[#27272a] rounded-2xl p-6 hover:border-[#6366f1]/30 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Symbol & Direction */}
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          signal.direction === "LONG"
                            ? "bg-[#10b981]/10"
                            : "bg-[#f43f5e]/10"
                        }`}
                      >
                        {signal.direction === "LONG" ? (
                          <TrendingUp className="w-6 h-6 text-[#10b981]" />
                        ) : (
                          <TrendingDown className="w-6 h-6 text-[#f43f5e]" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg tracking-tight">
                            {signal.symbol}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-md border ${
                              signal.direction === "LONG"
                                ? "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20"
                                : "bg-[#f43f5e]/10 text-[#f43f5e] border-[#f43f5e]/20"
                            }`}
                          >
                            {signal.direction}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-md border ${
                              signal.strength === "STRONG"
                                ? "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20"
                                : signal.strength === "MODERATE"
                                ? "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20"
                                : "bg-[#52525b]/10 text-[#52525b] border-[#52525b]/20"
                            }`}
                          >
                            {signal.strength}
                          </span>
                        </div>
                        <p className="text-sm text-[#71717a]">
                          {formatTimeAgo(signal.opened_at)}
                        </p>
                      </div>
                    </div>

                    {/* Entry & Targets */}
                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <p className="text-[#71717a]">Entry</p>
                        <p className="font-mono font-medium">
                          ${signal.entry_price.toLocaleString()}
                        </p>
                      </div>
                      {signal.take_profit_pct && (
                        <div>
                          <p className="text-[#71717a]">Target</p>
                          <p className="font-mono font-medium text-[#10b981]">
                            +{signal.take_profit_pct}%
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-[#71717a]">Checks</p>
                        <p className="font-mono">
                          <span className="text-[#10b981]">
                            {signal.checks_passed}
                          </span>
                          <span className="text-[#52525b]">
                            /{signal.total_checks}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-[#71717a]">
                        <Clock className="w-4 h-4" />
                        <span className="font-mono">
                          {getTimeRemaining(
                            signal.opened_at,
                            signal.hold_time_hours
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-5">
          <Link
            href="/performance"
            className="bg-[#111114] border border-[#27272a] rounded-2xl p-6 hover:border-[#6366f1]/30 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1 tracking-tight">View Performance</h3>
                <p className="text-sm text-[#71717a]">
                  Track historical signal results
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#52525b] group-hover:text-[#6366f1] transition-colors" />
            </div>
          </Link>

          <Link
            href="/methodology"
            className="bg-[#111114] border border-[#27272a] rounded-2xl p-6 hover:border-[#6366f1]/30 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1 tracking-tight">Our Methodology</h3>
                <p className="text-sm text-[#71717a]">
                  Learn how signals are generated
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#52525b] group-hover:text-[#6366f1] transition-colors" />
            </div>
          </Link>

          <Link
            href="/settings"
            className="bg-[#111114] border border-[#27272a] rounded-2xl p-6 hover:border-[#6366f1]/30 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1 tracking-tight">Settings</h3>
                <p className="text-sm text-[#71717a]">
                  Manage profile & notifications
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#52525b] group-hover:text-[#6366f1] transition-colors" />
            </div>
          </Link>
        </div>

        {/* Telegram CTA for eligible plans */}
        {subscription?.has_telegram && !profile?.telegram_id && (
          <div className="mt-8 bg-gradient-to-r from-[#0088cc]/10 to-[#22d3ee]/5 border border-[#0088cc]/20 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0088cc]/10 flex items-center justify-center">
                  <Send className="w-6 h-6 text-[#0088cc]" />
                </div>
                <div>
                  <h3 className="font-semibold tracking-tight">Connect Telegram</h3>
                  <p className="text-sm text-[#71717a]">
                    Get instant signal alerts directly on Telegram
                  </p>
                </div>
              </div>
              <Link href="/settings#telegram" className="btn-secondary">
                Connect Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
