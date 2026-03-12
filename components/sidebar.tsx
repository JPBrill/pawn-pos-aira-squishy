'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  PackageSearch, 
  ShoppingCart, 
  Users, 
  FileText,
  Settings
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Inventory', href: '/inventory', icon: PackageSearch },
  { name: 'POS', href: '/pos', icon: ShoppingCart },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Documents', href: '/documents', icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full bg-ps-bg-elevated border-r border-white/5 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-ps-primary/20 flex items-center justify-center border border-ps-primary/30">
          <div className="w-3 h-3 rounded-full bg-ps-primary shadow-[0_0_10px_var(--color-ps-primary)]" />
        </div>
        <span className="font-mono text-sm font-bold tracking-wider text-ps-text uppercase">
          Command
        </span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className="relative block"
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-bg"
                  className="absolute inset-0 bg-ps-bg-surface rounded-xl border border-white/5"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <div className={cn(
                "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors z-10",
                isActive ? "text-ps-primary" : "text-ps-text-muted hover:text-ps-text hover:bg-white/5"
              )}>
                <item.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-ps-text-muted hover:text-ps-text hover:bg-white/5 transition-colors">
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm">Settings</span>
        </button>
      </div>
    </aside>
  );
}
