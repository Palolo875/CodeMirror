import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Asset } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface AssetsInputProps {
  assets: Asset[];
  onAddAsset: (asset: Asset) => void;
  onRemoveAsset: (index: number) => void;
}

const assetTypes = [
  { value: 'savings', label: 'Épargne' },
  { value: 'investment', label: 'Investissement' },
  { value: 'property', label: 'Immobilier' },
  { value: 'other', label: 'Autre' },
];

export function AssetsInput({ assets, onAddAsset, onRemoveAsset }: AssetsInputProps) {
  const [newAsset, setNewAsset] = useState({
    name: '',
    type: 'savings' as Asset['type'],
    value: '',
    description: '',
  });

  const handleAddAsset = () => {
    if (newAsset.name.trim() && newAsset.value.trim()) {
      const value = parseFloat(newAsset.value);
      if (!isNaN(value)) {
        onAddAsset({
          id: uuidv4(),
          name: newAsset.name.trim(),
          type: newAsset.type,
          value,
          description: newAsset.description.trim() || undefined,
        });
        setNewAsset({
          name: '',
          type: 'savings',
          value: '',
          description: '',
        });
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddAsset();
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-white mb-4">Actifs et patrimoine</h3>
      
      {/* Existing assets */}
      <div className="space-y-3 mb-4">
        {assets.map((asset, index) => (
          <div key={asset.id} className="p-3 rounded-lg bg-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <span className="text-white font-medium">{asset.name}</span>
                <span className="px-2 py-1 rounded-full bg-white/20 text-xs text-white/80">
                  {assetTypes.find(type => type.value === asset.type)?.label}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-white font-medium">{asset.value.toLocaleString()}€</span>
                <button
                  onClick={() => onRemoveAsset(index)}
                  className="text-white/60 hover:text-red-400 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            {asset.description && (
              <p className="text-white/60 text-sm">{asset.description}</p>
            )}
          </div>
        ))}
      </div>

      {/* Add new asset form */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            value={newAsset.name}
            onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
            placeholder="Nom de l'actif"
            className="p-3 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--rivela-accent))]"
            onKeyPress={handleKeyPress}
          />
          <select
            value={newAsset.type}
            onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value as Asset['type'] })}
            className="p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--rivela-accent))]"
          >
            {assetTypes.map((type) => (
              <option key={type.value} value={type.value} className="bg-gray-800">
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-3">
          <input
            type="number"
            value={newAsset.value}
            onChange={(e) => setNewAsset({ ...newAsset, value: e.target.value })}
            placeholder="Valeur"
            className="flex-1 p-3 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--rivela-accent))]"
            onKeyPress={handleKeyPress}
          />
          <span className="flex items-center text-white/80 px-2">€</span>
          <button
            onClick={handleAddAsset}
            disabled={!newAsset.name.trim() || !newAsset.value.trim()}
            className="px-4 py-3 bg-[hsl(var(--rivela-accent))] hover:bg-[hsl(var(--rivela-accent))]/80 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
          </button>
        </div>

        <input
          type="text"
          value={newAsset.description}
          onChange={(e) => setNewAsset({ ...newAsset, description: e.target.value })}
          placeholder="Description (optionnel)"
          className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--rivela-accent))]"
          onKeyPress={handleKeyPress}
        />
      </div>
    </div>
  );
}
