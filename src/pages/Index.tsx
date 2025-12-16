import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { WaitlistForm } from '@/components/WaitlistForm';
import { getUser } from '@/lib/supabase';
import { supabase } from '@/integrations/supabase/client';
import { Users } from 'lucide-react';
import noxaraLogo from '@/assets/luminosity-logo.png';

const Index = () => {
  const { address } = useAccount();
  const [isRegistered, setIsRegistered] = useState(false);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const checkRegistration = async () => {
      if (address) {
        const user = await getUser(address);
        setIsRegistered(!!user);
      }
    };
    checkRegistration();
  }, [address]);

  // Fetch initial user count
  useEffect(() => {
    const fetchUserCount = async () => {
      const { count } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      setUserCount(count || 0);
    };
    fetchUserCount();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('users-count')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'users' },
        () => {
          setUserCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-20 relative z-10">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-4 sm:mb-6 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 w-20 sm:w-32 h-20 sm:h-32 bg-[hsl(var(--lum-gold)/0.2)] rounded-full blur-[40px] sm:blur-[60px] animate-glow-pulse" />
              <img 
                src={noxaraLogo} 
                alt="Noxara" 
                className="w-16 h-16 sm:w-28 sm:h-28 luminosity-logo relative z-10"
              />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-5 sm:mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gradient-gold mb-1 sm:mb-2">
              Noxara
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm px-4">
              Join the waitlist. Complete quests. Earn points.
            </p>
          </div>

          {/* User Count Badge */}
          <div className="flex justify-center mb-5 sm:mb-8 animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-[hsl(var(--lum-gold)/0.2)] bg-[hsl(var(--layer-2)/0.6)] backdrop-blur-sm">
              <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[hsl(var(--lum-gold)/0.15)]">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              </div>
              <div className="flex items-baseline gap-1 sm:gap-1.5">
                <span className="text-xl sm:text-2xl font-display font-bold text-gradient-gold">{userCount.toLocaleString()}</span>
                <span className="text-xs sm:text-sm text-muted-foreground">users joined</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <WaitlistForm 
              onSuccess={() => setIsRegistered(true)} 
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Index;
