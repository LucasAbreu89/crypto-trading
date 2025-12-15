"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Profile,
  Subscription,
  UserPreferences,
  Signal,
  PLAN_DETAILS,
  AVAILABLE_PAIRS,
} from "@/lib/types";
import {
  User,
  Settings,
  LogOut,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  Crown,
  Bell,
  Send,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";

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
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#8b5cf6]" />
          <p className="text-[#9ca3af]">Loading your dashboard...</p>
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
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-[#2d2d3d] bg-[#12121a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Axiom"
                width={140}
                height={42}
                className="object-contain"
                unoptimized
              />
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/settings"
                className="p-2 rounded-lg hover:bg-[#1a1a2e] transition-colors text-[#9ca3af] hover:text-white"
              >
                <Settings className="w-5 h-5" />
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-[#1a1a2e] transition-colors text-[#9ca3af] hover:text-white"
              >
                <LogOut className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#00f5ff] flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#ef4444]" />
            <p className="text-[#ef4444]">{error}</p>
            <button
              onClick={loadUserData}
              className="ml-auto text-[#ef4444] hover:text-white transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome back,{" "}
            <span className="gradient-text">
              {profile?.full_name?.split(" ")[0] || "Trader"}
            </span>
          </h1>
          <p className="text-[#9ca3af]">
            Here&apos;s your trading signals overview
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Plan Card */}
          <div className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#9ca3af] text-sm">Current Plan</span>
              <Crown
                className={`w-5 h-5 ${
                  subscription?.plan === "premium"
                    ? "text-[#f59e0b]"
                    : subscription?.plan === "pro"
                    ? "text-[#8b5cf6]"
                    : "text-[#6b7280]"
                }`}
              />
            </div>
            <p className="text-2xl font-bold">{planDetails.name}</p>
            <p className="text-sm text-[#9ca3af]">
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
          <div className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#9ca3af] text-sm">Active Signals</span>
              <Zap className="w-5 h-5 text-[#00f5ff]" />
            </div>
            <p className="text-2xl font-bold">{userSignals.length}</p>
            <p className="text-sm text-[#9ca3af]">
              {userSignals.length > 0 ? "Trading opportunities" : "No active signals"}
            </p>
          </div>

          {/* Notification Status */}
          <div className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#9ca3af] text-sm">Notifications</span>
              <Bell className="w-5 h-5 text-[#8b5cf6]" />
            </div>
            <div className="flex items-center gap-2">
              {profile?.notify_email && (
                <span className="px-2 py-1 rounded bg-[#10b981]/20 text-[#10b981] text-xs">
                  Email
                </span>
              )}
              {profile?.notify_telegram && subscription?.has_telegram && (
                <span className="px-2 py-1 rounded bg-[#0088cc]/20 text-[#0088cc] text-xs">
                  Telegram
                </span>
              )}
              {!profile?.notify_email &&
                (!profile?.notify_telegram || !subscription?.has_telegram) && (
                  <span className="text-[#9ca3af] text-sm">Disabled</span>
                )}
            </div>
            <Link
              href="/settings"
              className="mt-2 text-sm text-[#8b5cf6] hover:text-[#a78bfa]"
            >
              Manage →
            </Link>
          </div>

          {/* Selected Pairs */}
          <div className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#9ca3af] text-sm">Your Pairs</span>
              <TrendingUp className="w-5 h-5 text-[#10b981]" />
            </div>
            <div className="flex flex-wrap gap-2">
              {preferences?.selected_pairs?.length ? (
                preferences.selected_pairs.map((pair) => (
                  <span
                    key={pair}
                    className="px-2 py-1 rounded bg-[#8b5cf6]/20 text-[#8b5cf6] text-xs font-mono"
                  >
                    {pair}
                  </span>
                ))
              ) : (
                <span className="text-[#9ca3af] text-sm">None selected</span>
              )}
            </div>
          </div>
        </div>

        {/* Active Signals Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Active Signals</h2>
            <button
              onClick={loadUserData}
              className="flex items-center gap-2 text-sm text-[#9ca3af] hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {subscription?.plan === "free" ? (
            <div className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-8 text-center">
              <Crown className="w-12 h-12 text-[#f59e0b] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">
                Upgrade to See Signals
              </h3>
              <p className="text-[#9ca3af] mb-6 max-w-md mx-auto">
                Free accounts can explore our platform but don&apos;t receive
                trading signals. Upgrade to start receiving data-driven
                opportunities.
              </p>
              <Link href="/pricing" className="btn-primary inline-block">
                View Plans
              </Link>
            </div>
          ) : userSignals.length === 0 ? (
            <div className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-8 text-center">
              <Zap className="w-12 h-12 text-[#6b7280] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Active Signals</h3>
              <p className="text-[#9ca3af]">
                We&apos;re analyzing the market. You&apos;ll be notified when a
                new signal is generated.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {userSignals.map((signal) => (
                <div
                  key={signal.id}
                  className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-6 hover:border-[#8b5cf6]/50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Symbol & Direction */}
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          signal.direction === "LONG"
                            ? "bg-[#10b981]/20"
                            : "bg-[#ef4444]/20"
                        }`}
                      >
                        {signal.direction === "LONG" ? (
                          <TrendingUp className="w-6 h-6 text-[#10b981]" />
                        ) : (
                          <TrendingDown className="w-6 h-6 text-[#ef4444]" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">
                            {signal.symbol}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              signal.direction === "LONG"
                                ? "bg-[#10b981]/20 text-[#10b981]"
                                : "bg-[#ef4444]/20 text-[#ef4444]"
                            }`}
                          >
                            {signal.direction}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              signal.strength === "STRONG"
                                ? "bg-[#10b981]/20 text-[#10b981]"
                                : signal.strength === "MODERATE"
                                ? "bg-[#f59e0b]/20 text-[#f59e0b]"
                                : "bg-[#6b7280]/20 text-[#6b7280]"
                            }`}
                          >
                            {signal.strength}
                          </span>
                        </div>
                        <p className="text-sm text-[#9ca3af]">
                          {formatTimeAgo(signal.opened_at)}
                        </p>
                      </div>
                    </div>

                    {/* Entry & Targets */}
                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <p className="text-[#9ca3af]">Entry</p>
                        <p className="font-mono font-medium">
                          ${signal.entry_price.toLocaleString()}
                        </p>
                      </div>
                      {signal.take_profit_pct && (
                        <div>
                          <p className="text-[#9ca3af]">Target</p>
                          <p className="font-mono font-medium text-[#10b981]">
                            +{signal.take_profit_pct}%
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-[#9ca3af]">Checks</p>
                        <p className="font-mono">
                          <span className="text-[#10b981]">
                            {signal.checks_passed}
                          </span>
                          <span className="text-[#6b7280]">
                            /{signal.total_checks}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-[#9ca3af]">
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
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="/performance"
            className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-6 hover:border-[#8b5cf6]/50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">View Performance</h3>
                <p className="text-sm text-[#9ca3af]">
                  Track historical signal results
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#6b7280] group-hover:text-[#8b5cf6] transition-colors" />
            </div>
          </Link>

          <Link
            href="/methodology"
            className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-6 hover:border-[#8b5cf6]/50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Our Methodology</h3>
                <p className="text-sm text-[#9ca3af]">
                  Learn how signals are generated
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#6b7280] group-hover:text-[#8b5cf6] transition-colors" />
            </div>
          </Link>

          <Link
            href="/settings"
            className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-6 hover:border-[#8b5cf6]/50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Settings</h3>
                <p className="text-sm text-[#9ca3af]">
                  Manage profile & notifications
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#6b7280] group-hover:text-[#8b5cf6] transition-colors" />
            </div>
          </Link>
        </div>

        {/* Telegram CTA for eligible plans */}
        {subscription?.has_telegram && !profile?.telegram_id && (
          <div className="mt-8 bg-gradient-to-r from-[#0088cc]/20 to-[#00f5ff]/20 border border-[#0088cc]/30 rounded-xl p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#0088cc]/20 flex items-center justify-center">
                  <Send className="w-6 h-6 text-[#0088cc]" />
                </div>
                <div>
                  <h3 className="font-semibold">Connect Telegram</h3>
                  <p className="text-sm text-[#9ca3af]">
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
