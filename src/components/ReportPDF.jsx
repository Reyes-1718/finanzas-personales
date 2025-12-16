import React from 'react';

const ReportPDF = ({ transactions, month, year, calculateBalance, calculateProjection }) => {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const monthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getFullYear() === year && date.getMonth() === month;
  });

  const balance = calculateBalance(monthTransactions);
  const projection = calculateProjection();

  const totalIncome = monthTransactions
    .filter(t => t.type === 'ingreso')
    .reduce((sum, t) => {
      const rate = parseFloat(localStorage.getItem('exchange_rate_usd_dop') || 63.52);
      return sum + (t.currency === 'USD' ? parseFloat(t.amount) * rate : parseFloat(t.amount));
    }, 0);

  const totalFixed = monthTransactions
    .filter(t => t.type === 'gasto-fijo')
    .reduce((sum, t) => {
      const rate = parseFloat(localStorage.getItem('exchange_rate_usd_dop') || 63.52);
      return sum + (t.currency === 'USD' ? parseFloat(t.amount) * rate : parseFloat(t.amount));
    }, 0);

  const totalVariable = monthTransactions
    .filter(t => t.type === 'gasto-variable')
    .reduce((sum, t) => {
      const rate = parseFloat(localStorage.getItem('exchange_rate_usd_dop') || 63.52);
      return sum + (t.currency === 'USD' ? parseFloat(t.amount) * rate : parseFloat(t.amount));
    }, 0);

  const generateCSVReport = () => {
    let csv = 'REPORTE FINANCIERO\n';
    csv += `Mes: ${months[month]} ${year}\n`;
    csv += `Fecha de Generación: ${new Date().toLocaleString('es-DO')}\n`;
    csv += '\n=== RESUMEN ===\n';
    csv += `Total Ingresos,RD$ ${totalIncome.toFixed(2)}\n`;
    csv += `Total Gastos Fijos,RD$ ${totalFixed.toFixed(2)}\n`;
    csv += `Total Gastos Variables,RD$ ${totalVariable.toFixed(2)}\n`;
    csv += `Balance,RD$ ${balance.toFixed(2)}\n`;
    csv += '\n=== PROYECCIÓN SIGUIENTE MES ===\n';
    csv += `Gastos Fijos Proyectados,RD$ ${projection.fixedExpenses.toFixed(2)}\n`;
    csv += `Promedio Gastos Variables,RD$ ${projection.avgVariableExpenses.toFixed(2)}\n`;
    csv += `Total Proyectado,RD$ ${projection.totalProjection.toFixed(2)}\n`;
    csv += '\n=== TRANSACCIONES ===\n';
    csv += 'Fecha,Tipo,Categoría,Descripción,Monto,Moneda,Método Pago\n';
    
    monthTransactions.forEach(t => {
      csv += `${t.date},${t.type},${t.category},${t.description || '-'},${t.amount},${t.currency},${t.paymentMethod || '-'}\n`;
    });

    return csv;
  };

  const downloadCSV = () => {
    const csv = generateCSVReport();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte_finanzas_${months[month].toLowerCase()}_${year}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    const report = {
      mes: months[month],
      año: year,
      fechaGeneración: new Date().toISOString(),
      resumen: {
        totalIngresos: totalIncome,
        totalGastosFijos: totalFixed,
        totalGastosVariables: totalVariable,
        balance: balance
      },
      proyección: {
        gastosFijosProyectados: projection.fixedExpenses,
        promedioGastosVariables: projection.avgVariableExpenses,
        totalProyectado: projection.totalProjection
      },
      transacciones: monthTransactions
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte_finanzas_${months[month].toLowerCase()}_${year}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Reporte Mensual - {months[month]} {year}
        </h2>

        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Ingresos</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">RD$ {totalIncome.toFixed(2)}</p>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Gastos</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              RD$ {(totalFixed + totalVariable).toFixed(2)}
            </p>
          </div>

          <div className={`p-4 rounded-lg border ${
            balance >= 0
              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
              : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700'
          }`}>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Balance</p>
            <p className={`text-2xl font-bold ${
              balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-yellow-600 dark:text-yellow-400'
            }`}>
              RD$ {balance.toFixed(2)}
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Proyección Próx. Mes</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              RD$ {projection.totalProjection.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Detalles de Gastos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Gastos Fijos</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">RD$ {totalFixed.toFixed(2)}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Gastos Variables</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">RD$ {totalVariable.toFixed(2)}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Transacciones</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">{monthTransactions.length}</p>
          </div>
        </div>

        {/* Botones de Descarga */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={downloadCSV}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
          >
            📊 Descargar como CSV
          </button>
          <button
            onClick={downloadJSON}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition"
          >
            📁 Descargar como JSON
          </button>
        </div>
      </div>

      {/* Vista Previa de Transacciones */}
      {monthTransactions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Transacciones del Mes</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Fecha</th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Tipo</th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Categoría</th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Descripción</th>
                  <th className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">Monto</th>
                </tr>
              </thead>
              <tbody>
                {monthTransactions.slice(0, 10).map((t, idx) => (
                  <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-2 text-gray-900 dark:text-white">{t.date}</td>
                    <td className="px-4 py-2 text-gray-900 dark:text-white">{t.type}</td>
                    <td className="px-4 py-2 text-gray-900 dark:text-white">{t.category}</td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400 truncate">{t.description}</td>
                    <td className="px-4 py-2 text-right font-semibold text-gray-900 dark:text-white">
                      {t.currency === 'USD' ? 'US$' : 'RD$'} {t.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {monthTransactions.length > 10 && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Mostrando 10 de {monthTransactions.length} transacciones
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportPDF;
