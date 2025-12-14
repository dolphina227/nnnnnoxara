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
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
            <span className="text-gradient-gold">Quests</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Complete quests to earn points and climb the leaderboard
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="rounded-2xl p-6 text-center bg-[hsl(var(--layer-1)/0.6)] border border-[hsl(var(--lum-gold)/0.15)] backdrop-blur-xl shadow-card">
            <div className="inline-flex p-3 rounded-xl bg-[hsl(var(--lum-gold)/0.15)] border border-[hsl(var(--lum-gold)/0.2)] mb-3">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <p className="text-2xl font-display font-bold text-gradient-gold">
              {totalPoints.toLocaleString()}
            </p>
            <p className="text-muted-foreground text-sm">Your Points</p>
          </div>
          <div className="rounded-2xl p-6 text-center bg-[hsl(var(--layer-1)/0.6)] border border-[hsl(var(--lum-cyan)/0.15)] backdrop-blur-xl shadow-card">
            <div className="inline-flex p-3 rounded-xl bg-[hsl(var(--lum-cyan)/0.15)] border border-[hsl(var(--lum-cyan)/0.2)] mb-3">
              <Target className="w-6 h-6 text-secondary" />
            </div>
            <p className="text-2xl font-display font-bold text-secondary">
              {completedCount} / {activeQuests.length}
            </p>
            <p className="text-muted-foreground text-sm">Completed</p>
          </div>
          <div className="rounded-2xl p-6 text-center bg-[hsl(var(--layer-1)/0.6)] border border-[hsl(var(--lum-purple)/0.15)] backdrop-blur-xl shadow-card">
            <div className="inline-flex p-3 rounded-xl bg-[hsl(var(--lum-purple)/0.15)] border border-[hsl(var(--lum-purple)/0.2)] mb-3">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <p className="text-2xl font-display font-bold text-accent">
              {activeQuests.length - completedCount}
            </p>
            <p className="text-muted-foreground text-sm">Available</p>
          </div>
        </div>

        {/* Quest List */}
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 mx-auto rounded-full border-4 border-primary border-t-transparent animate-spin" />
              <p className="mt-4 text-muted-foreground">Loading quests...</p>
            </div>
          ) : activeQuests.length === 0 ? (
            <div className="text-center py-20 rounded-2xl bg-[hsl(var(--layer-1)/0.6)] border border-[hsl(var(--lum-gold)/0.15)] backdrop-blur-xl shadow-card">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[hsl(var(--lum-gold)/0.15)] border border-[hsl(var(--lum-gold)/0.2)] flex items-center justify-center">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-display font-bold mb-2 text-gradient-gold">No Quests Available</h3>
              <p className="text-muted-foreground">Check back later for new quests!</p>
            </div>
          ) : (
            <div className="space-y-4">
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
      </div>
    </main>
  );
}
