import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { DEFAULT_EXCHANGE_RATE } from '../utils/currency';

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
    const storedRate = localStorage.getItem(STORAGE_KEYS.EXCHANGE_RATE);
    const storedDate = localStorage.getItem(STORAGE_KEYS.EXCHANGE_RATE_DATE);

    if (storedRate && storedDate) {
      setRate(parseFloat(storedRate));
      setLastUpdated(new Date(storedDate));
    }
  }, []);

  // Función para actualizar manualmente la tasa
  const updateRate = (newRate) => {
    setRate(newRate);
    setLastUpdated(new Date());
    localStorage.setItem(STORAGE_KEYS.EXCHANGE_RATE, newRate.toString());
    localStorage.setItem(STORAGE_KEYS.EXCHANGE_RATE_DATE, new Date().toISOString());
  };

  // Función para obtener la tasa desde una API
  const fetchRate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Opción 1: API del Banco Central de la República Dominicana (si está disponible)
      // Opción 2: exchangerate-api.com (requiere API key gratuita)
      // Opción 3: API alternativa
      
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

      if (!rate) {
        updateRate(DEFAULT_EXCHANGE_RATE);
      }
      return rate || DEFAULT_EXCHANGE_RATE;
    }
  };

  // Convertir de USD a DOP
  const convertUSDtoDOP = (amountUSD) => {
    return amountUSD * (rate ?? DEFAULT_EXCHANGE_RATE);
  };

  // Convertir de DOP a USD
  const convertDOPtoUSD = (amountDOP) => {
    return amountDOP / (rate ?? DEFAULT_EXCHANGE_RATE);
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
