import { FinancialData, EmotionalContext, Insight } from '../types';

export function exportToPDF(data: {
  question: string;
  financialData: FinancialData;
  emotionalContext: EmotionalContext;
  insights: Insight[];
}) {
  // Simulate PDF export - in a real app, you'd use a library like jsPDF
  console.log('Exporting to PDF:', data);
  
  // Create a simple text version for download
  const content = `
RIVELA - EXPLORATION FINANCIÈRE
===============================

Question: ${data.question}

RÉSUMÉ FINANCIER:
- Revenus: ${data.financialData.income.reduce((sum, item) => sum + item.amount, 0)}€
- Dépenses fixes: ${data.financialData.fixedExpenses.reduce((sum, item) => sum + item.amount, 0)}€
- Dépenses variables: ${data.financialData.variableExpenses.reduce((sum, item) => sum + item.amount, 0)}€

INSIGHTS PRINCIPAUX:
${data.insights.map((insight, index) => `${index + 1}. ${insight.title}: ${insight.description}`).join('\n')}

Généré le ${new Date().toLocaleDateString('fr-FR')}
  `.trim();

  // Create and download file
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rivela-exploration-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function shareByEmail(data: {
  question: string;
  financialData: FinancialData;
  emotionalContext: EmotionalContext;
  insights: Insight[];
}) {
  const subject = 'Mon exploration financière Rivela';
  const body = `
Bonjour,

J'ai utilisé Rivela pour analyser ma situation financière.

Question explorée: ${data.question}

Principaux insights:
${data.insights.slice(0, 3).map((insight, index) => `${index + 1}. ${insight.title}`).join('\n')}

Découvrez Rivela: https://rivela.finance

Cordialement
  `.trim();

  const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(mailtoUrl);
}
