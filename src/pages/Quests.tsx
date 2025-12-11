import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { QuestCard } from '@/components/QuestCard';
import { useRealtimeQuests } from '@/hooks/useRealtime';
import { completeQuest, getCompletedQuests, getUser, User } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Trophy, Target } from 'lucide-react';

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
        title: 'Quest Completed! 🎉',
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
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="text-gradient">Quests</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Complete quests to earn points and climb the leaderboard. More points = more benefits at launch.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card-neon">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Your Points</p>
                <p className="text-2xl font-display font-bold text-gradient">
                  {totalPoints.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="card-neon">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-secondary/20">
                <Target className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Completed</p>
                <p className="text-2xl font-display font-bold">
                  {completedCount} / {activeQuests.length}
                </p>
              </div>
            </div>
          </div>
          <div className="card-neon">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-glow-purple/20">
                <Sparkles className="w-6 h-6 text-glow-purple" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Available</p>
                <p className="text-2xl font-display font-bold">
                  {activeQuests.length - completedCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quest List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 mx-auto rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="mt-4 text-muted-foreground">Loading quests...</p>
          </div>
        ) : activeQuests.length === 0 ? (
          <div className="text-center py-12 card-neon">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-display font-bold mb-2">No Quests Available</h3>
            <p className="text-muted-foreground">Check back later for new quests!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeQuests.map((quest) => (
              <QuestCard
                key={quest.quest_id}
                quest={quest}
                completed={completedQuests.includes(quest.quest_id)}
                onComplete={() => handleCompleteQuest(quest.quest_id, quest.reward_points)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
