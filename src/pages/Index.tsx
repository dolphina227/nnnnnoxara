import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { WaitlistForm } from '@/components/WaitlistForm';
import { getUser } from '@/lib/supabase';
import { supabase } from '@/integrations/supabase/client';
import { Users } from 'lucide-react';
import { ParticleBackground } from '@/components/ParticleBackground';
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
      {/* Particle Background */}
      <ParticleBackground />

      {/* Background Glow Effects */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[hsl(var(--lum-gold)/0.08)] rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[hsl(var(--lum-purple)/0.04)] rounded-full blur-[150px]" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-6 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 w-32 h-32 bg-[hsl(var(--lum-gold)/0.2)] rounded-full blur-[60px] animate-glow-pulse" />
              <img 
                src={noxaraLogo} 
                alt="Noxara" 
                className="w-28 h-28 luminosity-logo relative z-10"
              />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient-gold mb-2">
              Noxara
            </h1>
            <p className="text-muted-foreground text-sm">
              Join the waitlist. Complete quests. Earn points.
            </p>
          </div>

          {/* User Count Badge */}
          <div className="flex justify-center mb-8 animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-[hsl(var(--lum-gold)/0.2)] bg-[hsl(var(--layer-2)/0.6)] backdrop-blur-sm">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[hsl(var(--lum-gold)/0.15)]">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-display font-bold text-gradient-gold">{userCount.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">users joined</span>
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

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 py-6 z-10">
        <div className="text-center text-muted-foreground/60 text-xs">
          <p>© 2025 Noxara. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
};

export default Index;
