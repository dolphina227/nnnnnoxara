import { useState } from 'react';
import { Quest } from '@/lib/supabase';
import { ExternalLink, Check, Loader2, Sparkles } from 'lucide-react';

interface QuestCardProps {
  quest: Quest;
  completed: boolean;
  onComplete: () => Promise<void>;
}

export function QuestCard({ quest, completed, onComplete }: QuestCardProps) {
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    try {
      await onComplete();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`card-neon group ${completed ? 'border-secondary/30' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-display font-semibold text-lg">{quest.title}</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-4">{quest.description}</p>
          
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
              +{quest.reward_points} pts
            </span>
            {quest.status === 'inactive' && (
              <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm">
                Inactive
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {quest.quest_link && (
            <a
              href={quest.quest_link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-neon-outline text-sm px-4 py-2 flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Go to Quest
            </a>
          )}
          
          <button
            onClick={handleComplete}
            disabled={completed || loading || quest.status === 'inactive'}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
              completed
                ? 'bg-secondary/20 text-secondary cursor-default'
                : 'btn-neon'
            } disabled:opacity-50`}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : completed ? (
              <>
                <Check className="w-4 h-4" />
                Completed
              </>
            ) : (
              'Complete Quest'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
