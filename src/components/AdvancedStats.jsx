import React from 'react';

const AdvancedStats = ({ stats, transactions }) => {
  if (!stats || !transactions.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-gray-600 dark:text-gray-400">No hay datos para mostrar estadísticas</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Gastos Más Grandes */}
      {stats.largestExpenses.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Top 5 Gastos Más Grandes</h3>
          <div className="space-y-2">
            {stats.largestExpenses.map((expense, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{expense.category}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{expense.date}</p>
                </div>
                <span className="font-semibold text-red-600">RD$ {expense.amountInDOP.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Categorías */}
      {stats.topCategories.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Categorías con Más Gasto</h3>
          <div className="space-y-2">
            {stats.topCategories.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="font-medium text-gray-900 dark:text-white">{item.category}</p>
                <span className="font-semibold text-blue-600">RD$ {item.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Promedios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Promedio Diario</h3>
          <p className="text-3xl font-bold text-green-600">RD$ {stats.dailyAverage.toFixed(2)}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Total de Transacciones</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.transactionCount}</p>
        </div>
      </div>

      {/* Promedio por Categoría */}
      {Object.keys(stats.averagePerCategory).length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Promedio por Categoría</h3>
          <div className="space-y-2">
            {Object.entries(stats.averagePerCategory).map(([cat, avg]) => (
              <div key={cat} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-900 dark:text-white">{cat}</p>
                <span className="font-semibold text-gray-700 dark:text-gray-300">RD$ {avg.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedStats;
