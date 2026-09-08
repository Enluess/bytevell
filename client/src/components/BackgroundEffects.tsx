'use client';

export function BackgroundEffects() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
      {/* Subtle top light gradient — single soft glow, no grid */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] max-w-5xl h-[600px] pointer-events-none opacity-[0.15]" 
        style={{ 
          background: 'radial-gradient(ellipse at top, var(--primary) 0%, transparent 60%)' 
        }} 
      />
      

      {/* Central strong glow like Nodesty */}
      <div 
        className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[80%] max-w-2xl h-[300px] pointer-events-none opacity-20 blur-[100px]" 
        style={{ background: 'var(--primary)' }}
      />
      {/* Bottom fade for seamless transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
}
