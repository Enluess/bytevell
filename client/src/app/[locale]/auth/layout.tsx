'use client';

import { BackgroundEffects } from '@/components/BackgroundEffects';
import { Flex } from '@/components/ui';
import { Link } from '@/i18n/routing';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden text-foreground">
      <BackgroundEffects />
      
      <div className="absolute top-8 left-8 z-50">
        <Link href="/" className="hover:opacity-80 transition-opacity block">
          <Image src="/bytevell-beyaz.svg" alt="Bytevell Logo" width={140} height={40} className="object-contain" />
        </Link>
      </div>

      <Flex col items="center" justify="center" className="flex-1 px-4 relative z-10 w-full py-20">
        {children}
      </Flex>
    </div>
  );
}
