import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Quest, getAllUsers, getQuests, getUserCount } from '@/lib/supabase';

const PAGE_SIZE = 100;

export function useRealtimeUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const fetchUsers = useCallback(async (reset: boolean = false) => {
    const currentOffset = reset ? 0 : offset;
    const data = await getAllUsers(PAGE_SIZE, currentOffset);
    
    if (reset) {
      setUsers(data as User[]);
      setOffset(PAGE_SIZE);
    } else {
      setUsers(prev => [...prev, ...(data as User[])]);
      setOffset(currentOffset + PAGE_SIZE);
    }
    
    setHasMore(data.length === PAGE_SIZE);
    setLoading(false);
    setLoadingMore(false);
  }, [offset]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const data = await getAllUsers(PAGE_SIZE, offset);
    setUsers(prev => [...prev, ...(data as User[])]);
    setOffset(prev => prev + PAGE_SIZE);
    setHasMore(data.length === PAGE_SIZE);
    setLoadingMore(false);
  }, [offset, loadingMore, hasMore]);

  useEffect(() => {
    fetchUsers(true);

    const channel = supabase
      .channel('users-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        () => {
          fetchUsers(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { users, loading, loadingMore, hasMore, loadMore, refetch: () => fetchUsers(true) };
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
