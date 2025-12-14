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
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[hsl(var(--lum-gold)/0.1)]">
            <th className="text-left py-4 px-4 text-muted-foreground font-medium text-sm">Rank</th>
            <th className="text-left py-4 px-4 text-muted-foreground font-medium text-sm">Wallet</th>
            <th className="text-left py-4 px-4 text-muted-foreground font-medium text-sm">Username</th>
            <th className="text-right py-4 px-4 text-muted-foreground font-medium text-sm">Points</th>
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
                  isCurrentUser
                    ? 'bg-[hsl(var(--lum-gold)/0.08)]'
                    : 'hover:bg-layer-2/50'
                }`}
              >
                <td className="py-4 px-4">
                  {getRankDisplay(index + 1)}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border border-[hsl(var(--lum-gold)/0.2)]"
                      style={{
                        background: `linear-gradient(135deg, hsl(39 75% 65%), hsl(43 100% 77%))`
                      }}
                    >
                      <span className="text-background">{user.wallet.slice(2, 4).toUpperCase()}</span>
                    </div>
                    <span className="font-mono text-sm">{shortenAddress(user.wallet)}</span>
                    {isAdmin && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[hsl(var(--lum-gold)/0.1)] border border-[hsl(var(--lum-gold)/0.2)] text-primary text-xs font-medium">
                        <Shield className="w-3 h-3" />
                        Admin
                      </span>
                    )}
                    {isCurrentUser && (
                      <span className="px-2 py-0.5 rounded-full bg-[hsl(var(--lum-cyan)/0.1)] border border-[hsl(var(--lum-cyan)/0.2)] text-secondary text-xs font-medium">
                        You
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-muted-foreground">@{user.twitter_username}</span>
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
  );
}
