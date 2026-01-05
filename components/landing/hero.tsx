"use client";

import { useLocale } from "next-intl";

export default function HeroSection() {
  const locale = useLocale();

  return (
    <section className="relative flex flex-col items-center justify-center px-6 py-20 md:py-32">
      <div className="mx-auto max-w-5xl text-center">
        {/* Badge */}
        <div className="mb-6 inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
          Free to Start • No Credit Card Required
        </div>

        {/* Heading */}
        <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
          Preserve Your{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Family Legacy
          </span>
        </h1>

        {/* Subheading */}
        <p className="mb-10 text-xl leading-relaxed text-gray-700 md:text-2xl">
          Create beautiful, interactive family trees with our easy-to-use editor.
          <br />
          Share your family history and connect with loved ones.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a
            href={`/${locale}/editor`}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Start Creating Free
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
          <a
            href="#features"
            className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-700 transition-colors hover:border-gray-400"
          >
            See Features
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600">100%</div>
            <div className="mt-2 text-sm text-gray-600">Free to Start</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600">Unlimited</div>
            <div className="mt-2 text-sm text-gray-600">Family Members</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600">Easy</div>
            <div className="mt-2 text-sm text-gray-600">Drag & Drop</div>
          </div>
        </div>
      </div>

      {/* Preview Image/Animation Placeholder */}
      <div className="mt-16 w-full max-w-6xl">
        <div className="relative aspect-video overflow-hidden rounded-2xl border-4 border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50 shadow-2xl">
          <div className="flex h-full items-center justify-center">
            <p className="text-2xl font-semibold text-gray-400">
              Interactive Family Tree Preview
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
