'use client';

export function BackgroundEffects() {
  return (
    <div className="absolute top-0 left-0 w-full h-[800px] z-0 overflow-hidden pointer-events-none" aria-hidden="true" style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }}>
      
      <div className="absolute inset-0 grid-pattern opacity-50" style={{ backgroundSize: '50px 50px' }} />

      <div 
        className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[1200px] h-[400px] rounded-[100%] pointer-events-none mix-blend-screen blur-[120px]" 
        style={{ background: 'rgba(100, 107, 242, 0.15)' }} 
      />
      
      <div 
        className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] max-w-[700px] h-[200px] rounded-[100%] pointer-events-none mix-blend-screen blur-[90px]" 
        style={{ background: 'rgba(255, 255, 255, 0.05)' }} 
      />

    </div>
  );
}
