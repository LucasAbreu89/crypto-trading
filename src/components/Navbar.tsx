"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight, Settings, LogOut, User, LayoutDashboard } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const navLinks = [
  { href: "/live", label: "Live" },
  { href: "/performance", label: "Performance" },
  { href: "/methodology", label: "Methodology" },
  { href: "/pricing", label: "Pricing" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUserMenuOpen(false);
    router.push("/");
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setUserMenuOpen(false);
    if (userMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [userMenuOpen]);

  const isDashboard = pathname?.startsWith("/dashboard") || pathname?.startsWith("/settings");

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isDashboard
          ? "glass shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={user ? "/dashboard" : "/"} className="flex items-center group">
            <Image
              src="/logo.png"
              alt="Axiom"
              width={140}
              height={40}
              className="object-contain transition-opacity group-hover:opacity-80"
              style={{ height: "var(--logo-header-height)", width: "auto" }}
              priority
              unoptimized
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-white"
                    : "text-[#a1a1aa] hover:text-white"
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-[#6366f1] to-[#22d3ee]" />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop CTA / User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    pathname === "/dashboard"
                      ? "text-white"
                      : "text-[#a1a1aa] hover:text-white"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/settings"
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors text-[#a1a1aa] hover:text-white"
                >
                  <Settings className="w-5 h-5" />
                </Link>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUserMenuOpen(!userMenuOpen);
                    }}
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6366f1] to-[#22d3ee] flex items-center justify-center hover:opacity-90 transition-opacity"
                  >
                    <User className="w-4 h-4 text-white" />
                  </button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#111114] border border-[#27272a] rounded-xl shadow-xl overflow-hidden">
                      <div className="px-4 py-3 border-b border-[#27272a]">
                        <p className="text-sm text-white truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#a1a1aa] hover:bg-white/5 hover:text-white transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#a1a1aa] hover:bg-white/5 hover:text-white transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-[#f43f5e] hover:bg-[#f43f5e]/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-[#a1a1aa] hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/pricing"
                  className="group flex items-center gap-2 bg-gradient-to-r from-[#6366f1] to-[#6366f1] hover:to-[#22d3ee] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#6366f1]/25"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[#a1a1aa] hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="glass border-t border-[#27272a] px-4 py-4 space-y-1">
          {user && (
            <div className="flex items-center gap-3 px-3 py-3 mb-2 border-b border-[#27272a]">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366f1] to-[#22d3ee] flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{user.email}</p>
              </div>
            </div>
          )}

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-[#6366f1]/10 text-white"
                  : "text-[#a1a1aa] hover:bg-white/5 hover:text-white"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 mt-3 border-t border-[#27272a] space-y-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#a1a1aa] hover:bg-white/5 hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#a1a1aa] hover:bg-white/5 hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-[#f43f5e] hover:bg-[#f43f5e]/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[#a1a1aa] hover:bg-white/5 hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/pricing"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#6366f1] to-[#22d3ee] text-white text-sm font-medium px-4 py-2.5 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
