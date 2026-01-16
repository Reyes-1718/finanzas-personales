import React from 'react';

const currencyFormat = (value) => {
  const num = Number(value || 0);
  return `RD$ ${num.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const EmergencyFundWidget = ({ meta, saldoActual, progress, shouldAlert, onOpenFund }) => {
  const metaDisplay = meta > 0 ? currencyFormat(meta) : 'Meta no disponible';
  const savedDisplay = currencyFormat(saldoActual);

  return (
    <div className={`rounded-lg shadow p-4 mb-4 border ${shouldAlert ? 'bg-red-50 border-red-200' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Fondo de Emergencia</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Ahorrado: {savedDisplay}</p>
        </div>
        <button
          type="button"
          onClick={onOpenFund}
          className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
        >
          Ver Fondo
        </button>
      </div>

      <div className="mb-2 flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
        <span>Meta: {metaDisplay}</span>
        <span className="font-semibold">{progress.toFixed(0)}%</span>
      </div>

      <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${shouldAlert ? 'bg-red-500' : 'bg-green-500'} transition-all duration-500`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {shouldAlert && (
        <p className="mt-3 text-xs text-red-700 font-medium flex items-center gap-1">
          ❗ Tu fondo está bajo la meta. Refuerza tu seguridad financiera.
        </p>
      )}
    </div>
  );
};

export default EmergencyFundWidget;
