import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeSelector } from './ui/ThemeSelector';
import {
  BookOpen,
  BarChart3,
  Home,
  Menu,
  X,
  PieChart,
  HelpCircle,
  User,
  Settings,
  Bell,
  Zap,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentScreen: string;
}

export function Layout({ children, currentScreen }: LayoutProps) {
  const { theme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount] = useState(3);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className={`min-h-screen w-full ${theme.gradient} ${theme.text} transition-colors duration-500`}>
      <header className="glassmorphism sticky top-0 z-50 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Rivela</h1>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-white">
            <span className="text-sm opacity-80">Explorateur Financier</span>
            <div className="relative">
              <Bell className="w-5 h-5 cursor-pointer hover:text-[hsl(var(--rivela-accent))] transition-colors" />
              {notificationCount > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[hsl(var(--rivela-accent))] rounded-full text-xs flex items-center justify-center text-white">
                  {notificationCount}
                </div>
              )}
            </div>
            <ThemeSelector />
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm pt-20">
          <div className="container mx-auto px-4">
            <div className="flex justify-end mb-4">
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                aria-label="Fermer le menu"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col space-y-4">
              <a
                href="#"
                className="flex items-center p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                onClick={closeMobileMenu}
              >
                <Home size={20} className="mr-3" />
                <span>Accueil</span>
              </a>
              <a
                href="#"
                className="flex items-center p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                onClick={closeMobileMenu}
              >
                <BarChart3 size={20} className="mr-3" />
                <span>Tableau de bord</span>
              </a>
              <a
                href="#"
                className="flex items-center p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                onClick={closeMobileMenu}
              >
                <BookOpen size={20} className="mr-3" />
                <span>Apprentissage</span>
              </a>
              <a
                href="#"
                className="flex items-center p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                onClick={closeMobileMenu}
              >
                <PieChart size={20} className="mr-3" />
                <span>Analyses</span>
              </a>
              <a
                href="#"
                className="flex items-center p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                onClick={closeMobileMenu}
              >
                <User size={20} className="mr-3" />
                <span>Profil</span>
              </a>
              <a
                href="#"
                className="flex items-center p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                onClick={closeMobileMenu}
              >
                <Settings size={20} className="mr-3" />
                <span>Paramètres</span>
              </a>
              <a
                href="#"
                className="flex items-center p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                onClick={closeMobileMenu}
              >
                <HelpCircle size={20} className="mr-3" />
                <span>Aide</span>
              </a>
              <div className="mt-4 pt-4 border-t border-white/20">
                <ThemeSelector />
              </div>
            </nav>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 pb-32 pt-8 min-h-[calc(100vh-160px)]">
        {children}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 glassmorphism p-4 z-40">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-white/80 text-sm">
          <p className="text-center md:text-left mb-2 md:mb-0">
            "Vos données + Notre science = Votre révélation financière"
          </p>
          <div className="flex items-center space-x-4">
            <span>Déjà 127 révélations financières cette semaine</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse-soft"></div>
              <span className="text-xs">En ligne</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
