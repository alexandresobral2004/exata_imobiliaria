"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Terminal, AlertCircle, Info, CheckCircle2, Moon, Sun, Layout, CreditCard, User } from 'lucide-react';

export function DesignSystem() {
  return (
    <div className="p-8 space-y-8 bg-gray-50 dark:bg-zinc-900/50 min-h-full transition-colors duration-300">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Design System</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Documentação completa da identidade visual, componentes e regras de uso da interface.
        </p>
      </div>

      <Tabs defaultValue="style-guide" className="w-full">
        <TabsList className="bg-gray-100 dark:bg-zinc-800 p-1 w-full flex justify-start border-b border-gray-200 dark:border-zinc-700 rounded-none mb-6">
          <TabsTrigger value="style-guide" className="px-6 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:shadow-sm rounded-md transition-all dark:text-gray-300 dark:data-[state=active]:text-white">
            Style Guide
          </TabsTrigger>
          <TabsTrigger value="components" className="px-6 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:shadow-sm rounded-md transition-all dark:text-gray-300 dark:data-[state=active]:text-white">
            Biblioteca de Componentes
          </TabsTrigger>
          <TabsTrigger value="rules" className="px-6 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:shadow-sm rounded-md transition-all dark:text-gray-300 dark:data-[state=active]:text-white">
            Regras de Uso
          </TabsTrigger>
        </TabsList>

        <TabsContent value="style-guide" className="space-y-8">
          <Section title="Paleta de Cores Exata">
            <div className="space-y-8">
              {/* Cores Primárias */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cores Primárias (Verde Exata)</h4>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                  {[
                    { shade: '50', color: '#f0fdf4' },
                    { shade: '100', color: '#dcfce7' },
                    { shade: '200', color: '#bbf7d0' },
                    { shade: '300', color: '#86efac' },
                    { shade: '400', color: '#4ade80' },
                    { shade: '500', color: '#22c55e' },
                    { shade: '600', color: '#16a34a' },
                    { shade: '700', color: '#15803d' },
                    { shade: '800', color: '#166534' },
                    { shade: '900', color: '#14532d' },
                  ].map((item) => (
                    <div key={item.shade} className="text-center">
                      <div 
                        className="h-16 w-full rounded-lg border border-gray-200 dark:border-zinc-700 mb-2"
                        style={{ backgroundColor: item.color }}
                      />
                      <p className="text-xs font-medium text-gray-700 dark:text-zinc-300">{item.shade}</p>
                      <p className="text-xs text-gray-500 dark:text-zinc-500">{item.color}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cores Neutras */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cores Neutras</h4>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                  {[
                    { shade: '50', color: '#fafafa' },
                    { shade: '100', color: '#f5f5f5' },
                    { shade: '200', color: '#e5e5e5' },
                    { shade: '300', color: '#d4d4d4' },
                    { shade: '400', color: '#a3a3a3' },
                    { shade: '500', color: '#737373' },
                    { shade: '600', color: '#525252' },
                    { shade: '700', color: '#404040' },
                    { shade: '800', color: '#262626' },
                    { shade: '900', color: '#171717' },
                  ].map((item) => (
                    <div key={item.shade} className="text-center">
                      <div 
                        className="h-16 w-full rounded-lg border border-gray-200 dark:border-zinc-700 mb-2"
                        style={{ backgroundColor: item.color }}
                      />
                      <p className="text-xs font-medium text-gray-700 dark:text-zinc-300">{item.shade}</p>
                      <p className="text-xs text-gray-500 dark:text-zinc-500">{item.color}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cores de Status */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cores de Status</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="h-16 w-full rounded-lg bg-green-500 mb-2" />
                    <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">Sucesso</p>
                    <p className="text-xs text-gray-500 dark:text-zinc-500">#22c55e</p>
                  </div>
                  <div className="text-center">
                    <div className="h-16 w-full rounded-lg bg-yellow-500 mb-2" />
                    <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">Aviso</p>
                    <p className="text-xs text-gray-500 dark:text-zinc-500">#f59e0b</p>
                  </div>
                  <div className="text-center">
                    <div className="h-16 w-full rounded-lg bg-red-500 mb-2" />
                    <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">Erro</p>
                    <p className="text-xs text-gray-500 dark:text-zinc-500">#ef4444</p>
                  </div>
                  <div className="text-center">
                    <div className="h-16 w-full rounded-lg bg-blue-500 mb-2" />
                    <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">Informação</p>
                    <p className="text-xs text-gray-500 dark:text-zinc-500">#3b82f6</p>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Section title="Tipografia">
            <Card>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-center border-b dark:border-zinc-800 pb-4">
                  <span className="text-gray-500 dark:text-gray-400 font-mono text-sm">Heading 1</span>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Título Principal</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-center border-b dark:border-zinc-800 pb-4">
                  <span className="text-gray-500 dark:text-gray-400 font-mono text-sm">Heading 2</span>
                  <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">Subtítulo de Seção</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-center border-b dark:border-zinc-800 pb-4">
                  <span className="text-gray-500 dark:text-gray-400 font-mono text-sm">Heading 3</span>
                  <h3 className="text-2xl font-medium text-gray-900 dark:text-white">Título de Card</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-center border-b dark:border-zinc-800 pb-4">
                  <span className="text-gray-500 dark:text-gray-400 font-mono text-sm">Heading 4</span>
                  <h4 className="text-xl font-medium text-gray-900 dark:text-white">Título Menor</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-center border-b dark:border-zinc-800 pb-4">
                  <span className="text-gray-500 dark:text-gray-400 font-mono text-sm">Paragraph</span>
                  <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    O rato roeu a roupa do rei de Roma. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-center">
                  <span className="text-gray-500 dark:text-gray-400 font-mono text-sm">Small / Muted</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Texto auxiliar ou legenda. Usado para informações secundárias.
                  </p>
                </div>
              </CardContent>
            </Card>
          </Section>
        </TabsContent>

        <TabsContent value="components" className="space-y-8">
          <Section title="Botões">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-4 mb-6">
                  <Button>Primary Button</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="link">Link Button</Button>
                </div>
                <Separator className="my-6" />
                <div className="flex flex-wrap gap-4 items-center">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon"><Terminal className="w-4 h-4" /></Button>
                  <Button disabled>Disabled</Button>
                </div>
              </CardContent>
            </Card>
          </Section>

          <Section title="Cards e Containers">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Card Simples</CardTitle>
                  <CardDescription>Um exemplo básico de card.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Conteúdo do card vai aqui.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Ação</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Perfil
                  </CardTitle>
                  <CardDescription>Informações do usuário</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                       <User className="h-6 w-6 text-gray-500" />
                     </div>
                     <div>
                       <p className="font-medium">João Silva</p>
                       <p className="text-sm text-muted-foreground">joao@example.com</p>
                     </div>
                   </div>
                </CardContent>
              </Card>
            </div>
          </Section>

          <Section title="Dialogs e Modais">
             <Card>
               <CardContent className="pt-6">
                 <Dialog>
                   <DialogTrigger asChild>
                     <Button variant="outline">Abrir Dialog de Exemplo</Button>
                   </DialogTrigger>
                   <DialogContent className="sm:max-w-[425px]">
                     <DialogHeader>
                       <DialogTitle>Editar Perfil</DialogTitle>
                       <DialogDescription>
                         Faça alterações no seu perfil aqui. Clique em salvar quando terminar.
                       </DialogDescription>
                     </DialogHeader>
                     <div className="grid gap-4 py-4">
                       <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="name" className="text-right">
                           Nome
                         </Label>
                         <Input id="name" value="Pedro Duarte" className="col-span-3" />
                       </div>
                       <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="username" className="text-right">
                           Username
                         </Label>
                         <Input id="username" value="@pedroduarte" className="col-span-3" />
                       </div>
                     </div>
                     <DialogFooter>
                       <Button type="submit">Salvar alterações</Button>
                     </DialogFooter>
                   </DialogContent>
                 </Dialog>
               </CardContent>
             </Card>
          </Section>

          <Section title="Tabelas">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fatura</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">INV001</TableCell>
                      <TableCell>Pago</TableCell>
                      <TableCell>Cartão de Crédito</TableCell>
                      <TableCell className="text-right">R$ 250,00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">INV002</TableCell>
                      <TableCell>Pendente</TableCell>
                      <TableCell>Pix</TableCell>
                      <TableCell className="text-right">R$ 150,00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Section>

          <Section title="Formulários e Inputs">
            <Card>
              <CardContent className="space-y-6 pt-6">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input type="email" id="email" placeholder="nome@exemplo.com" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms">Aceito os termos e condições</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="airplane-mode" />
                  <Label htmlFor="airplane-mode">Modo Avião</Label>
                </div>
              </CardContent>
            </Card>
          </Section>

          <Section title="Badges e Status">
            <Card>
              <CardContent className="pt-6 flex gap-4">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge className="bg-green-600 hover:bg-green-700">Custom Success</Badge>
              </CardContent>
            </Card>
          </Section>

          <Section title="Feedback e Alertas">
            <div className="space-y-4">
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                  You can add components to your app using the cli.
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>
                  Sua sessão expirou. Por favor, faça login novamente.
                </AlertDescription>
              </Alert>
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="rules" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  Boas Práticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Use o botão <strong>Primary</strong> apenas para a ação principal da tela.</li>
                  <li>Use botões <strong>Destructive</strong> (vermelhos) para ações irreversíveis como apagar dados.</li>
                  <li>Mantenha a consistência nos espaçamentos usando as classes do Tailwind (gap-4, p-6, etc).</li>
                  <li>Sempre forneça feedback visual após uma ação do usuário (loading, toast ou mensagem de sucesso).</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  O que evitar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Não use mais de um botão Primary na mesma seção visual.</li>
                  <li>Evite usar cores que não estejam na paleta oficial do sistema.</li>
                  <li>Não misture tipos de ícones (use sempre Lucide React para consistência).</li>
                  <li>Evite textos muito longos em botões (máximo 3 palavras).</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Info className="w-5 h-5" />
                  Convenções de Nomenclatura
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Componentes</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Use PascalCase para nomes de arquivos e componentes React. Ex: <code>Button.tsx</code>, <code>UserProfile.tsx</code>.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Variáveis e Funções</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Use camelCase. Ex: <code>handleCreateUser</code>, <code>isLoading</code>, <code>userAddress</code>.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 pb-2 border-b border-gray-200 dark:border-zinc-700">{title}</h3>
      {children}
    </div>
  );
}

function ColorCard({ name, variable, hex, text, border }: { name: string, variable: string, hex: string, text: string, border?: boolean }) {
  return (
    <Card>
      <div className={`h-24 w-full rounded-t-lg ${variable} ${border ? 'border-b dark:border-zinc-700' : ''}`}></div>
      <CardContent className="p-4">
        <h4 className="font-bold text-gray-900 dark:text-gray-100">{name}</h4>
        <div className="flex justify-between items-center mt-1">
          <code className="text-xs bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded text-gray-600 dark:text-gray-400">{variable}</code>
          {/* <span className="text-xs text-gray-500 dark:text-gray-400">{hex}</span> */}
        </div>
      </CardContent>
    </Card>
  );
}
