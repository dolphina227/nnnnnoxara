import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ADMIN_WALLET } from '@/config/wagmi';
import { Quest, createQuest, updateQuest, deleteQuest, updateUserPoints } from '@/lib/supabase';
import { useRealtimeQuests, useRealtimeUsers } from '@/hooks/useRealtime';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit2, Trash2, Save, X, Users, Sparkles, TrendingUp, Link as LinkIcon, Shield } from 'lucide-react';

export function AdminPanel() {
  const { address } = useAccount();
  const { toast } = useToast();
  const { quests, refetch: refetchQuests } = useRealtimeQuests();
  const { users, refetch: refetchUsers } = useRealtimeUsers();
  
  const [showQuestForm, setShowQuestForm] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [questForm, setQuestForm] = useState({
    title: '',
    description: '',
    reward_points: 200,
    quest_link: '',
    status: 'active' as string,
  });

  const isAdmin = address?.toLowerCase() === ADMIN_WALLET;

  if (!isAdmin) {
    return (
      <div className="text-center py-20 card-neon max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/10 flex items-center justify-center">
          <Shield className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-xl font-display font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">You don't have permission to access this page.</p>
      </div>
    );
  }

  const resetForm = () => {
    setQuestForm({
      title: '',
      description: '',
      reward_points: 200,
      quest_link: '',
      status: 'active',
    });
    setEditingQuest(null);
    setShowQuestForm(false);
  };

  const handleCreateQuest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingQuest) {
        await updateQuest(editingQuest.quest_id, {
          ...questForm,
          quest_link: questForm.quest_link || null,
        });
        toast({ title: 'Quest updated!' });
      } else {
        await createQuest({
          ...questForm,
          quest_link: questForm.quest_link || null,
          created_by: address!,
        });
        toast({ title: 'Quest created!' });
      }
      resetForm();
      refetchQuests();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save quest', variant: 'destructive' });
    }
  };

  const handleDeleteQuest = async (quest_id: string) => {
    if (!confirm('Are you sure you want to delete this quest?')) return;
    try {
      await deleteQuest(quest_id);
      toast({ title: 'Quest deleted!' });
      refetchQuests();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete quest', variant: 'destructive' });
    }
  };

  const handleEditQuest = (quest: Quest) => {
    setEditingQuest(quest);
    setQuestForm({
      title: quest.title,
      description: quest.description,
      reward_points: quest.reward_points,
      quest_link: quest.quest_link || '',
      status: quest.status as 'active' | 'inactive',
    });
    setShowQuestForm(true);
  };

  const handleUpdatePoints = async (wallet: string, currentPoints: number) => {
    const newPoints = prompt('Enter new point value:', currentPoints.toString());
    if (newPoints === null) return;
    
    const points = parseInt(newPoints);
    if (isNaN(points)) {
      toast({ title: 'Invalid points value', variant: 'destructive' });
      return;
    }

    try {
      await updateUserPoints(wallet, points);
      toast({ title: 'Points updated!' });
      refetchUsers();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update points', variant: 'destructive' });
    }
  };

  const totalUsers = users.length;
  const totalPoints = users.reduce((sum, u) => sum + u.points, 0);
  const activeQuests = quests.filter(q => q.status === 'active').length;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-neon text-center">
          <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-3">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <p className="text-2xl font-display font-bold text-gradient">{totalUsers}</p>
          <p className="text-muted-foreground text-sm">Total Users</p>
        </div>
        <div className="card-neon text-center">
          <div className="inline-flex p-3 rounded-xl bg-secondary/10 mb-3">
            <Sparkles className="w-6 h-6 text-secondary" />
          </div>
          <p className="text-2xl font-display font-bold">{activeQuests}</p>
          <p className="text-muted-foreground text-sm">Active Quests</p>
        </div>
        <div className="card-neon text-center">
          <div className="inline-flex p-3 rounded-xl bg-glow-purple/10 mb-3">
            <TrendingUp className="w-6 h-6 text-glow-purple" />
          </div>
          <p className="text-2xl font-display font-bold text-gradient">{totalPoints.toLocaleString()}</p>
          <p className="text-muted-foreground text-sm">Total Points</p>
        </div>
      </div>

      {/* Quest Management */}
      <div className="card-neon">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold">Quest Management</h2>
          <button
            onClick={() => setShowQuestForm(!showQuestForm)}
            className="btn-neon text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Quest
          </button>
        </div>

        {showQuestForm && (
          <form onSubmit={handleCreateQuest} className="mb-6 p-6 rounded-xl bg-layer-2/50 border border-border/30 space-y-4">
            <input
              type="text"
              placeholder="Quest Title"
              value={questForm.title}
              onChange={(e) => setQuestForm({ ...questForm, title: e.target.value })}
              className="input-neon"
              required
            />
            <textarea
              placeholder="Description"
              value={questForm.description}
              onChange={(e) => setQuestForm({ ...questForm, description: e.target.value })}
              className="input-neon min-h-[80px] resize-none"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Points</label>
                <select
                  value={questForm.reward_points}
                  onChange={(e) => setQuestForm({ ...questForm, reward_points: parseInt(e.target.value) })}
                  className="input-neon"
                >
                  <option value={100}>100 pts</option>
                  <option value={200}>200 pts</option>
                  <option value={500}>500 pts</option>
                  <option value={1000}>1000 pts</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Status</label>
                <select
                  value={questForm.status}
                  onChange={(e) => setQuestForm({ ...questForm, status: e.target.value })}
                  className="input-neon"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="url"
                placeholder="Quest Link (optional)"
                value={questForm.quest_link}
                onChange={(e) => setQuestForm({ ...questForm, quest_link: e.target.value })}
                className="input-neon pl-12"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-neon flex items-center gap-2">
                <Save className="w-4 h-4" />
                {editingQuest ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={resetForm} className="btn-neon-outline flex items-center gap-2">
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {quests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No quests yet. Create your first quest!
            </div>
          ) : (
            quests.map((quest) => (
              <div 
                key={quest.quest_id} 
                className="flex items-center justify-between p-4 rounded-xl bg-layer-2/30 border border-border/20"
              >
                <div>
                  <h3 className="font-semibold">{quest.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-secondary">+{quest.reward_points} pts</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      quest.status === 'active' 
                        ? 'bg-green-500/10 text-green-400' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {quest.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditQuest(quest)}
                    className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuest(quest.quest_id)}
                    className="p-2 rounded-lg hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* User Management */}
      <div className="card-neon">
        <h2 className="text-xl font-display font-bold mb-6">User Management</h2>

        <div className="w-full">
          {/* Mobile: vertical list (no horizontal scroll) */}
          <div className="md:hidden divide-y divide-border/20">
            {users.slice(0, 50).map((user) => (
              <article key={user.wallet} className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-mono text-sm truncate">
                      {user.wallet.slice(0, 8)}...{user.wallet.slice(-6)}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">@{user.twitter_username}</div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-bold text-gradient">{user.points.toLocaleString()}</div>
                    <button
                      onClick={() => handleUpdatePoints(user.wallet, user.points)}
                      className="mt-1 text-xs text-secondary hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {users.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">No users registered yet.</div>
            )}
          </div>

          {/* Desktop: table */}
          <div className="hidden md:block">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left py-3 px-4 text-muted-foreground text-sm">Wallet</th>
                  <th className="text-left py-3 px-4 text-muted-foreground text-sm">Twitter</th>
                  <th className="text-right py-3 px-4 text-muted-foreground text-sm">Points</th>
                  <th className="text-right py-3 px-4 text-muted-foreground text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 50).map((user) => (
                  <tr key={user.wallet} className="border-b border-border/20 hover:bg-layer-2/30">
                    <td className="py-3 px-4 font-mono text-sm truncate">
                      {user.wallet.slice(0, 8)}...{user.wallet.slice(-6)}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground truncate">@{user.twitter_username}</td>
                    <td className="py-3 px-4 text-right font-bold text-gradient">{user.points.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleUpdatePoints(user.wallet, user.points)}
                        className="text-sm text-secondary hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">No users registered yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
