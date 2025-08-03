import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Share2,
  FileText,
  Image,
  Mail,
  Printer,
  Link,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  CheckCircle,
  FileSpreadsheet,
  Calendar,
  Zap,
  Settings,
  Eye
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
// Removed external share dependencies for simplicity
import { FinancialData, EmotionalContext, JournalEntry } from '../../types';

interface ExportShareSystemProps {
  data: {
    financialData: FinancialData;
    emotionalContext: EmotionalContext;
    journalEntries?: JournalEntry[];
    insights?: any;
    simulationResults?: any;
  };
  targetElement?: React.RefObject<HTMLElement>;
  title?: string;
}

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  format: 'pdf' | 'image' | 'excel' | 'json' | 'csv';
  action: () => void;
}

interface ShareOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
}

export function ExportShareSystem({ data, targetElement, title = "Analyse Financière Rivela" }: ExportShareSystemProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'export' | 'share'>('export');
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  const { financialData, emotionalContext, journalEntries = [], insights, simulationResults } = data;

  // Calculate key metrics for sharing
  const totalIncome = financialData.income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = [
    ...financialData.fixedExpenses,
    ...financialData.variableExpenses,
    ...financialData.debts
  ].reduce((sum, item) => sum + item.amount, 0);
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

  const generateShareUrl = () => {
    // In a real app, this would create a shareable link with encrypted data
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      income: totalIncome.toString(),
      expenses: totalExpenses.toString(),
      balance: balance.toString(),
      savings_rate: savingsRate.toFixed(1),
      mood: emotionalContext.mood.toString()
    });
    return `${baseUrl}/shared-analysis?${params.toString()}`;
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    setExportProgress(20);

    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;

      // Header
      pdf.setFontSize(24);
      pdf.setTextColor(72, 61, 139);
      pdf.text(title, margin, 30);

      setExportProgress(40);

      // Date
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, margin, 45);

      // Financial Summary
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Résumé Financier', margin, 65);

      pdf.setFontSize(12);
      const summaryData = [
        `Revenus mensuels: ${totalIncome.toLocaleString()}€`,
        `Dépenses totales: ${totalExpenses.toLocaleString()}€`,
        `Solde mensuel: ${balance.toLocaleString()}€`,
        `Taux d'épargne: ${savingsRate.toFixed(1)}%`,
        `Niveau de satisfaction: ${emotionalContext.mood}/10`
      ];

      summaryData.forEach((line, index) => {
        pdf.text(line, margin, 85 + (index * 10));
      });

      setExportProgress(60);

      // Income Details
      pdf.text('Détail des Revenus', margin, 145);
      financialData.income.forEach((item, index) => {
        pdf.text(`• ${item.name}: ${item.amount.toLocaleString()}€`, margin + 5, 160 + (index * 8));
      });

      setExportProgress(80);

      // Expenses Details
      const startY = 160 + (financialData.income.length * 8) + 20;
      pdf.text('Détail des Dépenses', margin, startY);
      
      let currentY = startY + 15;
      const allExpenses = [
        ...financialData.fixedExpenses.map(e => ({ ...e, type: 'Fixe' })),
        ...financialData.variableExpenses.map(e => ({ ...e, type: 'Variable' })),
        ...financialData.debts.map(e => ({ ...e, type: 'Dette' }))
      ];

      allExpenses.forEach((expense, index) => {
        pdf.text(`• [${expense.type}] ${expense.name}: ${expense.amount.toLocaleString()}€`, margin + 5, currentY);
        currentY += 8;
        
        // Add new page if needed
        if (currentY > 270) {
          pdf.addPage();
          currentY = 30;
        }
      });

      setExportProgress(100);

      // Save PDF
      pdf.save(`${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const exportToImage = async () => {
    if (!targetElement?.current) return;

    setIsExporting(true);
    setExportProgress(50);

    try {
      const canvas = await html2canvas(targetElement.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      });

      setExportProgress(80);

      const link = document.createElement('a');
      link.download = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL();
      link.click();

      setExportProgress(100);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const exportToExcel = () => {
    // Prepare data for CSV export (simplified)
    const summaryData = [
      { metric: 'Revenus mensuels', value: totalIncome, unit: '€' },
      { metric: 'Dépenses totales', value: totalExpenses, unit: '€' },
      { metric: 'Solde mensuel', value: balance, unit: '€' },
      { metric: 'Taux d\'épargne', value: savingsRate.toFixed(1), unit: '%' },
      { metric: 'Satisfaction', value: emotionalContext.mood, unit: '/10' }
    ];

    const incomeData = financialData.income.map(item => ({
      type: 'Revenu',
      name: item.name,
      amount: item.amount,
      category: item.category || 'Non spécifié'
    }));

    const expenseData = [
      ...financialData.fixedExpenses.map(item => ({
        type: 'Dépense fixe',
        name: item.name,
        amount: item.amount,
        category: item.category || 'Non spécifié'
      })),
      ...financialData.variableExpenses.map(item => ({
        type: 'Dépense variable',
        name: item.name,
        amount: item.amount,
        category: item.category || 'Non spécifié'
      })),
      ...financialData.debts.map(item => ({
        type: 'Dette',
        name: item.name,
        amount: item.amount,
        category: 'Dette'
      }))
    ];

    // Export as CSV format
    const csvHeaders = 'Type,Nom,Montant,Catégorie\n';
    const csvData = [...incomeData, ...expenseData]
      .map(item => `${item.type},${item.name},${item.amount},${item.category}`)
      .join('\n');
    
    const csvContent = csvHeaders + csvData;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '_')}_data.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const exportData = {
      metadata: {
        title,
        exportDate: new Date().toISOString(),
        version: '1.0'
      },
      financialData,
      emotionalContext,
      journalEntries,
      insights,
      simulationResults,
      summary: {
        totalIncome,
        totalExpenses,
        balance,
        savingsRate
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '_')}_complete.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const shareToSocial = (platform: string) => {
    const url = generateShareUrl();
    const text = `Mon analyse financière Rivela: ${balance >= 0 ? '+' : ''}${balance.toLocaleString()}€ de solde mensuel, ${savingsRate.toFixed(1)}% d'épargne. Découvrez vos insights! #FinancePersonnelle #Rivela`;
    
    setShareUrl(url);
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
        break;
    }
  };

  const copyLink = () => {
    const url = generateShareUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportFormats: ExportFormat[] = [
    {
      id: 'pdf',
      name: 'PDF Complet',
      description: 'Rapport détaillé avec graphiques et analyses',
      icon: <FileText size={20} />,
      format: 'pdf',
      action: exportToPDF
    },
    {
      id: 'image',
      name: 'Image PNG',
      description: 'Capture d\'écran haute qualité du dashboard',
      icon: <Image size={20} />,
      format: 'image',
      action: exportToImage
    },
    {
      id: 'excel',
      name: 'Données Excel',
      description: 'Tableaux structurés pour analyses avancées',
      icon: <FileSpreadsheet size={20} />,
      format: 'excel',
      action: exportToExcel
    },
    {
      id: 'json',
      name: 'Données JSON',
      description: 'Export complet pour développeurs',
      icon: <Settings size={20} />,
      format: 'json',
      action: exportToJSON
    }
  ];

  const shareOptions: ShareOption[] = [
    {
      id: 'link',
      name: 'Copier le lien',
      icon: copied ? <CheckCircle size={20} /> : <Link size={20} />,
      color: 'bg-gray-500/20 text-gray-400',
      action: copyLink
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <Facebook size={20} />,
      color: 'bg-blue-600/20 text-blue-400',
      action: () => shareToSocial('facebook')
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: <Twitter size={20} />,
      color: 'bg-sky-500/20 text-sky-400',
      action: () => shareToSocial('twitter')
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: <Linkedin size={20} />,
      color: 'bg-blue-700/20 text-blue-400',
      action: () => shareToSocial('linkedin')
    },
    {
      id: 'email',
      name: 'Email',
      icon: <Mail size={20} />,
      color: 'bg-emerald-500/20 text-emerald-400',
      action: () => shareToSocial('email')
    }
  ];

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-[hsl(var(--rivela-accent))] hover:bg-[hsl(var(--rivela-accent))]/80 text-white p-3 rounded-lg transition-colors flex items-center"
        title="Exporter et partager"
      >
        <Share2 size={20} />
      </button>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowModal(false);
            }}
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glassmorphism rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Share2 className="mr-3" size={28} />
                  Exporter & Partager
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Tabs */}
              <div className="flex mb-6">
                <button
                  onClick={() => setActiveTab('export')}
                  className={`flex-1 py-3 px-6 rounded-l-lg transition-colors flex items-center justify-center ${
                    activeTab === 'export'
                      ? 'bg-[hsl(var(--rivela-accent))] text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <Download className="mr-2" size={18} />
                  Exporter
                </button>
                <button
                  onClick={() => setActiveTab('share')}
                  className={`flex-1 py-3 px-6 rounded-r-lg transition-colors flex items-center justify-center ${
                    activeTab === 'share'
                      ? 'bg-[hsl(var(--rivela-accent))] text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <Share2 className="mr-2" size={18} />
                  Partager
                </button>
              </div>

              {/* Export Tab */}
              {activeTab === 'export' && (
                <div className="space-y-4">
                  <p className="text-white/70 mb-6">
                    Téléchargez votre analyse financière dans différents formats
                  </p>
                  
                  {isExporting && (
                    <div className="mb-6 p-4 bg-white/10 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 border-2 border-[hsl(var(--rivela-accent))] border-t-transparent rounded-full animate-spin mr-3" />
                        <span className="text-white">Export en cours...</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className="bg-[hsl(var(--rivela-accent))] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${exportProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {exportFormats.map((format) => (
                      <button
                        key={format.id}
                        onClick={format.action}
                        disabled={isExporting}
                        className="p-4 bg-white/10 hover:bg-white/20 disabled:opacity-50 rounded-lg text-left transition-colors group"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 bg-[hsl(var(--rivela-accent))]/20 rounded-lg flex items-center justify-center text-[hsl(var(--rivela-accent))] group-hover:bg-[hsl(var(--rivela-accent))]/30">
                            {format.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-medium mb-1">{format.name}</h3>
                            <p className="text-white/70 text-sm">{format.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Tab */}
              {activeTab === 'share' && (
                <div className="space-y-4">
                  <p className="text-white/70 mb-6">
                    Partagez vos résultats financiers (données anonymisées)
                  </p>

                  {/* Privacy Notice */}
                  <div className="p-4 bg-blue-500/20 rounded-lg mb-6">
                    <div className="flex items-start">
                      <Eye className="text-blue-400 mt-0.5 mr-3 flex-shrink-0" size={18} />
                      <div className="text-sm">
                        <div className="text-blue-400 font-medium mb-1">Confidentialité</div>
                        <div className="text-white/80">
                          Seuls les métriques générales sont partagées (revenus, épargne, satisfaction). 
                          Aucune donnée personnelle ou détail spécifique n'est inclus.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {shareOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={option.action}
                        className={`p-4 rounded-lg text-left transition-colors hover:bg-white/20 ${option.color}`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                            {option.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-medium">{option.name}</h3>
                            {option.id === 'link' && copied && (
                              <p className="text-emerald-400 text-sm">Lien copié!</p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Preview Message */}
                  <div className="mt-6 p-4 bg-white/5 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Aperçu du message partagé:</h4>
                    <p className="text-white/70 text-sm">
                      "Mon analyse financière Rivela: {balance >= 0 ? '+' : ''}{balance.toLocaleString()}€ de solde mensuel, 
                      {savingsRate.toFixed(1)}% d'épargne. Découvrez vos insights! #FinancePersonnelle #Rivela"
                    </p>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-white/20 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}