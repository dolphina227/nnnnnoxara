import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { WaitlistForm } from '@/components/WaitlistForm';
import { MysteryBox } from '@/components/MysteryBox';
import { getUser } from '@/lib/supabase';
import { useRealtimeUserCount } from '@/hooks/useRealtime';
import { Users, Zap, Gift, Shield } from 'lucide-react';

const Index = () => {
  const { address, isConnected } = useAccount();
  const userCount = useRealtimeUserCount();
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const checkRegistration = async () => {
      if (address) {
        const user = await getUser(address);
        setIsRegistered(!!user);
      }
    };
    checkRegistration();
  }, [address]);

  const features = [
    {
      icon: Zap,
      title: 'Early Access',
      description: 'Be among the first to experience REVA NFT Mystery Boxes',
    },
    {
      icon: Gift,
      title: 'Exclusive Rewards',
      description: 'Earn points through quests and climb the leaderboard',
    },
    {
      icon: Shield,
      title: 'Premium Benefits',
      description: 'Top ranked users get priority access to rare drops',
    },
  ];

  return (
    <main className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-primary font-medium uppercase tracking-widest animate-fade-in">
                You Are Early
              </p>
              <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
                Welcome to{' '}
                <span className="text-gradient text-glow-purple">REVA</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
                The next generation NFT Mystery Box platform. Join our exclusive waitlist 
                and earn rewards before launch.
              </p>
            </div>

            {/* Stats Counter */}
            <div className="flex items-center gap-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-3 px-6 py-3 rounded-xl glass">
                <Users className="w-5 h-5 text-secondary" />
                <div>
                  <p className="text-2xl font-display font-bold text-gradient">{userCount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Joined</p>
                </div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-muted-foreground">
                <p className="text-sm">Real-time updates</p>
                <p className="text-xs text-secondary">Live</p>
              </div>
            </div>

            {/* Waitlist Form */}
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {isConnected ? (
                isRegistered ? (
                  <div className="card-neon p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold">You're In!</h3>
                        <p className="text-sm text-muted-foreground">Complete quests to earn more points</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <WaitlistForm onSuccess={() => setIsRegistered(true)} />
                )
              ) : (
                <div className="card-neon p-6 text-center">
                  <p className="text-muted-foreground mb-4">Connect your wallet to join the waitlist</p>
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Content - Mystery Box */}
          <div className="flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <MysteryBox />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="card-neon group animate-fade-in"
              style={{ animationDelay: `${0.6 + index * 0.1}s` }}
            >
              <div className="p-4 rounded-xl bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border">
        <div className="text-center text-muted-foreground text-sm">
          <p>© 2024 REVA. All rights reserved.</p>
          <p className="mt-2">NFT Mystery Box Platform</p>
        </div>
      </footer>
    </main>
  );
};

export default Index;
