import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { WaitlistForm } from '@/components/WaitlistForm';
import { getUser } from '@/lib/supabase';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { address, isConnected } = useAccount();
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

  return (
    <main className="min-h-screen pt-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[hsl(var(--neon-purple)/0.08)] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[hsl(var(--neon-cyan)/0.06)] rounded-full blur-[150px]" />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-6 min-h-[85vh] flex flex-col items-center justify-center relative z-10">
        <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left space-y-8">
            {/* Badge */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[hsl(var(--neon-purple)/0.3)] bg-[hsl(var(--layer-2)/0.5)] animate-fade-in"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
              <span className="text-sm font-medium text-muted-foreground">Early Access Available</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
                <span className="text-foreground">Discover the </span>
                <span className="text-gradient">Future</span>
                <br />
                <span className="text-foreground">of NFT Mystery Boxes</span>
              </h1>
            </div>

            {/* Description */}
            <p 
              className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 animate-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              Join the waitlist, complete quests, and earn points to unlock exclusive NFT rewards. Be part of the revolution.
            </p>

            {/* Stats */}
            {isRegistered && (
              <div 
                className="flex items-center justify-center lg:justify-start gap-8 animate-fade-in"
                style={{ animationDelay: '0.3s' }}
              >
                <Link 
                  to="/quests" 
                  className="group inline-flex items-center gap-2 text-[hsl(var(--neon-cyan))] font-semibold hover:gap-3 transition-all duration-300"
                >
                  Start Earning Points
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            )}
          </div>

          {/* Right Content - Form */}
          <div 
            className="w-full lg:w-auto lg:min-w-[420px] animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            {isConnected ? (
              <WaitlistForm 
                onSuccess={() => setIsRegistered(true)} 
              />
            ) : (
              <div className="card-neon p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-primary flex items-center justify-center glow-purple">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-3">Get Early Access</h3>
                <p className="text-muted-foreground mb-6">
                  Connect your wallet to join the waitlist and start earning rewards
                </p>
                <div className="text-sm text-muted-foreground/70 border-t border-border/50 pt-4 mt-4">
                  Supported: MetaMask, WalletConnect, Coinbase
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-10 relative z-10">
        <div className="separator-glow mb-10" />
        <div className="text-center text-muted-foreground text-sm">
          <p className="font-display">© 2025 REVA. All rights reserved.</p>
          <p className="mt-2 text-xs uppercase tracking-wider">NFT Mystery Box Platform</p>
        </div>
      </footer>
    </main>
  );
};

export default Index;
