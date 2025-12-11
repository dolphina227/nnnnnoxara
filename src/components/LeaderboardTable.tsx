import { User } from '@/lib/supabase';
import { ADMIN_WALLET } from '@/config/wagmi';
import { useAccount } from 'wagmi';
import { Crown, Shield, Star } from 'lucide-react';

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

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Star className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Star className="w-5 h-5 text-amber-600" />;
    return <span className="text-muted-foreground">{rank}</span>;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-4 px-4 text-muted-foreground font-medium">Rank</th>
            <th className="text-left py-4 px-4 text-muted-foreground font-medium">Wallet</th>
            <th className="text-left py-4 px-4 text-muted-foreground font-medium">Username</th>
            <th className="text-right py-4 px-4 text-muted-foreground font-medium">Points</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => {
            const isCurrentUser = address?.toLowerCase() === user.wallet.toLowerCase();
            const isAdmin = user.wallet.toLowerCase() === ADMIN_WALLET;

            return (
              <tr
                key={user.wallet}
                className={`border-b border-border/50 transition-colors ${
                  isCurrentUser
                    ? 'bg-primary/10 glow-purple'
                    : 'hover:bg-white/5'
                }`}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center w-8 h-8">
                    {getRankIcon(index + 1)}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{shortenAddress(user.wallet)}</span>
                    {isAdmin && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/20 text-secondary text-xs">
                        <Shield className="w-3 h-3" />
                        Admin
                      </span>
                    )}
                    {isCurrentUser && (
                      <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs">
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

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No users found
        </div>
      )}
    </div>
  );
}
