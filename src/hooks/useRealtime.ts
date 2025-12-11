import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Quest, getAllUsers, getQuests, getUserCount } from '@/lib/supabase';

export function useRealtimeUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    const data = await getAllUsers();
    setUsers(data as User[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();

    const channel = supabase
      .channel('users-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        () => {
          fetchUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchUsers]);

  return { users, loading, refetch: fetchUsers };
}

export function useRealtimeQuests() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuests = useCallback(async () => {
    const data = await getQuests();
    setQuests(data as Quest[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchQuests();

    const channel = supabase
      .channel('quests-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'quests' },
        () => {
          fetchQuests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchQuests]);

  return { quests, loading, refetch: fetchQuests };
}

export function useRealtimeUserCount() {
  const [count, setCount] = useState(0);

  const fetchCount = useCallback(async () => {
    const c = await getUserCount();
    setCount(c);
  }, []);

  useEffect(() => {
    fetchCount();

    const channel = supabase
      .channel('users-count')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'users' },
        () => {
          fetchCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchCount]);

  return count;
}
