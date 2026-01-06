"use client";

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Plus, Search, FileCheck, X, Trash2, Edit, ArrowRight } from 'lucide-react';
import { useRealEstate } from './RealEstateContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

export function Contracts() {
  const { contracts, deleteContract, properties, tenants } = useRealEstate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredContracts = contracts.filter(contract => {
    const property = properties.find(p => p.id === contract.propertyId);
    const tenant = tenants.find(t => t.id === contract.tenantId);
    
    const matchesSearch = 
      property?.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contractNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getProperty = (id: string) => properties.find(p => p.id === id);
  const getTenant = (id: string) => tenants.find(t => t.id === id);
  const getPropertyAddress = (id: string) => getProperty(id)?.address || 'Desconhecido';
  const getTenantName = (id: string) => getTenant(id)?.name || 'Desconhecido';

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleEdit = (contract: any) => {
    console.log('Edit contract:', contract);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'all';

  return (
    <div className="space-y-4">
      <Card className="border-gray-200 dark:border-zinc-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-zinc-100">
            <FileCheck className="w-5 h-5" />
            Contratos Ativos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="text-sm font-medium text-gray-700 dark:text-zinc-300">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Buscar por imóvel, inquilino ou número do contrato..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="sm:w-48">
                <Label htmlFor="status" className="text-sm font-medium text-gray-700 dark:text-zinc-300">Status</Label>
                <select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100"
                >
                  <option value="all">Todos</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Encerrado">Encerrado</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
            </div>
            
            {hasActiveFilters && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-zinc-400">
                  {filteredContracts.length} contrato(s) encontrado(s)
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  <X className="w-4 h-4 mr-1" /> Limpar
                </Button>
              </div>
            )}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imóvel</TableHead>
                <TableHead>Inquilino</TableHead>
                <TableHead>Datas</TableHead>
                <TableHead>Garantia</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
              <TableBody>
                {filteredContracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 dark:text-zinc-100">{getPropertyAddress(contract.propertyId)}</span>
                          {contract.contractNumber && (
                             <span className="text-xs text-gray-500 dark:text-zinc-500 font-mono">{contract.contractNumber}</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getTenantName(contract.tenantId)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm text-gray-500 dark:text-zinc-400">
                        <span>Contrato: {contract.contractDate ? new Date(contract.contractDate).toLocaleDateString() : 'Não informada'}</span>
                        <span>Início: {new Date(contract.startDate).toLocaleDateString()}</span>
                        <span>{contract.durationMonths} meses</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        {contract.securityDeposit ? (
                          <span className="font-medium text-gray-700 dark:text-zinc-300">{formatCurrency(contract.securityDeposit)}</span>
                        ) : (
                          <span className="text-gray-400 dark:text-zinc-600">-</span>
                        )}
                        {contract.complement && (
                           <span className="text-xs text-gray-500 dark:text-zinc-500 truncate max-w-[120px]" title={contract.complement}>
                             {contract.complement}
                           </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-green-700 dark:text-green-400">{formatCurrency(contract.rentAmount || 0)}</span>
                    </TableCell>
                    <TableCell>
                       <Badge className={
                         contract.status === 'Ativo' ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400" :
                         "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
                       }>
                         {contract.status}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                          onClick={() => handleEdit(contract)}
                          title="Editar Contrato"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                          title="Ver Financeiro"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20" title="Excluir">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="dark:bg-zinc-900 dark:border-zinc-800">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir Contrato</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir este contrato? 
                                <br />
                                <span className="text-xs text-gray-500 mt-1 block">
                                  O imóvel vinculado ficará "Disponível" novamente.
                                </span>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteContract(contract.id)} className="bg-red-600 hover:bg-red-700">
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredContracts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-gray-500 dark:text-zinc-400">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                          <FileCheck className="w-6 h-6 text-gray-400 dark:text-zinc-500" />
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-gray-900 dark:text-zinc-100">Nenhum contrato encontrado</p>
                          <p className="text-sm text-gray-400 dark:text-zinc-500 mt-1">Tente ajustar os filtros ou adicione um novo contrato.</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
