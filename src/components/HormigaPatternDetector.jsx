import React, { useState, useEffect } from 'react';

/**
 * Componente que detecta y sugiere patrones de Gastos Hormiga
 * Si detecta gastos pequeños repetitivos, ofrece agregarlos al contenedor
 */
export default function HormigaPatternDetector({
  transactions = [],
  onPatternDetected,
  threshold = 500,
  minOccurrences = 3,
  darkMode = false
}) {
  const [detectedPattern, setDetectedPattern] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (transactions.length < minOccurrences) return;

    // Analizar patrones de gastos pequeños
    const recentTransactions = transactions.slice(-30); // Últimos 30 días
    const patterns = {};

    recentTransactions.forEach(t => {
      if (t.type === 'gasto-variable' && t.amount < threshold) {
        const key = `${t.description}-${t.category}`;
        patterns[key] = (patterns[key] || 0) + 1;
      }
    });

    // Encontrar patrones repetitivos
    const foundPattern = Object.entries(patterns).find(([_, count]) => count >= minOccurrences);

    if (foundPattern && !dismissed) {
      const [key, count] = foundPattern;
      const [description, category] = key.split('-');
      const totalSpent = recentTransactions
        .filter(t => t.description === description && t.category === category)
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

      setDetectedPattern({
        description,
        category,
        count,
        totalSpent,
        key
      });

      if (onPatternDetected) {
        onPatternDetected({ description, category, count, totalSpent });
      }
    }
  }, [transactions, threshold, minOccurrences, dismissed, onPatternDetected]);

  if (!detectedPattern || dismissed) return null;

  const reduction = detectedPattern.totalSpent / 2;
  const savings = Math.round(reduction);

  return (
    <div className={`fixed bottom-40 right-6 max-w-xs z-30 animate-slide-in ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
    } border rounded-lg shadow-lg overflow-hidden`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 flex justify-between items-center">
        <span className="text-white font-bold text-sm">🐜 Patrón Detectado</span>
        <button
          onClick={() => setDismissed(true)}
          className="text-white hover:bg-white/20 p-1 rounded transition text-lg"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className={`p-4 space-y-3 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        <p className="text-sm">
          Detectamos que gastas <strong>{detectedPattern.description}</strong> 
          {' '}<strong>{detectedPattern.count} veces</strong> en {detectedPattern.category}.
        </p>

        <div className={`p-3 rounded-lg ${
          darkMode ? 'bg-orange-900/30' : 'bg-orange-50'
        }`}>
          <div className="text-xs text-gray-600 dark:text-gray-400">Total gastado:</div>
          <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
            RD$ {detectedPattern.totalSpent.toFixed(2)}
          </div>
        </div>

        <p className="text-sm">
          Si reduces a la mitad, ahorrarías:
        </p>
        <div className={`p-3 rounded-lg ${
          darkMode ? 'bg-green-900/30' : 'bg-green-50'
        }`}>
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            💰 RD$ {savings.toFixed(2)}/mes
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => {
              setDismissed(true);
              if (onPatternDetected) {
                onPatternDetected({ ...detectedPattern, action: 'add-to-hormiga' });
              }
            }}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 rounded text-sm transition"
          >
            ✓ Aceptar
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold py-2 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Descartar
          </button>
        </div>
      </div>
    </div>
  );
}
