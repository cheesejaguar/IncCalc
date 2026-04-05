'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Building2,
  Users,
  Sword,
  Cpu,
  Star,
  Gem,
  Home,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/economy', label: 'Economy', icon: Building2 },
  { href: '/tech', label: 'Technology', icon: Cpu },
  { href: '/military', label: 'Military', icon: Sword },
  { href: '/improvements', label: 'Improvements', icon: Users },
  { href: '/wonders', label: 'Wonders', icon: Star },
  { href: '/resources', label: 'Resources', icon: Gem },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r border-border bg-[var(--sidebar)] hidden md:flex md:flex-col">
      {/* Burgundy header - honoring legacy */}
      <div className="bg-[#B92432] px-5 py-4">
        <h1 className="text-lg font-bold tracking-wider text-white uppercase" style={{ fontFamily: 'var(--font-chakra)' }}>
          IncCalc
        </h1>
        <p className="text-[11px] text-white/70 tracking-wide uppercase mt-0.5">
          Cybernations Calculator
        </p>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-[#B92432] text-white'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-3 border-t border-border">
        <p className="text-[10px] text-muted-foreground/60 tracking-wide uppercase">
          v2.0 — Full Mechanics
        </p>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden flex overflow-x-auto border-b border-border bg-[var(--sidebar)] px-2 gap-1 py-1.5">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs whitespace-nowrap font-medium transition-colors',
              isActive
                ? 'bg-[#B92432] text-white'
                : 'text-muted-foreground hover:bg-accent'
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
