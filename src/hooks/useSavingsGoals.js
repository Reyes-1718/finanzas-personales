import { useState, useEffect } from 'react';

/**
 * Hook para manejar metas de ahorro
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

  const addGoal = (goal) => {
    const newGoal = {
      id: Date.now().toString(),
      ...goal,
      createdAt: new Date().toISOString().split('T')[0],
      achieved: false
    };
    setGoals([...goals, newGoal]);
    return newGoal;
  };

  const updateGoal = (id, updatedGoal) => {
    setGoals(goals.map(g => g.id === id ? { ...g, ...updatedGoal } : g));
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

  return {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    getGoalProgress,
    getActiveGoals,
    getAchievedGoals
  };
};
