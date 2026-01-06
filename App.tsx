import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { RealEstateDashboard } from './components/real-estate/Dashboard';
import { Users } from './components/admin/Users';
import { Toaster } from 'sonner';
import { RealEstateProvider, User } from './components/real-estate/RealEstateContext';
import { Login } from './components/Login';

import { RealEstateLayout } from './components/real-estate/RealEstateLayout';
import { ThemeProvider } from './components/ThemeProvider';

function AppContent() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <RealEstateDashboard onNavigateToModule={setCurrentPage} />;
      case 'real-estate':
        return <RealEstateLayout />;
      case 'users':
        return <Users />;
      default:
        return (
          <div className="p-8 text-center text-gray-500 dark:text-zinc-400">
            <h2 className="text-2xl font-bold mb-2">Em desenvolvimento</h2>
            <p>A página {currentPage} está sendo construída.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-zinc-900">
      <Sidebar 
        activePage={currentPage} 
        onNavigate={setCurrentPage} 
        onLogout={() => setCurrentUser(null)} 
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={currentUser} />
        
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>

        <footer className="bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 px-6 py-4">
          <div className="flex items-center justify-center text-sm text-gray-500 dark:text-zinc-400">
            © 2024 Sistema de Gestão Imobiliária Exata. Todos os direitos reservados.
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <RealEstateProvider>
        <AppContent />
        <Toaster 
          position="top-right"
          richColors
          closeButton
          expand={false}
          visibleToasts={5}
        />
      </RealEstateProvider>
    </ThemeProvider>
  );
}
