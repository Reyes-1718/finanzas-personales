import { useState, useEffect } from 'react';

/**
 * Hook para obtener la tasa de cambio USD -> DOP
 * Usa una API pública o permite configuración manual
 */
export const useExchangeRate = () => {
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Intentar obtener la tasa desde localStorage como fallback
  useEffect(() => {
    const storedRate = localStorage.getItem('exchange_rate_usd_dop');
    const storedDate = localStorage.getItem('exchange_rate_date');
    
    if (storedRate && storedDate) {
      setRate(parseFloat(storedRate));
      setLastUpdated(new Date(storedDate));
    }
  }, []);

  // Función para actualizar manualmente la tasa
  const updateRate = (newRate) => {
    setRate(newRate);
    setLastUpdated(new Date());
    localStorage.setItem('exchange_rate_usd_dop', newRate.toString());
    localStorage.setItem('exchange_rate_date', new Date().toISOString());
  };

  // Función para obtener la tasa desde una API
  const fetchRate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Opción 1: API del Banco Central de la República Dominicana (si está disponible)
      // Opción 2: exchangerate-api.com (requiere API key gratuita)
      // Opción 3: API alternativa
      
      // Por ahora, usar una tasa fija como ejemplo
      // En producción, deberías usar una API real
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      
      if (data && data.rates && data.rates.DOP) {
        const fetchedRate = data.rates.DOP;
        updateRate(fetchedRate);
        setLoading(false);
        return fetchedRate;
      } else {
        throw new Error('No se pudo obtener la tasa de cambio');
      }
    } catch (err) {
      console.error('Error al obtener tasa de cambio:', err);
      setError(err.message);
      setLoading(false);
      
      // Si falla, usar tasa por defecto
      if (!rate) {
        updateRate(58.50); // Tasa aproximada por defecto
      }
      return rate || 58.50;
    }
  };

  // Convertir de USD a DOP
  const convertUSDtoDOP = (amountUSD) => {
    if (!rate) return amountUSD * 58.50; // Tasa por defecto
    return amountUSD * rate;
  };

  // Convertir de DOP a USD
  const convertDOPtoUSD = (amountDOP) => {
    if (!rate) return amountDOP / 58.50; // Tasa por defecto
    return amountDOP / rate;
  };

  return {
    rate,
    loading,
    error,
    lastUpdated,
    updateRate,
    fetchRate,
    convertUSDtoDOP,
    convertDOPtoUSD
  };
};
