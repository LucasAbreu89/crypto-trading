"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  X,
  Shield,
  Zap,
  Star,
  MessageCircle,
  Mail,
  ChevronDown,
} from "lucide-react";
import { pricingPlans, faqItems } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const yearlyDiscount = 0.2; // 20% discount

  const getPrice = (monthlyPrice: number) => {
    if (billingPeriod === "yearly") {
      return Math.round(monthlyPrice * 12 * (1 - yearlyDiscount));
    }
    return monthlyPrice;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <section className="border-b border-[#2d2d3d] bg-[#12121a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h1>
          <p className="text-[#9ca3af] mb-8">
            Choose the plan that fits your trading style. All plans include our
            7-day money-back guarantee.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-[#1a1a2e] rounded-full p-1">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all",
                billingPeriod === "monthly"
                  ? "bg-gradient-to-r from-[#8b5cf6] to-[#00f5ff] text-white"
                  : "text-[#9ca3af] hover:text-white"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                billingPeriod === "yearly"
                  ? "bg-gradient-to-r from-[#8b5cf6] to-[#00f5ff] text-white"
                  : "text-[#9ca3af] hover:text-white"
              )}
            >
              Yearly
              <span className="bg-[#10b981] text-white text-xs px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative bg-[#1a1a2e] border rounded-2xl overflow-hidden",
                plan.popular
                  ? "border-[#8b5cf6] scale-105 shadow-lg shadow-[#8b5cf6]/20"
                  : "border-[#2d2d3d]"
              )}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#8b5cf6] to-[#00f5ff] text-white text-center py-2 text-sm font-semibold">
                  <Star className="w-4 h-4 inline mr-1" />
                  Most Popular
                </div>
              )}

              <div className={cn("p-8", plan.popular && "pt-14")}>
                {/* Plan Name */}
                <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                <p className="text-[#9ca3af] text-sm mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    ${getPrice(plan.price)}
                  </span>
                  <span className="text-[#9ca3af]">
                    /{billingPeriod === "yearly" ? "year" : "month"}
                  </span>
                  {billingPeriod === "yearly" && (
                    <p className="text-sm text-[#10b981] mt-1">
                      ${Math.round(getPrice(plan.price) / 12)}/month billed
                      annually
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  className={cn(
                    "w-full py-3 rounded-lg font-semibold transition-all mb-8",
                    plan.popular
                      ? "btn-primary"
                      : "btn-secondary hover:bg-[#242442]"
                  )}
                >
                  {plan.cta}
                </button>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 opacity-50"
                    >
                      <X className="w-5 h-5 text-[#6b7280] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-[#6b7280]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl overflow-hidden mb-16">
          <div className="px-6 py-4 border-b border-[#2d2d3d]">
            <h2 className="text-xl font-semibold">Compare Plans</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2d2d3d]">
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#9ca3af]">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium">
                    Starter
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-[#8b5cf6]">
                    Pro
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium">
                    Premium
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    feature: "Trading Pairs",
                    starter: "1",
                    pro: "3",
                    premium: "6",
                  },
                  {
                    feature: "Telegram Notifications",
                    starter: false,
                    pro: true,
                    premium: true,
                  },
                  {
                    feature: "Email Notifications",
                    starter: true,
                    pro: true,
                    premium: true,
                  },
                  {
                    feature: "Full Dashboard",
                    starter: false,
                    pro: true,
                    premium: true,
                  },
                  {
                    feature: "Performance Analytics",
                    starter: false,
                    pro: true,
                    premium: true,
                  },
                  {
                    feature: "API Access",
                    starter: false,
                    pro: false,
                    premium: true,
                  },
                  {
                    feature: "VIP Support",
                    starter: false,
                    pro: false,
                    premium: true,
                  },
                  {
                    feature: "Monthly Strategy Call",
                    starter: false,
                    pro: false,
                    premium: true,
                  },
                ].map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-[#2d2d3d] hover:bg-[#242442] transition-colors"
                  >
                    <td className="px-6 py-4 text-sm">{row.feature}</td>
                    <td className="px-6 py-4 text-center">
                      {typeof row.starter === "boolean" ? (
                        row.starter ? (
                          <Check className="w-5 h-5 text-[#10b981] mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-[#6b7280] mx-auto" />
                        )
                      ) : (
                        <span className="font-medium">{row.starter}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center bg-[#8b5cf6]/5">
                      {typeof row.pro === "boolean" ? (
                        row.pro ? (
                          <Check className="w-5 h-5 text-[#10b981] mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-[#6b7280] mx-auto" />
                        )
                      ) : (
                        <span className="font-medium text-[#8b5cf6]">
                          {row.pro}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {typeof row.premium === "boolean" ? (
                        row.premium ? (
                          <Check className="w-5 h-5 text-[#10b981] mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-[#6b7280] mx-auto" />
                        )
                      ) : (
                        <span className="font-medium">{row.premium}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Guarantee Section */}
        <div className="bg-gradient-to-r from-[#10b981]/10 to-[#10b981]/5 border border-[#10b981]/30 rounded-xl p-8 mb-16">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-[#10b981]/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-8 h-8 text-[#10b981]" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-2">
                7-Day Money-Back Guarantee
              </h3>
              <p className="text-[#9ca3af]">
                Try our service risk-free. If you&apos;re not satisfied within the
                first 7 days, we&apos;ll refund 100% of your payment—no questions
                asked. We&apos;re confident you&apos;ll love our signals.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. Crypto payments (BTC, ETH, USDT) available for yearly plans.",
              },
              {
                question: "Can I upgrade or downgrade my plan?",
                answer:
                  "Yes! You can change your plan at any time. Upgrades take effect immediately, and downgrades take effect at the end of your current billing period. We'll prorate the difference.",
              },
              {
                question: "How do I cancel my subscription?",
                answer:
                  "You can cancel anytime from your dashboard. Your access continues until the end of your current billing period. No penalties or hidden fees.",
              },
              {
                question: "Is my payment information secure?",
                answer:
                  "Absolutely. We use Stripe for payment processing, which is PCI-DSS Level 1 certified—the highest level of security in the payments industry. We never store your card details.",
              },
              ...faqItems.slice(0, 4),
            ].map((item, index) => (
              <div
                key={index}
                className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#242442] transition-colors"
                >
                  <span className="font-medium">{item.question}</span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-[#9ca3af] transition-transform",
                      openFaq === index && "rotate-180"
                    )}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-[#9ca3af]">{item.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-[#1a1a2e] border border-[#2d2d3d] rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Still Have Questions?</h2>
          <p className="text-[#9ca3af] mb-6">
            Our team is here to help you choose the right plan
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on Telegram
            </a>
            <a
              href="mailto:support@axiom.com"
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
