import { useState, useEffect } from 'react';
import { Quest } from '@/lib/supabase';
import { ExternalLink, Check, Loader2, Zap, Lock } from 'lucide-react';

interface QuestCardProps {
  quest: Quest;
  completed: boolean;
  onComplete: () => Promise<void>;
}

export function QuestCard({ quest, completed, onComplete }: QuestCardProps) {
  const [loading, setLoading] = useState(false);
  const [linkVisited, setLinkVisited] = useState(false);

  // Check localStorage for visited status on mount
  useEffect(() => {
    const visitedKey = `quest_visited_${quest.quest_id}`;
    const visited = localStorage.getItem(visitedKey);
    if (visited === 'true') {
      setLinkVisited(true);
    }
  }, [quest.quest_id]);

  const handleVisitLink = () => {
    if (quest.quest_link) {
      const visitedKey = `quest_visited_${quest.quest_id}`;
      localStorage.setItem(visitedKey, 'true');
      setLinkVisited(true);
      window.open(quest.quest_link, '_blank', 'noopener,noreferrer');
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await onComplete();
      // Clear visited status after completion
      const visitedKey = `quest_visited_${quest.quest_id}`;
      localStorage.removeItem(visitedKey);
    } finally {
      setLoading(false);
    }
  };

  const canComplete = !quest.quest_link || linkVisited;

  return (
    <div 
      className={`rounded-2xl p-6 border transition-all duration-300 backdrop-blur-xl ${
        completed 
          ? 'opacity-70 bg-[hsl(var(--layer-1)/0.4)] border-border/30' 
          : 'bg-[hsl(var(--layer-1)/0.6)] border-[hsl(var(--lum-gold)/0.15)] hover:border-[hsl(var(--lum-gold)/0.3)] shadow-card'
      }`}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-[hsl(var(--lum-gold)/0.15)] border border-[hsl(var(--lum-gold)/0.2)]">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-lg">{quest.title}</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            {quest.description}
          </p>
          
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-full bg-[hsl(var(--lum-gold)/0.1)] border border-[hsl(var(--lum-gold)/0.2)] text-primary text-sm font-semibold">
              +{quest.reward_points} pts
            </span>
            {quest.status === 'inactive' && (
              <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm">
                Inactive
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 min-w-[140px]">
          {quest.quest_link && (
            <button
              onClick={handleVisitLink}
              disabled={completed}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300 border ${
                linkVisited && !completed 
                  ? 'border-[hsl(var(--lum-cyan)/0.5)] text-secondary bg-[hsl(var(--lum-cyan)/0.1)]' 
                  : 'border-border/50 text-foreground hover:border-[hsl(var(--lum-gold)/0.3)] bg-layer-2/50'
              } ${completed ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ExternalLink className={`w-4 h-4 ${linkVisited && !completed ? 'text-secondary' : ''}`} />
              {linkVisited && !completed ? 'Visited' : 'Visit Link'}
            </button>
          )}
          
          {completed ? (
            <div className="px-4 py-2.5 rounded-xl bg-[hsl(var(--lum-cyan)/0.1)] border border-[hsl(var(--lum-cyan)/0.3)] text-secondary font-semibold text-sm flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              Completed
            </div>
          ) : (
            <button
              onClick={handleComplete}
              disabled={loading || quest.status === 'inactive' || !canComplete}
              className="px-4 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 transition-all duration-300 bg-gradient-to-r from-[hsl(var(--lum-gold-bright))] to-[hsl(var(--lum-gold))] text-background hover:shadow-[0_0_20px_hsl(var(--glow-gold)/0.3)] hover:-translate-y-0.5"
              title={!canComplete ? 'Visit the link first to complete this quest' : ''}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : !canComplete ? (
                <>
                  <Lock className="w-4 h-4" />
                  Complete
                </>
              ) : (
                'Complete'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
