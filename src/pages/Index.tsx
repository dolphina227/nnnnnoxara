import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { WaitlistForm } from '@/components/WaitlistForm';
import { getUser } from '@/lib/supabase';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { address, isConnected } = useAccount();
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

  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section - Centered */}
      <section className="container mx-auto px-6 min-h-[80vh] flex flex-col items-center justify-center text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          
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

          {/* CTA Text Link */}
          <div 
            className="pt-4 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            {isConnected ? (
              isRegistered ? (
                <Link 
                  to="/quests" 
                  className="text-gradient text-xl font-semibold hover:opacity-80 transition-opacity inline-flex items-center gap-2"
                >
                  Start Earning
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <button 
                  onClick={() => setShowForm(!showForm)}
                  className="text-gradient text-xl font-semibold hover:opacity-80 transition-opacity"
                >
                  Join Waitlist
                </button>
              )
            ) : (
              <span className="text-muted-foreground text-xl">
                Connect Wallet to Join
              </span>
            )}
          </div>

          {/* Waitlist Form - Directly below */}
          {showForm && !isRegistered && isConnected && (
            <div 
              className="w-full max-w-md mx-auto animate-fade-in pt-4"
              style={{ animationDelay: '0.3s' }}
            >
              <WaitlistForm 
                onSuccess={() => {
                  setIsRegistered(true);
                  setShowForm(false);
                }} 
              />
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-10">
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
