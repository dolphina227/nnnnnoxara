import { User } from '@/lib/supabase';
import { ADMIN_WALLET } from '@/config/wagmi';
import { useAccount } from 'wagmi';
import { Crown, Shield, Medal } from 'lucide-react';

interface LeaderboardTableProps {
  users: User[];
  searchTerm: string;
}

export function LeaderboardTable({ users, searchTerm }: LeaderboardTableProps) {
  const { address } = useAccount();

  const filteredUsers = users.filter(
    (user) =>
      user.wallet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.twitter_username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getRankDisplay = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="flex items-center justify-center w-9 h-9 rounded-full font-bold text-sm bg-gradient-to-br from-[hsl(var(--lum-gold-bright))] to-[hsl(var(--lum-gold))] shadow-[0_0_15px_hsl(var(--glow-gold)/0.5)] text-background">
          <Crown className="w-4 h-4" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="flex items-center justify-center w-9 h-9 rounded-full font-bold text-sm bg-gradient-to-br from-gray-200 to-gray-400 text-background">
          <Medal className="w-4 h-4" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="flex items-center justify-center w-9 h-9 rounded-full font-bold text-sm bg-gradient-to-br from-amber-600 to-amber-800 text-white">
          <Medal className="w-4 h-4" />
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center w-9 h-9 rounded-full font-medium text-sm bg-layer-2 border border-border/30 text-muted-foreground">
        {rank}
      </div>
    );
  };

  if (filteredUsers.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[hsl(var(--lum-gold)/0.1)] border border-[hsl(var(--lum-gold)/0.2)] flex items-center justify-center">
          <Crown className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-display font-bold mb-2 text-gradient-gold">Be the First</h3>
        <p className="text-muted-foreground">Join the waitlist to appear here!</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full">
      {/* Mobile: vertical list (no horizontal scroll) */}
      <div className="md:hidden divide-y divide-[hsl(var(--lum-gold)/0.08)]">
        {filteredUsers.map((user, index) => {
          const isCurrentUser = address?.toLowerCase() === user.wallet.toLowerCase();
          const isAdmin = user.wallet.toLowerCase() === ADMIN_WALLET;

          return (
            <article
              key={user.wallet}
              className={`w-full max-w-full px-4 py-4 ${
                isCurrentUser ? 'bg-[hsl(var(--lum-gold)/0.08)]' : 'bg-transparent'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0">{getRankDisplay(index + 1)}</div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-sm truncate">{shortenAddress(user.wallet)}</span>
                      {isAdmin && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[hsl(var(--lum-gold)/0.1)] border border-[hsl(var(--lum-gold)/0.2)] text-primary text-xs font-medium shrink-0">
                          <Shield className="w-3 h-3" />
                          Admin
                        </span>
                      )}
                      {isCurrentUser && (
                        <span className="px-2 py-0.5 rounded-full bg-[hsl(var(--lum-cyan)/0.1)] border border-[hsl(var(--lum-cyan)/0.2)] text-secondary text-xs font-medium shrink-0">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      @{user.twitter_username}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-display font-bold text-lg text-gradient-gold">
                    {user.points.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-muted-foreground">Points</div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block">
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b border-[hsl(var(--lum-gold)/0.1)]">
              <th className="w-24 text-left py-4 px-4 text-muted-foreground font-medium text-sm">Rank</th>
              <th className="text-left py-4 px-4 text-muted-foreground font-medium text-sm">Wallet</th>
              <th className="text-left py-4 px-4 text-muted-foreground font-medium text-sm">Username</th>
              <th className="w-40 text-right py-4 px-4 text-muted-foreground font-medium text-sm">Points</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => {
              const isCurrentUser = address?.toLowerCase() === user.wallet.toLowerCase();
              const isAdmin = user.wallet.toLowerCase() === ADMIN_WALLET;

              return (
                <tr
                  key={user.wallet}
                  className={`border-b border-border/10 transition-colors ${
                    isCurrentUser ? 'bg-[hsl(var(--lum-gold)/0.08)]' : 'hover:bg-layer-2/50'
                  }`}
                >
                  <td className="py-4 px-4">{getRankDisplay(index + 1)}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border border-[hsl(var(--lum-gold)/0.2)] shrink-0"
                        style={{
                          background: `linear-gradient(135deg, hsl(39 75% 65%), hsl(43 100% 77%))`,
                        }}
                      >
                        <span className="text-background">{user.wallet.slice(2, 4).toUpperCase()}</span>
                      </div>
                      <span className="font-mono text-sm truncate">{shortenAddress(user.wallet)}</span>
                      {isAdmin && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[hsl(var(--lum-gold)/0.1)] border border-[hsl(var(--lum-gold)/0.2)] text-primary text-xs font-medium shrink-0">
                          <Shield className="w-3 h-3" />
                          Admin
                        </span>
                      )}
                      {isCurrentUser && (
                        <span className="px-2 py-0.5 rounded-full bg-[hsl(var(--lum-cyan)/0.1)] border border-[hsl(var(--lum-cyan)/0.2)] text-secondary text-xs font-medium shrink-0">
                          You
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-muted-foreground truncate block">@{user.twitter_username}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-display font-bold text-lg text-gradient-gold">
                      {user.points.toLocaleString()}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
