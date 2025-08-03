import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme } from '../types';

const themes: Record<string, Theme> = {
  classic: {
    name: 'Classique',
    gradient: 'theme-classic gradient-bg',
    primary: 'bg-[hsl(var(--rivela-primary))]',
    secondary: 'bg-[hsl(var(--rivela-secondary))]',
    accent: 'bg-[hsl(var(--rivela-accent))]',
    text: 'text-white',
  },
  sunset: {
    name: 'Coucher de soleil',
    gradient: 'theme-sunset gradient-bg',
    primary: 'bg-[hsl(var(--rivela-primary))]',
    secondary: 'bg-[hsl(var(--rivela-secondary))]',
    accent: 'bg-[hsl(var(--rivela-accent))]',
    text: 'text-white',
  },
  ocean: {
    name: 'Océan',
    gradient: 'theme-ocean gradient-bg',
    primary: 'bg-[hsl(var(--rivela-primary))]',
    secondary: 'bg-[hsl(var(--rivela-secondary))]',
    accent: 'bg-[hsl(var(--rivela-accent))]',
    text: 'text-white',
  },
  forest: {
    name: 'Forêt',
    gradient: 'theme-forest gradient-bg',
    primary: 'bg-[hsl(var(--rivela-primary))]',
    secondary: 'bg-[hsl(var(--rivela-secondary))]',
    accent: 'bg-[hsl(var(--rivela-accent))]',
    text: 'text-white',
  },
  aurora: {
    name: 'Aurore boréale',
    gradient: 'theme-aurora gradient-bg',
    primary: 'bg-[hsl(var(--rivela-primary))]',
    secondary: 'bg-[hsl(var(--rivela-secondary))]',
    accent: 'bg-[hsl(var(--rivela-accent))]',
    text: 'text-white',
  },
  cosmic: {
    name: 'Cosmique',
    gradient: 'theme-cosmic gradient-bg',
    primary: 'bg-[hsl(var(--rivela-primary))]',
    secondary: 'bg-[hsl(var(--rivela-secondary))]',
    accent: 'bg-[hsl(var(--rivela-accent))]',
    text: 'text-white',
  },
  desert: {
    name: 'Désert',
    gradient: 'theme-desert gradient-bg',
    primary: 'bg-[hsl(var(--rivela-primary))]',
    secondary: 'bg-[hsl(var(--rivela-secondary))]',
    accent: 'bg-[hsl(var(--rivela-accent))]',
    text: 'text-white',
  },
  glacial: {
    name: 'Glacial',
    gradient: 'theme-glacial gradient-bg',
    primary: 'bg-[hsl(var(--rivela-primary))]',
    secondary: 'bg-[hsl(var(--rivela-secondary))]',
    accent: 'bg-[hsl(var(--rivela-accent))]',
    text: 'text-white',
  },
  volcanic: {
    name: 'Volcanique',
    gradient: 'theme-volcanic gradient-bg',
    primary: 'bg-[hsl(var(--rivela-primary))]',
    secondary: 'bg-[hsl(var(--rivela-secondary))]',
    accent: 'bg-[hsl(var(--rivela-accent))]',
    text: 'text-white',
  },
  tropical: {
    name: 'Tropical',
    gradient: 'theme-tropical gradient-bg',
    primary: 'bg-[hsl(var(--rivela-primary))]',
    secondary: 'bg-[hsl(var(--rivela-secondary))]',
    accent: 'bg-[hsl(var(--rivela-accent))]',
    text: 'text-white',
  },
};

interface ThemeContextType {
  theme: Theme;
  themeName: string;
  setTheme: (themeName: string) => void;
  themes: Record<string, Theme>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState('classic');

  useEffect(() => {
    const savedTheme = localStorage.getItem('rivela-theme');
    if (savedTheme && themes[savedTheme]) {
      setThemeName(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('rivela-theme', themeName);
    // Apply theme class to document body
    const body = document.body;
    Object.keys(themes).forEach(theme => {
      body.classList.remove(`theme-${theme}`);
    });
    body.classList.add(`theme-${themeName}`);
  }, [themeName]);

  const setTheme = (newThemeName: string) => {
    if (themes[newThemeName]) {
      setThemeName(newThemeName);
    }
  };

  const value = {
    theme: themes[themeName],
    themeName,
    setTheme,
    themes,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
