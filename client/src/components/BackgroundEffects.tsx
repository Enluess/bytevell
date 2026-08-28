'use client';

export function BackgroundEffects() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
      {/* Subtle grid background pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
        style={{ 
          backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)', 
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
        }} 
      />
      
      {/* Subtle top light gradient */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] max-w-4xl h-[500px] pointer-events-none opacity-[0.12]" 
        style={{ 
          background: 'radial-gradient(ellipse at top, var(--primary) 0%, transparent 70%)' 
        }} 
      />
    </div>
  );
}
