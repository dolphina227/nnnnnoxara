import { useState } from 'react';
import { useAccount } from 'wagmi';
import { registerUser, getUser } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Check, Loader2, Mail, Wallet, AtSign } from 'lucide-react';

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
      <div className="card-neon p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-5" />
        <div className="relative z-10">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-primary flex items-center justify-center glow-purple">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-display font-bold mb-3">Welcome to REVA!</h3>
          <p className="text-muted-foreground mb-4">
            You've earned <span className="text-[hsl(var(--neon-cyan))] font-semibold">+10,000 points</span>
          </p>
          <p className="text-sm text-muted-foreground/70">
            Complete quests to climb the leaderboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-neon p-8 relative overflow-hidden">
      {/* Decorative gradient bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-vertical" />
      
      <div className="relative z-10">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-display font-bold mb-2">Join the Waitlist</h3>
          <p className="text-muted-foreground text-sm">Get early access and earn rewards</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider pl-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-neon pl-12"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider pl-1">Wallet Address</label>
            <div className="relative">
              <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="BSC Wallet Address"
                value={address || ''}
                readOnly
                className="input-neon pl-12 opacity-60 cursor-not-allowed bg-[hsl(var(--layer-2)/0.5)]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider pl-1">Twitter</label>
            <div className="relative">
              <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="username"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value.replace('@', ''))}
                className="input-neon pl-12"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !isConnected}
              className="w-full btn-neon disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 py-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  Join Waitlist
                  <span className="text-white/80 text-sm">+10,000 pts</span>
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-muted-foreground/60 mt-6">
          By joining, you agree to our terms of service
        </p>
      </div>
    </div>
  );
}
