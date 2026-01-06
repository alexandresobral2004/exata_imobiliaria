"use client";

import React, { useState } from 'react';
import { X, DollarSign, Calendar, Tag, FileText, Building, CreditCard, AlertCircle } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Switch } from './switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { cn } from './utils';
import { maskCurrency } from '../../utils/masks';

interface FinancialRecord {
  id?: string;
  type: 'Receita' | 'Despesa';
  amount: string;
  categoryId: string;
  description: string;
  contractId: string;
  dueDate: string;
  status: 'Pendente' | 'Pago' | 'Atrasado';
}

interface Category {
  id: string;
  name: string;
  type: 'Receita' | 'Despesa';
}

interface Contract {
  id: string;
  propertyId: string;
}

interface Property {
  id: string;
  address: string;
  ownerId: string;
}

interface Owner {
  id: string;
  name: string;
}

interface NewFinancialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: any) => void;
  editingRecord?: any;
  categories: Category[];
  contracts: Contract[];
  properties: Property[];
  owners: Owner[];
}

export function NewFinancialModal({
  isOpen,
  onClose,
  onSave,
  editingRecord,
  categories,
  contracts,
  properties,
  owners
}: NewFinancialModalProps) {
  const [formData, setFormData] = useState<FinancialRecord>({
    type: 'Receita',
    amount: '',
    categoryId: '',
    description: '',
    contractId: 'manual',
    dueDate: new Date().toISOString().split('T')[0],
    status: 'Pendente'
  });

  const [errors, setErrors] = useState<Partial<FinancialRecord>>({});

  // Reset form when modal opens/closes or editing record changes
  React.useEffect(() => {
    if (isOpen) {
      if (editingRecord) {
        setFormData({
          type: editingRecord.type,
          amount: editingRecord.amount.toString(),
          categoryId: categories.find(c => c.name === editingRecord.category)?.id || '',
          description: editingRecord.description,
          contractId: editingRecord.contractId,
          dueDate: editingRecord.dueDate,
          status: editingRecord.status
        });
      } else {
        setFormData({
          type: 'Receita',
          amount: '',
          categoryId: '',
          description: '',
          contractId: 'manual',
          dueDate: new Date().toISOString().split('T')[0],
          status: 'Pendente'
        });
      }
      setErrors({});
    }
  }, [isOpen, editingRecord, categories]);

  const getContractDetails = (contractId: string) => {
    if (!contractId || contractId === 'manual') return null;
    const contract = contracts.find(c => c.id === contractId);
    if (!contract) return null;
    const property = properties.find(p => p.id === contract.propertyId);
    const owner = owners.find(o => o.id === property?.ownerId);
    return { property, owner };
  };

  const validateForm = () => {
    const newErrors: Partial<FinancialRecord> = {};

    if (!formData.amount || parseFloat(formData.amount.replace(/\D/g, '').replace(/(\d)(\d{2})$/, '$1.$2')) <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Categoria é obrigatória';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Data de vencimento é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const recordData = {
      type: formData.type,
      amount: parseFloat(formData.amount.replace(/\D/g, '').replace(/(\d)(\d{2})$/, '$1.$2')),
      category: categories.find(c => c.id === formData.categoryId)?.name || '',
      description: formData.description.trim(),
      contractId: formData.contractId,
      dueDate: formData.dueDate,
      status: formData.status
    };

    onSave(recordData);
    onClose();
  };

  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-zinc-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-zinc-100">
                {editingRecord ? 'Editar Lançamento' : 'Novo Lançamento'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-zinc-400">
                {editingRecord ? 'Atualize os dados do lançamento financeiro' : 'Adicione um novo registro financeiro'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Tipo e Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                  Tipo de Lançamento
                </Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value: 'Receita' | 'Despesa') => {
                    setFormData(prev => ({ 
                      ...prev, 
                      type: value,
                      categoryId: '' // Reset category when type changes
                    }));
                  }}
                >
                  <SelectTrigger className={cn(
                    "h-11 border-2 transition-colors",
                    formData.type === 'Receita' 
                      ? "border-green-200 focus:border-green-500 bg-green-50 dark:bg-green-900/20" 
                      : "border-red-200 focus:border-red-500 bg-red-50 dark:bg-red-900/20"
                  )}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Receita" className="text-green-700 dark:text-green-400">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Receita
                      </div>
                    </SelectItem>
                    <SelectItem value="Despesa" className="text-red-700 dark:text-red-400">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Despesa
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                  Status do Pagamento
                </Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: 'Pendente' | 'Pago' | 'Atrasado') => 
                    setFormData(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendente">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        Pendente
                      </div>
                    </SelectItem>
                    <SelectItem value="Pago">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Pago
                      </div>
                    </SelectItem>
                    <SelectItem value="Atrasado">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Atrasado
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Valor e Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                  Valor (R$) *
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: maskCurrency(e.target.value) }))}
                    placeholder="0,00"
                    className={cn(
                      "pl-10 h-11 text-lg font-semibold",
                      errors.amount && "border-red-500 focus:border-red-500"
                    )}
                  />
                </div>
                {errors.amount && (
                  <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.amount}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                  Data de Vencimento *
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className={cn(
                      "pl-10 h-11",
                      errors.dueDate && "border-red-500 focus:border-red-500"
                    )}
                  />
                </div>
                {errors.dueDate && (
                  <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.dueDate}
                  </p>
                )}
              </div>
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                Categoria *
              </Label>
              <Select 
                value={formData.categoryId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
              >
                <SelectTrigger className={cn(
                  "h-11",
                  errors.categoryId && "border-red-500 focus:border-red-500"
                )}>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <SelectValue placeholder="Selecione uma categoria" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          formData.type === 'Receita' ? "bg-green-500" : "bg-red-500"
                        )}></div>
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.categoryId}
                </p>
              )}
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                Descrição *
              </Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o lançamento financeiro..."
                  rows={3}
                  className={cn(
                    "w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-800 dark:text-zinc-100",
                    errors.description && "border-red-500 focus:border-red-500"
                  )}
                />
              </div>
              {errors.description && (
                <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Referência/Contrato */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                Referência (Opcional)
              </Label>
              <Select 
                value={formData.contractId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, contractId: value }))}
              >
                <SelectTrigger className="h-11">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <SelectValue placeholder="Vincular a contrato ou selecionar avulso" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      Lançamento Avulso
                    </div>
                  </SelectItem>
                  {contracts.map(contract => {
                    const details = getContractDetails(contract.id);
                    if (!details) return null;
                    return (
                      <SelectItem key={contract.id} value={contract.id}>
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-blue-500" />
                          <div className="flex flex-col">
                            <span>{details.property?.address}</span>
                            <span className="text-xs text-gray-500">
                              Proprietário: {details.owner?.name}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Preview do valor */}
            {formData.amount && parseFloat(formData.amount.replace(/\D/g, '').replace(/(\d)(\d{2})$/, '$1.$2')) > 0 && (
              <div className={cn(
                "p-4 rounded-lg border-2 border-dashed",
                formData.type === 'Receita' 
                  ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                  : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
              )}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                      Preview do Lançamento
                    </p>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">
                      {formData.type} de {formData.description || 'Descrição não informada'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "text-lg font-bold",
                      formData.type === 'Receita' 
                        ? "text-green-700 dark:text-green-400" 
                        : "text-red-700 dark:text-red-400"
                    )}>
                      {formData.type === 'Despesa' ? '- ' : ''}R$ {parseFloat(formData.amount.replace(/\D/g, '').replace(/(\d)(\d{2})$/, '$1.$2')).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">
                      Vencimento: {new Date(formData.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="px-6"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            className={cn(
              "px-6 text-white font-medium",
              formData.type === 'Receita'
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            )}
          >
            {editingRecord ? 'Salvar Alterações' : 'Adicionar Lançamento'}
          </Button>
        </div>
      </div>
    </div>
  );
}
