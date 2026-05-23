'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { supabase } from '../../utils/supabase';

const Navbar: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(Boolean(session));
      setUserEmail(session?.user?.email ?? null);
    };

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
      setUserEmail(session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
    router.push('/');
  };

  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : '?';

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-zinc-200 dark:border-border-dark bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-6 py-4 md:px-10 lg:px-40">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <Image src="/Levitate.png" alt="Levitate Logo" width={32} height={32} className="w-8 h-8 rounded-lg" />
          <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">Levitate</h2>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
        <nav className="flex items-center gap-8">
          <a href="#product" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Product</a>
          <a href="#solutions" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Solutions</a>
          <a href="#pricing" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Pricing</a>
        </nav>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-9 h-9 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-bold flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
              >
                {userInitial}
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg py-1 z-50">
                  <p className="px-4 py-2 text-xs text-zinc-500 truncate">{userEmail}</p>
                  <div className="border-t border-zinc-100 dark:border-zinc-800" />
                  <Link
                    href="/projects"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                  >
                    Projects
                  </Link>
                  <div className="border-t border-zinc-100 dark:border-zinc-800" />
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/signin"
              className="h-9 px-4 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 text-sm font-semibold rounded-lg transition-all shadow-sm inline-flex items-center cursor-pointer"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 cursor-pointer">
          <span className="material-symbols-outlined text-zinc-600 dark:text-zinc-400">
            {isMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-background-dark border-b border-zinc-200 dark:border-border-dark p-4 flex flex-col gap-4 md:hidden shadow-lg animate-in slide-in-from-top-2">
          <a href="#product" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 p-2 cursor-pointer">Product</a>
          <a href="#solutions" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 p-2 cursor-pointer">Solutions</a>
          <a href="#pricing" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 p-2 cursor-pointer">Pricing</a>
          {isAuthenticated ? (
            <>
              <Link href="/projects" className="w-full h-10 border border-zinc-200 dark:border-border-dark text-zinc-700 dark:text-zinc-200 font-semibold rounded-lg inline-flex items-center justify-center cursor-pointer">
                Projects
              </Link>
              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-bold flex items-center justify-center">
                  {userInitial}
                </div>
                <span className="text-sm text-zinc-600 dark:text-zinc-400 truncate flex-1">{userEmail}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full h-10 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-semibold rounded-lg inline-flex items-center justify-center cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/signin" className="w-full h-10 bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold rounded-lg inline-flex items-center justify-center cursor-pointer">
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
