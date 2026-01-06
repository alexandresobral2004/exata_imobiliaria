"use client";

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Plus, Search, User, Phone, Mail, FileText, Briefcase, Trash2, Edit, MapPin, CreditCard, Building, Filter, X, HelpCircle, Home } from 'lucide-react';
import { toast } from 'sonner';
import { formatCPF, formatPhone, formatCEP, isValidCPF, isValidCNPJ } from '../../utils/formatters';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useRealEstate, Owner } from './RealEstateContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

// Função para formatar CPF ou CNPJ dinamicamente
const formatDocument = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  
  if (cleaned.length <= 11) {
    // Formata como CPF
    return cleaned
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  } else {
    // Formata como CNPJ
    return cleaned
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
};

// Função para validar CPF ou CNPJ
const isValidDocument = (document: string): boolean => {
  const cleaned = document.replace(/\D/g, '');
  return cleaned.length === 11 ? isValidCPF(document) : 
         cleaned.length === 14 ? isValidCNPJ(document) : 
         false;
};

// Função para buscar dados do CEP
const fetchCEPData = async (cep: string, setFormData: (data: any) => void, setIsLoading: (loading: boolean) => void) => {
  const cleanCEP = cep.replace(/\D/g, '');
  
  // Só busca se tiver 8 dígitos
  if (cleanCEP.length !== 8) {
    return;
  }

  setIsLoading(true);
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      toast.error('CEP não encontrado. Verifique o CEP digitado.');
      return;
    }

    // Preenche automaticamente os campos do endereço
    setFormData((prev: any) => ({
      ...prev,
      address: {
        ...prev.address,
        street: data.logradouro || '',
        neighborhood: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || ''
      }
    }));

    toast.success('Endereço preenchido automaticamente!');
    
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    toast.error('Erro ao buscar dados do CEP. Tente novamente.');
  } finally {
    setIsLoading(false);
  }
};

