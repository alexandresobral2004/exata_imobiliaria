"use client";

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { TableWrapper } from '../ui/table-wrapper';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Search, User, Phone, Mail, Trash2, Edit, Shield } from 'lucide-react';
import { useRealEstate, User as UserType } from '../real-estate/RealEstateContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { toast } from "sonner";
import { maskPhone } from '../../utils/masks';

export function Users() {
  const { users, addUser, updateUser, deleteUser } = useRealEstate();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '', 
    email: '', 
    role: 'Operador' as 'Admin' | 'Operador',
    password: '',
    confirmPassword: ''
  });
  const [search, setSearch] = useState('');

  const resetForm = () => {
    setFormData({ 
      name: '', 
      phone: '', 
      email: '', 
      role: 'Operador',
      password: '',
      confirmPassword: ''
    });
    setEditingId(null);
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.role) {
        toast.error("Preencha os campos obrigatórios.");
        return;
    }

    if (!editingId && !formData.password) {
        toast.error("Senha é obrigatória para novos usuários.");
        return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
        toast.error("As senhas não coincidem.");
        return;
    }
    
    const userData = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      role: formData.role,
      password: formData.password || undefined // Only update password if provided
    };

    if (editingId) {
      updateUser(editingId, userData);
      toast.success("Usuário atualizado com sucesso!");
    } else {
      // For new users password is required, handled above
      addUser(userData as any);
      toast.success("Usuário cadastrado com sucesso!");
    }
    
    resetForm();
    setOpen(false);
  };

  const handleEdit = (user: UserType) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      password: '', // Don't show existing password
      confirmPassword: ''
    });
    setOpen(true);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Gestão de Usuários</h1>
        <p className="text-gray-500 dark:text-zinc-400">Controle de acesso e permissões do sistema.</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-zinc-400" />
          <Input 
            placeholder="Buscar usuário..." 
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-600 dark:hover:bg-green-700 dark:text-white">
              <Plus className="w-4 h-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent 
            className="max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-zinc-900 dark:border-zinc-800"
            title={editingId ? 'Editar Usuário' : 'Novo Usuário'}
            showMaximize={true}
          >
            <DialogDescription className="dark:text-zinc-400">
              Preencha os dados de acesso do usuário.
            </DialogDescription>
            
            <div className="space-y-4 py-4">
               <div className="space-y-2">
                 <Label htmlFor="name" className="dark:text-zinc-300">Nome Completo</Label>
                 <Input 
                   id="name" 
                   value={formData.name}
                   onChange={(e) => setFormData({...formData, name: e.target.value})}
                 />
               </div>
               
               <div className="space-y-2">
                 <Label htmlFor="email" className="dark:text-zinc-300">Email</Label>
                 <Input 
                   id="email" 
                   type="email"
                   value={formData.email}
                   onChange={(e) => setFormData({...formData, email: e.target.value})}
                 />
               </div>

               <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="phone" className="dark:text-zinc-300">WhatsApp</Label>
                     <Input 
                       id="phone" 
                       value={formData.phone}
                       onChange={(e) => setFormData({...formData, phone: maskPhone(e.target.value)})}
                       maxLength={15}
                       placeholder="(00) 00000-0000"
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="role" className="dark:text-zinc-300">Tipo de Acesso</Label>
                     <Select 
                        value={formData.role} 
                        onValueChange={(val: 'Admin' | 'Operador') => setFormData({...formData, role: val})}
                     >
                       <SelectTrigger>
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="Admin" className="dark:text-zinc-200 dark:focus:bg-zinc-700">Admin</SelectItem>
                         <SelectItem value="Operador" className="dark:text-zinc-200 dark:focus:bg-zinc-700">Operador</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
               </div>

               <div className="border-t border-gray-100 dark:border-zinc-800 pt-4 mt-2">
                   <h4 className="text-sm font-medium mb-3 dark:text-zinc-300">Segurança</h4>
                   <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <Label htmlFor="password" className="dark:text-zinc-300">Senha {editingId && '(Opcional)'}</Label>
                         <Input 
                           id="password" 
                           type="password"
                           value={formData.password}
                           onChange={(e) => setFormData({...formData, password: e.target.value})}
                         />
                       </div>
                       <div className="space-y-2">
                         <Label htmlFor="confirmPassword" className="dark:text-zinc-300">Confirmar Senha</Label>
                         <Input 
                           id="confirmPassword" 
                           type="password"
                           value={formData.confirmPassword}
                           onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                         />
                       </div>
                   </div>
               </div>

            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)} className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-700">Cancelar</Button>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-600 dark:hover:bg-green-700 dark:text-white">Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="dark:bg-zinc-900 dark:border-zinc-800">
        <CardContent className="p-0">
          <TableWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[32%] min-w-[260px]">Usuário</TableHead>
                  <TableHead className="w-[32%] min-w-[260px]">Contato</TableHead>
                  <TableHead className="w-[18%] min-w-[140px]">Permissão</TableHead>
                  <TableHead className="w-[18%] min-w-[140px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="dark:border-zinc-800 dark:hover:bg-zinc-800/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium shrink-0 ${
                          user.role === 'Admin' 
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' 
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-zinc-200">{user.name}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm text-gray-500 dark:text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" /> {user.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" /> {user.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                     <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                         user.role === 'Admin'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800'
                            : 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
                     }`}>
                        <Shield className="w-3 h-3 mr-1" />
                        {user.role}
                     </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent 
                            className="dark:bg-zinc-900 dark:border-zinc-800"
                            title="Excluir Usuário"
                          >
                            <AlertDialogDescription className="dark:text-zinc-400">
                              Tem certeza que deseja excluir <b>{user.name}</b>?
                            </AlertDialogDescription>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-700">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => {
                                deleteUser(user.id);
                                toast.success("Usuário excluído.");
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
            </TableBody>
            </Table>
          </TableWrapper>
        </CardContent>
      </Card>
    </div>
  );
}
