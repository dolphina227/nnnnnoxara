import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { WaitlistForm } from '@/components/WaitlistForm';
import { getUser } from '@/lib/supabase';
import { useRealtimeUserCount } from '@/hooks/useRealtime';
import { Users, Zap, Gift, Shield, ArrowRight, Trophy, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { address, isConnected } = useAccount();
  const userCount = useRealtimeUserCount();
  const [isRegistered, setIsRegistered] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const checkRegistration = async () => {
      if (address) {
        const user = await getUser(address);
        setIsRegistered(!!user);
      }
    };
    checkRegistration();
  }, [address]);

  const stats = [
    { icon: Users, label: 'Users Joined', value: userCount.toLocaleString() },
    { icon: Trophy, label: 'Total Rewards', value: '500K+' },
    { icon: Target, label: 'Quests Available', value: '10+' },
  ];

  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section - Centered */}
      <section className="container mx-auto px-6 min-h-[80vh] flex flex-col items-center justify-center text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Main Title */}
          <h1 
            className="text-7xl md:text-9xl font-display font-bold text-gradient animate-fade-in"
          >
            REVA
          </h1>
          
          {/* Subtitle */}
          <div 
            className="space-y-2 animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            <p className="text-xl md:text-2xl text-muted-foreground">
              Join the waitlist. Complete quests. Earn points.
            </p>
            <p className="text-xl md:text-2xl text-secondary font-medium">
              Win exclusive rewards.
            </p>
          </div>

          {/* CTA Button */}
          <div 
            className="pt-4 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            {isConnected ? (
              isRegistered ? (
                <Link 
                  to="/quests" 
                  className="btn-neon inline-flex items-center gap-3 text-lg px-10 py-4"
                >
                  Start Earning
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <button 
                  onClick={() => setShowForm(true)}
                  className="btn-neon text-lg px-10 py-4"
                >
                  Join Waitlist
                </button>
              )
            ) : (
              <button 
                className="btn-neon text-lg px-10 py-4 opacity-80 cursor-not-allowed"
                disabled
              >
                Connect Wallet to Join
              </button>
            )}
          </div>

          {/* Live Counter */}
          <div 
            className="flex items-center justify-center gap-3 pt-6 animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-muted-foreground text-sm">
              <span className="text-foreground font-semibold">{userCount.toLocaleString()}</span> users already joined
            </span>
          </div>
        </div>
      </section>

      {/* Waitlist Modal/Form */}
      {showForm && !isRegistered && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md animate-scale-in">
            <div className="flex justify-end mb-4">
              <button 
                onClick={() => setShowForm(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>
            <WaitlistForm 
              onSuccess={() => {
                setIsRegistered(true);
                setShowForm(false);
              }} 
            />
          </div>
        </div>
      )}

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="card-neon text-center p-8 animate-fade-in"
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
            >
              <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4">
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
              <p className="text-3xl font-display font-bold text-gradient mb-2">{stat.value}</p>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get started in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              step: '01',
              icon: Shield,
              title: 'Connect Wallet',
              description: 'Link your BSC wallet to join the exclusive waitlist',
            },
            {
              step: '02',
              icon: Zap,
              title: 'Complete Quests',
              description: 'Earn points by completing social and on-chain quests',
            },
            {
              step: '03',
              icon: Gift,
              title: 'Win Rewards',
              description: 'Top ranked users get exclusive NFT Mystery Boxes',
            },
          ].map((feature, index) => (
            <div
              key={feature.title}
              className="relative p-8 rounded-3xl border border-border/30 bg-layer-1/30 hover:border-primary/30 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              <span className="absolute top-6 right-6 text-5xl font-display font-bold text-muted/20">
                {feature.step}
              </span>
              <div className="p-4 rounded-2xl bg-primary/10 w-fit mb-6">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display font-bold text-xl mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-3xl mx-auto text-center card-neon p-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Ready to <span className="text-gradient">Get Started?</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join thousands of users earning rewards on REVA
          </p>
          {isConnected ? (
            isRegistered ? (
              <Link 
                to="/quests" 
                className="btn-neon inline-flex items-center gap-3 text-lg px-10 py-4"
              >
                View Quests
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <button 
                onClick={() => setShowForm(true)}
                className="btn-neon text-lg px-10 py-4"
              >
                Join Waitlist
              </button>
            )
          ) : (
            <p className="text-muted-foreground">Connect your wallet to get started</p>
          )}
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
