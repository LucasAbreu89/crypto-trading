import Link from "next/link";
import Image from "next/image";
import { Twitter, Send, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#2d2d3d] bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center mb-4">
              <Image
                src="/logo.png"
                alt="Axiom"
                width={180}
                height={54}
                className="object-contain"
                style={{ height: "var(--logo-footer-height)", width: "auto" }}
                unoptimized
              />
            </Link>
            <p className="text-[#9ca3af] text-sm max-w-md mb-4">
              Data-driven crypto trading signals powered by quantitative analysis.
              11 technical indicators. 2 years of backtested data. Proven results.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-[#1a1a2e] flex items-center justify-center text-[#9ca3af] hover:text-[#00f5ff] hover:border-[#00f5ff] border border-[#2d2d3d] transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-[#1a1a2e] flex items-center justify-center text-[#9ca3af] hover:text-[#00f5ff] hover:border-[#00f5ff] border border-[#2d2d3d] transition-all"
              >
                <Send className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-[#1a1a2e] flex items-center justify-center text-[#9ca3af] hover:text-[#00f5ff] hover:border-[#00f5ff] border border-[#2d2d3d] transition-all"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/performance"
                  className="text-[#9ca3af] hover:text-white text-sm transition-colors"
                >
                  Performance
                </Link>
              </li>
              <li>
                <Link
                  href="/methodology"
                  className="text-[#9ca3af] hover:text-white text-sm transition-colors"
                >
                  Methodology
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-[#9ca3af] hover:text-white text-sm transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-[#9ca3af] hover:text-white text-sm transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-[#9ca3af] hover:text-white text-sm transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  className="text-[#9ca3af] hover:text-white text-sm transition-colors"
                >
                  Risk Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-[#2d2d3d]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#6b7280] text-sm">
              © {new Date().getFullYear()} Axiom Signals. All rights reserved.
            </p>
            <p className="text-[#6b7280] text-xs text-center md:text-right max-w-xl">
              Trading cryptocurrencies involves significant risk. Past performance
              does not guarantee future results. Never invest more than you can
              afford to lose.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
