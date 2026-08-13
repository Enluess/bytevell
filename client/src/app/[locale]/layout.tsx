import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/Providers";
import { Navigation } from "@/components/Navigation";
import { InitialLoader } from "@/components/InitialLoader";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: "Bytevell - Premium Hosting",
    description: t('description')
  };
}
export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark h-full antialiased text-foreground bg-background">
      <body className="min-h-full flex flex-col relative bg-background scrollbar-hide">
        <NextIntlClientProvider messages={messages}>
          <div className="pointer-events-none fixed bottom-0 left-6 top-0 z-1 w-px bg-white/5 2xl:left-[calc(50%-700px+24px)] lg:left-[calc(50%-512px+24px)] xl:left-[calc(50%-576px+24px)] hidden lg:block"></div>
          <div className="pointer-events-none fixed bottom-0 right-6 top-0 z-1 w-px bg-white/5 2xl:right-[calc(50%-700px+24px)] lg:right-[calc(50%-512px+24px)] xl:right-[calc(50%-576px+24px)] hidden lg:block"></div>
          
          <InitialLoader />
          <Navigation />
          <Providers>
            <div className="relative z-10">
              {children}
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
