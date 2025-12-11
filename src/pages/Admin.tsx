import { AdminPanel } from '@/components/AdminPanel';
import { Shield } from 'lucide-react';

export default function Admin() {
  return (
    <main className="min-h-screen pt-24 pb-16 noise-overlay">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-5">
            <div className="p-3 rounded-xl bg-secondary/15">
              <Shield className="w-8 h-8 text-secondary" />
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-display font-bold">
                <span className="text-gradient">Admin Panel</span>
              </h1>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-semibold uppercase tracking-wider mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                Admin Verified
              </span>
            </div>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
            Manage quests, users, and monitor platform activity in real-time.
          </p>
        </div>

        <AdminPanel />
      </div>
    </main>
  );
}
