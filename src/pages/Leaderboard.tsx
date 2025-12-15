import { useState, useRef, useCallback } from 'react';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { useRealtimeUsers } from '@/hooks/useRealtime';
import { Search, Crown, Loader2 } from 'lucide-react';

export default function Leaderboard() {
  const { users, loading, loadingMore, hasMore, loadMore } = useRealtimeUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Infinite scroll observer
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading || loadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !searchTerm) {
        loadMore();
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [loading, loadingMore, hasMore, loadMore, searchTerm]);

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
            <span className="text-gradient-gold">Leaderboard</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Rankings of all Noxara waitlist members
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search wallet or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-5 rounded-xl border border-border/50 bg-[hsl(var(--input)/0.5)] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[hsl(var(--lum-gold)/0.5)] focus:ring-2 focus:ring-[hsl(var(--lum-gold)/0.1)] transition-all"
            />
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl bg-[hsl(var(--layer-1)/0.6)] border border-[hsl(var(--lum-gold)/0.15)] backdrop-blur-xl shadow-card overflow-hidden">
            {loading ? (
              <div className="text-center py-20">
                <div className="w-12 h-12 mx-auto rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <p className="mt-4 text-muted-foreground">Loading leaderboard...</p>
              </div>
            ) : (
              <>
                <LeaderboardTable users={users} searchTerm={searchTerm} />
                
                {/* Infinite scroll trigger */}
                {!searchTerm && (
                  <div ref={lastElementRef} className="py-4">
                    {loadingMore && (
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm">Loading more...</span>
                      </div>
                    )}
                    {!hasMore && users.length > 0 && (
                      <p className="text-center text-sm text-muted-foreground/60">
                        End of leaderboard
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-primary" />
            <span>Top 3 Ranks</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[hsl(var(--lum-cyan)/0.1)] border border-[hsl(var(--lum-cyan)/0.2)] text-secondary text-xs">You</span>
            <span>Your Position</span>
          </div>
        </div>
      </div>
    </main>
  );
}
