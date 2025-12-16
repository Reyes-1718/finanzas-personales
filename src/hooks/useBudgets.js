import { useState, useEffect } from 'react';

/**
 * Hook para manejar presupuestos mensuales por categoría
 */
export const useBudgets = () => {
  const [budgets, setBudgets] = useState([]);
  const STORAGE_KEY = 'monthly_budgets';

  // Cargar presupuestos desde localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBudgets(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error al cargar presupuestos:', error);
    }
  }, []);

  // Guardar presupuestos en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
    } catch (error) {
      console.error('Error al guardar presupuestos:', error);
    }
  }, [budgets]);

  const setBudget = (category, amount, month, year) => {
    const key = `${category}-${year}-${month}`;
    const existing = budgets.find(b => b.key === key);
    
    if (existing) {
      setBudgets(budgets.map(b => b.key === key ? { ...b, amount } : b));
    } else {
      setBudgets([...budgets, { key, category, amount, month, year }]);
    }
  };

  const getBudget = (category, month, year) => {
    const key = `${category}-${year}-${month}`;
    const budget = budgets.find(b => b.key === key);
    return budget ? budget.amount : null;
  };

  const getAllBudgetsForMonth = (month, year) => {
    return budgets.filter(b => b.month === month && b.year === year);
  };

  const deleteBudget = (category, month, year) => {
    const key = `${category}-${year}-${month}`;
    setBudgets(budgets.filter(b => b.key !== key));
  };

  return {
    budgets,
    setBudget,
    getBudget,
    getAllBudgetsForMonth,
    deleteBudget
  };
};
