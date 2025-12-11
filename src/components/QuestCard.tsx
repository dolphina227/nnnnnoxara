import { useState } from 'react';
import { Quest } from '@/lib/supabase';
import { ExternalLink, Check, Loader2, Zap } from 'lucide-react';

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
    <div 
      className={`card-accent transition-all duration-300 hover-lift ${
        completed ? 'opacity-80' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 pl-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-primary/15">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-lg">{quest.title}</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
            {quest.description}
          </p>
          
          <div className="flex items-center gap-4">
            <span className="px-4 py-1.5 rounded-full bg-secondary/15 text-secondary text-sm font-bold">
              +{quest.reward_points} pts
            </span>
            {quest.status === 'inactive' && (
              <span className="px-4 py-1.5 rounded-full bg-muted text-muted-foreground text-sm">
                Inactive
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 min-w-[160px]">
          {quest.quest_link && (
            <a
              href={quest.quest_link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-neon-outline text-sm px-5 py-2.5 flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4 text-secondary" />
              <span>Visit Link</span>
            </a>
          )}
          
          {completed ? (
            <div className="px-5 py-2.5 rounded-[18px] bg-green-500/15 text-green-400 font-semibold text-sm flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              Completed
            </div>
          ) : (
            <button
              onClick={handleComplete}
              disabled={loading || quest.status === 'inactive'}
              className="btn-neon text-sm px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Complete Quest'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
