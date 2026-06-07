/**
 * Claves de localStorage usadas por la app.
 * Centralizar aquí evita typos y facilita migraciones.
 */
export const STORAGE_KEYS = {
  /** Datos principales cifrados con AES (transacciones, categorías) */
  FINANCES_DATA: 'finanzas_data',

  /** Fondo de emergencia */
  EMERGENCY_FUND: 'fondoEmergencia',

  /** Presupuestos mensuales por categoría */
  MONTHLY_BUDGETS: 'monthly_budgets',

  /** Metas de ahorro */
  SAVINGS_GOALS: 'savings_goals',

  /** Configuración de alertas */
  ALERT_SETTINGS: 'alert_settings',

  /** Tasa de cambio USD→DOP guardada manualmente */
  EXCHANGE_RATE: 'exchange_rate_usd_dop',

  /** Fecha de la última actualización de la tasa */
  EXCHANGE_RATE_DATE: 'exchange_rate_date'
};
