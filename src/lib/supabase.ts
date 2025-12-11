import { supabase } from '@/integrations/supabase/client';

export type User = {
  wallet: string;
  email: string;
  twitter_username: string;
  points: number;
  joined_at: string;
};

export type Quest = {
  quest_id: string;
  title: string;
  description: string;
  reward_points: number;
  status: string;
  quest_link: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type CompletedQuest = {
  id: string;
  wallet: string;
  quest_id: string;
  completed_at: string;
};

// User functions
export async function registerUser(wallet: string, email: string, twitter_username: string) {
  const { data, error } = await supabase
    .from('users')
    .insert([{ wallet, email, twitter_username, points: 10000 }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getUser(wallet: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('wallet', wallet)
    .maybeSingle();
  
  if (error) throw error;
  return data;
}

export async function getAllUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('points', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function updateUserPoints(wallet: string, points: number) {
  const { data, error } = await supabase
    .from('users')
    .update({ points })
    .eq('wallet', wallet)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Quest functions
export async function getQuests() {
  const { data, error } = await supabase
    .from('quests')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function getActiveQuests() {
  const { data, error } = await supabase
    .from('quests')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function createQuest(quest: Omit<Quest, 'quest_id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('quests')
    .insert([quest])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateQuest(quest_id: string, updates: Partial<Quest>) {
  const { data, error } = await supabase
    .from('quests')
    .update(updates)
    .eq('quest_id', quest_id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteQuest(quest_id: string) {
  const { error } = await supabase
    .from('quests')
    .delete()
    .eq('quest_id', quest_id);
  
  if (error) throw error;
}

// Completed quests functions
export async function completeQuest(wallet: string, quest_id: string, reward_points: number) {
  // First complete the quest
  const { error: completeError } = await supabase
    .from('completed_quests')
    .insert([{ wallet, quest_id }]);
  
  if (completeError) throw completeError;
  
  // Then update user points
  const user = await getUser(wallet);
  if (user) {
    await updateUserPoints(wallet, user.points + reward_points);
  }
}

export async function getCompletedQuests(wallet: string) {
  const { data, error } = await supabase
    .from('completed_quests')
    .select('quest_id')
    .eq('wallet', wallet);
  
  if (error) throw error;
  return data?.map(q => q.quest_id) || [];
}

export async function getUserCount() {
  const { count, error } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });
  
  if (error) throw error;
  return count || 0;
}
