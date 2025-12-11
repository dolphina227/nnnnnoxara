import { AdminPanel } from '@/components/AdminPanel';
import { Shield } from 'lucide-react';

export default function Admin() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            Admin Verified
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
            <span className="text-gradient">Admin Panel</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Manage quests, users, and monitor platform activity
          </p>
        </div>

        <AdminPanel />
      </div>
    </main>
  );
}
