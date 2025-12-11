import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { QuestCard } from '@/components/QuestCard';
import { useRealtimeQuests } from '@/hooks/useRealtime';
import { completeQuest, getCompletedQuests, getUser, User } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Trophy, Target, Zap } from 'lucide-react';

export default function Quests() {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const { quests, loading } = useRealtimeQuests();
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      if (address) {
        const userData = await getUser(address);
        setUser(userData as User | null);
        const completed = await getCompletedQuests(address);
        setCompletedQuests(completed);
      }
    };
    loadUserData();
  }, [address]);

  const handleCompleteQuest = async (questId: string, rewardPoints: number) => {
    if (!address) {
      toast({
        title: 'Connect Wallet',
        description: 'Please connect your wallet to complete quests.',
        variant: 'destructive',
      });
      return;
    }

    if (!user) {
      toast({
        title: 'Join Waitlist First',
        description: 'You need to join the waitlist before completing quests.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await completeQuest(address, questId, rewardPoints);
      setCompletedQuests([...completedQuests, questId]);
      setUser({ ...user, points: user.points + rewardPoints });
      toast({
        title: 'Quest Completed!',
        description: `You earned +${rewardPoints} points!`,
      });
    } catch (error) {
      console.error('Error completing quest:', error);
      toast({
        title: 'Error',
        description: 'Could not complete quest. Try again.',
        variant: 'destructive',
      });
    }
  };

  const activeQuests = quests.filter(q => q.status === 'active');
  const completedCount = completedQuests.length;
  const totalPoints = user?.points || 0;

  return (
    <main className="min-h-screen pt-24 pb-16 noise-overlay">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-14">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-5">
            <span className="text-gradient">Quests</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
            Complete quests to earn points and climb the leaderboard. More points = more benefits at launch.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          <div className="card-accent hover-lift">
            <div className="flex items-center gap-5 pl-4">
              <div className="p-4 rounded-xl bg-primary/15">
                <Trophy className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm uppercase tracking-wider mb-1">Your Points</p>
                <p className="text-3xl font-display font-bold text-gradient">
                  {totalPoints.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="card-accent hover-lift">
            <div className="flex items-center gap-5 pl-4">
              <div className="p-4 rounded-xl bg-secondary/15">
                <Target className="w-7 h-7 text-secondary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm uppercase tracking-wider mb-1">Completed</p>
                <p className="text-3xl font-display font-bold">
                  {completedCount} <span className="text-muted-foreground text-xl">/ {activeQuests.length}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="card-accent hover-lift">
            <div className="flex items-center gap-5 pl-4">
              <div className="p-4 rounded-xl bg-glow-purple/15">
                <Sparkles className="w-7 h-7 text-glow-purple" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm uppercase tracking-wider mb-1">Available</p>
                <p className="text-3xl font-display font-bold">
                  {activeQuests.length - completedCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quest List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 mx-auto rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="mt-6 text-muted-foreground">Loading quests...</p>
          </div>
        ) : activeQuests.length === 0 ? (
          <div className="text-center py-20 card-accent">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Zap className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-display font-bold mb-3">No Quests Available</h3>
            <p className="text-muted-foreground">Check again soon.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {activeQuests.map((quest, index) => (
              <div 
                key={quest.quest_id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <QuestCard
                  quest={quest}
                  completed={completedQuests.includes(quest.quest_id)}
                  onComplete={() => handleCompleteQuest(quest.quest_id, quest.reward_points)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
