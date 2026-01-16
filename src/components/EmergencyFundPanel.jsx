import React, { useMemo, useState } from 'react';

const currencyFormat = (value) => {
  const num = Number(value || 0);
  return `RD$ ${num.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const EMERGENCY_CATEGORIES = ['Salud', 'Vivienda', 'Ingresos', 'Otros'];

const EmergencyFundPanel = ({
  fund,
  progress,
  shouldAlert,
  setMultiplier,
  setManualMeta,
  deposit,
  withdraw,
  getRateFromStorage
}) => {
  const [depositForm, setDepositForm] = useState({
    monto: '',
    moneda: 'DOP',
    tasaCambio: getRateFromStorage(),
    descripcion: ''
  });
  const [withdrawForm, setWithdrawForm] = useState({
    monto: '',
    moneda: 'DOP',
    tasaCambio: getRateFromStorage(),
    descripcion: '',
    categoria: EMERGENCY_CATEGORIES[0]
  });
  const [message, setMessage] = useState(null);

  const handleDeposit = (e) => {
    e.preventDefault();
    if (!depositForm.monto || Number(depositForm.monto) <= 0) {
      setMessage({ type: 'error', text: 'Ingresa un monto válido para depositar.' });
      return;
    }
    const result = deposit({
      monto: depositForm.monto,
      moneda: depositForm.moneda,
      tasaCambio: depositForm.moneda === 'USD' ? depositForm.tasaCambio : undefined,
      descripcion: depositForm.descripcion
    });
    setMessage(result.success ? { type: 'success', text: result.message } : { type: 'error', text: result.message });
    if (result.success) {
      setDepositForm((prev) => ({ ...prev, monto: '', descripcion: '' }));
    }
  };

  const handleWithdraw = (e) => {
    e.preventDefault();
    if (!withdrawForm.monto || Number(withdrawForm.monto) <= 0) {
      setMessage({ type: 'error', text: 'Ingresa un monto válido para retirar.' });
      return;
    }
    if (!window.confirm(`⚠️ Esto reducirá tu fondo de emergencia. ¿Estás seguro de usar RD$ ${withdrawForm.monto}?`)) {
      return;
    }
    const result = withdraw({
      monto: withdrawForm.monto,
      moneda: withdrawForm.moneda,
      tasaCambio: withdrawForm.moneda === 'USD' ? withdrawForm.tasaCambio : undefined,
      descripcion: withdrawForm.descripcion,
      categoria_emergencia: withdrawForm.categoria
    });
    setMessage(result.success ? { type: 'success', text: result.message } : { type: 'error', text: result.message });
    if (result.success) {
      setWithdrawForm((prev) => ({ ...prev, monto: '', descripcion: '' }));
    }
  };

  const exportCSV = () => {
    const header = 'fecha,tipo,montoDOP,montoOriginal,monedaOriginal,tasaCambio,categoria,descripcion\n';
    const rows = fund.transacciones.map((t) => [
      t.fecha,
      t.tipo,
      t.montoDOP,
      t.montoOriginal,
      t.monedaOriginal,
      t.tasaCambio,
      t.categoria_emergencia || '-',
      t.descripcion?.replace(/,/g, ';') || '-'
    ].join(','));

    const csv = header + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fondo_emergencia.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const payload = {
      meta: fund.meta,
      saldoActual: fund.saldoActual,
      multiplicador: fund.multiplicador,
      recommendedMeta: fund.recommendedMeta,
      manualMeta: fund.manualMeta,
      lastComputation: fund.lastComputation,
      configuracion: fund.configuracion,
      transacciones: fund.transacciones
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fondo_emergencia.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const printableReport = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    const rows = fund.transacciones
      .map(
        (t) => `<tr><td>${t.fecha}</td><td>${t.tipo}</td><td>${currencyFormat(t.montoDOP)}</td><td>${t.monedaOriginal} ${t.montoOriginal}</td><td>${t.categoria_emergencia || '-'}</td><td>${t.descripcion || ''}</td></tr>`
      )
      .join('');
    win.document.write(`
      <html>
        <head>
          <title>Reporte Fondo de Emergencia</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 16px; }
            h1 { margin-bottom: 8px; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th, td { border: 1px solid #ccc; padding: 6px; font-size: 12px; }
            th { background: #f5f5f5; }
          </style>
        </head>
        <body>
          <h1>Reporte Fondo de Emergencia</h1>
          <p>Meta actual: ${currencyFormat(fund.meta)} | Saldo: ${currencyFormat(fund.saldoActual)} | Progreso: ${progress.toFixed(0)}%</p>
          <p>Meta recomendada: ${currencyFormat(fund.recommendedMeta)} (multiplicador ${fund.multiplicador}x, meses analizados: ${fund.lastComputation.monthsUsed})</p>
          <table>
            <thead>
              <tr><th>Fecha</th><th>Tipo</th><th>Monto DOP</th><th>Monto Original</th><th>Categoría</th><th>Descripción</th></tr>
            </thead>
            <tbody>${rows || '<tr><td colspan="6">Sin movimientos</td></tr>'}</tbody>
          </table>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  const emptyState = fund.recommendedMeta === 0;

  return (
    <div className="space-y-6">
      {shouldAlert && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-800 p-4 flex items-center gap-2">
          ❗ Tu fondo de emergencia está por debajo del {fund.configuracion.umbral_alerta}% de la meta. ¡Aporta para reforzarlo!
        </div>
      )}

      {message && (
        <div className={`rounded-lg p-3 ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Fondo de Emergencia</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Ahorrado: {currencyFormat(fund.saldoActual)} / Meta: {currencyFormat(fund.meta)}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportCSV}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
            >
              📊 Exportar CSV
            </button>
            <button
              onClick={exportJSON}
              className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
            >
              📁 Exportar JSON
            </button>
            <button
              onClick={printableReport}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm"
            >
              🖨️ PDF del Fondo
            </button>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-1">
            <span>Progreso</span>
            <span className="font-semibold">{progress.toFixed(0)}%</span>
          </div>
          <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-green-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500">Meta calculada</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{currencyFormat(fund.recommendedMeta)}</p>
            <p className="text-xs text-gray-500">Basada en gastos fijos últimos 3 meses</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500">Meta aplicada</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{currencyFormat(fund.meta)}</p>
            <p className="text-xs text-gray-500">Multiplicador {fund.multiplicador}x</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500">Saldo disponible</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{currencyFormat(fund.saldoActual)}</p>
            <p className="text-xs text-gray-500">Actualizado: {fund.configuracion.ultima_actualizacion_meta || 'N/D'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Multiplicador (3-6 meses)</p>
            <input
              type="range"
              min="3"
              max="6"
              step="1"
              value={fund.multiplicador}
              onChange={(e) => setMultiplier(e.target.value)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
              <span>3x: Estabilidad básica</span>
              <span>6x: Máxima seguridad</span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Ajuste manual de meta</p>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min="0"
                placeholder="Ej: 50000"
                value={fund.manualMeta ?? ''}
                onChange={(e) => setManualMeta(e.target.value)}
                className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
              <button
                onClick={() => setManualMeta(null)}
                className="px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded"
              >
                Reset
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Útil si tus gastos fijos son variables o irregulares.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form onSubmit={handleDeposit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Aportar Ahora</h3>
            <span className="text-sm text-gray-500">Depósito</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">Monto</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={depositForm.monto}
                onChange={(e) => setDepositForm({ ...depositForm, monto: e.target.value })}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">Moneda</label>
              <select
                value={depositForm.moneda}
                onChange={(e) => setDepositForm({ ...depositForm, moneda: e.target.value })}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="DOP">DOP</option>
                <option value="USD">USD</option>
              </select>
            </div>
            {depositForm.moneda === 'USD' && (
              <div className="sm:col-span-2">
                <label className="text-sm text-gray-600 dark:text-gray-300">Tasa de cambio (día)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={depositForm.tasaCambio}
                  onChange={(e) => setDepositForm({ ...depositForm, tasaCambio: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            )}
            <div className="sm:col-span-2">
              <label className="text-sm text-gray-600 dark:text-gray-300">Descripción (opcional)</label>
              <input
                type="text"
                value={depositForm.descripcion}
                onChange={(e) => setDepositForm({ ...depositForm, descripcion: e.target.value })}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
          >
            Depositar en Fondo
          </button>
        </form>

        <form onSubmit={handleWithdraw} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Usar Fondo</h3>
            <span className="text-sm text-gray-500">Retiro</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">Monto</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={withdrawForm.monto}
                onChange={(e) => setWithdrawForm({ ...withdrawForm, monto: e.target.value })}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">Moneda</label>
              <select
                value={withdrawForm.moneda}
                onChange={(e) => setWithdrawForm({ ...withdrawForm, moneda: e.target.value })}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="DOP">DOP</option>
                <option value="USD">USD</option>
              </select>
            </div>
            {withdrawForm.moneda === 'USD' && (
              <div className="sm:col-span-2">
                <label className="text-sm text-gray-600 dark:text-gray-300">Tasa de cambio (día)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={withdrawForm.tasaCambio}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, tasaCambio: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            )}
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">Categoría emergencia</label>
              <select
                value={withdrawForm.categoria}
                onChange={(e) => setWithdrawForm({ ...withdrawForm, categoria: e.target.value })}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {EMERGENCY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm text-gray-600 dark:text-gray-300">Descripción</label>
              <input
                type="text"
                required
                value={withdrawForm.descripcion}
                onChange={(e) => setWithdrawForm({ ...withdrawForm, descripcion: e.target.value })}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <p className="text-xs text-red-600 flex items-center gap-1">⚠️ Este fondo es para situaciones críticas.</p>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md disabled:opacity-60"
            disabled={fund.saldoActual <= 0}
          >
            Usar Fondo
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Historial</h3>
          <span className="text-sm text-gray-500">Depósitos y retiros del fondo</span>
        </div>
        {fund.transacciones.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-400">Sin movimientos en el fondo.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 text-left text-gray-700 dark:text-gray-200">
                  <th className="px-3 py-2">Fecha</th>
                  <th className="px-3 py-2">Tipo</th>
                  <th className="px-3 py-2 text-right">Monto DOP</th>
                  <th className="px-3 py-2">Moneda</th>
                  <th className="px-3 py-2">Categoría</th>
                  <th className="px-3 py-2">Descripción</th>
                </tr>
              </thead>
              <tbody>
                {fund.transacciones.map((t) => (
                  <tr key={t.id} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="px-3 py-2 text-gray-900 dark:text-white">{t.fecha}</td>
                    <td className={`px-3 py-2 font-semibold ${t.tipo === 'deposito' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.tipo === 'deposito' ? 'Depósito' : 'Retiro'}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-900 dark:text-white">{currencyFormat(t.montoDOP)}</td>
                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{t.monedaOriginal} {t.montoOriginal}</td>
                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{t.categoria_emergencia || '-'}</td>
                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{t.descripcion || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {emptyState && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4">
          <p className="font-semibold">Registra al menos 1 mes de gastos fijos para calcular tu meta.</p>
          <p className="text-sm mt-1">Ejemplos: renta, servicios públicos, seguros, educación.</p>
        </div>
      )}
    </div>
  );
};

export default EmergencyFundPanel;
