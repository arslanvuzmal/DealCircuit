'use client';

import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <button
      onClick={handleLogout}
      title="Sign out"
      className="p-1.5 hover:bg-brand-coral/20 hover:text-brand-coral text-dark-muted rounded-md transition"
    >
      <LogOut className="w-4 h-4" />
    </button>
  );
}
