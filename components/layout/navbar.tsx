"use client";

import React, { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import LanguageSelector from "@/components/language-selector";

export default function Navbar() {
  const { data: session } = useSession();
  const locale = useLocale();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("Nav");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-300 bg-[#F2F2F2]/95 backdrop-blur-sm transition-all">
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 md:px-12">
        {/* Logo */}
        <a
          href={`/${locale}`}
          className="font-serif text-xl font-bold tracking-tight transition-all hover:italic md:text-2xl"
        >
          FamilyTreeMaker<span className="text-gray-400">.com</span>
        </a>

        <div className="flex items-center gap-8 md:gap-12">
          {/* Desktop Navigation */}
          <nav className="hidden gap-8 text-xs font-bold tracking-widest text-gray-500 uppercase md:flex">
            <a
              href={`/${locale}`}
              className={pathname === `/${locale}` ? "text-black" : "transition-colors hover:text-black"}
            >
              Home
            </a>
            <a
              href={`/${locale}/#features`}
              className="transition-colors hover:text-black"
            >
              Features
            </a>
            <a
              href={`/${locale}/pricing`}
              className={pathname?.includes("/pricing") ? "text-black" : "transition-colors hover:text-black"}
            >
              Pricing
            </a>
            {session && (
              <a
                href={`/${locale}/dashboard`}
                className={pathname?.includes("/dashboard") ? "text-black" : "transition-colors hover:text-black"}
              >
                Dashboard
              </a>
            )}
          </nav>

          {/* Language Selector & CTA */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <LanguageSelector />
            </div>
            <a
              href={`/${locale}/editor`}
              className="hidden md:block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-bold tracking-widest uppercase"
            >
              Start Free
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden flex flex-col gap-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="block h-0.5 w-6 bg-black"></span>
            <span className="block h-0.5 w-6 bg-black"></span>
            <span className="block h-0.5 w-6 bg-black"></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-gray-300 bg-[#F2F2F2] md:hidden">
          <nav className="flex flex-col gap-4 px-6 py-6 text-sm font-bold uppercase">
            <a
              href={`/${locale}`}
              className="text-gray-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
            <a
              href={`/${locale}/#features`}
              className="text-gray-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a
              href={`/${locale}/pricing`}
              className="text-gray-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </a>
            <a
              href={`/${locale}/editor`}
              className="text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Start Free
            </a>
            <div className="pt-4 border-t border-gray-300">
              <LanguageSelector />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
