"use client";

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { TableWrapper } from '../ui/table-wrapper';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Plus, Search, Mail, Phone, FileText, BadgeCheck, Edit, Trash2 } from 'lucide-react';
import { useRealEstate } from './RealEstateContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { formatPhone } from '../../utils/formatters';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { toast } from 'sonner';

export function Brokers() {
  const { brokers, addBroker, updateBroker, deleteBroker } = useRealEstate();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const initialFormState = { 
    name: '', 
    creci: '', 
    email: '', 
    phone: '', 
    commissionRate: 0 
  };
  const [formData, setFormData] = useState(initialFormState);
  
  const [search, setSearch] = useState('');

  const resetForm = () => {
      setFormData(initialFormState);
      setEditingId(null);
  };

  const handleSave = () => {
    if (!formData.name || !formData.creci) {
        toast.error("Nome e CRECI são obrigatórios");
        return;
    }

    if (editingId) {
        updateBroker(editingId, formData);
        toast.success("Corretor atualizado com sucesso!");
    } else {
        addBroker(formData);
        toast.success("Corretor cadastrado com sucesso!");
    }
    
    resetForm();
    setOpen(false);
  };

  const handleEdit = (broker: any) => {
      setEditingId(broker.id);
      setFormData({
          name: broker.name,
          creci: broker.creci,
          email: broker.email,
          phone: broker.phone,
          commissionRate: broker.commissionRate || 0
      });
      setOpen(true);
  };

  const filteredBrokers = brokers.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) || 
    b.creci.includes(search)
  ).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-zinc-100">Corretores</h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400">Gerencie a equipe de corretores e suas credenciais.</p>
        </div>
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Novo Corretor
            </Button>
          </DialogTrigger>
          <DialogContent 
            className="max-w-md dark:bg-zinc-900 dark:border-zinc-800"
            title={editingId ? 'Editar Corretor' : 'Cadastrar Corretor'}
          >
            <DialogDescription>
              {editingId ? 'Atualize os dados do corretor abaixo.' : 'Adicione um novo corretor à equipe de vendas.'}
            </DialogDescription>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Carlos Santos"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="creci">CRECI *</Label>
                <Input 
                  id="creci" 
                  value={formData.creci}
                  onChange={(e) => setFormData({...formData, creci: e.target.value})}
                  placeholder="12345-F"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="carlos@imob.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input 
                  id="phone" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: formatPhone(e.target.value)})}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commissionRate">Taxa de Intermediação (%)</Label>
                <Input 
                  id="commissionRate" 
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.commissionRate || ''}
                  onChange={(e) => setFormData({...formData, commissionRate: parseFloat(e.target.value) || 0})}
                  placeholder="Ex: 1.5"
                />
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  Percentual pago mensalmente quando o corretor intermediar locações
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">Lista de Corretores</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Buscar por nome ou CRECI..." 
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TableWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CRECI</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Taxa</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {filteredBrokers.map((broker) => (
                <TableRow key={broker.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-medium">
                        {broker.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-zinc-100">{broker.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-zinc-300 font-medium">
                      <BadgeCheck className="w-4 h-4 text-green-600" />
                      {broker.creci}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm text-gray-500 dark:text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" /> {broker.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" /> {broker.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {broker.commissionRate && broker.commissionRate > 0 ? (
                      <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                        <FileText className="w-4 h-4" />
                        {broker.commissionRate}%
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 dark:text-zinc-500">Não definida</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => handleEdit(broker)}
                        >
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
                            title="Excluir Corretor"
                          >
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir <b>{broker.name}</b>?
                            </AlertDialogDescription>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => { deleteBroker(broker.id); toast.success("Corretor excluído."); }} className="bg-red-600 hover:bg-red-700">
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredBrokers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    Nenhum corretor encontrado.
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
