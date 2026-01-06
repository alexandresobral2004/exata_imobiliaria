"use client";

import React from 'react';
import { useRealEstate } from './RealEstateContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowRight, Home, Users, FileText, AlertCircle, TrendingUp, Wallet } from 'lucide-react';
import { formatCurrency } from '../../utils/masks';

interface DashboardProps {
  onNavigateToModule: (module: string) => void;
}

export function RealEstateDashboard({ onNavigateToModule }: DashboardProps) {
  const { properties, tenants, contracts, owners, setActiveTab, financialRecords } = useRealEstate();

  // Cálculos de KPIs
  const totalProperties = properties.length;
  const vacantProperties = properties.filter(p => p.status === 'Disponível').length;
  const rentedProperties = properties.filter(p => p.status === 'Alugado').length;
  const occupationRate = totalProperties > 0 ? ((rentedProperties / totalProperties) * 100).toFixed(1) : '0';

  const activeContracts = contracts.filter(c => c.status === 'Ativo').length;
  
  // Receita Mensal Estimada (Soma dos aluguéis ativos)
  const monthlyRevenue = contracts
    .filter(c => c.status === 'Ativo')
    .reduce((acc, curr) => acc + curr.rentAmount, 0);

  // Aluguéis em Atraso (Simplificado: registros de receita atrasados)
  const overdueRents = financialRecords.filter(r => 
    r.type === 'Receita' && r.status === 'Atrasado'
  ).length;

  const navigateTo = (tab: string) => {
    setActiveTab(tab);
    onNavigateToModule('real-estate');
  };

  return (
    <main className="flex-1 p-8 bg-gray-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Visão Geral</h1>
          <p className="text-gray-600 dark:text-zinc-400">Acompanhe os principais indicadores da sua imobiliária.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-600 dark:text-zinc-400 uppercase tracking-wide">IMÓVEIS TOTAIS</span>
                  <span className="text-3xl font-bold text-gray-900 dark:text-zinc-100 mt-2">{totalProperties}</span>
                  <span className="text-sm text-green-600 dark:text-green-400 mt-1">{rentedProperties} alugados ({occupationRate}%)</span>
                </div>
                <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Home className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-600 dark:text-zinc-400 uppercase tracking-wide">RECEITA MENSAL (EST.)</span>
                  <span className="text-3xl font-bold text-gray-900 dark:text-zinc-100 mt-2">R$ {monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  <span className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Baseada em contratos ativos</span>
                </div>
                <div className="h-12 w-12 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-600 dark:text-zinc-400 uppercase tracking-wide">CONTRATOS ATIVOS</span>
                  <span className="text-3xl font-bold text-gray-900 dark:text-zinc-100 mt-2">{activeContracts}</span>
                  <span className="text-sm text-purple-600 dark:text-purple-400 mt-1">Em vigência</span>
                </div>
                <div className="h-12 w-12 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-600 dark:text-zinc-400 uppercase tracking-wide">PENDÊNCIAS FINANCEIRAS</span>
                  <span className="text-3xl font-bold text-gray-900 dark:text-zinc-100 mt-2">{overdueRents}</span>
                  <span className="text-sm text-red-600 dark:text-red-400 mt-1">Faturas em atraso</span>
                </div>
                <div className="h-12 w-12 bg-red-50 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions and Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-zinc-100">Ações Rápidas</CardTitle>
              <CardDescription className="text-gray-600 dark:text-zinc-400">Acesse rapidamente as áreas mais utilizadas</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 text-gray-700 dark:text-zinc-300" 
                  onClick={() => navigateTo('owners')}
                >
                  <Users className="h-5 w-5" />
                  <span className="text-sm font-medium">Gerenciar Proprietários</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 text-gray-700 dark:text-zinc-300" 
                  onClick={() => navigateTo('contracts')}
                >
                  <FileText className="h-5 w-5" />
                  <span className="text-sm font-medium">Novo Contrato</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 text-gray-700 dark:text-zinc-300" 
                  onClick={() => navigateTo('properties')}
                >
                  <Home className="h-5 w-5" />
                  <span className="text-sm font-medium">Cadastrar Imóvel</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2 bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 text-gray-700 dark:text-zinc-300" 
                  onClick={() => navigateTo('financial')}
                >
                  <Wallet className="h-5 w-5" />
                  <span className="text-sm font-medium">Lançar Receita/Despesa</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Status Breakdown */}
          <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-zinc-100">Status dos Imóveis</CardTitle>
              <CardDescription className="text-gray-600 dark:text-zinc-400">Distribuição da sua carteira</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Alugados</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-zinc-100">{rentedProperties} ({occupationRate}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 dark:bg-green-600 rounded-full transition-all duration-300" style={{ width: `${occupationRate}%` }} />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Disponíveis</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-zinc-100">{vacantProperties} ({totalProperties > 0 ? (100 - Number(occupationRate)).toFixed(1) : 0}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 dark:bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${100 - Number(occupationRate)}%` }} />
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 mt-6 border-t border-gray-100 dark:border-zinc-800">
                  <Button 
                    variant="ghost" 
                    className="text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 text-sm font-medium" 
                    onClick={() => navigateTo('properties')}
                  >
                    Ver Todos os Imóveis <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
