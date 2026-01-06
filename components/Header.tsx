import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

import { User } from './real-estate/RealEstateContext';

interface HeaderProps {
  user: User;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="h-16 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <button className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
          <Menu className="size-6 text-gray-600 dark:text-zinc-400" />
        </button>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar..."
              className="w-80 px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
          <Bell className="size-5 text-gray-600 dark:text-zinc-400" />
          <span className="absolute top-1 right-1 size-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-zinc-800">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
            <p className="text-xs text-gray-500 dark:text-zinc-400">{user.role}</p>
          </div>
          <Avatar className="h-10 w-10">
            <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=16a34a&color=ffffff`} alt={user.name} />
            <AvatarFallback className="bg-green-600 text-white font-medium">
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