export function Owners() {
  const { owners, addOwner, updateOwner, deleteOwner, setActiveTab } = useRealEstate();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoadingCEP, setIsLoadingCEP] = useState(false);
  
  // Initial Form State
  const initialFormState: Omit<Owner, 'id'> = {
    name: '',
    document: '', // CPF ou CNPJ
    email: '',
    phone: '',
    commercialPhone: '',
    profession: '',
    num_contrato_adm: '',
    commission_rate: 0,
    admContractAddendum: '',
    admContractAddendumDate: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    },
    bankAccount: {
      bankName: '',
      accountType: 'Corrente',
      agency: '',
      accountNumber: '',
      pixKey: ''
    }
  };

  const [formData, setFormData] = useState(initialFormState);
  const [search, setSearch] = useState('');
  const [searchContract, setSearchContract] = useState('');
  const [searchAddendum, setSearchAddendum] = useState('');

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!formData.name || !formData.document) return;
    
    // Ensure numbers are numbers
    const ownerData = {
      ...formData,
      commission_rate: Number(formData.commission_rate)
    };

    if (editingId) {
      updateOwner(editingId, ownerData);
      toast.success('Cliente atualizado com sucesso!');
    } else {
      addOwner(ownerData);
      toast.success('Cliente cadastrado com sucesso!');
    }

    resetForm();
    setOpen(false);
  };

  const handleEdit = (owner: Owner) => {
    setEditingId(owner.id);
    setFormData({
      name: owner.name,
      document: owner.document,
      email: owner.email,
      phone: owner.phone,
      commercialPhone: owner.commercialPhone || '',
      profession: owner.profession || '',
      num_contrato_adm: owner.num_contrato_adm || '',
      commission_rate: owner.commission_rate || 0,
      admContractAddendum: owner.admContractAddendum || '',
      admContractAddendumDate: owner.admContractAddendumDate ? owner.admContractAddendumDate.split('T')[0] : '',
      address: {
        street: owner.address?.street || '',
        number: owner.address?.number || '',
        complement: owner.address?.complement || '',
        neighborhood: owner.address?.neighborhood || '',
        city: owner.address?.city || '',
        state: owner.address?.state || '',
        zipCode: owner.address?.zipCode || ''
      },
      bankAccount: {
        bankName: owner.bankAccount?.bankName || '',
        accountType: owner.bankAccount?.accountType || 'Corrente',
        agency: owner.bankAccount?.agency || '',
        accountNumber: owner.bankAccount?.accountNumber || '',
        pixKey: owner.bankAccount?.pixKey || ''
      }
    });
    setOpen(true);
  };

  const filteredOwners = owners.filter(o => {
    const matchesNameOrDocument = o.name.toLowerCase().includes(search.toLowerCase()) || o.document.includes(search);
    const matchesContract = searchContract ? o.num_contrato_adm?.toLowerCase().includes(searchContract.toLowerCase()) : true;
    const matchesAddendum = searchAddendum ? o.admContractAddendum?.toLowerCase().includes(searchAddendum.toLowerCase()) : true;

    return matchesNameOrDocument && matchesContract && matchesAddendum;
  }).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-4">
      {/* Header da Seção */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-zinc-100">Clientes</h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400">Gerencie a base de clientes proprietários de imóveis.</p>
        </div>
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent 
            className="max-w-2xl max-h-[80vh] overflow-y-auto dark:bg-zinc-900 dark:border-zinc-800"
            title={editingId ? 'Editar Cliente' : 'Cadastrar Cliente'}
          >
            <DialogDescription className="dark:text-zinc-400">
              Preencha as informações do cliente organizadas por categoria.
            </DialogDescription>
            
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-zinc-800 p-1 gap-1">
                <TabsTrigger 
                  value="personal" 
                  className="data-[state=active]:bg-white data-[state=active]:text-green-600 dark:data-[state=active]:bg-zinc-700 dark:data-[state=active]:text-green-400 dark:text-zinc-400 dark:data-[state=active]:shadow-sm"
                >
                  Pessoal
                </TabsTrigger>
                <TabsTrigger 
                  value="address" 
                  className="data-[state=active]:bg-white data-[state=active]:text-green-600 dark:data-[state=active]:bg-zinc-700 dark:data-[state=active]:text-green-400 dark:text-zinc-400 dark:data-[state=active]:shadow-sm"
                >
                  Endereço
                </TabsTrigger>
                <TabsTrigger 
                  value="financial" 
                  className="data-[state=active]:bg-white data-[state=active]:text-green-600 dark:data-[state=active]:bg-zinc-700 dark:data-[state=active]:text-green-400 dark:text-zinc-400 dark:data-[state=active]:shadow-sm"
                >
                  Financeiro
                </TabsTrigger>
                <TabsTrigger 
                  value="admin" 
                  className="data-[state=active]:bg-white data-[state=active]:text-green-600 dark:data-[state=active]:bg-zinc-700 dark:data-[state=active]:text-green-400 dark:text-zinc-400 dark:data-[state=active]:shadow-sm"
                >
                  Adm
                </TabsTrigger>
              </TabsList>

              {/* DADOS PESSOAIS */}
              <TabsContent value="personal" className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="name" className="dark:text-zinc-300">Nome Completo *</Label>
                    <Input 
                      id="name" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ex: João da Silva"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="document" className="dark:text-zinc-300">CPF/CNPJ *</Label>
                    <Input 
                      id="document" 
                      value={formData.document}
                      onChange={(e) => setFormData({...formData, document: formatDocument(e.target.value)})}
                      placeholder="000.000.000-00 ou 00.000.000/0000-00"
                      maxLength={18}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="dark:text-zinc-300">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="joao@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="dark:text-zinc-300">Telefone Celular</Label>
                    <Input 
                      id="phone" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: formatPhone(e.target.value)})}
                      placeholder="(11) 99999-9999"
                      maxLength={15}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commercialPhone" className="dark:text-zinc-300">Telefone Comercial</Label>
                    <Input 
                      id="commercialPhone" 
                      value={formData.commercialPhone}
                      onChange={(e) => setFormData({...formData, commercialPhone: formatPhone(e.target.value)})}
                      placeholder="(11) 3333-3333"
                      maxLength={15}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="profession" className="dark:text-zinc-300">Profissão</Label>
                    <Input 
                      id="profession" 
                      value={formData.profession}
                      onChange={(e) => setFormData({...formData, profession: e.target.value})}
                      placeholder="Ex: Advogado"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* ENDEREÇO */}
              <TabsContent value="address" className="space-y-4 py-4">
                 <div className="grid grid-cols-6 gap-4">
                    <div className="col-span-2 space-y-2">
                       <Label htmlFor="zipCode" className="dark:text-zinc-300">
                         CEP {isLoadingCEP && <span className="text-blue-500">(Buscando...)</span>}
                       </Label>
                       <Input 
                        id="zipCode" 
                        value={formData.address?.zipCode}
                        onChange={(e) => {
                          const formattedCEP = formatCEP(e.target.value);
                          setFormData({
                            ...formData, 
                            address: { ...formData.address!, zipCode: formattedCEP }
                          });
                          
                          // Busca automática quando CEP estiver completo
                          const cleanCEP = formattedCEP.replace(/\D/g, '');
                          if (cleanCEP.length === 8) {
                            fetchCEPData(formattedCEP, setFormData, setIsLoadingCEP);
                          }
                        }}
                        placeholder="00000-000"
                        maxLength={9}
                       />
                    </div>
                    <div className="col-span-4 space-y-2">
                       <Label htmlFor="street" className="dark:text-zinc-300">Rua/Logradouro</Label>
                       <Input 
                        id="street" 
                        value={formData.address?.street}
                        onChange={(e) => setFormData({
                          ...formData, 
                          address: { ...formData.address!, street: e.target.value }
                        })}
                        placeholder="Rua das Flores"
                       />
                    </div>
                    <div className="col-span-2 space-y-2">
                       <Label htmlFor="number" className="dark:text-zinc-300">Número</Label>
                       <Input 
                        id="number" 
                        value={formData.address?.number}
                        onChange={(e) => setFormData({
                          ...formData, 
                          address: { ...formData.address!, number: e.target.value }
                        })}
                        placeholder="123"
                       />
                    </div>
                    <div className="col-span-4 space-y-2">
                       <Label htmlFor="complement" className="dark:text-zinc-300">Complemento</Label>
                       <Input 
                        id="complement" 
                        value={formData.address?.complement}
                        onChange={(e) => setFormData({
                          ...formData, 
                          address: { ...formData.address!, complement: e.target.value }
                        })}
                        placeholder="Apto 101"
                       />
                    </div>
                    <div className="col-span-3 space-y-2">
                       <Label htmlFor="neighborhood" className="dark:text-zinc-300">Bairro</Label>
                       <Input 
                        id="neighborhood" 
                        value={formData.address?.neighborhood}
                        onChange={(e) => setFormData({
                          ...formData, 
                          address: { ...formData.address!, neighborhood: e.target.value }
                        })}
                        placeholder="Centro"
                       />
                    </div>
                    <div className="col-span-2 space-y-2">
                       <Label htmlFor="city" className="dark:text-zinc-300">Cidade</Label>
                       <Input 
                        id="city" 
                        value={formData.address?.city}
                        onChange={(e) => setFormData({
                          ...formData, 
                          address: { ...formData.address!, city: e.target.value }
                        })}
                        placeholder="São Paulo"
                       />
                    </div>
                    <div className="col-span-1 space-y-2">
                       <Label htmlFor="state" className="dark:text-zinc-300">UF</Label>
                       <Input 
                        id="state" 
                        value={formData.address?.state}
                        onChange={(e) => setFormData({
                          ...formData, 
                          address: { ...formData.address!, state: e.target.value }
                        })}
                        placeholder="SP"
                        maxLength={2}
                       />
                    </div>
                 </div>
              </TabsContent>

              {/* DADOS BANCÁRIOS */}
              <TabsContent value="financial" className="space-y-4 py-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label htmlFor="bankName" className="dark:text-zinc-300">Banco</Label>
                       <Input 
                        id="bankName" 
                        value={formData.bankAccount?.bankName}
                        onChange={(e) => setFormData({
                          ...formData, 
                          bankAccount: { ...formData.bankAccount!, bankName: e.target.value }
                        })}
                        placeholder="Ex: Itaú"
                       />
                    </div>
                    <div className="space-y-2">
                       <Label htmlFor="accountType" className="dark:text-zinc-300">Tipo de Conta</Label>
                       <Select 
                          value={formData.bankAccount?.accountType} 
                          onValueChange={(val: any) => setFormData({
                             ...formData, 
                             bankAccount: { ...formData.bankAccount!, accountType: val }
                          })}
                       >
                         <SelectTrigger>
                           <SelectValue placeholder="Selecione" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="Corrente" className="dark:text-zinc-200 dark:focus:bg-zinc-700">Corrente</SelectItem>
                           <SelectItem value="Poupança" className="dark:text-zinc-200 dark:focus:bg-zinc-700">Poupança</SelectItem>
                         </SelectContent>
                       </Select>
                    </div>
                    <div className="space-y-2">
                       <Label htmlFor="agency" className="dark:text-zinc-300">Agência</Label>
                       <Input 
                        id="agency" 
                        value={formData.bankAccount?.agency}
                        onChange={(e) => setFormData({
                          ...formData, 
                          bankAccount: { ...formData.bankAccount!, agency: e.target.value }
                        })}
                        placeholder="0000"
                       />
                    </div>
                    <div className="space-y-2">
                       <Label htmlFor="accountNumber" className="dark:text-zinc-300">Conta</Label>
                       <Input 
                        id="accountNumber" 
                        value={formData.bankAccount?.accountNumber}
                        onChange={(e) => setFormData({
                          ...formData, 
                          bankAccount: { ...formData.bankAccount!, accountNumber: e.target.value }
                        })}
                        placeholder="00000-0"
                       />
                    </div>
                    <div className="col-span-2 space-y-2">
                       <Label htmlFor="pixKey" className="dark:text-zinc-300">Chave PIX</Label>
                       <Input 
                        id="pixKey" 
                        value={formData.bankAccount?.pixKey}
                        onChange={(e) => setFormData({
                          ...formData, 
                          bankAccount: { ...formData.bankAccount!, pixKey: e.target.value }
                        })}
                        placeholder="CPF, Email, Telefone ou Aleatória"
                       />
                    </div>
                 </div>
              </TabsContent>

              {/* ADMINISTRATIVO */}
              <TabsContent value="admin" className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contract_adm" className="dark:text-zinc-300">Nº Contrato Adm.</Label>
                      <Input 
                        id="contract_adm" 
                        value={formData.num_contrato_adm}
                        onChange={(e) => setFormData({...formData, num_contrato_adm: e.target.value})}
                        placeholder="ADM-2024-000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="commission" className="dark:text-zinc-300">Taxa de Adm. (%)</Label>
                      <Input 
                        id="commission" 
                        type="number"
                        value={formData.commission_rate}
                        onChange={(e) => setFormData({...formData, commission_rate: Number(e.target.value)})}
                        placeholder="10"
                      />
                    </div>
                    <div className="col-span-2 border-t border-gray-100 dark:border-zinc-700 pt-4 mt-2">
                        <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-zinc-300">Aditivo Admin</h4>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="admContractAddendum" className="flex items-center gap-2 dark:text-zinc-300">
                            Num Aditivo Admin
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <HelpCircle className="w-3 h-3 text-gray-400 dark:text-zinc-500" />
                                    </TooltipTrigger>
                                    <TooltipContent className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200">
                                        <p className="max-w-xs">Use este campo para registrar o número/identificador do aditivo administrativo.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </Label>
                        <Input 
                            id="admContractAddendum" 
                            value={formData.admContractAddendum}
                            onChange={(e) => setFormData({...formData, admContractAddendum: e.target.value})}
                            placeholder="Ex: ADT-2024-001"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="admContractAddendumDate" className="dark:text-zinc-300">Data Aditivo</Label>
                        <Input 
                            id="admContractAddendumDate" 
                            type="date"
                            value={formData.admContractAddendumDate}
                            onChange={(e) => setFormData({...formData, admContractAddendumDate: e.target.value})}
                        />
                    </div>
                  </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)} className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-700">Cancelar</Button>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-600 dark:hover:bg-green-700 dark:text-white">Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Card da Lista */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
        {/* Header do Card */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800">
          <h3 className="text-base font-semibold text-gray-900 dark:text-zinc-100">Lista de Clientes</h3>
        </div>
        
        {/* Filtros */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
              <Input 
                placeholder="Buscar por nome ou CPF..." 
                className="pl-9 h-10 bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-44">
              <Input 
                placeholder="Nº Contrato Adm" 
                value={searchContract}
                onChange={(e) => setSearchContract(e.target.value)}
                className="h-10 bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
              />
            </div>
            <div className="w-44">
              <Input 
                placeholder="Nº Aditivo" 
                value={searchAddendum}
                onChange={(e) => setSearchAddendum(e.target.value)}
                className="h-10 bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
              />
            </div>
            {(search || searchContract || searchAddendum) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSearch('');
                  setSearchContract('');
                  setSearchAddendum('');
                }}
                className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <X className="w-4 h-4 mr-1" /> Limpar
              </Button>
            )}
          </div>
        </div>

        {/* Tabela */}
        <Table>
          <TableHeader>
            <TableRow>
          <TableHead>Nome/Profissão</TableHead>
          <TableHead>CPF</TableHead>
          <TableHead>Dados Contratuais</TableHead>
          <TableHead>Dados Aditivo</TableHead>
          <TableHead>Contato</TableHead>
          <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
            <TableBody>
              {filteredOwners.map((owner) => (
                <TableRow key={owner.id} className="border-b border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/30">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 dark:text-green-400 font-medium text-sm shrink-0">
                        {owner.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-zinc-100">{owner.name}</span>
                        {owner.profession && (
                          <span className="text-xs text-gray-500 dark:text-zinc-500">{owner.profession}</span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-sm text-gray-600 dark:text-zinc-400">{owner.document}</span>
                  </TableCell>
                  <TableCell className="py-4">
                    {owner.num_contrato_adm ? (
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-700 dark:text-zinc-300">{owner.num_contrato_adm}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 dark:text-zinc-600">-</span>
                    )}
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-sm text-gray-400 dark:text-zinc-600">-</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-400">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{owner.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-400">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{owner.phone}</span>
                      </div>
                      {owner.commercialPhone && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-500">
                          <Building className="w-3 h-3 text-gray-400" />
                          <span>{owner.commercialPhone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                        onClick={() => handleEdit(owner)}
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                        onClick={() => {
                            setActiveTab('properties');
                            toast.info(`Filtrando imóveis de ${owner.name.split(' ')[0]}...`);
                        }}
                        title="Ver Imóveis"
                      >
                        <Home className="w-4 h-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20" 
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent 
            className="dark:bg-zinc-900 dark:border-zinc-800"
            title="Excluir Cliente"
          >
                            <AlertDialogDescription className="dark:text-zinc-400">
                              Tem certeza que deseja excluir <b>{owner.name}</b>? 
                              <br/>
                              <span className="text-red-600 dark:text-red-400 mt-2 block text-xs">
                                Atenção: Isso não excluirá os imóveis automaticamente, mas removerá o vínculo.
                              </span>
                            </AlertDialogDescription>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-700">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => {
                              deleteOwner(owner.id);
                              toast.success('Cliente removido com sucesso!');
                            }} className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700">
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredOwners.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-gray-500 dark:text-zinc-500">
                    <div className="flex flex-col items-center gap-2">
                      <User className="w-8 h-8 text-gray-300" />
                      <span>Nenhum cliente encontrado.</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
      </div>
    </div>
  );
}
