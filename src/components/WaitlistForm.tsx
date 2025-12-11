import { useState } from 'react';
import { useAccount } from 'wagmi';
import { registerUser, getUser } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Check, Loader2, Mail, User, AtSign } from 'lucide-react';

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
      // Check if user already registered
      const existingUser = await getUser(address);
      if (existingUser) {
        toast({
          title: 'Already registered',
          description: 'You have already joined the waitlist!',
          variant: 'destructive',
        });
        setJoined(true);
        return;
      }

      await registerUser(address, email, twitter);
      setJoined(true);
      toast({
        title: 'Welcome to REVA! 🎉',
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
      <div className="card-neon p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center glow-purple">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-display font-bold mb-2">You're In!</h3>
        <p className="text-muted-foreground">
          +10,000 points earned. Complete quests to earn more!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-neon pl-12"
          required
        />
      </div>

      <div className="relative">
        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="BSC Wallet Address"
          value={address || ''}
          readOnly
          className="input-neon pl-12 opacity-70 cursor-not-allowed"
        />
      </div>

      <div className="relative">
        <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Twitter username"
          value={twitter}
          onChange={(e) => setTwitter(e.target.value.replace('@', ''))}
          className="input-neon pl-12"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading || !isConnected}
        className="w-full btn-neon disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Joining...
          </>
        ) : !isConnected ? (
          'Connect Wallet First'
        ) : (
          'Join Waitlist (+10,000 pts)'
        )}
      </button>
    </form>
  );
}
