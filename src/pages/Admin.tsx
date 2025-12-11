import { AdminPanel } from '@/components/AdminPanel';
import { Shield } from 'lucide-react';

export default function Admin() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-secondary" />
            <h1 className="text-4xl md:text-5xl font-display font-bold">
              <span className="text-gradient">Admin Panel</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Manage quests, users, and monitor platform activity in real-time.
          </p>
        </div>

        <AdminPanel />
      </div>
    </main>
  );
}
