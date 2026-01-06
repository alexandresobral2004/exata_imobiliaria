import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Home, Key, ArrowUpRight } from 'lucide-react';

const data = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Fev', revenue: 3000 },
  { name: 'Mar', revenue: 2000 },
  { name: 'Abr', revenue: 2780 },
  { name: 'Mai', revenue: 1890 },
  { name: 'Jun', revenue: 2390 },
  { name: 'Jul', revenue: 3490 },
];

const recentProperties = [
  { id: 1, title: 'Apartamento Centro', price: 'R$ 450.000', type: 'Venda', status: 'Disponível' },
  { id: 2, title: 'Casa Jardim América', price: 'R$ 2.500', type: 'Aluguel', status: 'Alugado' },
  { id: 3, title: 'Sala Comercial', price: 'R$ 1.200', type: 'Aluguel', status: 'Disponível' },
  { id: 4, title: 'Terreno Loteamento', price: 'R$ 120.000', type: 'Venda', status: 'Negociação' },
];

export function DashboardHome() {
  return (
    <div className="flex-1 bg-gray-50 dark:bg-zinc-900 min-h-screen">
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Visão Geral</h1>
            <p className="text-gray-500 dark:text-zinc-400 mt-1">Acompanhe os principais indicadores da sua imobiliária.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
              Exportar
            </button>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors">
              + Novo Imóvel
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="IMÓVEIS TOTAIS" 
            value="302" 
            change="30 alugados (9.9%)" 
            icon={Home} 
            positive 
            color="blue"
          />
          <StatsCard 
            title="RECEITA MENSAL (EST.)" 
            value="R$ 225.702,00" 
            change="Baseada em contratos ativos" 
            icon={TrendingUp} 
            positive 
            color="green"
          />
          <StatsCard 
            title="CONTRATOS ATIVOS" 
            value="30" 
            change="Em vigência" 
            icon={Key} 
            positive 
            color="purple"
          />
          <StatsCard 
            title="PENDÊNCIAS FINANCEIRAS" 
            value="66" 
            change="Faturas em atraso" 
            icon={Users} 
            positive={false} 
            color="red"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ações Rápidas */}
          <Card className="bg-white dark:bg-zinc-800 border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Ações Rápidas</CardTitle>
              <CardDescription className="text-gray-500 dark:text-zinc-400">Acesse rapidamente as áreas mais utilizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <button className="h-24 flex flex-col items-center justify-center gap-2 bg-gray-50 dark:bg-zinc-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200 dark:border-zinc-600 rounded-lg text-gray-700 dark:text-zinc-300 hover:text-blue-700 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                  <Users className="h-6 w-6" />
                  <span className="text-sm font-medium">Gerenciar Clientes</span>
                </button>
                <button className="h-24 flex flex-col items-center justify-center gap-2 bg-gray-50 dark:bg-zinc-700 hover:bg-green-50 dark:hover:bg-green-900/20 border border-gray-200 dark:border-zinc-600 rounded-lg text-gray-700 dark:text-zinc-300 hover:text-green-700 dark:hover:text-green-400 hover:border-green-200 dark:hover:border-green-800 transition-colors">
                  <Key className="h-6 w-6" />
                  <span className="text-sm font-medium">Novo Contrato</span>
                </button>
                <button className="h-24 flex flex-col items-center justify-center gap-2 bg-gray-50 dark:bg-zinc-700 hover:bg-orange-50 dark:hover:bg-orange-900/20 border border-gray-200 dark:border-zinc-600 rounded-lg text-gray-700 dark:text-zinc-300 hover:text-orange-700 dark:hover:text-orange-400 hover:border-orange-200 dark:hover:border-orange-800 transition-colors">
                  <Home className="h-6 w-6" />
                  <span className="text-sm font-medium">Cadastrar Imóvel</span>
                </button>
                <button className="h-24 flex flex-col items-center justify-center gap-2 bg-gray-50 dark:bg-zinc-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-gray-200 dark:border-zinc-600 rounded-lg text-gray-700 dark:text-zinc-300 hover:text-purple-700 dark:hover:text-purple-400 hover:border-purple-200 dark:hover:border-purple-800 transition-colors">
                  <TrendingUp className="h-6 w-6" />
                  <span className="text-sm font-medium">Lançar Receita/Despesa</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Status dos Imóveis */}
          <Card className="bg-white dark:bg-zinc-800 border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Status dos Imóveis</CardTitle>
              <CardDescription className="text-gray-500 dark:text-zinc-400">Distribuição da sua carteira</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700 dark:text-zinc-300">Alugados</span>
                    <span className="text-gray-900 dark:text-white font-bold">30 (9.9%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '9.9%' }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700 dark:text-zinc-300">Disponíveis</span>
                    <span className="text-gray-900 dark:text-white font-bold">272 (90.1%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '90.1%' }} />
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 mt-4 border-t border-gray-100 dark:border-zinc-700">
                  <button className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors">
                    Ver Todos os Imóveis <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, change, icon: Icon, positive, color }: { 
  title: string, 
  value: string, 
  change: string, 
  icon: any, 
  positive: boolean,
  color: 'blue' | 'green' | 'purple' | 'red'
}) {
  const colorClasses = {
    blue: {
      border: 'border-l-blue-500',
      iconBg: 'bg-blue-50 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    green: {
      border: 'border-l-green-500',
      iconBg: 'bg-green-50 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    purple: {
      border: 'border-l-purple-500',
      iconBg: 'bg-purple-50 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    red: {
      border: 'border-l-red-500',
      iconBg: 'bg-red-50 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400'
    }
  };

  const colors = colorClasses[color];

  return (
    <Card className={`bg-white dark:bg-zinc-800 border-0 shadow-sm hover:shadow-md transition-shadow ${colors.border} border-l-4`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wide">{title}</p>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
              <p className={`text-xs mt-1 ${positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {change}
              </p>
            </div>
          </div>
          <div className={`h-12 w-12 ${colors.iconBg} rounded-full flex items-center justify-center ${colors.iconColor}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
