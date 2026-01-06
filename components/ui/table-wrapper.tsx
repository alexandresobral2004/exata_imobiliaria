"use client";

import React from 'react';
import { cn } from './utils';

interface TableWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function TableWrapper({ children, className }: TableWrapperProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Desktop and Tablet */}
      <div className="hidden sm:block">
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
      
      {/* Mobile - Show scrollable table */}
      <div className="sm:hidden">
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <div className="min-w-[600px]">
            {children}
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2 text-center">
          Deslize horizontalmente para ver mais colunas
        </p>
      </div>
    </div>
  );
}
