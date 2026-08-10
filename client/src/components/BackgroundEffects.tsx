'use client';

export function BackgroundEffects() {
  return (
    <div className="absolute top-0 left-0 w-full min-h-[900px] z-0 overflow-hidden pointer-events-none" aria-hidden="true" style={{ maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' }}>
      <div className="absolute inset-0 grid-pattern opacity-50" style={{ backgroundSize: 'clamp(30px, 8vw, 50px) clamp(30px, 8vw, 50px)' }} />

      {/* Base White Orbs */}
      <div 
        className="absolute w-48 h-48 sm:w-80 sm:h-80 md:w-125 md:h-125 rounded-full" 
        style={{
          top: '-10%', left: '-5%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 70%)',
          animation: 'float 30s ease-in-out infinite alternate'
        }} 
      />
      <div 
        className="absolute w-40 h-40 sm:w-64 sm:h-64 md:w-100 md:h-100 rounded-full" 
        style={{
          bottom: '-10%', right: '-5%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 70%)',
          animation: 'float 35s ease-in-out infinite alternate',
          animationDelay: '-10s'
        }} 
      />

      {/* Rich Purple Gradients from Homepage */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-60 mix-blend-screen" 
        style={{ background: 'radial-gradient(ellipse 100% 100% at center 45%, rgba(100,107,242,0.25) 0%, transparent 80%)' }}
      />
      <div 
        className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-80 sm:h-80 md:w-125 md:h-125 rounded-full blur-3xl animate-float pointer-events-none" 
        style={{ background: 'radial-gradient(circle, rgba(100,107,242,0.20) 0%, transparent 70%)' }}
      />
      <div 
        className="absolute bottom-[15%] right-1/4 w-48 h-48 sm:w-80 sm:h-80 md:w-125 md:h-125 rounded-full blur-3xl animate-float pointer-events-none" 
        style={{ background: 'radial-gradient(circle, rgba(100,107,242,0.15) 0%, transparent 70%)', animationDelay: '-3s' }} 
      />
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full sm:w-200 h-48 sm:h-100 pointer-events-none" 
        style={{ background: 'radial-gradient(ellipse at center top, rgba(100,107,242,0.12) 0%, transparent 70%)' }}
      />
    </div>
  );
}
