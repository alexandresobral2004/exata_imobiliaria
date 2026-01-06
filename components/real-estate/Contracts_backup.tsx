"use client";

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { TableWrapper } from '../ui/table-wrapper';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Search, MapPin, Building, DollarSign, Home, Filter, Calendar, X, Trash2, Edit, User, ShieldCheck, Banknote, FileText } from 'lucide-react';
import { useRealEstate } from './RealEstateContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { maskCurrency } from '../../utils/masks';
import { formatCEP } from '../../utils/formatters';
import { toast } from 'sonner';

// Função para obter variante do Badge baseado no status
const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
  switch (status) {
    case 'Disponível':
      return 'secondary';
    case 'Alugado':
    case 'Ocupado':
      return 'outline';
    case 'Ativo':
      return 'default';
    case 'Encerrado':
    case 'Inativo':
      return 'destructive';
    default:
      return 'secondary';
  }
};

// Função para buscar dados do CEP
const fetchCEPData = async (cep: string, setPropertyData: (data: any) => void, setIsLoading: (loading: boolean) => void) => {
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
    setPropertyData((prev: any) => ({
      ...prev,
      street: data.logradouro || '',
      neighborhood: data.bairro || '',
      city: data.localidade || '',
      state: data.uf || ''
    }));

    toast.success('Endereço preenchido automaticamente!');
    
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    toast.error('Erro ao buscar dados do CEP. Tente novamente.');
  } finally {
    setIsLoading(false);
  }
};

