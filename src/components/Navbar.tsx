"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Axiom"
              width={160}
              height={48}
              className="object-contain"
              style={{ height: "var(--logo-header-height)", width: "auto" }}
              priority
              unoptimized
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/live"
              className="text-[#9ca3af] hover:text-white transition-colors"
            >
              Live
            </Link>
            <Link
              href="/performance"
              className="text-[#9ca3af] hover:text-white transition-colors"
            >
              Performance
            </Link>
            <Link
              href="/methodology"
              className="text-[#9ca3af] hover:text-white transition-colors"
            >
              Methodology
            </Link>
            <Link
              href="/pricing"
              className="text-[#9ca3af] hover:text-white transition-colors"
            >
              Pricing
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-[#9ca3af] hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link href="/pricing" className="btn-primary text-sm">
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[#9ca3af] hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden glass border-t border-[#2d2d3d]">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/live"
              className="block text-[#9ca3af] hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Live
            </Link>
            <Link
              href="/performance"
              className="block text-[#9ca3af] hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Performance
            </Link>
            <Link
              href="/methodology"
              className="block text-[#9ca3af] hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Methodology
            </Link>
            <Link
              href="/pricing"
              className="block text-[#9ca3af] hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <div className="pt-3 border-t border-[#2d2d3d] flex flex-col gap-3">
              <Link
                href="/login"
                className="text-[#9ca3af] hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/pricing"
                className="btn-primary text-sm text-center"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
