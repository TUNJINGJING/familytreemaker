"use client";

import { useLocale } from "next-intl";

export default function CTASection() {
  const locale = useLocale();

  return (
    <section className="flex flex-col items-center justify-center px-6 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-4 text-4xl font-extrabold text-blue-700 md:text-5xl">
          Start Building Your Family Tree Today
        </h2>
        <p className="mb-8 text-xl leading-relaxed text-gray-700">
          Join thousands of families preserving their legacy with our free family tree maker.
          No credit card required.
        </p>
        <div className="flex justify-center">
          <a
            href={`/${locale}/editor`}
            className="inline-flex items-center rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Create Your Tree Free
            <svg
              className="ml-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
