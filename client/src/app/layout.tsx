import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/Providers";
import { Navigation } from "@/components/Navigation";
import { InitialLoader } from "@/components/InitialLoader";
import "./globals.css";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: "HostiHub - Premium Hosting",
  description: "Türkiye'nin Premium Hosting Platformu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark h-full antialiased text-foreground bg-background">
      <body className="min-h-full flex flex-col relative bg-background scrollbar-hide">
        <div className="pointer-events-none fixed bottom-0 left-6 top-0 z-1 w-px bg-white/5 2xl:left-[calc(50%-(1400px/2)+24px)] lg:left-[calc(50%-(1024px/2)+24px)] xl:left-[calc(50%-(1152px/2)+24px)] hidden lg:block"></div>
        <div className="pointer-events-none fixed bottom-0 right-6 top-0 z-1 w-px bg-white/5 2xl:right-[calc(50%-(1400px/2)+24px)] lg:right-[calc(50%-(1024px/2)+24px)] xl:right-[calc(50%-(1152px/2)+24px)] hidden lg:block"></div>
        <div className="fixed inset-0 grid-pattern opacity-30 z-0 pointer-events-none"></div>
        
        <InitialLoader />
        <Navigation />
        <Providers>
          <div className="relative z-10">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
