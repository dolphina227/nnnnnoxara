import { AdminPanel } from '@/components/AdminPanel';
import { Shield } from 'lucide-react';

export default function Admin() {
  return (
    <main className="min-h-screen pt-24 pb-16 overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-xs sm:text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            Admin Verified
          </div>
          <h1 className="text-3xl md:text-6xl font-display font-bold mb-3 md:mb-4">
            <span className="text-gradient">Admin Panel</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto">
            Manage quests, users, and monitor platform activity
          </p>
        </div>

        <AdminPanel />
      </div>
    </main>
  );
}
