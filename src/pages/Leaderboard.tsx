import { useState } from 'react';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { useRealtimeUsers } from '@/hooks/useRealtime';
import { Trophy, Search, Users } from 'lucide-react';

export default function Leaderboard() {
  const { users, loading } = useRealtimeUsers();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="text-gradient">Leaderboard</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Real-time rankings of all REVA waitlist members. Climb the ranks to unlock exclusive benefits.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-6 py-3 rounded-xl glass">
              <Users className="w-5 h-5 text-secondary" />
              <div>
                <p className="text-2xl font-display font-bold text-gradient">{users.length}</p>
                <p className="text-xs text-muted-foreground">Total Users</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 rounded-xl glass">
              <Trophy className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-display font-bold text-gradient">
                  {users[0]?.points.toLocaleString() || 0}
                </p>
                <p className="text-xs text-muted-foreground">Top Score</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search wallet or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-neon pl-12 w-80"
            />
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="card-neon overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 mx-auto rounded-full border-4 border-primary border-t-transparent animate-spin" />
              <p className="mt-4 text-muted-foreground">Loading leaderboard...</p>
            </div>
          ) : (
            <LeaderboardTable users={users} searchTerm={searchTerm} />
          )}
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-primary/20" />
            <span>Your Position</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-secondary/20 text-secondary text-xs">Admin</span>
            <span>Platform Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">👑</span>
            <span>Top 3 Ranks</span>
          </div>
        </div>
      </div>
    </main>
  );
}
