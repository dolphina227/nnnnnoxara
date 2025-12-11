import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { WaitlistForm } from '@/components/WaitlistForm';
import { MysteryBox } from '@/components/MysteryBox';
import { getUser } from '@/lib/supabase';
import { useRealtimeUserCount } from '@/hooks/useRealtime';
import { Users, Zap, Gift, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    <main className="min-h-screen pt-24 pb-16 noise-overlay">
      {/* Vertical neon bar - left side */}
      <div className="fixed left-0 top-1/4 w-1 h-48 bg-gradient-vertical opacity-50 blur-sm" />
      
      {/* Hero Section */}
      <section className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[85vh]">
          {/* Left Content */}
          <div className="space-y-10">
            <div className="space-y-6">
              <p 
                className="text-secondary font-semibold uppercase tracking-[0.2em] text-sm animate-fade-in"
              >
                You Are Early
              </p>
              <h1 
                className="text-6xl md:text-8xl font-display font-bold leading-[0.95] animate-fade-in"
                style={{ animationDelay: '0.1s' }}
              >
                <span className="block">REV</span>
                <span className="text-gradient text-glow-purple">A</span>
              </h1>
              <p 
                className="text-xl md:text-2xl text-muted-foreground max-w-lg leading-relaxed animate-fade-in" 
                style={{ animationDelay: '0.2s' }}
              >
                Discover the future of NFT Mystery Boxes.
                <br />
                <span className="text-foreground/80">Join the early access waitlist.</span>
              </p>
            </div>

            {/* Stats Counter */}
            <div 
              className="flex items-center gap-8 animate-fade-in" 
              style={{ animationDelay: '0.3s' }}
            >
              <div className="flex items-center gap-4 px-6 py-4 rounded-2xl glass hover-glow transition-all duration-300">
                <div className="p-2.5 rounded-xl bg-secondary/15">
                  <Users className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-3xl font-display font-bold text-gradient">
                    {userCount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Joined</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm text-muted-foreground">Real-time</span>
              </div>
            </div>

            {/* Waitlist Form */}
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {isConnected ? (
                isRegistered ? (
                  <div className="card-accent p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center glow-cyan">
                        <Zap className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-xl">You're In!</h3>
                        <p className="text-muted-foreground">Complete quests to earn more points</p>
                      </div>
                    </div>
                    <Link 
                      to="/quests" 
                      className="btn-neon w-full flex items-center justify-center gap-2 mt-4"
                    >
                      Start Earning
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                ) : (
                  <WaitlistForm onSuccess={() => setIsRegistered(true)} />
                )
              ) : (
                <div className="card-accent p-10 text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/15 flex items-center justify-center mb-5 animate-pulse-glow">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-muted-foreground text-lg">
                    Connect your wallet to join the waitlist
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Content - Mystery Box */}
          <div 
            className="flex justify-center lg:justify-end animate-fade-in" 
            style={{ animationDelay: '0.5s' }}
          >
            <MysteryBox />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="card-accent hover-lift animate-fade-in"
              style={{ animationDelay: `${0.6 + index * 0.1}s` }}
            >
              <div className="pl-4">
                <div className="p-3.5 rounded-xl bg-primary/10 w-fit mb-5 transition-all duration-300 group-hover:bg-primary/20">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-bold text-xl mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-10">
        <div className="separator-glow mb-10" />
        <div className="text-center text-muted-foreground text-sm">
          <p className="font-display">© 2024 REVA. All rights reserved.</p>
          <p className="mt-2 text-xs uppercase tracking-wider">NFT Mystery Box Platform</p>
        </div>
      </footer>
    </main>
  );
};

export default Index;
