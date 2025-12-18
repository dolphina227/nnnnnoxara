import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { getUserReferralCodes, getReferralStats, ReferralCode } from '@/lib/supabase';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Copy, Check, Users, Gift, Sparkles, Link2, Loader2 } from 'lucide-react';

export function ReferralSection() {
  const { address } = useAccount();
  const { toast } = useToast();
  const [codes, setCodes] = useState<ReferralCode[]>([]);
  const [stats, setStats] = useState({ totalReferrals: 0, totalPointsEarned: 0 });
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchData = async () => {
    if (!address) return;
    
    try {
      const [codesData, statsData] = await Promise.all([
        getUserReferralCodes(address),
        getReferralStats(address)
      ]);
      setCodes(codesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Real-time subscription for referral updates
    const channel = supabase
      .channel('referral-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'referrals' },
        () => {
          fetchData();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'referral_codes' },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [address]);

  const copyToClipboard = async (code: string) => {
    const referralLink = `https://noxara.xyz?ref=${code}`;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopiedCode(code);
      toast({
        title: 'Copied!',
        description: 'Referral link copied to clipboard',
      });
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const copyCodeOnly = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast({
        title: 'Copied!',
        description: 'Referral code copied to clipboard',
      });
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl sm:rounded-3xl border border-[hsl(var(--lum-gold)/0.2)] bg-[hsl(var(--layer-1)/0.6)] backdrop-blur-xl p-6 sm:p-8">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-[hsl(var(--lum-gold)/0.2)] bg-[hsl(var(--layer-1)/0.6)] backdrop-blur-xl p-5 sm:p-8 shadow-card">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[hsl(var(--lum-gold)/0.1)] border border-[hsl(var(--lum-gold)/0.2)] text-primary text-xs sm:text-sm font-medium mb-3">
          <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Referral Program
        </div>
        <h2 className="text-xl sm:text-2xl font-display font-bold mb-1 text-gradient-gold">Invite & Earn</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">Earn +2,500 points for each successful referral</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
        <div className="rounded-xl sm:rounded-2xl bg-[hsl(var(--layer-2)/0.5)] border border-[hsl(var(--border)/0.3)] p-3 sm:p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-lg sm:text-2xl font-bold text-foreground">{stats.totalReferrals}</span>
          </div>
          <span className="text-[10px] sm:text-xs text-muted-foreground">Total Referrals</span>
        </div>
        <div className="rounded-xl sm:rounded-2xl bg-[hsl(var(--layer-2)/0.5)] border border-[hsl(var(--border)/0.3)] p-3 sm:p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-lg sm:text-2xl font-bold text-foreground">+{stats.totalPointsEarned.toLocaleString()}</span>
          </div>
          <span className="text-[10px] sm:text-xs text-muted-foreground">Points Earned</span>
        </div>
      </div>

      {/* Referral Code */}
      {codes.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground/80 flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            Your Referral Code
          </h3>
          
          <div className="p-4 rounded-xl bg-[hsl(var(--layer-2)/0.5)] border border-[hsl(var(--border)/0.3)] hover:border-[hsl(var(--lum-gold)/0.3)] transition-colors">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <code 
                className="font-mono text-lg sm:text-xl text-primary font-bold cursor-pointer hover:text-primary/80"
                onClick={() => copyCodeOnly(codes[0].code)}
              >
                {codes[0].code}
              </code>
              <span className="text-xs text-muted-foreground">
                {codes[0].uses_count} successful referrals
              </span>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => copyCodeOnly(codes[0].code)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[hsl(var(--layer-2)/0.8)] border border-[hsl(var(--border)/0.3)] text-foreground text-sm font-medium hover:bg-[hsl(var(--layer-2))] transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copy Code
              </button>
              <button
                onClick={() => copyToClipboard(codes[0].code)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[hsl(var(--lum-gold)/0.15)] border border-[hsl(var(--lum-gold)/0.3)] text-primary text-sm font-medium hover:bg-[hsl(var(--lum-gold)/0.25)] transition-colors"
              >
                {copiedCode === codes[0].code ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4" />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer note */}
      <p className="text-center text-[10px] sm:text-xs text-muted-foreground/50 mt-5">
        Share your referral link to earn points when friends join
      </p>
    </div>
  );
}