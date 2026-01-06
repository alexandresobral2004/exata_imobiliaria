import type { Metadata } from "next";
import "../styles/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { RealEstateProvider } from "@/components/real-estate/RealEstateContext";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Exata - Sistema de Gestão Imobiliária",
  description: "Sistema completo de gestão imobiliária",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <RealEstateProvider>
            {children}
            <Toaster 
              position="top-right"
              richColors
              closeButton
              expand={false}
              visibleToasts={5}
            />
          </RealEstateProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

