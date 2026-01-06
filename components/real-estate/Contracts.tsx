"use client";

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Search, FileCheck, X, Trash2, Edit, ArrowRight, Calendar, DollarSign, Building, Users, FileText, ShieldCheck, Filter, Minimize2, Phone, UserCheck } from 'lucide-react';
import { useRealEstate } from './RealEstateContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { maskCurrency, maskPhone } from '../../utils/masks';
import { toast } from 'sonner';

export function Contracts() {
  const { contracts, addContract, updateContract, deleteContract, properties, tenants, brokers, owners } = useRealEstate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [ownerCpfFilter, setOwnerCpfFilter] = useState('');
  
  const [formData, setFormData] = useState({
    propertyId: '',
    tenantId: '',
    contractNumber: '',
    contractDate: '',
    startDate: '',
    durationMonths: '',
    rentAmount: '',
    paymentDay: '',
    securityDeposit: '',
    complement: '',
    brokerId: '',
    status: 'Ativo' as 'Ativo' | 'Encerrado',
    guaranteeType: 'none' as 'none' | 'caucao' | 'fiador' | 'seguro' | 'sem_garantia',
    guarantorName: '',
    guarantorPhone: '',
    addendumNumber: '',
    addendumDate: ''
  });

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

  const resetForm = () => {
    setFormData({
      propertyId: '',
      tenantId: '',
      contractNumber: '',
      contractDate: '',
      startDate: '',
      durationMonths: '',
      rentAmount: '',
      paymentDay: '',
      securityDeposit: '',
      complement: '',
      brokerId: '',
      status: 'Ativo',
      guaranteeType: 'none',
      guarantorName: '',
      guarantorPhone: '',
      addendumNumber: '',
      addendumDate: ''
    });
    setEditingId(null);
    setOwnerCpfFilter('');
  };

  const handleEdit = (contract: any) => {
    setEditingId(contract.id);
    setFormData({
      propertyId: contract.propertyId,
      tenantId: contract.tenantId,
      contractNumber: contract.contractNumber || '',
      contractDate: contract.contractDate || '',
      startDate: contract.startDate,
      durationMonths: contract.durationMonths.toString(),
      rentAmount: contract.rentAmount.toString(),
      paymentDay: contract.paymentDay.toString(),
      securityDeposit: contract.securityDeposit?.toString() || '',
      complement: contract.complement || '',
      brokerId: contract.brokerId || '',
      status: contract.status
    });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.propertyId || !formData.tenantId || !formData.startDate || 
        !formData.durationMonths || !formData.rentAmount || !formData.paymentDay) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const contractData = {
      propertyId: formData.propertyId,
      tenantId: formData.tenantId,
      contractNumber: formData.contractNumber,
      contractDate: formData.contractDate,
      startDate: formData.startDate,
      durationMonths: parseInt(formData.durationMonths),
      rentAmount: parseFloat(formData.rentAmount.replace(/\D/g, '').replace(/(\d)(\d{2})$/, '$1.$2')),
      paymentDay: parseInt(formData.paymentDay),
      securityDeposit: formData.securityDeposit ? parseFloat(formData.securityDeposit.replace(/\D/g, '').replace(/(\d)(\d{2})$/, '$1.$2')) : undefined,
      complement: formData.complement,
      brokerId: formData.brokerId && formData.brokerId !== 'none' ? formData.brokerId : undefined,
      status: formData.status
    };

    if (editingId) {
      updateContract(editingId, contractData);
      toast.success('Contrato atualizado com sucesso!');
    } else {
      addContract(contractData);
      toast.success('Contrato criado com sucesso!');
    }

    setOpen(false);
    resetForm();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'all';

  // Filtrar apenas imóveis disponíveis para novos contratos
  const availableProperties = properties.filter(p => {
    // Se estiver editando, mostra todos os imóveis
    if (editingId) return true;
    
    // Senão, só mostra disponíveis
    if (p.status !== 'Disponível') return false;
    
    // Se tiver filtro de CPF do proprietário, aplica
    if (ownerCpfFilter.length > 2) {
      const owner = owners.find(o => o.id === p.ownerId);
      if (!owner) return false;
      
      const cleanFilter = ownerCpfFilter.replace(/\D/g, '');
      const cleanDocument = owner.document.replace(/\D/g, '');
      
      return cleanDocument.includes(cleanFilter);
    }
    
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header da Seção */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-zinc-100">Contratos</h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400">Gerencie os contratos de locação dos imóveis.</p>
        </div>
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Novo Contrato
            </Button>
          </DialogTrigger>
          <DialogContent 
            title="Novo Contrato de Locação"
            showMaximize={true}
            defaultMinimized={true}
            className="max-w-lg"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-zinc-400 -mt-2 mb-4">
                Preencha os detalhes do contrato para vincular imóvel, inquilino e proprietário.
              </p>
              {/* Filtro por Proprietário (Opcional) */}
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <Label className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filtrar Imóveis por Proprietário (Opcional)
                </Label>
                <Input 
                  value={ownerCpfFilter}
                  onChange={(e) => setOwnerCpfFilter(e.target.value)}
                  placeholder="Digite o CPF do proprietário..."
                  className="mt-2 bg-white dark:bg-zinc-800"
                />
                {ownerCpfFilter.length > 2 && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    {availableProperties.length} imóvel(is) encontrado(s)
                  </p>
                )}
              </div>

              {/* Imóvel */}
              <div className="space-y-2">
                <Label htmlFor="propertyId">Imóvel (Todos Disponíveis)</Label>
                <Select 
                  value={formData.propertyId} 
                  onValueChange={(value) => setFormData({...formData, propertyId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o imóvel" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProperties.map(property => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Inquilino e Corretor */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tenantId">Inquilino</Label>
                  <Select 
                    value={formData.tenantId} 
                    onValueChange={(value) => setFormData({...formData, tenantId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o inquilino" />
                    </SelectTrigger>
                    <SelectContent>
                      {tenants.map(tenant => (
                        <SelectItem key={tenant.id} value={tenant.id}>
                          {tenant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brokerId">Corretor Intermediador (Opcional)</Label>
                  <Select 
                    value={formData.brokerId} 
                    onValueChange={(value) => setFormData({...formData, brokerId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sem intermediador" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem intermediador</SelectItem>
                      {brokers.map(broker => (
                        <SelectItem key={broker.id} value={broker.id}>
                          {broker.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Nº do Contrato e Data do Contrato */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contractNumber">Nº do Contrato</Label>
                  <Input 
                    id="contractNumber" 
                    value={formData.contractNumber}
                    onChange={(e) => setFormData({...formData, contractNumber: e.target.value})}
                    placeholder="Ex: LOC-2024-001"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contractDate">Data do Contrato</Label>
                  <Input 
                    id="contractDate" 
                    type="date"
                    value={formData.contractDate}
                    onChange={(e) => setFormData({...formData, contractDate: e.target.value})}
                  />
                </div>
              </div>

              {/* Data de Início */}
              <div className="space-y-2">
                <Label htmlFor="startDate">Data de Início</Label>
                <Input 
                  id="startDate" 
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  placeholder="dd/mm/aaaa"
                />
              </div>

              {/* Duração, Valor do Aluguel e Dia do Vencimento */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="durationMonths">Duração (Meses)</Label>
                  <Input 
                    id="durationMonths" 
                    type="number"
                    min="1"
                    value={formData.durationMonths}
                    onChange={(e) => setFormData({...formData, durationMonths: e.target.value})}
                    placeholder="12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rentAmount">Valor do Aluguel (R$)</Label>
                  <Input 
                    id="rentAmount" 
                    value={formData.rentAmount}
                    onChange={(e) => setFormData({...formData, rentAmount: maskCurrency(e.target.value)})}
                    placeholder="0,00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentDay">Dia do Vencimento</Label>
                  <Input 
                    id="paymentDay" 
                    type="number"
                    min="1"
                    max="31"
                    value={formData.paymentDay}
                    onChange={(e) => setFormData({...formData, paymentDay: e.target.value})}
                    placeholder="5"
                  />
                </div>
              </div>

              {/* Garantia Locatícia */}
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                <Label className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-4 h-4" />
                  Garantia Locatícia
                </Label>
                
                {/* Tipo de Garantia */}
                <div className="space-y-2 mb-4">
                  <Label htmlFor="guaranteeType" className="text-sm">Tipo de Garantia</Label>
                  <Select 
                    value={formData.guaranteeType} 
                    onValueChange={(value: any) => setFormData({...formData, guaranteeType: value, guarantorName: '', guarantorPhone: ''})}
                  >
                    <SelectTrigger className="bg-white dark:bg-zinc-800">
                      <SelectValue placeholder="Selecione o tipo de garantia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Selecione...</SelectItem>
                      <SelectItem value="caucao">Caução</SelectItem>
                      <SelectItem value="fiador">Fiador</SelectItem>
                      <SelectItem value="seguro">Seguro</SelectItem>
                      <SelectItem value="sem_garantia">Sem Garantia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Campos condicionais baseados no tipo de garantia */}
                {formData.guaranteeType === 'caucao' && (
                  <div className="space-y-2">
                    <Label htmlFor="securityDeposit" className="text-sm">Valor da Caução (R$)</Label>
                    <Input 
                      id="securityDeposit" 
                      value={formData.securityDeposit}
                      onChange={(e) => setFormData({...formData, securityDeposit: maskCurrency(e.target.value)})}
                      placeholder="0,00"
                      className="bg-white dark:bg-zinc-800"
                    />
                  </div>
                )}

                {formData.guaranteeType === 'fiador' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="guarantorName" className="text-sm flex items-center gap-2">
                        <UserCheck className="w-4 h-4" />
                        Nome Completo do Fiador
                      </Label>
                      <Input 
                        id="guarantorName" 
                        value={formData.guarantorName}
                        onChange={(e) => setFormData({...formData, guarantorName: e.target.value})}
                        placeholder="Nome completo do fiador"
                        className="bg-white dark:bg-zinc-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guarantorPhone" className="text-sm flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Telefone do Fiador
                      </Label>
                      <Input 
                        id="guarantorPhone" 
                        value={formData.guarantorPhone}
                        onChange={(e) => setFormData({...formData, guarantorPhone: maskPhone(e.target.value)})}
                        placeholder="(11) 99999-9999"
                        className="bg-white dark:bg-zinc-800"
                      />
                    </div>
                  </div>
                )}

                {formData.guaranteeType === 'seguro' && (
                  <div className="space-y-2">
                    <Label htmlFor="complement" className="text-sm">Seguradora / Detalhes</Label>
                    <Input 
                      id="complement" 
                      value={formData.complement}
                      onChange={(e) => setFormData({...formData, complement: e.target.value})}
                      placeholder="Ex: Porto Seguro, Tokio Marine..."
                      className="bg-white dark:bg-zinc-800"
                    />
                  </div>
                )}
              </div>

              {/* Seção de Aditivo */}
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <Label className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4" />
                  Aditivo
                </Label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="addendumNumber" className="text-sm">Número Aditivo ADM</Label>
                    <Input 
                      id="addendumNumber" 
                      value={formData.addendumNumber}
                      onChange={(e) => setFormData({...formData, addendumNumber: e.target.value})}
                      placeholder="Ex: ADM-2024-001"
                      className="bg-white dark:bg-zinc-800"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addendumDate" className="text-sm">Data Aditivo</Label>
                    <Input 
                      id="addendumDate" 
                      type="date"
                      value={formData.addendumDate}
                      onChange={(e) => setFormData({...formData, addendumDate: e.target.value})}
                      className="bg-white dark:bg-zinc-800"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2 mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Fazer Contrato
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
                <TableHead className="text-center">Ações</TableHead>
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
