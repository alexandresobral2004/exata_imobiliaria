"use client";

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { TableWrapper } from '../ui/table-wrapper';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Plus, Search, Mail, Phone, FileText, Trash2, Edit, User, MapPin, Calendar, Briefcase, MessageCircle } from 'lucide-react';
import { useRealEstate } from './RealEstateContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { maskCPFCNPJ, maskPhone } from '../../utils/masks';

export function Tenants() {
  const { tenants, addTenant, updateTenant, deleteTenant } = useRealEstate();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    document: '', // CPF ou CNPJ
    rg: '',
    email: '', 
    phone: '',
    whatsapp: '',
    profession: '',
    naturalness: '',
    birthDate: ''
  });
  const [search, setSearch] = useState('');

  const resetForm = () => {
    setFormData({ 
        name: '', 
        document: '', // CPF ou CNPJ
        rg: '',
        email: '', 
        phone: '',
        whatsapp: '',
        profession: '',
        naturalness: '',
        birthDate: ''
    });
    setEditingId(null);
  };

  const handleSave = () => {
    if (!formData.name || !formData.document) return;
    
    if (editingId) {
      updateTenant(editingId, formData);
    } else {
      addTenant(formData);
    }
    
    resetForm();
    setOpen(false);
  };

  const handleEdit = (tenant: any) => {
    setEditingId(tenant.id);
    setFormData({
      name: tenant.name,
      document: tenant.document,
      rg: tenant.rg || '',
      email: tenant.email,
      phone: tenant.phone,
      whatsapp: tenant.whatsapp || '',
      profession: tenant.profession || '',
      naturalness: tenant.naturalness || '',
      birthDate: tenant.birthDate || ''
    });
    setOpen(true);
  };

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.document.includes(search)
  ).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-zinc-100">Inquilinos</h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400">Gerencie os inquilinos cadastrados no sistema.</p>
        </div>
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Novo Inquilino
            </Button>
          </DialogTrigger>
          <DialogContent 
            className="max-w-2xl max-h-[90vh] overflow-y-auto"
            title={editingId ? 'Editar Inquilino' : 'Cadastrar Inquilino'}
          >
            <DialogDescription>
              {editingId ? 'Atualize os dados do inquilino abaixo.' : 'Preencha os dados completos para cadastrar um novo inquilino.'}
            </DialogDescription>
            
            <div className="grid grid-cols-2 gap-4 py-4">
               {/* Dados Pessoais */}
               <div className="col-span-2 space-y-2">
                 <Label htmlFor="name">Nome Completo *</Label>
                 <Input 
                   id="name" 
                   value={formData.name}
                   onChange={(e) => setFormData({...formData, name: e.target.value})}
                   placeholder="Ex: Maria Oliveira"
                 />
               </div>
               
               <div className="space-y-2">
<Label htmlFor="document">CPF/CNPJ *</Label>
                  <Input 
                    id="document" 
                    value={formData.document}
                    onChange={(e) => setFormData({...formData, document: maskCPFCNPJ(e.target.value)})}
                   placeholder="000.000.000-00 ou 00.000.000/0000-00"
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="rg">RG</Label>
                 <Input 
                   id="rg" 
                   value={formData.rg}
                   onChange={(e) => setFormData({...formData, rg: e.target.value})}
                   placeholder="00.000.000-0"
                 />
               </div>

               <div className="space-y-2">
                 <Label htmlFor="birthDate">Data de Nascimento</Label>
                 <Input 
                   id="birthDate" 
                   type="date"
                   value={formData.birthDate}
                   onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="naturalness">Naturalidade</Label>
                 <Input 
                   id="naturalness" 
                   value={formData.naturalness}
                   onChange={(e) => setFormData({...formData, naturalness: e.target.value})}
                   placeholder="Cidade - UF"
                 />
               </div>

               <div className="col-span-2 space-y-2">
                 <Label htmlFor="profession">Profissão</Label>
                 <Input 
                   id="profession" 
                   value={formData.profession}
                   onChange={(e) => setFormData({...formData, profession: e.target.value})}
                   placeholder="Ex: Engenheira Civil"
                 />
               </div>

               {/* Contato */}
               <div className="col-span-2 border-t pt-4 mt-2">
                 <h3 className="text-sm font-semibold mb-2">Contato</h3>
               </div>

               <div className="col-span-2 space-y-2">
                 <Label htmlFor="email">Email</Label>
                 <Input 
                   id="email" 
                   type="email"
                   value={formData.email}
                   onChange={(e) => setFormData({...formData, email: e.target.value})}
                   placeholder="maria@email.com"
                 />
               </div>
               
               <div className="space-y-2">
                 <Label htmlFor="phone">Telefone</Label>
                 <Input 
                   id="phone" 
                   value={formData.phone}
                   onChange={(e) => setFormData({...formData, phone: maskPhone(e.target.value)})}
                   placeholder="(11) 99999-9999"
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="whatsapp">WhatsApp</Label>
                 <Input 
                   id="whatsapp" 
                   value={formData.whatsapp}
                   onChange={(e) => setFormData({...formData, whatsapp: maskPhone(e.target.value)})}
                   placeholder="(11) 99999-9999"
                 />
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
            <CardTitle className="text-base font-medium">Lista de Inquilinos</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Buscar por nome ou CPF..." 
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <TableWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Inquilino</TableHead>
                  <TableHead>Dados Pessoais</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {filteredTenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-400 font-medium shrink-0">
                        {tenant.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                         <span className="font-medium text-gray-900 dark:text-zinc-100">{tenant.name}</span>
                         {tenant.profession && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-zinc-400">
                               <Briefcase className="w-3 h-3" />
                               {tenant.profession}
                            </div>
                         )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm text-gray-500 dark:text-zinc-400">
                        <div className="flex items-center gap-2">
                           <FileText className="w-3.5 h-3.5" />
                           <span className="text-xs">CPF/CNPJ: {tenant.document}</span>
                        </div>
                        {tenant.rg && (
                           <div className="flex items-center gap-2">
                              <User className="w-3.5 h-3.5" />
                              <span className="text-xs">RG: {tenant.rg}</span>
                           </div>
                        )}
                        {(tenant.naturalness || tenant.birthDate) && (
                            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-zinc-500 mt-1">
                               {tenant.naturalness && <span>{tenant.naturalness}</span>}
                               {tenant.birthDate && <span>• Nasc: {new Date(tenant.birthDate).toLocaleDateString()}</span>}
                            </div>
                        )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm text-gray-500 dark:text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" /> {tenant.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" /> {tenant.phone}
                      </div>
                      {tenant.whatsapp && (
                         <div className="flex items-center gap-2 text-green-600 dark:text-green-500 font-medium text-xs">
                            <MessageCircle className="w-3 h-3" /> {tenant.whatsapp}
                         </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => handleEdit(tenant)}
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
                            title="Excluir Inquilino"
                          >
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir <b>{tenant.name}</b>?
                            </AlertDialogDescription>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteTenant(tenant.id)} className="bg-red-600 hover:bg-red-700">
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTenants.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500 dark:text-zinc-400">
                    Nenhum inquilino encontrado.
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
