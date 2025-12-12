import { useState, useRef, useCallback } from 'react';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { useRealtimeUsers } from '@/hooks/useRealtime';
import { Trophy, Search, Users, Crown, Loader2 } from 'lucide-react';

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
            <span className="text-gradient">Leaderboard</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real-time rankings of all REVA waitlist members
          </p>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
          <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-layer-1 border border-border/30">
            <Users className="w-5 h-5 text-secondary" />
            <div>
              <p className="text-xl font-display font-bold text-gradient">{users.length}+</p>
              <p className="text-xs text-muted-foreground">Users Loaded</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-layer-1 border border-border/30">
            <Trophy className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xl font-display font-bold text-gradient">
                {users[0]?.points.toLocaleString() || 0}
              </p>
              <p className="text-xs text-muted-foreground">Top Score</p>
            </div>
          </div>
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
              className="input-neon pl-12 w-full"
            />
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="max-w-4xl mx-auto">
          <div className="card-neon overflow-hidden">
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
            <Crown className="w-4 h-4 text-yellow-400" />
            <span>Top 3 Ranks</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-xs">You</span>
            <span>Your Position</span>
          </div>
        </div>
      </div>
    </main>
  );
}
