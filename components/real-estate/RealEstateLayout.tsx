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
          <p className="text-gray-600 dark:text-zinc-400">Gerencie clientes, inquilinos, imóveis e contratos.</p>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-50 dark:bg-zinc-900 p-2 h-auto w-full justify-between rounded-full border border-gray-200 dark:border-zinc-800">
            <TabsTrigger 
              value="owners" 
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-full data-[state=active]:bg-white data-[state=active]:text-green-600 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-green-500 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200 bg-transparent data-[state=active]:shadow-sm"
            >
              <Users className="w-5 h-5" />
              Proprietários
            </TabsTrigger>
            <TabsTrigger 
              value="properties" 
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-full data-[state=active]:bg-white data-[state=active]:text-green-600 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-green-500 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200 bg-transparent data-[state=active]:shadow-sm"
            >
              <Home className="w-5 h-5" />
              Imóveis
            </TabsTrigger>
            <TabsTrigger 
              value="tenants" 
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-full data-[state=active]:bg-white data-[state=active]:text-green-600 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-green-500 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200 bg-transparent data-[state=active]:shadow-sm"
            >
              <Key className="w-5 h-5" />
              Inquilinos
            </TabsTrigger>
            <TabsTrigger 
              value="contracts" 
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-full data-[state=active]:bg-white data-[state=active]:text-green-600 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-green-500 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200 bg-transparent data-[state=active]:shadow-sm"
            >
              <FileText className="w-5 h-5" />
              Contratos
            </TabsTrigger>
            <TabsTrigger 
              value="financial" 
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-full data-[state=active]:bg-white data-[state=active]:text-green-600 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-green-500 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200 bg-transparent data-[state=active]:shadow-sm"
            >
              <DollarSign className="w-5 h-5" />
              Financeiro
            </TabsTrigger>
            <TabsTrigger 
              value="brokers" 
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-full data-[state=active]:bg-white data-[state=active]:text-green-600 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-green-500 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200 bg-transparent data-[state=active]:shadow-sm"
            >
              <Briefcase className="w-5 h-5" />
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
