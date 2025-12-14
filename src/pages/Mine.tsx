import { Pickaxe } from 'lucide-react';

export default function Mine() {
  return (
    <div className="min-h-screen pt-24 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center relative">
          {/* Glowing Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[hsl(var(--lum-gold)/0.06)] rounded-full blur-[150px]" />
          </div>

          {/* Icon with Glow */}
          <div className="relative mb-8">
            <div className="absolute inset-0 w-24 h-24 bg-[hsl(var(--lum-gold)/0.2)] rounded-full blur-[40px] animate-glow-pulse" />
            <div className="w-24 h-24 rounded-full bg-layer-2/50 flex items-center justify-center relative z-10 border border-[hsl(var(--lum-gold)/0.2)]">
              <Pickaxe className="w-10 h-10 text-primary" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient-gold mb-4 relative z-10">
            Mine
          </h1>
          <p className="text-xl text-primary font-medium mb-2 relative z-10">Coming Soon</p>
          <p className="text-muted-foreground max-w-md relative z-10">
            Something exciting is being built. Stay tuned for updates!
          </p>
        </div>
      </div>
    </div>
  );
}
