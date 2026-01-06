"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Users, Key, Briefcase, Home, FileText, DollarSign } from 'lucide-react';
import { Owners } from './Owners';
import { Tenants } from './Tenants';
import { Brokers } from './Brokers';
import { Properties } from './Properties';
import { Contracts } from './Contracts';
import { Financial } from './Financial';
import { useRealEstate } from './RealEstateContext';

export function RealEstateLayout() {
  const { activeTab, setActiveTab } = useRealEstate();

  return (
    <div className="flex-1 px-3 py-4 bg-gray-50 dark:bg-zinc-950">
      <div className="w-full max-w-full space-y-3">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Gestão Imobiliária</h1>
          <p className="text-gray-600 dark:text-zinc-400">Gerencie proprietários, inquilinos, imóveis e contratos.</p>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-transparent p-0 h-auto w-full justify-start border-b border-gray-200 dark:border-zinc-800 rounded-none gap-0">
            <TabsTrigger 
              value="owners" 
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-600 dark:data-[state=active]:text-green-400 dark:data-[state=active]:border-green-400 text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Users className="w-4 h-4" />
              Proprietários
            </TabsTrigger>
            <TabsTrigger 
              value="properties" 
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-600 dark:data-[state=active]:text-green-400 dark:data-[state=active]:border-green-400 text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Home className="w-4 h-4" />
              Imóveis
            </TabsTrigger>
            <TabsTrigger 
              value="tenants" 
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-600 dark:data-[state=active]:text-green-400 dark:data-[state=active]:border-green-400 text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Key className="w-4 h-4" />
              Inquilinos
            </TabsTrigger>
            <TabsTrigger 
              value="contracts" 
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-600 dark:data-[state=active]:text-green-400 dark:data-[state=active]:border-green-400 text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <FileText className="w-4 h-4" />
              Contratos
            </TabsTrigger>
            <TabsTrigger 
              value="financial" 
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-600 dark:data-[state=active]:text-green-400 dark:data-[state=active]:border-green-400 text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <DollarSign className="w-4 h-4" />
              Financeiro
            </TabsTrigger>
            <TabsTrigger 
              value="brokers" 
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-600 dark:data-[state=active]:text-green-400 dark:data-[state=active]:border-green-400 text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Briefcase className="w-4 h-4" />
              Corretores
            </TabsTrigger>
          </TabsList>

          <div className="mt-3">
            <TabsContent value="owners" className="mt-0">
              <Owners />
            </TabsContent>
            <TabsContent value="properties" className="mt-0">
              <Properties />
            </TabsContent>
            <TabsContent value="tenants" className="mt-0">
              <Tenants />
            </TabsContent>
            <TabsContent value="contracts" className="mt-0">
              <Contracts />
            </TabsContent>
            <TabsContent value="financial" className="mt-0">
              <Financial />
            </TabsContent>
            <TabsContent value="brokers" className="mt-0">
              <Brokers />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
