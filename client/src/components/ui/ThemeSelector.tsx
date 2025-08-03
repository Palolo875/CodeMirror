import React, { useState } from 'react';
import { Palette, ChevronDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function ThemeSelector() {
  const { theme, themeName, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Couleurs représentatives pour chaque thème
  const themeColors: Record<string, string> = {
    classic: 'bg-gradient-to-r from-purple-500 to-blue-500',
    sunset: 'bg-gradient-to-r from-orange-500 to-pink-500',
    ocean: 'bg-gradient-to-r from-blue-400 to-blue-600',
    forest: 'bg-gradient-to-r from-green-500 to-green-700',
    aurora: 'bg-gradient-to-r from-purple-400 to-cyan-400',
    cosmic: 'bg-gradient-to-r from-indigo-900 to-purple-900',
    desert: 'bg-gradient-to-r from-orange-400 to-red-500',
    glacial: 'bg-gradient-to-r from-blue-200 to-blue-400',
    volcanic: 'bg-gradient-to-r from-red-600 to-orange-500',
    tropical: 'bg-gradient-to-r from-green-400 to-teal-500'
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg glassmorphism hover:bg-white/20 transition-colors text-white"
      >
        <Palette size={16} />
        <span className="text-sm hidden sm:inline">{theme.name}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-56 rounded-lg glassmorphism shadow-lg z-20 max-h-64 overflow-y-auto">
            <div className="py-2">
              {Object.entries(themes).map(([key, themeOption]) => (
                <button
                  key={key}
                  onClick={() => {
                    setTheme(key);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-white/20 transition-colors flex items-center space-x-3 ${
                    themeName === key ? 'bg-white/10' : ''
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full ${themeColors[key] || 'bg-gray-500'}`}
                  />
                  <span className="text-white text-sm flex-1">{themeOption.name}</span>
                  {themeName === key && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
