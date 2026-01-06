"use client";

import React from 'react';
import { cn } from './utils';

interface ResponsiveTableProps {
  headers: string[];
  data: any[];
  renderRow: (item: any, index: number) => React.ReactNode;
  renderMobileCard?: (item: any, index: number) => React.ReactNode;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  className?: string;
  headerWidths?: string[];
}

export function ResponsiveTable({ 
  headers, 
  data, 
  renderRow, 
  renderMobileCard,
  emptyMessage = "Nenhum item encontrado",
  emptyIcon,
  className,
  headerWidths = []
}: ResponsiveTableProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-zinc-700">
          <table className="w-full border-collapse bg-white dark:bg-zinc-900">
            <thead>
              <tr className="border-b border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50">
                {headers.map((header, index) => (
                  <th 
                    key={index} 
                    className={cn(
                      "text-center py-3 px-4 font-semibold text-gray-900 dark:text-zinc-100 text-sm whitespace-nowrap",
                      headerWidths[index] || "min-w-[120px]"
                    )}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
          <tbody>
            {data.map((item, index) => renderRow(item, index))}
            {data.length === 0 && (
              <tr>
                <td 
                  colSpan={headers.length} 
                  className="text-center py-12 text-gray-500 dark:text-zinc-400"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    {emptyIcon && (
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                        {emptyIcon}
                      </div>
                    )}
                    <div className="text-center">
                      <p className="font-medium text-gray-900 dark:text-zinc-100">{emptyMessage}</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Tablet Table */}
      <div className="hidden md:block lg:hidden">
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-zinc-700">
          <table className="w-full border-collapse bg-white dark:bg-zinc-900 min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50">
                {headers.map((header, index) => (
                  <th 
                    key={index} 
                    className="text-center py-3 px-2 font-semibold text-gray-900 dark:text-zinc-100 text-xs whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => renderRow(item, index))}
              {data.length === 0 && (
                <tr>
                  <td 
                    colSpan={headers.length} 
                    className="text-center py-12 text-gray-500 dark:text-zinc-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      {emptyIcon && (
                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                          {emptyIcon}
                        </div>
                      )}
                      <div className="text-center">
                        <p className="font-medium text-gray-900 dark:text-zinc-100">{emptyMessage}</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {data.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-zinc-400">
            <div className="flex flex-col items-center justify-center gap-3">
              {emptyIcon && (
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                  {emptyIcon}
                </div>
              )}
              <div className="text-center">
                <p className="font-medium text-gray-900 dark:text-zinc-100">{emptyMessage}</p>
              </div>
            </div>
          </div>
        ) : (
          data.map((item, index) => (
            <div key={index} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg p-4 shadow-sm">
              {renderMobileCard ? renderMobileCard(item, index) : renderRow(item, index)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
