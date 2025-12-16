import React, { useState, useEffect } from 'react';
import { useExchangeRate } from '../hooks/useExchangeRate';

const ExchangeRateWidget = () => {
  const { rate, lastUpdated, updateRate, fetchRate, loading, error } = useExchangeRate();
  const [isEditing, setIsEditing] = useState(false);
  const [manualRate, setManualRate] = useState('');

  useEffect(() => {
    // Intentar obtener la tasa al cargar
    if (!rate) {
      fetchRate();
    }
  }, []);

  const handleUpdateRate = () => {
    const newRate = parseFloat(manualRate);
    if (newRate && newRate > 0) {
      updateRate(newRate);
      setIsEditing(false);
      setManualRate('');
    } else {
      alert('Ingresa una tasa válida');
    }
  };

  const handleFetchRate = async () => {
    await fetchRate();
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-blue-900">💱 Tasa de Cambio</h3>
        {lastUpdated && (
          <span className="text-xs text-blue-700">
            Actualizado: {lastUpdated.toLocaleDateString('es-DO')}
          </span>
        )}
      </div>

      {loading && <p className="text-sm text-blue-800">Cargando tasa...</p>}
      
      {error && (
        <p className="text-xs text-red-600 mb-2">
          Error: {error}
        </p>
      )}

      {!isEditing ? (
        <div>
          <p className="text-lg font-bold text-blue-900 mb-3">
            1 USD = RD$ {rate ? rate.toFixed(2) : '58.50'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleFetchRate}
              className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              🔄 Actualizar
            </button>
            <button
              onClick={() => {
                setIsEditing(true);
                setManualRate(rate?.toString() || '58.50');
              }}
              className="flex-1 px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
            >
              ✏️ Editar
            </button>
          </div>
        </div>
      ) : (
        <div>
          <input
            type="number"
            value={manualRate}
            onChange={(e) => setManualRate(e.target.value)}
            placeholder="Ej: 58.50"
            step="0.01"
            className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpdateRate}
              className="flex-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
            >
              ✓ Guardar
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setManualRate('');
              }}
              className="flex-1 px-3 py-1.5 bg-gray-400 text-white text-sm rounded hover:bg-gray-500 transition-colors"
            >
              ✕ Cancelar
            </button>
          </div>
        </div>
      )}

      <p className="text-xs text-blue-700 mt-2">
        💡 Puedes actualizar automáticamente o ingresar manualmente
      </p>
    </div>
  );
};

export default ExchangeRateWidget;
