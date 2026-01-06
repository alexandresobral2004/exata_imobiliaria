"use client";

import React from 'react';
import Image from 'next/image';
import { LayoutDashboard, Building2, Settings, LogOut, Moon, Sun, Users } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function Sidebar({ activePage, onNavigate, onLogout }: { activePage: string; onNavigate: (page: string) => void; onLogout: () => void }) {
  const { theme, setTheme } = useTheme();
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
    { icon: Building2, label: 'Imobiliária', id: 'real-estate' },
    { icon: Users, label: 'Usuários', id: 'users' },
  ];

  return (
    <aside className="hidden md:flex w-48 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex-col">
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex items-center justify-center p-5 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-white dark:bg-zinc-800 shadow-sm border border-gray-200 dark:border-zinc-700">
              <Image
                src="/images/logo.jpeg"
                alt="Logo"
                fill
                className="object-contain p-1"
                sizes="100%"
              />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Exata</h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">Serviços</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activePage === item.id
                      ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 shadow-sm border-l-4 border-l-green-600 dark:border-l-green-500'
                      : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50 hover:text-green-600 dark:hover:text-zinc-100'
                  }`}
                >
                  <item.icon className={`size-4 transition-colors ${activePage === item.id ? 'text-green-600 dark:text-green-500' : 'text-gray-400 dark:text-zinc-500'}`} />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Settings Section */}
          <div className="mt-5">
            <p className="px-2.5 text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
              Configurações
            </p>
            <div className="space-y-1">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50 hover:text-green-600 dark:hover:text-zinc-100 transition-colors"
              >
                {theme === 'dark' ? <Sun className="size-4 text-gray-400 dark:text-zinc-500" /> : <Moon className="size-4 text-gray-400 dark:text-zinc-500" />}
                {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
              </button>
              <button
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50 hover:text-green-600 dark:hover:text-zinc-100 transition-colors"
              >
                <Settings className="size-4 text-gray-400 dark:text-zinc-500" />
                Preferências
              </button>
            </div>
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-gray-100 dark:border-zinc-800">
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 w-full px-2.5 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="size-4" />
            Sair
          </button>
        </div>
      </div>
    </aside>
  );
}
