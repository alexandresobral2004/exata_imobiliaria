"use client";

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { useRealEstate } from './RealEstateContext';
import { NewFinancialModal } from '../ui/NewFinancialModal';
import { DollarSign, Calendar, CheckCircle, Clock, ArrowUpCircle, ArrowDownCircle, Plus, Filter, AlertCircle, Tag, Wallet, CreditCard, X, Trash2, Edit } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { cn } from '../ui/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { maskCurrency } from '../../utils/masks';

export function Financial() {
  const { financialRecords, properties, contracts, owners, brokers, categories, addFinancialRecord, updateFinancialRecord, deleteFinancialRecord, generateBrokerCommission } = useRealEstate();
  const [filter, setFilter] = useState('all');
  const [selectedOwner, setSelectedOwner] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const getContractDetails = (contractId: string) => {
    if (!contractId || contractId === 'manual') return null;
    const contract = contracts.find(c => c.id === contractId);
    if (!contract) return null;
    const property = properties.find(p => p.id === contract.propertyId);
    const owner = owners.find(o => o.id === property?.ownerId);
    return { property, owner };
  };

  // Get current month and year
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const filteredRecords = financialRecords.filter(record => {
    const details = getContractDetails(record.contractId);
    const recordDate = new Date(record.dueDate);
    const recordMonth = recordDate.getMonth();
    const recordYear = recordDate.getFullYear();

    // Only show records from current month
    if (recordMonth !== currentMonth || recordYear !== currentYear) return false;

    // Filter by Status
    if (filter === 'pending' && record.status !== 'Pendente') return false;
    if (filter === 'paid' && record.status !== 'Pago') return false;
    if (filter === 'overdue' && record.status !== 'Atrasado') return false;

    // Filter by Owner
    if (selectedOwner !== 'all') {
      if (!details || details.owner?.id !== selectedOwner) return false;
    }

    // Filter by Date Range (optional additional filter)
    if (startDate && record.dueDate < startDate) return false;
    if (endDate && record.dueDate > endDate) return false;

    return true;
  }).sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

  // Calcular totais por categoria (a receber - pendentes)
  const receivablesByCategory = filteredRecords
    .filter(record => record.status !== 'Pago' && record.type === 'Receita')
    .reduce((acc, record) => {
      const category = record.category || 'Outros';
      acc[category] = (acc[category] || 0) + record.amount;
      return acc;
    }, {} as Record<string, number>);

  const totalReceivables = Object.values(receivablesByCategory).reduce((sum, val) => sum + val, 0);

  // Calcular totais por categoria (já recebidos - pagos)
  const paidByCategory = filteredRecords
    .filter(record => record.status === 'Pago' && record.type === 'Receita')
    .reduce((acc, record) => {
      const category = record.category || 'Outros';
      acc[category] = (acc[category] || 0) + record.amount;
      return acc;
    }, {} as Record<string, number>);

  const totalPaid = Object.values(paidByCategory).reduce((sum, val) => sum + val, 0);

  // Calcular comissões do mês (detalhadas por corretor)
  const commissionsByBroker = filteredRecords
    .filter(record => record.type === 'Despesa' && record.category === 'Comissão' && record.status === 'Pago')
    .reduce((acc, record) => {
      // Extrair nome do corretor da descrição
      const brokerName = record.description.split(' - ')[0].replace('Comissão ', '') || 'Outros';
      acc[brokerName] = (acc[brokerName] || 0) + record.amount;
      return acc;
    }, {} as Record<string, number>);

  const totalCommissions = Object.values(commissionsByBroker).reduce((sum, val) => sum + val, 0);

  const resetForm = () => {
    setEditingId(null);
  };

  const handleEdit = (record: any) => {
    setEditingId(record.id);
    setOpen(true);
  };

  const handlePay = (id: string) => {
    const record = financialRecords.find(r => r.id === id);
    if (!record) return;

    // Marcar como pago
    updateFinancialRecord(id, { status: 'Pago' });

    // Se for uma receita de aluguel, gerar comissão automaticamente
    if (record.type === 'Receita' && record.contractId && record.contractId !== 'manual') {
      const contract = contracts.find(c => c.id === record.contractId);
      if (contract && contract.brokerId) {
        const broker = brokers.find(b => b.id === contract.brokerId);
        if (broker && broker.commissionRate && broker.commissionRate > 0) {
          // Calcular comissão
          const commissionAmount = (record.amount * broker.commissionRate) / 100;
          
          // Criar registro de comissão
          const commissionRecord = {
            type: 'Despesa' as const,
            amount: commissionAmount,
            category: 'Comissão',
            description: `Comissão ${broker.name} - ${record.description}`,
            contractId: record.contractId,
            dueDate: record.dueDate,
            status: 'Pago' as const
          };
          
          addFinancialRecord(commissionRecord);
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Financeiro</h1>
          <p className="text-gray-600 dark:text-zinc-400">
            Receitas e despesas de {now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Button 
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3" 
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Lançamento
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow dark:bg-zinc-900 dark:border-zinc-800 dark:border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total a Receber</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-400 mb-3">
              R$ {totalReceivables.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="space-y-1">
              {Object.entries(receivablesByCategory).map(([category, amount]) => (
                <div key={category} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-zinc-400">{category}:</span>
                  <span className="font-semibold text-gray-700 dark:text-zinc-300">
                    R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
              {Object.keys(receivablesByCategory).length === 0 && (
                <p className="text-xs text-gray-500 dark:text-zinc-500">Nenhum valor a receber</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow dark:bg-zinc-900 dark:border-zinc-800 dark:border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recebido</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-3">
              R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="space-y-1">
              {Object.entries(paidByCategory).map(([category, amount]) => (
                <div key={category} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-zinc-400">{category}:</span>
                  <span className="font-semibold text-gray-700 dark:text-zinc-300">
                    R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
              {Object.keys(paidByCategory).length === 0 && (
                <p className="text-xs text-gray-500 dark:text-zinc-500">Nenhum valor recebido</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow dark:bg-zinc-900 dark:border-zinc-800 dark:border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comissões Pagas</CardTitle>
            <CreditCard className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-400 mb-3">
              R$ {totalCommissions.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="space-y-1">
              {Object.entries(commissionsByBroker).map(([broker, amount]) => (
                <div key={broker} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-zinc-400">{broker}:</span>
                  <span className="font-semibold text-gray-700 dark:text-zinc-300">
                    R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
              {Object.keys(commissionsByBroker).length === 0 && (
                <p className="text-xs text-gray-500 dark:text-zinc-500">Nenhuma comissão paga</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow dark:bg-zinc-900 dark:border-zinc-800 dark:border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Líquido</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${(totalPaid - totalCommissions) >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
              R$ {(totalPaid - totalCommissions).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="dark:bg-zinc-900 dark:border-zinc-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg dark:text-zinc-100">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="dark:text-zinc-300">Status</Label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="paid">Pagos</SelectItem>
                  <SelectItem value="overdue">Atrasados</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="dark:text-zinc-300">Cliente</Label>
              <Select value={selectedOwner} onValueChange={setSelectedOwner}>
                <SelectTrigger className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {owners.map(owner => (
                    <SelectItem key={owner.id} value={owner.id}>
                      {owner.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="dark:text-zinc-300">Data Início</Label>
              <Input 
                type="date" 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)}
                className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
              />
            </div>
            <div className="space-y-2">
              <Label className="dark:text-zinc-300">Data Fim</Label>
              <Input 
                type="date" 
                value={endDate} 
                onChange={e => setEndDate(e.target.value)}
                className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records Table */}
      <Card className="dark:bg-zinc-900 dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 dark:text-zinc-100">
            <Wallet className="w-5 h-5" />
            Lançamentos Financeiros
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <Table>
            <TableHeader>
        <TableRow>
          <TableHead>Vencimento</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Referência</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-center">Ações</TableHead>
        </TableRow>
            </TableHeader>
            <TableBody>
                {filteredRecords.map((record) => {
                  const details = getContractDetails(record.contractId);
                  return (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400 dark:text-zinc-500" />
                          <span className="font-medium text-gray-900 dark:text-zinc-100 text-sm">
                            {new Date(record.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={cn("flex items-center gap-1.5 font-medium text-sm", record.type === 'Receita' ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400")}>
                          {record.type === 'Receita' ? <ArrowUpCircle className="w-3.5 h-3.5" /> : <ArrowDownCircle className="w-3.5 h-3.5" />}
                          {record.type}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-sm truncate block max-w-[120px]">{record.description}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal text-gray-600 dark:text-zinc-300 dark:bg-zinc-800">
                          {record.category || 'Geral'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {details ? (
                          <div className="flex flex-col text-xs">
                            <span className="font-medium text-gray-900 dark:text-zinc-100 truncate max-w-[120px]">
                              {details?.property?.address}
                            </span>
                            <span className="text-gray-500 dark:text-zinc-400 text-xs truncate max-w-[120px]">
                              {details?.owner?.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 dark:text-zinc-500 text-sm">Avulso</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`font-bold ${record.type === 'Receita' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                          {record.type === 'Despesa' ? '- ' : ''}R$ {record.amount.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={record.status === 'Pago' ? 'secondary' : 'outline'}
                          className={
                            record.status === 'Pago' ? 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 border-transparent' :
                            record.status === 'Atrasado' ? 'bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 border-transparent' :
                            'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'
                          }
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                              onClick={() => handleEdit(record)}
                          >
                              <Edit className="w-4 h-4" />
                          </Button>

                          {record.status !== 'Pago' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                              onClick={() => handlePay(record.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Baixar
                            </Button>
                          )}
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="dark:bg-zinc-900 dark:border-zinc-800">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="dark:text-zinc-100">Confirmar Exclusão</AlertDialogTitle>
                                <AlertDialogDescription className="dark:text-zinc-400">
                                  Tem certeza que deseja excluir este registro financeiro? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300">Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteFinancialRecord(record.id)} className="bg-red-600 hover:bg-red-700">
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredRecords.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-gray-500 dark:text-zinc-400">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                          <Wallet className="w-6 h-6 text-gray-400 dark:text-zinc-500" />
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-gray-900 dark:text-zinc-100">Nenhum lançamento encontrado</p>
                          <p className="text-sm text-gray-400 dark:text-zinc-500 mt-1">Tente ajustar os filtros ou adicione um novo registro.</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* New Financial Modal */}
      <NewFinancialModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSave={(recordData) => {
          if (editingId) {
            updateFinancialRecord(editingId, recordData);
            setEditingId(null);
          } else {
            addFinancialRecord(recordData);
          }
          resetForm();
        }}
        editingRecord={editingId ? filteredRecords.find(r => r.id === editingId) : undefined}
        categories={categories}
        contracts={contracts}
        properties={properties}
        owners={owners}
      />
    </div>
  );
}
