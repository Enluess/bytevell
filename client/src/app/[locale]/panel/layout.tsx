'use client';

import { PanelSidebar } from '@/components/panel/PanelSidebar';
import { PanelHeader } from '@/components/panel/PanelHeader';
import { CommandPalette } from '@/components/panel/CommandPalette';

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#000000] text-foreground overflow-hidden">
      {/* Floating Sidebar hidden on mobile by default, shown on lg */}
      <div className="hidden lg:flex z-40 w-[260px] shrink-0 p-4 pb-4 pr-0">
        <div className="w-full h-full bg-white/[0.02] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col relative before:absolute before:inset-0 before:-z-10 before:backdrop-blur-2xl">
          <PanelSidebar />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 relative">
        <PanelHeader />
        
        <main className="flex-1 overflow-y-auto px-4 pb-4 md:px-8 md:pb-8 xl:px-10 xl:pb-10 scrollbar-hide relative">
          <div className="max-w-[1500px] mx-auto w-full relative z-10 pt-4">
            {children}
          </div>
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
