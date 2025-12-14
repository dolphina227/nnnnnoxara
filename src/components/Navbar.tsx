import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { ADMIN_WALLET } from '@/config/wagmi';
import luminosityLogo from '@/assets/luminosity-logo.png';

export function Navbar() {
  const { address } = useAccount();
  const location = useLocation();
  const isAdmin = address?.toLowerCase() === ADMIN_WALLET;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/leaderboard', label: 'Leaderboard' },
    { path: '/quests', label: 'Quests' },
    { path: '/mine', label: 'Mine' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-[hsl(var(--lum-gold)/0.1)]">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo - Static */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={luminosityLogo} 
              alt="Luminosity" 
              className="h-10 w-10 transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-xl font-display font-bold text-gradient-gold">
              Luminosity
            </span>
          </Link>

          {/* Navigation Links - Center */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  location.pathname === path
                    ? 'bg-[hsl(var(--lum-gold)/0.15)] text-primary border border-[hsl(var(--lum-gold)/0.3)]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-layer-2/50'
                }`}
              >
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  location.pathname === '/admin'
                    ? 'text-primary bg-[hsl(var(--lum-gold)/0.15)]'
                    : 'text-primary/70 hover:text-primary'
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Connect Button */}
          <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
              const ready = mounted;
              const connected = ready && account && chain;

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    style: {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button onClick={openConnectModal} className="btn-gold text-sm px-6 py-2.5">
                          Connect Wallet
                        </button>
                      );
                    }

                    return (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={openChainModal}
                          className="flex items-center gap-2 px-3 py-2 rounded-full bg-layer-2 border border-border/30 text-sm hover:border-[hsl(var(--lum-gold)/0.3)] transition-all duration-300"
                        >
                          {chain.hasIcon && (
                            <div
                              style={{
                                background: chain.iconBackground,
                                width: 24,
                                height: 24,
                                borderRadius: 999,
                                overflow: 'hidden',
                              }}
                            >
                              {chain.iconUrl && (
                                <img
                                  alt={chain.name ?? 'Chain icon'}
                                  src={chain.iconUrl}
                                  style={{ width: 24, height: 24 }}
                                />
                              )}
                            </div>
                          )}
                        </button>

                        <button
                          onClick={openAccountModal}
                          className="flex items-center gap-2 px-4 py-2 rounded-full bg-layer-2 border border-border/30 text-sm font-medium hover:border-[hsl(var(--lum-gold)/0.3)] transition-all duration-300"
                        >
                          <div 
                            className="w-6 h-6 rounded-full"
                            style={{
                              background: `linear-gradient(135deg, hsl(39 75% 65%), hsl(43 100% 77%))`
                            }}
                          />
                          {account.displayName}
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </nav>
  );
}
