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
      <div className="text-center py-24 card-accent">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-accent/15 flex items-center justify-center">
          <Shield className="w-10 h-10 text-accent" />
        </div>
        <h2 className="text-2xl font-display font-bold mb-3">Access Denied</h2>
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
        <div className="card-accent hover-lift">
          <div className="flex items-center gap-5 pl-4">
            <div className="p-4 rounded-xl bg-primary/15">
              <Users className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm uppercase tracking-wider mb-1">Total Users</p>
              <p className="text-3xl font-display font-bold text-gradient">{totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="card-accent hover-lift">
          <div className="flex items-center gap-5 pl-4">
            <div className="p-4 rounded-xl bg-secondary/15">
              <Sparkles className="w-7 h-7 text-secondary" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm uppercase tracking-wider mb-1">Active Quests</p>
              <p className="text-3xl font-display font-bold">{activeQuests}</p>
            </div>
          </div>
        </div>
        <div className="card-accent hover-lift">
          <div className="flex items-center gap-5 pl-4">
            <div className="p-4 rounded-xl bg-glow-purple/15">
              <TrendingUp className="w-7 h-7 text-glow-purple" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm uppercase tracking-wider mb-1">Total Points</p>
              <p className="text-3xl font-display font-bold text-gradient">{totalPoints.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quest Management */}
      <div className="card-neon">
        <div className="flex items-center justify-between mb-8">
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
          <form onSubmit={handleCreateQuest} className="mb-8 p-6 rounded-2xl bg-layer-2/50 border border-border/30 space-y-5">
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
              className="input-neon min-h-[100px] resize-none"
              required
            />
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Reward Points</label>
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
              <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="url"
                placeholder="Quest Link (optional)"
                value={questForm.quest_link}
                onChange={(e) => setQuestForm({ ...questForm, quest_link: e.target.value })}
                className="input-neon pl-14"
              />
            </div>
            <div className="flex gap-4 pt-2">
              <button type="submit" className="btn-neon flex items-center gap-2 px-6">
                <Save className="w-4 h-4" />
                {editingQuest ? 'Update Quest' : 'Create Quest'}
              </button>
              <button type="button" onClick={resetForm} className="btn-neon-outline flex items-center gap-2 px-6">
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {quests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No quests yet. Create your first quest!
            </div>
          ) : (
            quests.map((quest) => (
              <div 
                key={quest.quest_id} 
                className="flex items-center justify-between p-5 rounded-2xl bg-layer-2/30 border border-border/20 hover:border-border/40 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-12 rounded-full ${quest.status === 'active' ? 'bg-gradient-vertical' : 'bg-muted'}`} />
                  <div>
                    <h3 className="font-semibold text-lg">{quest.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-secondary font-medium">+{quest.reward_points} pts</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        quest.status === 'active' 
                          ? 'bg-green-500/15 text-green-400' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {quest.status}
                      </span>
                      {quest.quest_link && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <LinkIcon className="w-3 h-3" />
                          Has link
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditQuest(quest)}
                    className="p-3 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuest(quest.quest_id)}
                    className="p-3 rounded-xl hover:bg-accent/10 text-muted-foreground hover:text-accent transition-all duration-300"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* User Management */}
      <div className="card-neon">
        <h2 className="text-xl font-display font-bold mb-8">User Management</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-4 px-5 text-muted-foreground text-sm font-medium uppercase tracking-wider">Wallet</th>
                <th className="text-left py-4 px-5 text-muted-foreground text-sm font-medium uppercase tracking-wider">Twitter</th>
                <th className="text-right py-4 px-5 text-muted-foreground text-sm font-medium uppercase tracking-wider">Points</th>
                <th className="text-right py-4 px-5 text-muted-foreground text-sm font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 50).map((user, index) => (
                <tr 
                  key={user.wallet} 
                  className="border-t border-border/20 hover:bg-layer-2/30 transition-colors"
                >
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          background: `linear-gradient(135deg, hsl(${(parseInt(user.wallet.slice(2, 10), 16) % 360)} 70% 50%), hsl(${(parseInt(user.wallet.slice(10, 18), 16) % 360)} 70% 50%))`
                        }}
                      >
                        {user.wallet.slice(2, 4).toUpperCase()}
                      </div>
                      <span className="font-mono text-sm">
                        {user.wallet.slice(0, 8)}...{user.wallet.slice(-6)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-muted-foreground">@{user.twitter_username}</td>
                  <td className="py-4 px-5 text-right">
                    <span className="font-display font-bold text-gradient">{user.points.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => handleUpdatePoints(user.wallet, user.points)}
                      className="text-sm text-secondary hover:text-secondary/80 font-medium transition-colors"
                    >
                      Edit Points
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No users registered yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
