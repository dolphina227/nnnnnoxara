import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useSearchParams } from 'react-router-dom';
import { registerUser, getUser, validateReferralCode } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Check, Loader2, Mail, Wallet, AtSign, ArrowRight, Sparkles, Gift, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WaitlistFormProps {
  onSuccess?: () => void;
}

export function WaitlistForm({ onSuccess }: WaitlistFormProps) {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [twitter, setTwitter] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [referralValid, setReferralValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [validatingCode, setValidatingCode] = useState(false);
  const [joined, setJoined] = useState(false);

  // Check for referral code in URL
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setReferralCode(refCode.toUpperCase());
      validateCode(refCode);
    }
  }, [searchParams]);

  const validateCode = async (code: string) => {
    if (!code || code.length < 5) {
      setReferralValid(null);
      return;
    }
    
    setValidatingCode(true);
    try {
      const isValid = await validateReferralCode(code);
      setReferralValid(isValid);
    } catch (error) {
      setReferralValid(false);
    } finally {
      setValidatingCode(false);
    }
  };

  const handleReferralCodeChange = (value: string) => {
    const upperCode = value.toUpperCase();
    setReferralCode(upperCode);
    if (upperCode.length >= 5) {
      validateCode(upperCode);
    } else {
      setReferralValid(null);
    }
  };

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

      // Register with referral code if valid
      const validRefCode = referralValid ? referralCode : undefined;
      await registerUser(address, email, twitter, validRefCode);
      
      setJoined(true);
      
      if (validRefCode) {
        toast({
          title: 'Welcome to Noxara!',
          description: 'You earned +10,000 points! Your referrer earned +2,500 points!',
        });
      } else {
        toast({
          title: 'Welcome to Noxara!',
          description: 'You earned +10,000 points for joining the waitlist!',
        });
      }
      
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
      <div className="rounded-2xl sm:rounded-3xl border border-[hsl(var(--lum-gold)/0.2)] bg-[hsl(var(--layer-1)/0.6)] backdrop-blur-xl p-6 sm:p-10 text-center shadow-card">
        <div className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[hsl(var(--lum-gold-bright))] to-[hsl(var(--lum-gold))] flex items-center justify-center glow-gold">
          <Check className="w-7 h-7 sm:w-10 sm:h-10 text-background" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold mb-2 sm:mb-3 text-gradient-gold">Welcome!</h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-2">
          You've earned <span className="text-primary font-semibold">+10,000 points</span>
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground/70 mb-4 sm:mb-6">
          Complete quests to climb the leaderboard
        </p>
        <Link 
          to="/quests"
          className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all text-sm sm:text-base"
        >
          Start Earning <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="rounded-2xl sm:rounded-3xl border border-[hsl(var(--lum-gold)/0.2)] bg-[hsl(var(--layer-1)/0.6)] backdrop-blur-xl p-6 sm:p-10 text-center shadow-card">
        <div className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-[hsl(var(--layer-2))] border border-[hsl(var(--lum-gold)/0.2)] flex items-center justify-center">
          <Wallet className="w-7 h-7 sm:w-10 sm:h-10 text-primary/60" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold mb-2 sm:mb-3 text-gradient-gold">Join Waitlist</h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-1 sm:mb-2">
          Connect your wallet to get started
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground/60">
          Earn <span className="text-primary">+10,000 points</span> instantly
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-[hsl(var(--lum-gold)/0.2)] bg-[hsl(var(--layer-1)/0.6)] backdrop-blur-xl p-5 sm:p-10 shadow-card">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[hsl(var(--lum-gold)/0.1)] border border-[hsl(var(--lum-gold)/0.2)] text-primary text-xs sm:text-sm font-medium mb-3 sm:mb-4">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Early Access
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold mb-1 sm:mb-2 text-gradient-gold">Join Waitlist</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Get early access & earn rewards</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Email Field */}
        <div className="space-y-1.5 sm:space-y-2">
          <label className="block text-xs sm:text-sm font-medium text-foreground/80 pl-1">
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[hsl(var(--layer-2))] flex items-center justify-center transition-colors group-focus-within:bg-[hsl(var(--lum-gold)/0.15)]">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-focus-within:text-primary" />
            </div>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 sm:h-14 pl-14 sm:pl-[4.5rem] pr-4 sm:pr-5 rounded-xl sm:rounded-2xl border border-[hsl(var(--border)/0.5)] bg-[hsl(var(--input)/0.5)] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[hsl(var(--lum-gold)/0.5)] focus:ring-2 focus:ring-[hsl(var(--lum-gold)/0.1)] transition-all font-medium text-sm sm:text-base"
              required
            />
          </div>
        </div>

        {/* Wallet Field */}
        <div className="space-y-1.5 sm:space-y-2">
          <label className="block text-xs sm:text-sm font-medium text-foreground/80 pl-1">
            Wallet Address
          </label>
          <div className="relative">
            <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[hsl(var(--layer-2))] flex items-center justify-center">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              value={address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
              readOnly
              className="w-full h-12 sm:h-14 pl-14 sm:pl-[4.5rem] pr-4 sm:pr-5 rounded-xl sm:rounded-2xl border border-[hsl(var(--border)/0.3)] bg-[hsl(var(--layer-2)/0.5)] text-muted-foreground cursor-not-allowed font-mono text-xs sm:text-sm"
            />
            <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            </div>
          </div>
        </div>

        {/* Twitter Field */}
        <div className="space-y-1.5 sm:space-y-2">
          <label className="block text-xs sm:text-sm font-medium text-foreground/80 pl-1">
            Twitter Username
          </label>
          <div className="relative group">
            <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[hsl(var(--layer-2))] flex items-center justify-center transition-colors group-focus-within:bg-[hsl(var(--lum-gold)/0.15)]">
              <AtSign className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-focus-within:text-primary" />
            </div>
            <input
              type="text"
              placeholder="username"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value.replace('@', ''))}
              className="w-full h-12 sm:h-14 pl-14 sm:pl-[4.5rem] pr-4 sm:pr-5 rounded-xl sm:rounded-2xl border border-[hsl(var(--border)/0.5)] bg-[hsl(var(--input)/0.5)] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[hsl(var(--lum-gold)/0.5)] focus:ring-2 focus:ring-[hsl(var(--lum-gold)/0.1)] transition-all font-medium text-sm sm:text-base"
              required
            />
          </div>
        </div>

        {/* Referral Code Field */}
        <div className="space-y-1.5 sm:space-y-2">
          <label className="block text-xs sm:text-sm font-medium text-foreground/80 pl-1 flex items-center gap-2">
            Referral Code <span className="text-muted-foreground/50">(optional)</span>
          </label>
          <div className="relative group">
            <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[hsl(var(--layer-2))] flex items-center justify-center transition-colors group-focus-within:bg-[hsl(var(--lum-gold)/0.15)]">
              <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-focus-within:text-primary" />
            </div>
            <input
              type="text"
              placeholder="XXXXXX"
              value={referralCode}
              onChange={(e) => handleReferralCodeChange(e.target.value)}
              className={`w-full h-12 sm:h-14 pl-14 sm:pl-[4.5rem] pr-12 rounded-xl sm:rounded-2xl border bg-[hsl(var(--input)/0.5)] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 transition-all font-mono text-sm sm:text-base uppercase ${
                referralValid === true 
                  ? 'border-green-500/50 focus:border-green-500 focus:ring-green-500/10' 
                  : referralValid === false 
                    ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10'
                    : 'border-[hsl(var(--border)/0.5)] focus:border-[hsl(var(--lum-gold)/0.5)] focus:ring-[hsl(var(--lum-gold)/0.1)]'
              }`}
            />
            <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2">
              {validatingCode ? (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              ) : referralValid === true ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : referralValid === false ? (
                <X className="w-4 h-4 text-red-500" />
              ) : null}
            </div>
          </div>
          {referralValid === true && (
            <p className="text-xs text-green-500 pl-1">Valid code! Your referrer will earn +2,500 points</p>
          )}
          {referralValid === false && referralCode.length >= 5 && (
            <p className="text-xs text-red-500 pl-1">Invalid referral code</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2 sm:pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-[hsl(var(--lum-gold-bright))] to-[hsl(var(--lum-gold))] text-background hover:shadow-[0_0_40px_hsl(var(--glow-gold)/0.4)] hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                <span>Joining...</span>
              </>
            ) : (
              <>
                <span>Join Waitlist</span>
                <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg bg-background/20 text-xs sm:text-sm">+10,000 pts</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Footer */}
      <p className="text-center text-[10px] sm:text-xs text-muted-foreground/50 mt-5 sm:mt-8">
        By joining, you agree to our terms of service
      </p>
    </div>
  );
}
