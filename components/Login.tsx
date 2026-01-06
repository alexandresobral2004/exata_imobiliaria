"use client";

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Building2, Lock, Mail, User } from 'lucide-react';
import { useRealEstate } from './real-estate/RealEstateContext';
import { toast } from 'sonner';

interface LoginProps {
  onLogin: (user: any) => void;
}

export function Login({ onLogin }: LoginProps) {
  const { users } = useRealEstate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulação de delay de rede
    setTimeout(() => {
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        toast.success(`Bem-vindo, ${user.name}!`);
        onLogin(user);
      } else {
        toast.error('Credenciais inválidas. Verifique seu email e senha.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4 transition-colors duration-300">
      <Card className="w-full max-w-md shadow-xl dark:bg-zinc-900 dark:border-zinc-800">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2">
            <Building2 className="w-6 h-6 text-green-600 dark:text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Exata - Serviços</CardTitle>
          <CardDescription className="dark:text-zinc-400">
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-zinc-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-zinc-500" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="seu@email.com" 
                    className="pl-10 h-11"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="dark:text-zinc-300">Senha</Label>
                  <a href="#" className="text-sm text-green-600 hover:text-green-700 dark:text-green-500 hover:underline font-medium">
                    Esqueceu a senha?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-zinc-500" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 h-11"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pb-8 pt-2">
            <Button 
              className="w-full h-11 text-base font-medium shadow-lg bg-green-600 hover:bg-green-700 text-white dark:bg-green-600 dark:hover:bg-green-700 dark:text-white transition-all duration-200 hover:shadow-green-600/20" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Acessar Sistema'}
            </Button>
          </CardFooter>
        </form>
        <div className="px-6 pb-6 text-center text-xs text-gray-500 dark:text-zinc-500">
          Dica: Admin (admin@exata.com / 123)
        </div>
      </Card>
    </div>
  );
}
