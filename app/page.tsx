"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { RealEstateDashboard } from "@/components/real-estate/Dashboard";
import { Users } from "@/components/admin/Users";
import { User } from "@/components/real-estate/RealEstateContext";
import { Login } from "@/components/Login";
import { RealEstateLayout } from "@/components/real-estate/RealEstateLayout";
import { DesignSystem } from "@/components/DesignSystem";

function AppContent() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState("dashboard");

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <RealEstateDashboard onNavigateToModule={setCurrentPage} />;
      case "real-estate":
        return <RealEstateLayout />;
      case "users":
        return <Users />;
      case "design-system":
        return <DesignSystem />;
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
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-zinc-950 overflow-hidden text-foreground transition-colors duration-300">
      <Sidebar
        activePage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={() => setCurrentUser(null)}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <Header user={currentUser} />

        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-zinc-950">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  return <AppContent />;
}