export function Properties() {
  const { properties, owners, contracts, tenants, addProperty, deleteProperty } = useRealEstate();
  const [open, setOpen] = useState(false);
  const [isLoadingCEP, setIsLoadingCEP] = useState(false);
  const [newProperty, setNewProperty] = useState({ 
    ownerId: '', 
    address: '', 
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    type: 'Apartamento', 
    value: '',
    iptu: '',
    pmsControlNumber: ''
  });
  
  // Owner Search
  const [searchOwnerCpf, setSearchOwnerCpf] = useState('');
  const [foundOwner, setFoundOwner] = useState<{id: string, name: string} | null>(null);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchOwnerCpf(value);

    // Busca automática se tiver pelo menos 3 caracteres
    if (value.length > 2) {
      // Limpa pontuação para comparação flexível
      const cleanValue = value.replace(/\D/g, '');
      
      const owner = owners.find(o => {
        const cleanDocument = o.document.replace(/\D/g, '');
        return o.document.includes(value) || (cleanValue.length > 0 && cleanDocument.includes(cleanValue));
      });

      if (owner) {
          setFoundOwner({ id: owner.id, name: owner.name });
          setNewProperty(prev => ({ ...prev, ownerId: owner.id }));
      } else {
          setFoundOwner(null);
          // Se não encontrar, limpa a seleção para evitar inconsistência
          setNewProperty(prev => ({ ...prev, ownerId: '' }));
      }
    } else {
        setFoundOwner(null);
    }
  };

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [dateFilterStart, setDateFilterStart] = useState('');
  const [dateFilterEnd, setDateFilterEnd] = useState('');

  const handleAdd = () => {
    if (!newProperty.address || !newProperty.ownerId) return;

    // Converte string formatada (1.234,56) para number (1234.56)
    const value = newProperty.value ? Number(newProperty.value.replace(/\D/g, '')) / 100 : 0;
    const iptu = newProperty.iptu ? Number(newProperty.iptu.replace(/\D/g, '')) / 100 : undefined;

    addProperty({
      ...newProperty,
      value: value,
      iptu: iptu,
      pmsControlNumber: newProperty.pmsControlNumber || undefined
    });
    setNewProperty({ 
      ownerId: '', 
      address: '', 
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
      type: 'Apartamento', 
      value: '',
      iptu: '',
      pmsControlNumber: ''
    });
    setSearchOwnerCpf('');
    setFoundOwner(null);
    setOpen(false);
  };

  const getOwnerName = (id: string) => {
    return owners.find(o => o.id === id)?.name || 'Desconhecido';
  };

  const getActiveContractInfo = (propertyId: string) => {
    // Find active contract for this property
    const contract = contracts.find(c => c.propertyId === propertyId && c.status === 'Ativo');
    if (!contract) return null;

    const tenant = tenants.find(t => t.id === contract.tenantId);

    const start = new Date(contract.startDate);
    const end = new Date(start);
    end.setMonth(start.getMonth() + contract.durationMonths);

    return {
      contract,
      tenant,
      periodText: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
      start,
      end
    };
  };

  const filteredProperties = properties.filter(p => {
    // Search by address
    if (search && !p.address.toLowerCase().includes(search.toLowerCase())) return false;

    // Filter by Status
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;

    // Filter by Owner
    if (ownerFilter !== 'all' && p.ownerId !== ownerFilter) return false;

    // Filter by Period
    // If a period is selected, we only show rented properties that intersect with this period
    if (dateFilterStart || dateFilterEnd) {
      if (p.status !== 'Alugado') return false; // Only rented properties have periods
      
      const info = getActiveContractInfo(p.id);
      if (!info) return false; 

      const filterStart = dateFilterStart ? new Date(dateFilterStart) : new Date('1900-01-01');
      const filterEnd = dateFilterEnd ? new Date(dateFilterEnd) : new Date('2100-01-01');

      // Check intersection: (StartA <= EndB) and (EndA >= StartB)
      const isIntersecting = info.start <= filterEnd && info.end >= filterStart;
      if (!isIntersecting) return false;
    }

    return true;
  }).sort((a, b) => a.address.localeCompare(b.address));

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setOwnerFilter('all');
    setDateFilterStart('');
    setDateFilterEnd('');
  };

  const hasFilters = search || statusFilter !== 'all' || ownerFilter !== 'all' || dateFilterStart || dateFilterEnd;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-zinc-100">Imóveis</h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400">Gerencie o portfólio de imóveis disponíveis e alugados.</p>
        </div>
        <Dialog open={open} onOpenChange={(val) => { 
           setOpen(val); 
           if (!val) {
             setNewProperty({ 
      ownerId: '', 
      address: '', 
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
      type: 'Apartamento', 
      value: '',
      iptu: '',
      pmsControlNumber: ''
    });
             setSearchOwnerCpf('');
             setFoundOwner(null);
           }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Novo Imóvel
            </Button>
          </DialogTrigger>
          <DialogContent 
            className="max-w-2xl max-h-[80vh] overflow-y-auto"
            title="Cadastrar Imóvel"
          >
            <DialogDescription>
              Informe os detalhes do imóvel para adicioná-lo ao sistema.
            </DialogDescription>
            <div className="space-y-4 py-4">
              
              {/* Owner Search */}
              <div className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <Label htmlFor="searchCpf">Buscar Cliente (CPF)</Label>
                  <div className="flex gap-2">
                      <Input 
                        id="searchCpf" 
                        placeholder="Digite o CPF para buscar..." 
                        value={searchOwnerCpf}
                        onChange={handleCpfChange}
                      />
                  </div>
                  {foundOwner && (
                      <div className="text-sm text-green-700 font-medium mt-1 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          Cliente selecionado: {foundOwner.name}
                      </div>
                  )}
                  {!foundOwner && searchOwnerCpf.length > 3 && (
                       <p className="text-xs text-gray-500">Nenhum cliente encontrado.</p>
                  )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner">Cliente</Label>
                <Select 
                  value={newProperty.ownerId} 
                  onValueChange={(value) => setNewProperty({...newProperty, ownerId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {owners.map(owner => (
                      <SelectItem key={owner.id} value={owner.id}>{owner.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* ENDEREÇO */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Endereço do Imóvel
                </h3>
                
                <div className="grid grid-cols-6 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="zipCode" className="dark:text-zinc-300">
                      CEP {isLoadingCEP && <span className="text-blue-500">(Buscando...)</span>}
                    </Label>
                    <Input 
                      id="zipCode" 
                      value={newProperty.zipCode}
                      onChange={(e) => {
                        const formattedCEP = formatCEP(e.target.value);
                        setNewProperty({
                          ...newProperty, 
                          zipCode: formattedCEP
                        });
                        
                        // Busca automática quando CEP estiver completo
                        const cleanCEP = formattedCEP.replace(/\D/g, '');
                        if (cleanCEP.length === 8) {
                          fetchCEPData(formattedCEP, setNewProperty, setIsLoadingCEP);
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
                      value={newProperty.street}
                      onChange={(e) => setNewProperty({...newProperty, street: e.target.value})}
                      placeholder="Rua das Flores"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="number" className="dark:text-zinc-300">Número</Label>
                    <Input 
                      id="number" 
                      value={newProperty.number}
                      onChange={(e) => setNewProperty({...newProperty, number: e.target.value})}
                      placeholder="123"
                    />
                  </div>
                  <div className="col-span-4 space-y-2">
                    <Label htmlFor="complement" className="dark:text-zinc-300">Complemento</Label>
                    <Input 
                      id="complement" 
                      value={newProperty.complement}
                      onChange={(e) => setNewProperty({...newProperty, complement: e.target.value})}
                      placeholder="Apto 101"
                    />
                  </div>
                  <div className="col-span-3 space-y-2">
                    <Label htmlFor="neighborhood" className="dark:text-zinc-300">Bairro</Label>
                    <Input 
                      id="neighborhood" 
                      value={newProperty.neighborhood}
                      onChange={(e) => setNewProperty({...newProperty, neighborhood: e.target.value})}
                      placeholder="Centro"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="city" className="dark:text-zinc-300">Cidade</Label>
                    <Input 
                      id="city" 
                      value={newProperty.city}
                      onChange={(e) => setNewProperty({...newProperty, city: e.target.value})}
                      placeholder="São Paulo"
                    />
                  </div>
                  <div className="col-span-1 space-y-2">
                    <Label htmlFor="state" className="dark:text-zinc-300">UF</Label>
                    <Input 
                      id="state" 
                      value={newProperty.state}
                      onChange={(e) => setNewProperty({...newProperty, state: e.target.value.toUpperCase()})}
                      placeholder="SP"
                      maxLength={2}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select 
                  value={newProperty.type} 
                  onValueChange={(value) => setNewProperty({...newProperty, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Apartamento">Apartamento</SelectItem>
                    <SelectItem value="Casa">Casa</SelectItem>
                    <SelectItem value="Comercial">Comercial</SelectItem>
                    <SelectItem value="Terreno">Terreno</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="value">Valor Avaliação (R$)</Label>
                    <Input 
                    id="value" 
                    value={newProperty.value}
                    onChange={(e) => setNewProperty({...newProperty, value: maskCurrency(e.target.value)})}
                    placeholder="0,00"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="iptu">Valor IPTU (R$)</Label>
                    <Input 
                    id="iptu" 
                    value={newProperty.iptu}
                    onChange={(e) => setNewProperty({...newProperty, iptu: maskCurrency(e.target.value)})}
                    placeholder="0,00"
                    />
                </div>
                <div className="col-span-1 sm:col-span-2 space-y-2">
                    <Label htmlFor="pmsControlNumber">Nº Controle PMS</Label>
                    <Input 
                    id="pmsControlNumber" 
                    value={newProperty.pmsControlNumber || ''}
                    onChange={(e) => setNewProperty({...newProperty, pmsControlNumber: e.target.value})}
                    placeholder="Ex: 12345/2024"
                    />
                </div>
              </div>

            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700 text-white">Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3 space-y-4">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
               <Filter className="w-5 h-5 text-gray-500" />
               <h3 className="text-base font-medium">Filtros</h3>
               {hasFilters && (
                 <Button variant="ghost" size="sm" onClick={clearFilters} className="text-sm text-red-600 h-8 px-2 hover:bg-red-50">
                   <X className="w-3 h-3 mr-1" />
                   Limpar
                 </Button>
               )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:flex xl:flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative w-full sm:w-[200px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Buscar endereço..." 
                  className="pl-8 h-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Filter by Owner */}
              <div className="w-full sm:w-[180px]">
                <Select value={ownerFilter} onValueChange={setOwnerFilter}>
                  <SelectTrigger className="h-9">
                     <SelectValue placeholder="Cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos Clientes</SelectItem>
                    {owners.map(owner => (
                      <SelectItem key={owner.id} value={owner.id}>{owner.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filter by Status */}
              <div className="w-full sm:w-[140px]">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos Status</SelectItem>
                    <SelectItem value="Disponível">Disponível</SelectItem>
                    <SelectItem value="Alugado">Alugado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

               {/* Filter by Period */}
               <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={`h-9 border-dashed ${dateFilterStart || dateFilterEnd ? 'border-green-500 bg-green-50 text-green-700' : 'text-gray-500'}`}>
                      <Calendar className="w-4 h-4 mr-2" />
                      {dateFilterStart || dateFilterEnd ? 'Período Ativo' : 'Filtrar Vigência'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="end">
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm">Período de Vigência</h4>
                      <div className="space-y-2">
                        <Label htmlFor="start" className="text-xs">Início do Período</Label>
                        <Input 
                          id="start" 
                          type="date" 
                          value={dateFilterStart} 
                          onChange={e => setDateFilterStart(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end" className="text-xs">Fim do Período</Label>
                        <Input 
                          id="end" 
                          type="date" 
                          value={dateFilterEnd} 
                          onChange={e => setDateFilterEnd(e.target.value)}
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Mostra imóveis alugados cujo contrato esteja vigente dentro deste intervalo.
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>

            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <TableWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px] max-w-[240px]">Endereço</TableHead>
                  <TableHead className="min-w-[150px] max-w-[180px]">Cliente</TableHead>
                  <TableHead className="min-w-[180px] max-w-[220px]">Detalhes</TableHead>
                  <TableHead className="min-w-[200px] max-w-[240px]">Locação / Garantia</TableHead>
                  <TableHead className="min-w-[120px] max-w-[140px]">Status</TableHead>
                  <TableHead className="min-w-[120px] max-w-[140px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {filteredProperties.map((property) => {
                const info = getActiveContractInfo(property.id);
                return (
                  <TableRow key={property.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-zinc-400">
                          <Home className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-zinc-100">{property.address}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-gray-600 dark:text-zinc-300">{getOwnerName(property.ownerId)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm text-gray-500 dark:text-zinc-400">
                        <div className="flex items-center gap-2">
                          <Building className="w-3 h-3" /> {property.type}
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-3 h-3" /> 
                          {property.value ? `Aval: R$ ${property.value.toLocaleString()}` : 'Aval: N/A'}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Banknote className="w-3 h-3" />
                          {property.iptu ? `IPTU: R$ ${property.iptu.toLocaleString()}` : 'IPTU: N/A'}
                        </div>
                        {property.pmsControlNumber && (
                           <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-zinc-500">
                             <FileText className="w-3 h-3" /> PMS: {property.pmsControlNumber}
                           </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {info ? (
                        <div className="flex flex-col gap-1 text-sm">
                           <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-zinc-100">
                             <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                             {info.tenant?.name || 'Inquilino Desconhecido'}
                           </div>
                           <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-400">
                             <Calendar className="w-3.5 h-3.5" />
                             {info.periodText}
                           </div>
                           {(info.contract.securityDeposit || info.contract.complement) && (
                              <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded w-fit mt-1">
                                <ShieldCheck className="w-3 h-3" />
                                {info.contract.securityDeposit 
                                  ? `R$ ${info.contract.securityDeposit.toLocaleString()}` 
                                  : info.contract.complement}
                              </div>
                           )}
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-zinc-500 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={property.status === 'Disponível' ? 'secondary' : 'outline'} className={property.status === 'Disponível' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-blue-50 text-blue-700 border-blue-200'}>
                        {property.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          <Edit className="w-4 h-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent 
                            className="dark:bg-zinc-900 dark:border-zinc-800"
                            title="Excluir Imóvel"
                          >
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o imóvel <b>{property.address}</b>? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteProperty(property.id)} className="bg-red-600 hover:bg-red-700">
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filteredProperties.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500 dark:text-zinc-400">
                    Nenhum imóvel encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableWrapper>
        </CardContent>
      </Card>
    </div>
  );
}
