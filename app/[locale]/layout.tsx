import "../globals.css";
import { Providers } from "@/app/providers";
import { AppContextProvider } from "@/contexts/app";
import { NextAuthSessionProvider } from "@/providers/session";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Family Tree Maker - Create Beautiful Family Trees",
  description: "Create, visualize, and share your family history with our interactive family tree maker.",
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale || "en"}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="flex min-h-screen flex-col bg-[#F2F2F2] text-[#111]">
        <AppContextProvider>
          <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
            <NextAuthSessionProvider>
              <NextIntlClientProvider messages={messages}>
                {children}
              </NextIntlClientProvider>
            </NextAuthSessionProvider>
          </Providers>
        </AppContextProvider>
      </body>
    </html>
  );
}
