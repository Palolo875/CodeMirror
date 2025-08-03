import React, { useState } from 'react';
import { Palette, ChevronDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function ThemeSelector() {
  const { theme, themeName, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

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
          <div className="absolute right-0 top-full mt-2 w-48 rounded-lg glassmorphism shadow-lg z-20">
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
                    className={`w-4 h-4 rounded-full ${key === 'classic' ? 'bg-purple-500' : 
                      key === 'sunset' ? 'bg-orange-500' : 
                      key === 'ocean' ? 'bg-blue-500' : 'bg-green-500'}`}
                  />
                  <span className="text-white text-sm">{themeOption.name}</span>
                  {themeName === key && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full" />
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
