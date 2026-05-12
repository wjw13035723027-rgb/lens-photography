'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';

const mainLinks = [
  { href: '/', label: '作品' },
  { href: '/about', label: '关于' },
  { href: '/contact', label: '联系' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState(false);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isAdmin = user?.role === 'admin';

  function handleContactClick(e: React.MouseEvent) {
    if (isAdmin) {
      e.preventDefault();
      setToast(true);
      setTimeout(() => setToast(false), 2500);
    }
  }

  const authLinks = authLoading
    ? []
    : user
      ? [{ href: '/dashboard', label: '我的' }]
      : [{ href: '/login', label: '登录' }];

  const allLinks = [...mainLinks, ...authLinks];

  const linkClass = (href: string) =>
    `relative py-1 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded ${
      pathname === href ? 'text-foreground font-medium' : 'text-muted/60'
    }`;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${
        scrolled
          ? 'bg-background/50 backdrop-blur-2xl border-b border-white/[0.05]'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl flex items-center justify-between px-6 h-16">
        <Link
          href="/"
          className={`font-serif tracking-[0.3em] text-foreground hover:opacity-70 transition-all duration-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded ${
            scrolled ? 'text-base' : 'text-lg'
          }`}
        >
          LENS
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-10 text-sm tracking-widest">
            {allLinks.map(({ href, label }) => {
              const isContact = href === '/contact' && isAdmin;
              const className = linkClass(href);
              return (
                <li key={href}>
                  {isContact ? (
                    <button onClick={handleContactClick} className={className}>
                      联系
                    </button>
                  ) : (
                    <Link href={href} className={className}>
                      {label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
          <ThemeToggle />
        </div>

        {/* Mobile right */}
        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <button
            className="p-2 -mr-2 text-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
            aria-expanded={menuOpen}
          >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            {menuOpen ? (
              <path d="M5 5l10 10M15 5L5 15" />
            ) : (
              <path d="M3 6h14M3 10h14M3 14h14" />
            )}
          </svg>
        </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-background/95 border-b border-white/[0.05]">
          <ul className="flex flex-col px-6 pb-6 pt-2 gap-4 text-sm tracking-widest">
            {allLinks.map(({ href, label }) => {
              const isContact = href === '/contact' && isAdmin;
              return (
                <li key={href}>
                  {isContact ? (
                    <button
                      onClick={() => { setMenuOpen(false); handleContactClick({ preventDefault: () => {} } as React.MouseEvent); }}
                      className={`block py-1 transition-colors text-muted hover:text-foreground`}
                    >
                      联系
                    </button>
                  ) : (
                    <Link
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className={`block py-1 transition-colors ${
                        pathname === href ? 'text-foreground' : 'text-muted'
                      }`}
                    >
                      {label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          >
            <div className="px-8 py-4 rounded-2xl bg-card border border-white/[0.08] backdrop-blur-xl shadow-2xl">
              <p className="text-sm text-foreground tracking-widest">无法给自己发送信息</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
