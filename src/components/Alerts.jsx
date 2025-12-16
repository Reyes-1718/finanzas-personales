import React from 'react';

const Alerts = ({ alerts, dismissAlert, settings, updateSettings }) => {
  const handleSettingChange = (setting, value) => {
    const newSettings = { ...settings, ...{ [setting]: value } };
    updateSettings(newSettings);
  };

  return (
    <div className="space-y-6">
      {/* Configuración de Alertas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Configuración de Alertas</h2>
        
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.enableDailyAlert}
              onChange={(e) => handleSettingChange('enableDailyAlert', e.target.checked)}
              className="mr-3"
            />
            <span className="text-gray-900 dark:text-white">Alertar si supero límite diario</span>
          </label>

          {settings.enableDailyAlert && (
            <div className="ml-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Límite Diario (RD$)
              </label>
              <input
                type="number"
                value={settings.dailyLimit}
                onChange={(e) => handleSettingChange('dailyLimit', parseFloat(e.target.value))}
                step="100"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
              />
            </div>
          )}

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.enableBudgetAlert}
              onChange={(e) => handleSettingChange('enableBudgetAlert', e.target.checked)}
              className="mr-3"
            />
            <span className="text-gray-900 dark:text-white">Alertar al superar presupuesto</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.enableHighExpenseAlert}
              onChange={(e) => handleSettingChange('enableHighExpenseAlert', e.target.checked)}
              className="mr-3"
            />
            <span className="text-gray-900 dark:text-white">Alertar por gastos muy altos</span>
          </label>
        </div>
      </div>

      {/* Alertas Activas */}
      {alerts.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Alertas Recientes</h3>
          <div className="space-y-2">
            {alerts.map(alert => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg flex justify-between items-start border-l-4 ${
                  alert.severity === 'error'
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                    : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                }`}
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{alert.message}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {new Date(alert.timestamp).toLocaleString('es-DO')}
                  </p>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;
