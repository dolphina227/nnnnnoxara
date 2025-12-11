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
        <div className="rank-gold">
          <Crown className="w-4 h-4" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="rank-silver">
          <Medal className="w-4 h-4" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="rank-bronze">
          <Medal className="w-4 h-4" />
        </div>
      );
    }
    return (
      <div className="rank-default">
        {rank}
      </div>
    );
  };

  if (filteredUsers.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/30 flex items-center justify-center">
          <Crown className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-display font-bold mb-2">Be the First</h3>
        <p className="text-muted-foreground">Be the first to join the race.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left py-5 px-6 text-muted-foreground font-medium text-sm">Rank</th>
            <th className="text-left py-5 px-6 text-muted-foreground font-medium text-sm">Wallet</th>
            <th className="text-left py-5 px-6 text-muted-foreground font-medium text-sm">Username</th>
            <th className="text-right py-5 px-6 text-muted-foreground font-medium text-sm">Points</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => {
            const isCurrentUser = address?.toLowerCase() === user.wallet.toLowerCase();
            const isAdmin = user.wallet.toLowerCase() === ADMIN_WALLET;

            return (
              <tr
                key={user.wallet}
                className={`transition-all duration-270 table-row-enter ${
                  isCurrentUser
                    ? 'bg-secondary/5'
                    : 'hover:bg-layer-2/50'
                }`}
              >
                <td className="py-5 px-6">
                  <div className="separator-glow absolute left-0 right-0 bottom-0" />
                  {getRankDisplay(index + 1)}
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    {/* Avatar placeholder */}
                    <div 
                      className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold"
                      style={{
                        background: `linear-gradient(135deg, hsl(${(parseInt(user.wallet.slice(2, 10), 16) % 360)} 70% 50%), hsl(${(parseInt(user.wallet.slice(10, 18), 16) % 360)} 70% 50%))`
                      }}
                    >
                      {user.wallet.slice(2, 4).toUpperCase()}
                    </div>
                    <span className="font-mono text-sm">{shortenAddress(user.wallet)}</span>
                    {isAdmin && (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-semibold">
                        <Shield className="w-3 h-3" />
                        Admin
                      </span>
                    )}
                    {isCurrentUser && (
                      <span className="px-2.5 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold">
                        You
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-5 px-6">
                  <span className="text-muted-foreground">@{user.twitter_username}</span>
                </td>
                <td className="py-5 px-6 text-right">
                  <span className="font-display font-bold text-lg text-gradient">
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
