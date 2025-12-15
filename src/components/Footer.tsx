import { Twitter, MessageCircle, Send } from 'lucide-react';

export function Footer() {
  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/noxara', label: 'Twitter' },
    { icon: MessageCircle, href: 'https://discord.gg/noxara', label: 'Discord' },
    { icon: Send, href: 'https://t.me/noxara', label: 'Telegram' },
  ];

  return (
    <footer className="relative z-10 py-8 border-t border-[hsl(var(--lum-gold)/0.1)]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-4">
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[hsl(var(--layer-2)/0.6)] border border-[hsl(var(--lum-gold)/0.15)] text-muted-foreground hover:text-primary hover:border-[hsl(var(--lum-gold)/0.4)] hover:bg-[hsl(var(--lum-gold)/0.1)] transition-all duration-300"
                aria-label={label}
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-muted-foreground/60 text-xs">
            © 2025 Noxara. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}