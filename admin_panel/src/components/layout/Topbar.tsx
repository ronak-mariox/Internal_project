import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, Menu } from 'lucide-react';
import { SearchInput } from '@/components/ui/Input';
import { supportTickets } from '@/data/notifications';
import { useAuth } from '@/context/AuthContext';
import { humanizeRole, initials } from '@/lib/format';
import { cn } from '@/lib/cn';

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const openTickets = supportTickets.filter((t) => t.status === 'open' || t.status === 'escalated').length;
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-ink-200 bg-surface/95 px-4 backdrop-blur sm:px-6">
      <button onClick={onMenuClick} className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 lg:hidden">
        <Menu size={20} />
      </button>

      <div className="min-w-0 flex-1 md:w-72 md:flex-none">
        <SearchInput placeholder="Search orders, vendors, products…" />
      </div>

      <div className="flex-1" />

      <button className="relative rounded-xl border border-ink-200 p-2.5 text-ink-500 hover:bg-ink-100">
        <Bell size={18} />
        {openTickets > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
            {openTickets}
          </span>
        )}
      </button>

      <div className="relative hidden sm:block" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white"
        >
          {admin ? initials(admin.name) : '—'}
        </button>

        <div
          className={cn(
            'absolute right-0 top-11 w-52 origin-top-right rounded-xl border border-ink-200 bg-surface py-1.5 shadow-[var(--shadow-card)] transition-all',
            menuOpen ? 'visible scale-100 opacity-100' : 'invisible scale-95 opacity-0',
          )}
        >
          <div className="border-b border-ink-100 px-3.5 py-2.5 leading-tight">
            <p className="truncate text-[13px] font-semibold text-ink-800">{admin?.name ?? 'Unknown'}</p>
            <p className="truncate text-[11px] text-ink-500">{admin ? humanizeRole(admin.role) : ''}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-3.5 py-2 text-[13px] font-medium text-ink-600 hover:bg-ink-100 hover:text-ink-900"
          >
            <LogOut size={15} />
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
