import { useState, useEffect } from 'react';

/**
 * Hook para manejar presupuestos mensuales por categoría
 * Soporta presupuesto automático del 40% del ingreso mensual
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

  /**
   * Calcular presupuesto total recomendado (40% del ingreso mensual)
   * @param {number} monthlyIncome - Ingreso mensual total
   * @returns {number} - 40% del ingreso mensual
   */
  const getAutoBudgetAmount = (monthlyIncome) => {
    if (!monthlyIncome) return 0;
    return Math.round((monthlyIncome * 0.40) * 100) / 100;
  };

  /**
   * Sugerir presupuesto automático del 40% del ingreso
   * Distribuido entre las categorías de gasto
   * @param {number} monthlyIncome - Ingreso mensual total
   * @param {Array} expenseCategories - Lista de categorías de gasto
   * @returns {Array} - Array de presupuestos sugeridos
   */
  const getSuggestedBudgets = (monthlyIncome, expenseCategories = []) => {
    if (!monthlyIncome || expenseCategories.length === 0) return [];

    const totalBudget = getAutoBudgetAmount(monthlyIncome);
    const perCategory = totalBudget / expenseCategories.length;

    return expenseCategories.map(category => ({
      category,
      suggestedAmount: Math.round(perCategory * 100) / 100,
      percentage: 40 / expenseCategories.length
    }));
  };

  /**
   * Aplicar presupuestos automáticos para el mes/año especificado
   * @param {number} monthlyIncome - Ingreso mensual total
   * @param {Array} expenseCategories - Lista de categorías de gasto
   * @param {number} month - Mes (0-11)
   * @param {number} year - Año
   */
  const applyAutoBudgets = (monthlyIncome, expenseCategories = [], month, year) => {
    const suggested = getSuggestedBudgets(monthlyIncome, expenseCategories);
    
    suggested.forEach(({ category, suggestedAmount }) => {
      setBudget(category, suggestedAmount, month, year);
    });
  };

  return {
    budgets,
    setBudget,
    getBudget,
    getAllBudgetsForMonth,
    deleteBudget,
    getAutoBudgetAmount,
    getSuggestedBudgets,
    applyAutoBudgets
  };
};
