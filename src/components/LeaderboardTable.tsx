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
        <p className="text-muted-foreground">Join the waitlist to appear here!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border/30">
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
                className={`border-b border-border/20 transition-colors ${
                  isCurrentUser
                    ? 'bg-primary/5'
                    : 'hover:bg-layer-2/50'
                }`}
              >
                <td className="py-4 px-4">
                  {getRankDisplay(index + 1)}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        background: `linear-gradient(135deg, hsl(${(parseInt(user.wallet.slice(2, 10), 16) % 360)} 60% 50%), hsl(${(parseInt(user.wallet.slice(10, 18), 16) % 360)} 60% 50%))`
                      }}
                    >
                      {user.wallet.slice(2, 4).toUpperCase()}
                    </div>
                    <span className="font-mono text-sm">{shortenAddress(user.wallet)}</span>
                    {isAdmin && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                        <Shield className="w-3 h-3" />
                        Admin
                      </span>
                    )}
                    {isCurrentUser && (
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        You
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-muted-foreground">@{user.twitter_username}</span>
                </td>
                <td className="py-4 px-4 text-right">
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
