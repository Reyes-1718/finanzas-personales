import { useState, useEffect } from 'react';

/**
 * Hook para manejar metas de ahorro
 * Soporta cálculo automático basado en ingresos mensuales y fecha límite
 */
export const useSavingsGoals = () => {
  const [goals, setGoals] = useState([]);
  const STORAGE_KEY = 'savings_goals';

  // Cargar metas desde localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setGoals(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error al cargar metas:', error);
    }
  }, []);

  // Guardar metas en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error('Error al guardar metas:', error);
    }
  }, [goals]);

  /**
   * Calcular el ahorro periódico necesario para alcanzar una meta
   * @param {number} targetAmount - Monto objetivo de la meta
   * @param {string} deadline - Fecha límite (YYYY-MM-DD)
   * @param {number} monthlyIncome - Ingreso mensual total
   * @returns {Object} - Objeto con detalles del cálculo
   */
  const calculatePeriodicSavings = (targetAmount, deadline, monthlyIncome) => {
    if (!targetAmount || !deadline || !monthlyIncome) {
      return { monthlySavings: 0, percentageOfIncome: 0, monthsRemaining: 0 };
    }

    const today = new Date();
    const deadlineDate = new Date(deadline);
    
    // Calcular meses restantes
    const monthsRemaining = Math.max(
      (deadlineDate.getFullYear() - today.getFullYear()) * 12 + 
      (deadlineDate.getMonth() - today.getMonth()),
      1
    );

    // Calcular ahorro mensual necesario
    const monthlySavings = targetAmount / monthsRemaining;
    
    // Calcular porcentaje del ingreso
    const percentageOfIncome = (monthlySavings / monthlyIncome) * 100;

    return {
      monthlySavings: Math.ceil(monthlySavings * 100) / 100,
      percentageOfIncome: Math.round(percentageOfIncome * 100) / 100,
      monthsRemaining,
      isAchievable: percentageOfIncome <= 100 // Es posible alcanzar si es <= 100% del ingreso
    };
  };

  const addGoal = (goal) => {
    const newGoal = {
      id: Date.now().toString(),
      ...goal,
      createdAt: new Date().toISOString().split('T')[0],
      achieved: false,
      // Incluir información de ingresos si se proporciona
      monthlyIncome: goal.monthlyIncome || null,
      savingsCalculation: null
    };
    
    // Calcular ahorro periódico si se tienen los datos necesarios
    if (goal.deadline && goal.targetAmount && goal.monthlyIncome) {
      newGoal.savingsCalculation = calculatePeriodicSavings(
        goal.targetAmount,
        goal.deadline,
        goal.monthlyIncome
      );
    }
    
    setGoals([...goals, newGoal]);
    return newGoal;
  };

  const updateGoal = (id, updatedGoal) => {
    setGoals(goals.map(g => {
      if (g.id === id) {
        const updated = { ...g, ...updatedGoal };
        
        // Recalcular ahorro periódico si cambió algún campo relevante
        if (updated.deadline || updated.targetAmount || updated.monthlyIncome) {
          updated.savingsCalculation = calculatePeriodicSavings(
            updated.targetAmount,
            updated.deadline,
            updated.monthlyIncome
          );
        }
        
        return updated;
      }
      return g;
    }));
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const getGoalProgress = (goalId, currentAmount) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return 0;
    return Math.min((currentAmount / goal.targetAmount) * 100, 100);
  };

  const getActiveGoals = () => {
    return goals.filter(g => !g.achieved);
  };

  const getAchievedGoals = () => {
    return goals.filter(g => g.achieved);
  };

  /**
   * Obtener sugerencia de meta basada en ingreso
   * Calcula una meta automática del 10% del ingreso anual
   */
  const getSuggestedGoal = (monthlyIncome) => {
    if (!monthlyIncome) return null;
    
    return {
      name: 'Meta de Ahorro Sugerida',
      description: 'Meta de ahorro automática basada en tu ingreso mensual',
      targetAmount: monthlyIncome * 12 * 0.10, // 10% del ingreso anual
      currentAmount: 0,
      category: 'Ahorro',
      deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      monthlyIncome: monthlyIncome
    };
  };

  return {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    getGoalProgress,
    getActiveGoals,
    getAchievedGoals,
    calculatePeriodicSavings,
    getSuggestedGoal
  };
};
