import { useState, useEffect } from 'react';

/**
 * Hook para manejar alertas y límites
 */
export const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const STORAGE_KEY = 'alert_settings';

  const DEFAULT_SETTINGS = {
    dailyLimit: 5000,
    enableDailyAlert: true,
    enableBudgetAlert: true,
    enableHighExpenseAlert: true
  };

  // Cargar configuración desde localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      }
    } catch (error) {
      console.error('Error al cargar configuración de alertas:', error);
    }
  }, []);

  const getSettings = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  };

  const updateSettings = (settings) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  };

  const checkDailyLimit = (dailyTotal, settings) => {
    if (settings.enableDailyAlert && dailyTotal > settings.dailyLimit) {
      return {
        type: 'daily-limit',
        severity: 'warning',
        message: `Has excedido tu límite diario de RD$ ${settings.dailyLimit.toFixed(2)}`
      };
    }
    return null;
  };

  const checkBudgetExceeded = (spent, budgetAmount) => {
    if (spent > budgetAmount) {
      const percentage = (spent / budgetAmount) * 100;
      return {
        type: 'budget-exceeded',
        severity: 'error',
        message: `Has gastado el ${percentage.toFixed(0)}% de tu presupuesto`,
        percentage
      };
    }
    if (spent > budgetAmount * 0.8) {
      return {
        type: 'budget-warning',
        severity: 'warning',
        message: `Has gastado el 80% de tu presupuesto`,
        percentage: 80
      };
    }
    return null;
  };

  const addAlert = (alert) => {
    const newAlert = {
      id: Date.now().toString(),
      ...alert,
      timestamp: new Date().toISOString()
    };
    setAlerts(prev => [newAlert, ...prev].slice(0, 50)); // Guardar últimas 50
  };

  const dismissAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const clearOldAlerts = () => {
    const now = new Date();
    setAlerts(prev => 
      prev.filter(a => {
        const alertTime = new Date(a.timestamp);
        const hoursDiff = (now - alertTime) / (1000 * 60 * 60);
        return hoursDiff < 24;
      })
    );
  };

  return {
    alerts,
    getSettings,
    updateSettings,
    addAlert,
    dismissAlert,
    clearOldAlerts,
    checkDailyLimit,
    checkBudgetExceeded
  };
};
