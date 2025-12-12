import { useState } from 'react';
import { useAccount } from 'wagmi';
import { registerUser, getUser } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Check, Loader2, Mail, Wallet, AtSign, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WaitlistFormProps {
  onSuccess?: () => void;
}

export function WaitlistForm({ onSuccess }: WaitlistFormProps) {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [twitter, setTwitter] = useState('');
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !address) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet first.',
        variant: 'destructive',
      });
      return;
    }

    if (!email || !twitter) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const existingUser = await getUser(address);
      if (existingUser) {
        toast({
          title: 'Already registered',
          description: 'You have already joined the waitlist!',
          variant: 'destructive',
        });
        setJoined(true);
        onSuccess?.();
        return;
      }

      await registerUser(address, email, twitter);
      setJoined(true);
      toast({
        title: 'Welcome to REVA!',
        description: 'You earned +10,000 points for joining the waitlist!',
      });
      onSuccess?.();
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration failed',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (joined) {
    return (
      <div className="rounded-3xl border border-[hsl(var(--border)/0.5)] bg-[hsl(var(--layer-1)/0.6)] backdrop-blur-xl p-10 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-primary flex items-center justify-center">
          <Check className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-display font-bold mb-3 text-foreground">Welcome!</h2>
        <p className="text-muted-foreground mb-2">
          You've earned <span className="text-[hsl(var(--neon-cyan))] font-semibold">+10,000 points</span>
        </p>
        <p className="text-sm text-muted-foreground/70 mb-6">
          Complete quests to climb the leaderboard
        </p>
        <Link 
          to="/quests"
          className="inline-flex items-center gap-2 text-[hsl(var(--neon-cyan))] font-medium hover:gap-3 transition-all"
        >
          Start Earning <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="rounded-3xl border border-[hsl(var(--border)/0.5)] bg-[hsl(var(--layer-1)/0.6)] backdrop-blur-xl p-10 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[hsl(var(--layer-2))] border border-[hsl(var(--border)/0.5)] flex items-center justify-center">
          <Wallet className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-3xl font-display font-bold mb-3 text-foreground">Join Waitlist</h2>
        <p className="text-muted-foreground mb-2">
          Connect your wallet to get started
        </p>
        <p className="text-sm text-muted-foreground/60">
          Earn +10,000 points instantly
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[hsl(var(--border)/0.5)] bg-[hsl(var(--layer-1)/0.6)] backdrop-blur-xl p-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-display font-bold mb-2 text-foreground">Join Waitlist</h2>
        <p className="text-muted-foreground">Get early access & earn rewards</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground/80 pl-1">
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-[hsl(var(--layer-2))] flex items-center justify-center transition-colors group-focus-within:bg-[hsl(var(--neon-purple)/0.15)]">
              <Mail className="w-5 h-5 text-muted-foreground group-focus-within:text-[hsl(var(--neon-purple))]" />
            </div>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 pl-[4.5rem] pr-5 rounded-2xl border border-[hsl(var(--border)/0.5)] bg-[hsl(var(--input)/0.5)] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[hsl(var(--neon-purple)/0.5)] focus:ring-2 focus:ring-[hsl(var(--neon-purple)/0.1)] transition-all font-medium"
              required
            />
          </div>
        </div>

        {/* Wallet Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground/80 pl-1">
            Wallet Address
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-[hsl(var(--layer-2))] flex items-center justify-center">
              <Wallet className="w-5 h-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              value={address ? `${address.slice(0, 8)}...${address.slice(-6)}` : ''}
              readOnly
              className="w-full h-14 pl-[4.5rem] pr-5 rounded-2xl border border-[hsl(var(--border)/0.3)] bg-[hsl(var(--layer-2)/0.5)] text-muted-foreground cursor-not-allowed font-mono text-sm"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--neon-cyan))] animate-pulse" />
            </div>
          </div>
        </div>

        {/* Twitter Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground/80 pl-1">
            Twitter Username
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-[hsl(var(--layer-2))] flex items-center justify-center transition-colors group-focus-within:bg-[hsl(var(--neon-cyan)/0.15)]">
              <AtSign className="w-5 h-5 text-muted-foreground group-focus-within:text-[hsl(var(--neon-cyan))]" />
            </div>
            <input
              type="text"
              placeholder="username"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value.replace('@', ''))}
              className="w-full h-14 pl-[4.5rem] pr-5 rounded-2xl border border-[hsl(var(--border)/0.5)] bg-[hsl(var(--input)/0.5)] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[hsl(var(--neon-cyan)/0.5)] focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.1)] transition-all font-medium"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-2xl font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 bg-gradient-primary hover:shadow-[0_0_40px_hsl(var(--neon-purple)/0.3)] hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Joining...</span>
              </>
            ) : (
              <>
                <span>Join Waitlist</span>
                <span className="px-2.5 py-1 rounded-lg bg-white/20 text-sm">+10,000 pts</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground/50 mt-8">
        By joining, you agree to our terms of service
      </p>
    </div>
  );
}
