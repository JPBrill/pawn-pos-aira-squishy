'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  PackageSearch,
  ShoppingCart,
  Users,
  FileText,
  Settings,
  ChevronRight,
  Menu,
  X,
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

// ─── Shared nav link used in both desktop and mobile ─────────────────────────
function NavLink({
  item,
  isActive,
  expanded,
  onClick,
}: {
  item: (typeof navItems)[0];
  isActive: boolean;
  expanded: boolean;
  onClick?: () => void;
}) {
  return (
    <Link key={item.href} href={item.href} className="relative block" onClick={onClick}>
      {isActive && (
        <motion.div
          layoutId="sidebar-active-bg"
          className="absolute inset-0 bg-ps-bg-surface rounded-xl border border-white/5"
          initial={false}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
      <div
        className={cn(
          'relative flex items-center rounded-xl transition-colors z-10 overflow-hidden',
          expanded ? 'gap-3 px-4 py-3' : 'justify-center p-3',
          isActive
            ? 'text-ps-primary'
            : 'text-ps-text-muted hover:text-ps-text hover:bg-white/5',
        )}
      >
        <item.icon className="w-5 h-5 flex-shrink-0" />
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.span
              key="label"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="font-medium text-sm whitespace-nowrap overflow-hidden"
            >
              {item.name}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </Link>
  );
}

// ─── Desktop sidebar (always mounted, icon-only ↔ expanded) ──────────────────
function DesktopSidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.aside
      animate={{ width: expanded ? 256 : 64 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className="hidden md:flex h-full bg-ps-bg-elevated border-r border-white/5 flex-col overflow-hidden flex-shrink-0"
    >
      {/* Logo / wordmark */}
      <div className={cn('flex items-center border-b border-white/5', expanded ? 'p-5 gap-3' : 'p-4 justify-center')}>
        <div className="w-8 h-8 flex-shrink-0 rounded-xl bg-ps-primary/20 flex items-center justify-center border border-ps-primary/30">
          <div className="w-3 h-3 rounded-full bg-ps-primary shadow-[0_0_10px_var(--color-ps-primary)]" />
        </div>
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.span
              key="wordmark"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="font-mono text-sm font-bold tracking-wider text-ps-text uppercase whitespace-nowrap overflow-hidden"
            >
              Command
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <NavLink key={item.href} item={item} isActive={isActive} expanded={expanded} />
          );
        })}
      </nav>

      {/* Settings */}
      <div className="px-2 pb-4">
        <Link
          href="/settings"
          className={cn(
            'flex items-center rounded-xl transition-colors text-ps-text-muted hover:text-ps-text hover:bg-white/5 overflow-hidden',
            expanded ? 'gap-3 px-4 py-3' : 'justify-center p-3',
            pathname === '/settings' ? 'text-ps-primary' : ''
          )}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.span
                key="settings-label"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="font-medium text-sm whitespace-nowrap overflow-hidden"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Expand hint arrow */}
      <div className="px-2 pb-3 flex justify-center">
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-white/20"
        >
          <ChevronRight className="w-4 h-4" />
        </motion.div>
      </div>
    </motion.aside>
  );
}

// ─── Mobile sidebar (drawer, hidden by default) ───────────────────────────────
function MobileSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    const timer = setTimeout(() => setOpen(false), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {/* Hamburger trigger — shown only on mobile */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-ps-bg-elevated border border-white/10 flex items-center justify-center text-ps-text-muted hover:text-ps-text transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.aside
            key="drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="md:hidden fixed top-0 left-0 h-full w-64 z-50 bg-ps-bg-elevated border-r border-white/5 flex flex-col"
          >
            {/* Header */}
            <div className="p-5 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-ps-primary/20 flex items-center justify-center border border-ps-primary/30">
                  <div className="w-3 h-3 rounded-full bg-ps-primary shadow-[0_0_10px_var(--color-ps-primary)]" />
                </div>
                <span className="font-mono text-sm font-bold tracking-wider text-ps-text uppercase">
                  Command
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-ps-text-muted hover:text-ps-text transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <NavLink
                    key={item.href}
                    item={item}
                    isActive={isActive}
                    expanded={true}
                    onClick={() => setOpen(false)}
                  />
                );
              })}
            </nav>

            {/* Settings */}
            <div className="p-4 mt-auto border-t border-white/5">
              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-colors",
                  pathname === '/settings' ? 'text-ps-primary bg-white/5' : 'text-ps-text-muted hover:text-ps-text hover:bg-white/5'
                )}
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium text-sm">Settings</span>
              </Link>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Exported composite ───────────────────────────────────────────────────────
export function Sidebar() {
  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
}
