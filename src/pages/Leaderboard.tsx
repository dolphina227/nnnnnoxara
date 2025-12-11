import { useState } from 'react';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { useRealtimeUsers } from '@/hooks/useRealtime';
import { Trophy, Search, Users, Crown } from 'lucide-react';

export default function Leaderboard() {
  const { users, loading } = useRealtimeUsers();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <main className="min-h-screen pt-24 pb-16 noise-overlay">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-14">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-5">
            <span className="text-gradient">Leaderboard</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
            Real-time rankings of all REVA waitlist members. Climb the ranks to unlock exclusive benefits.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 px-6 py-4 rounded-2xl glass hover-glow transition-all duration-300">
              <div className="p-2.5 rounded-xl bg-secondary/15">
                <Users className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-gradient">{users.length}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Users</p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-6 py-4 rounded-2xl glass hover-glow transition-all duration-300">
              <div className="p-2.5 rounded-xl bg-primary/15">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-gradient">
                  {users[0]?.points.toLocaleString() || 0}
                </p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Top Score</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-secondary" />
            <input
              type="text"
              placeholder="Search wallet or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-neon pl-14 w-80"
            />
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="card-neon overflow-hidden">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-14 h-14 mx-auto rounded-full border-4 border-primary border-t-transparent animate-spin" />
              <p className="mt-6 text-muted-foreground">Loading leaderboard...</p>
            </div>
          ) : (
            <LeaderboardTable users={users} searchTerm={searchTerm} />
          )}
        </div>

        {/* Legend */}
        <div className="mt-10 flex flex-wrap items-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-secondary" />
            </div>
            <span>Your Position</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-semibold">Admin</span>
            <span>Platform Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <Crown className="w-5 h-5 text-yellow-400" />
            <span>Top 3 Ranks</span>
          </div>
        </div>
      </div>
    </main>
  );
}
