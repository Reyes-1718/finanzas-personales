/**
 * Utilidades de moneda compartidas para toda la app.
 * Tasa de cambio USD → DOP.
 */

import { STORAGE_KEYS } from '../constants/storageKeys';

/** Tasa de cambio por defecto cuando no hay valor en localStorage */
export const DEFAULT_EXCHANGE_RATE = 63.52;

/**
 * Obtener la tasa de cambio guardada en localStorage, o la tasa por defecto.
 * @returns {number}
 */
export const getStoredExchangeRate = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.EXCHANGE_RATE);
  return stored ? parseFloat(stored) : DEFAULT_EXCHANGE_RATE;
};

/**
 * Convertir un monto a DOP según su moneda.
 * Si se proporciona rateOverride (tasa guardada en la transacción), se usa esa.
 * De lo contrario, se usa la tasa global actual del localStorage.
 *
 * @param {number|string} amount
 * @param {'DOP'|'USD'} currency
 * @param {number|null} rateOverride  - Tasa específica de la transacción (opcional)
 * @returns {number}
 */
export const convertToDOP = (amount, currency, rateOverride = null) => {
  const num = parseFloat(amount) || 0;
  if (currency === 'USD') {
    const rate = rateOverride !== null ? rateOverride : getStoredExchangeRate();
    return num * rate;
  }
  return num;
};

/**
 * Formatear un monto como moneda con símbolo.
 * @param {number} amount
 * @param {'DOP'|'USD'} currency
 * @returns {string}
 */
export const formatCurrency = (amount, currency = 'DOP') => {
  const symbol = currency === 'USD' ? 'US$' : 'RD$';
  return `${symbol} ${new Intl.NumberFormat('es-DO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)}`;
};
