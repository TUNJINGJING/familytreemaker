"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

const languages = [
  { code: "en", name: "English" },
  { code: "zh", name: "中文" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "ja", name: "日本語" },
];

export default function Footer() {
  const locale = useLocale();
  const pathname = usePathname();

  const getLocalizedPath = (langCode: string) => {
    return pathname.replace(`/${locale}`, `/${langCode}`);
  };

  return (
    <footer className="w-full border-t border-gray-300 bg-[#F2F2F2] py-12">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid gap-8 md:grid-cols-5">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4">
              FamilyTreeMaker
            </h3>
            <p className="text-sm text-gray-600">
              Create, visualize, and share your family history.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold text-sm uppercase mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href={`/${locale}#features`} className="hover:text-black transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href={`/${locale}/pricing`} className="hover:text-black transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href={`/${locale}/examples`} className="hover:text-black transition-colors">
                  Examples
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-sm uppercase mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href={`/${locale}/about`} className="hover:text-black transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href={`/${locale}/blog`} className="hover:text-black transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href={`/${locale}/contact`} className="hover:text-black transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-sm uppercase mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href={`/${locale}/privacy`} className="hover:text-black transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href={`/${locale}/terms`} className="hover:text-black transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Languages (SEO) */}
          <div>
            <h4 className="font-bold text-sm uppercase mb-4">Languages</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {languages.map((lang) => (
                <li key={lang.code}>
                  <a
                    href={getLocalizedPath(lang.code)}
                    className={`hover:text-black transition-colors ${
                      lang.code === locale ? "font-semibold text-blue-600" : ""
                    }`}
                    hrefLang={lang.code}
                  >
                    {lang.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-300 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} FamilyTreeMaker. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
