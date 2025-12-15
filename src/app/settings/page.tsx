"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Profile,
  Subscription,
  UserPreferences,
  PLAN_DETAILS,
  AVAILABLE_PAIRS,
  SubscriptionPlan,
} from "@/lib/types";
import {
  User,
  ArrowLeft,
  Mail,
  Phone,
  Bell,
  Send,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Crown,
  Lock,
  Trash2,
  ExternalLink,
  Shield,
} from "lucide-react";
import Image from "next/image";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyTelegram, setNotifyTelegram] = useState(false);
  const [selectedPairs, setSelectedPairs] = useState<string[]>([]);
  const [riskLevel, setRiskLevel] = useState("moderate");
  const [defaultLeverage, setDefaultLeverage] = useState(10);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);

    try {
      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/login");
        return;
      }

      const [profileRes, subscriptionRes, preferencesRes] = await Promise.all([
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
      ]);

      if (profileRes.data) {
        setProfile(profileRes.data);
        setFullName(profileRes.data.full_name || "");
        setPhone(profileRes.data.phone || "");
        setTelegramUsername(profileRes.data.telegram_username || "");
        setNotifyEmail(profileRes.data.notify_email);
        setNotifyTelegram(profileRes.data.notify_telegram);
      }

      if (subscriptionRes.data) {
        setSubscription(subscriptionRes.data);
      }

      if (preferencesRes.data) {
        setPreferences(preferencesRes.data);
        setSelectedPairs(preferencesRes.data.selected_pairs || []);
        setRiskLevel(preferencesRes.data.risk_level || "moderate");
        setDefaultLeverage(preferencesRes.data.default_leverage || 10);
      }
    } catch {
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone: phone,
          telegram_username: telegramUsername,
          notify_email: notifyEmail,
          notify_telegram: notifyTelegram,
        })
        .eq("id", profile.id);

      if (error) throw error;

      setSuccess("Profile updated successfully!");
      setProfile({
        ...profile,
        full_name: fullName,
        phone,
        telegram_username: telegramUsername,
        notify_email: notifyEmail,
        notify_telegram: notifyTelegram,
      });
    } catch {
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!preferences) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("user_preferences")
        .update({
          selected_pairs: selectedPairs,
          risk_level: riskLevel,
          default_leverage: defaultLeverage,
        })
        .eq("id", preferences.id);

      if (error) throw error;

      setSuccess("Preferences updated successfully!");
      setPreferences({
        ...preferences,
        selected_pairs: selectedPairs,
        risk_level: riskLevel,
        default_leverage: defaultLeverage,
      });
    } catch {
      setError("Failed to update preferences");
    } finally {
      setSaving(false);
    }
  };

  const togglePair = (pair: string) => {
    const maxPairs = subscription ? PLAN_DETAILS[subscription.plan].maxPairs : 0;

    if (selectedPairs.includes(pair)) {
      setSelectedPairs(selectedPairs.filter((p) => p !== pair));
    } else if (selectedPairs.length < maxPairs) {
      setSelectedPairs([...selectedPairs, pair]);
    }
  };

  const handlePasswordReset = async () => {
    if (!profile?.email) return;

    setSaving(true);
    setError(null);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.resetPasswordForEmail(
        profile.email,
        {
          redirectTo: `${window.location.origin}/auth/callback?redirectTo=/settings`,
        }
      );

      if (error) throw error;

      setSuccess("Password reset email sent! Check your inbox.");
    } catch {
      setError("Failed to send password reset email");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#8b5cf6]" />
          <p className="text-[#9ca3af]">Loading settings...</p>
        </div>
      </div>
    );
  }

  const planDetails = subscription
    ? PLAN_DETAILS[subscription.plan]
    : PLAN_DETAILS.free;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-[#2d2d3d] bg-[#12121a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 rounded-lg hover:bg-[#1a1a2e] transition-colors text-[#9ca3af] hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
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
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Settings</h1>

        {/* Status Messages */}
        {success && (
          <div className="mb-6 p-4 bg-[#10b981]/10 border border-[#10b981]/30 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
            <p className="text-[#10b981]">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#ef4444]" />
            <p className="text-[#ef4444]">{error}</p>
          </div>
        )}

        {/* Profile Section */}
        <section className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-[#8b5cf6]" />
            Profile Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#12121a] border border-[#2d2d3d] rounded-lg px-4 py-3 text-white placeholder-[#6b7280] focus:outline-none focus:border-[#8b5cf6] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={profile?.email || ""}
                disabled
                className="w-full bg-[#12121a] border border-[#2d2d3d] rounded-lg px-4 py-3 text-[#6b7280] cursor-not-allowed"
              />
              <p className="text-xs text-[#6b7280] mt-1">
                Email cannot be changed
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Phone (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 234 567 8900"
                  className="w-full bg-[#12121a] border border-[#2d2d3d] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#6b7280] focus:outline-none focus:border-[#8b5cf6] transition-colors"
                />
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Profile
            </button>
          </div>
        </section>

        {/* Subscription Section */}
        <section className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Crown className="w-5 h-5 text-[#f59e0b]" />
            Subscription
          </h2>

          <div className="bg-[#12121a] rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#9ca3af]">Current Plan</p>
                <p className="text-2xl font-bold">{planDetails.name}</p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm ${
                  subscription?.status === "active"
                    ? "bg-[#10b981]/20 text-[#10b981]"
                    : "bg-[#f59e0b]/20 text-[#f59e0b]"
                }`}
              >
                {subscription?.status || "Active"}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-[#9ca3af]">Trading Pairs</p>
                <p className="font-medium">
                  {planDetails.maxPairs === 0
                    ? "None"
                    : `${planDetails.maxPairs} pair${
                        planDetails.maxPairs > 1 ? "s" : ""
                      }`}
                </p>
              </div>
              <div>
                <p className="text-[#9ca3af]">Telegram Alerts</p>
                <p className="font-medium">
                  {planDetails.hasTelegram ? (
                    <span className="text-[#10b981]">Included</span>
                  ) : (
                    <span className="text-[#6b7280]">Not included</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-[#9ca3af]">API Access</p>
                <p className="font-medium">
                  {planDetails.hasApi ? (
                    <span className="text-[#10b981]">Included</span>
                  ) : (
                    <span className="text-[#6b7280]">Not included</span>
                  )}
                </p>
              </div>
            </div>

            {subscription?.current_period_end && (
              <p className="mt-4 text-sm text-[#9ca3af]">
                {subscription.status === "active"
                  ? `Renews on ${new Date(
                      subscription.current_period_end
                    ).toLocaleDateString()}`
                  : `Expires on ${new Date(
                      subscription.current_period_end
                    ).toLocaleDateString()}`}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <Link href="/pricing" className="btn-primary flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              {subscription?.plan === "free" ? "Upgrade Plan" : "Change Plan"}
            </Link>
            {subscription?.plan !== "free" && (
              <button className="btn-secondary text-[#ef4444] border-[#ef4444]/30 hover:bg-[#ef4444]/10">
                Cancel Subscription
              </button>
            )}
          </div>
        </section>

        {/* Notifications Section */}
        <section
          id="telegram"
          className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-6 mb-6"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#8b5cf6]" />
            Notifications
          </h2>

          <div className="space-y-4">
            {/* Email Notifications */}
            <label className="flex items-center justify-between p-4 bg-[#12121a] rounded-lg cursor-pointer hover:bg-[#1a1a2e] transition-colors">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#9ca3af]" />
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-[#9ca3af]">
                    Receive signals via email
                  </p>
                </div>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#2d2d3d] rounded-full peer peer-checked:bg-[#8b5cf6] transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform"></div>
              </div>
            </label>

            {/* Telegram Notifications */}
            <div className="p-4 bg-[#12121a] rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Send className="w-5 h-5 text-[#0088cc]" />
                  <div>
                    <p className="font-medium">Telegram Notifications</p>
                    <p className="text-sm text-[#9ca3af]">
                      Get instant alerts on Telegram
                    </p>
                  </div>
                </div>
                {subscription?.has_telegram ? (
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={notifyTelegram}
                      onChange={(e) => setNotifyTelegram(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#2d2d3d] rounded-full peer peer-checked:bg-[#0088cc] transition-colors cursor-pointer"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform pointer-events-none"></div>
                  </div>
                ) : (
                  <span className="px-3 py-1 bg-[#f59e0b]/20 text-[#f59e0b] text-xs rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Pro+
                  </span>
                )}
              </div>

              {subscription?.has_telegram && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">
                    Telegram Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]">
                      @
                    </span>
                    <input
                      type="text"
                      value={telegramUsername}
                      onChange={(e) => setTelegramUsername(e.target.value)}
                      placeholder="username"
                      className="w-full bg-[#1a1a2e] border border-[#2d2d3d] rounded-lg pl-8 pr-4 py-3 text-white placeholder-[#6b7280] focus:outline-none focus:border-[#0088cc] transition-colors"
                    />
                  </div>
                  <p className="text-xs text-[#9ca3af] mt-2">
                    After saving, message our bot @AxiomSignalsBot to complete
                    setup
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Notifications
            </button>
          </div>
        </section>

        {/* Trading Pairs Section */}
        <section className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#10b981]" />
            Trading Pairs
          </h2>

          <p className="text-[#9ca3af] mb-4">
            Select which trading pairs you want to receive signals for.{" "}
            {planDetails.maxPairs === 0 ? (
              <span className="text-[#f59e0b]">
                Upgrade your plan to select pairs.
              </span>
            ) : (
              <span>
                You can select up to {planDetails.maxPairs} pair
                {planDetails.maxPairs > 1 ? "s" : ""}.
              </span>
            )}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {AVAILABLE_PAIRS.map((pair) => {
              const isSelected = selectedPairs.includes(pair);
              const isDisabled =
                !isSelected && selectedPairs.length >= planDetails.maxPairs;

              return (
                <button
                  key={pair}
                  onClick={() => togglePair(pair)}
                  disabled={isDisabled || planDetails.maxPairs === 0}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    isSelected
                      ? "border-[#8b5cf6] bg-[#8b5cf6]/20"
                      : isDisabled || planDetails.maxPairs === 0
                      ? "border-[#2d2d3d] bg-[#12121a] opacity-50 cursor-not-allowed"
                      : "border-[#2d2d3d] bg-[#12121a] hover:border-[#8b5cf6]/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{pair}</span>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-[#8b5cf6]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-sm text-[#6b7280] mb-4">
            Selected: {selectedPairs.length}/{planDetails.maxPairs} pairs
          </p>

          <button
            onClick={handleSavePreferences}
            disabled={saving || planDetails.maxPairs === 0}
            className="btn-primary flex items-center gap-2"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Pairs
          </button>
        </section>

        {/* Security Section */}
        <section className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#ef4444]" />
            Security
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-[#12121a] rounded-lg">
              <h3 className="font-medium mb-2">Change Password</h3>
              <p className="text-sm text-[#9ca3af] mb-4">
                We&apos;ll send a password reset link to your email
              </p>
              <button
                onClick={handlePasswordReset}
                disabled={saving}
                className="btn-secondary flex items-center gap-2"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
                Send Reset Email
              </button>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-[#1a1a2e] border border-[#ef4444]/30 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-6 text-[#ef4444] flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Danger Zone
          </h2>

          <div className="p-4 bg-[#ef4444]/10 rounded-lg">
            <h3 className="font-medium mb-2">Delete Account</h3>
            <p className="text-sm text-[#9ca3af] mb-4">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </p>
            <button className="px-4 py-2 bg-[#ef4444]/20 border border-[#ef4444]/30 rounded-lg text-[#ef4444] hover:bg-[#ef4444]/30 transition-colors">
              Delete My Account
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
