import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ADMIN_WALLET } from '@/config/wagmi';
import { Quest, createQuest, updateQuest, deleteQuest, updateUserPoints } from '@/lib/supabase';
import { useRealtimeQuests, useRealtimeUsers } from '@/hooks/useRealtime';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit2, Trash2, Save, X, Users, Sparkles, TrendingUp } from 'lucide-react';

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
      <div className="text-center py-20">
        <h2 className="text-2xl font-display font-bold mb-4">Access Denied</h2>
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
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-neon">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/20">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Total Users</p>
              <p className="text-2xl font-display font-bold">{totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="card-neon">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-secondary/20">
              <Sparkles className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Active Quests</p>
              <p className="text-2xl font-display font-bold">{activeQuests}</p>
            </div>
          </div>
        </div>
        <div className="card-neon">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-glow-purple/20">
              <TrendingUp className="w-6 h-6 text-glow-purple" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Total Points</p>
              <p className="text-2xl font-display font-bold">{totalPoints.toLocaleString()}</p>
            </div>
          </div>
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
          <form onSubmit={handleCreateQuest} className="mb-6 p-4 rounded-xl bg-muted/30 space-y-4">
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
              className="input-neon min-h-[80px]"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Reward Points"
                value={questForm.reward_points}
                onChange={(e) => setQuestForm({ ...questForm, reward_points: parseInt(e.target.value) })}
                className="input-neon"
                required
              />
              <select
                value={questForm.status}
                onChange={(e) => setQuestForm({ ...questForm, status: e.target.value })}
                className="input-neon"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <input
              type="url"
              placeholder="Quest Link (optional)"
              value={questForm.quest_link}
              onChange={(e) => setQuestForm({ ...questForm, quest_link: e.target.value })}
              className="input-neon"
            />
            <div className="flex gap-2">
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
          {quests.map((quest) => (
            <div key={quest.quest_id} className="flex items-center justify-between p-4 rounded-xl bg-muted/20">
              <div>
                <h3 className="font-semibold">{quest.title}</h3>
                <p className="text-sm text-muted-foreground">{quest.reward_points} pts • {quest.status}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditQuest(quest)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteQuest(quest.quest_id)}
                  className="p-2 rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Management */}
      <div className="card-neon">
        <h2 className="text-xl font-display font-bold mb-6">User Management</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground">Wallet</th>
                <th className="text-left py-3 px-4 text-muted-foreground">Twitter</th>
                <th className="text-right py-3 px-4 text-muted-foreground">Points</th>
                <th className="text-right py-3 px-4 text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 50).map((user) => (
                <tr key={user.wallet} className="border-b border-border/50 hover:bg-white/5">
                  <td className="py-3 px-4 font-mono text-sm">
                    {user.wallet.slice(0, 10)}...{user.wallet.slice(-6)}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">@{user.twitter_username}</td>
                  <td className="py-3 px-4 text-right font-bold">{user.points.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleUpdatePoints(user.wallet, user.points)}
                      className="text-sm text-primary hover:underline"
                    >
                      Edit Points
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
