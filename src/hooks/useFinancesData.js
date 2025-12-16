import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const STORAGE_KEY = 'finanzas_data';
// Nota: establece VITE_ENCRYPTION_KEY en .env.local para producción; evita exponerla en el repo
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'cambia-esta-clave-en-.env';

const encryptData = (payload) => {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(payload), ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Error al encriptar datos:', error);
    return null;
  }
};

const decryptData = (cipherText) => {
  if (!cipherText) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted ? JSON.parse(decrypted) : null;
  } catch (error) {
    console.error('Error al desencriptar datos:', error);
    return null;
  }
};

// Estructura inicial de datos
const initialData = {
  transactions: [],
  recurringTransactions: [],
  incomeCategories: [
    'Salario',
    'Freelance',
    'Inversiones',
    'Bonos',
    'Propinas',
    'Ventas',
    'Alquiler',
    'Otros Ingresos'
  ],
  expenseCategories: [
    'Alimentación',
    'Transporte',
    'Vivienda',
    'Servicios',
    'Entretenimiento',
    'Salud',
    'Educación',
    'Ropa',
    'Tecnología',
    'Otros Gastos'
  ]
};

/**
 * Hook personalizado para manejar la persistencia de datos financieros en LocalStorage
 * @returns {Object} - Objeto con datos y funciones para manipularlos
 */
export const useFinancesData = () => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);

  // Cargar datos desde LocalStorage al iniciar
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      const decrypted = decryptData(storedData);

      if (decrypted) {
        setData({
          ...initialData,
          ...decrypted,
          incomeCategories: decrypted.incomeCategories || initialData.incomeCategories,
          expenseCategories: decrypted.expenseCategories || initialData.expenseCategories
        });
      }
    } catch (error) {
      console.error('Error al cargar datos desde LocalStorage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sincronizar cambios con LocalStorage
  useEffect(() => {
    if (!loading) {
      try {
        const encrypted = encryptData(data);
        if (encrypted) {
          localStorage.setItem(STORAGE_KEY, encrypted);
        }
      } catch (error) {
        console.error('Error al guardar datos en LocalStorage:', error);
      }
    }
  }, [data, loading]);

  /**
   * Agregar una nueva transacción
   */
  const addTransaction = (transaction) => {
    const newTransaction = {
      id: Date.now().toString(),
      ...transaction,
      date: transaction.date || new Date().toISOString().split('T')[0]
    };
    
    setData(prev => ({
      ...prev,
      transactions: [...prev.transactions, newTransaction]
    }));
  };

  /**
   * Eliminar una transacción
   */
  const deleteTransaction = (id) => {
    setData(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
  };

  /**
   * Actualizar una transacción existente
   */
  const updateTransaction = (id, updatedTransaction) => {
    setData(prev => ({
      ...prev,
      transactions: prev.transactions.map(t => 
        t.id === id ? { ...t, ...updatedTransaction } : t
      )
    }));
  };

  /**
   * Agregar una nueva categoría de ingreso
   */
  const addIncomeCategory = (category) => {
    if (!data.incomeCategories.includes(category)) {
      setData(prev => ({
        ...prev,
        incomeCategories: [...prev.incomeCategories, category]
      }));
    }
  };

  /**
   * Agregar una nueva categoría de gasto
   */
  const addExpenseCategory = (category) => {
    if (!data.expenseCategories.includes(category)) {
      setData(prev => ({
        ...prev,
        expenseCategories: [...prev.expenseCategories, category]
      }));
    }
  };

  /**
   * Exportar datos como JSON
   */
  const exportData = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finanzas_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /**
   * Importar datos desde un archivo JSON
   */
  const importData = (jsonData) => {
    try {
      const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      
      // Validar estructura básica
      if (!parsed.transactions || !Array.isArray(parsed.transactions)) {
        throw new Error('Estructura de datos inválida');
      }

      setData({
        ...initialData,
        ...parsed,
        incomeCategories: parsed.incomeCategories || initialData.incomeCategories,
        expenseCategories: parsed.expenseCategories || initialData.expenseCategories
      });
      
      return { success: true, message: 'Datos importados exitosamente' };
    } catch (error) {
      console.error('Error al importar datos:', error);
      return { success: false, message: 'Error al importar datos: ' + error.message };
    }
  };

  /**
   * Limpiar todos los datos (reset)
   */
  const clearAllData = () => {
    setData(initialData);
    localStorage.removeItem(STORAGE_KEY);
  };

  /**
   * Obtener transacciones filtradas por mes y año
   */
  const getTransactionsByMonth = (year, month) => {
    return data.transactions.filter(transaction => {
      const date = new Date(transaction.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });
  };

  /**
   * Obtener tasa de cambio desde localStorage o usar defecto
   */
  const getExchangeRate = () => {
    const stored = localStorage.getItem('exchange_rate_usd_dop');
    return stored ? parseFloat(stored) : 63.52; // Tasa por defecto
  };

  /**
   * Convertir monto a DOP según la moneda
   */
  const convertToDOP = (amount, currency) => {
    const rate = getExchangeRate();
    if (currency === 'USD') {
      return parseFloat(amount) * rate;
    }
    return parseFloat(amount);
  };

  /**
   * Calcular balance (ingresos - gastos) con conversión de monedas
   */
  const calculateBalance = (transactions) => {
    return transactions.reduce((acc, t) => {
      const amountInDOP = convertToDOP(t.amount, t.currency);
      if (t.type === 'ingreso') {
        return acc + amountInDOP;
      } else {
        return acc - amountInDOP;
      }
    }, 0);
  };

  /**
   * Calcular proyección de gastos para el próximo mes
   * Suma de gastos fijos + promedio de gastos variables de los últimos 3 meses
   * Convierte USD a DOP usando la tasa de cambio actual
   */
  const calculateProjection = () => {
    const now = new Date();
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    
    // Obtener transacciones de los últimos 3 meses
    const recentTransactions = data.transactions.filter(t => {
      const date = new Date(t.date);
      return date >= threeMonthsAgo;
    });

    // Gastos fijos (convertidos a DOP)
    const fixedExpenses = recentTransactions
      .filter(t => t.type === 'gasto-fijo')
      .reduce((sum, t) => sum + convertToDOP(t.amount, t.currency), 0);

    // Gastos variables por mes (convertidos a DOP)
    const variableExpensesByMonth = {};
    recentTransactions
      .filter(t => t.type === 'gasto-variable')
      .forEach(t => {
        const date = new Date(t.date);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        const amountInDOP = convertToDOP(t.amount, t.currency);
        variableExpensesByMonth[monthKey] = (variableExpensesByMonth[monthKey] || 0) + amountInDOP;
      });

    // Promedio de gastos variables
    const monthCount = Object.keys(variableExpensesByMonth).length || 1;
    const totalVariableExpenses = Object.values(variableExpensesByMonth).reduce((sum, val) => sum + val, 0);
    const avgVariableExpenses = totalVariableExpenses / monthCount;

    return {
      fixedExpenses,
      avgVariableExpenses,
      totalProjection: fixedExpenses + avgVariableExpenses
    };
  };

  /**
   * Agregar transacción recurrente
   */
  const addRecurringTransaction = (recurringData) => {
    const newRecurring = {
      id: Date.now().toString(),
      ...recurringData,
      createdAt: new Date().toISOString().split('T')[0],
      active: true
    };
    
    setData(prev => ({
      ...prev,
      recurringTransactions: [...prev.recurringTransactions, newRecurring]
    }));
  };

  /**
   * Actualizar transacción recurrente
   */
  const updateRecurringTransaction = (id, updatedData) => {
    setData(prev => ({
      ...prev,
      recurringTransactions: prev.recurringTransactions.map(t => 
        t.id === id ? { ...t, ...updatedData } : t
      )
    }));
  };

  /**
   * Eliminar transacción recurrente
   */
  const deleteRecurringTransaction = (id) => {
    setData(prev => ({
      ...prev,
      recurringTransactions: prev.recurringTransactions.filter(t => t.id !== id)
    }));
  };

  /**
   * Procesar transacciones recurrentes (se debe llamar diariamente)
   */
  const processRecurringTransactions = () => {
    const today = new Date();
    const processedIds = new Set();

    data.recurringTransactions.forEach(recurring => {
      if (!recurring.active) return;

      const lastProcessed = recurring.lastProcessed 
        ? new Date(recurring.lastProcessed)
        : new Date(recurring.createdAt);

      let shouldProcess = false;
      const nextDate = new Date(lastProcessed);

      if (recurring.frequency === 'diaria') {
        shouldProcess = today.getTime() - lastProcessed.getTime() >= 24 * 60 * 60 * 1000;
      } else if (recurring.frequency === 'semanal') {
        nextDate.setDate(nextDate.getDate() + 7);
        shouldProcess = today >= nextDate;
      } else if (recurring.frequency === 'mensual') {
        nextDate.setMonth(nextDate.getMonth() + 1);
        shouldProcess = today >= nextDate;
      } else if (recurring.frequency === 'anual') {
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        shouldProcess = today >= nextDate;
      }

      if (shouldProcess) {
        addTransaction({
          amount: recurring.amount,
          type: recurring.type,
          category: recurring.category,
          currency: recurring.currency,
          incomeType: recurring.incomeType,
          paymentMethod: recurring.paymentMethod,
          description: `[Recurrente] ${recurring.description}`,
          date: today.toISOString().split('T')[0]
        });

        updateRecurringTransaction(recurring.id, {
          lastProcessed: today.toISOString().split('T')[0]
        });

        processedIds.add(recurring.id);
      }
    });

    return processedIds.size > 0;
  };

  /**
   * Buscar transacciones por múltiples criterios
   */
  const searchTransactions = (criteria) => {
    return data.transactions.filter(t => {
      if (criteria.description && !t.description?.toLowerCase().includes(criteria.description.toLowerCase())) {
        return false;
      }
      if (criteria.category && t.category !== criteria.category) {
        return false;
      }
      if (criteria.type && t.type !== criteria.type) {
        return false;
      }
      if (criteria.currency && t.currency !== criteria.currency) {
        return false;
      }
      if (criteria.paymentMethod && t.paymentMethod !== criteria.paymentMethod) {
        return false;
      }
      if (criteria.minAmount && parseFloat(t.amount) < criteria.minAmount) {
        return false;
      }
      if (criteria.maxAmount && parseFloat(t.amount) > criteria.maxAmount) {
        return false;
      }
      if (criteria.startDate && t.date < criteria.startDate) {
        return false;
      }
      if (criteria.endDate && t.date > criteria.endDate) {
        return false;
      }
      return true;
    });
  };

  /**
   * Obtener estadísticas avanzadas
   */
  const getAdvancedStats = (transactions) => {
    if (transactions.length === 0) {
      return {
        averagePerCategory: {},
        largestExpenses: [],
        topCategories: [],
        dailyAverage: 0,
        transactionCount: 0
      };
    }

    const stats = {
      averagePerCategory: {},
      largestExpenses: [],
      topCategories: [],
      dailyAverage: 0,
      transactionCount: transactions.length
    };

    // Calcular promedio por categoría
    const categoryTotals = {};
    const categoryCounts = {};

    transactions.forEach(t => {
      const amountInDOP = convertToDOP(t.amount, t.currency);
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + amountInDOP;
      categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
    });

    Object.keys(categoryTotals).forEach(cat => {
      stats.averagePerCategory[cat] = categoryTotals[cat] / categoryCounts[cat];
    });

    // Top 5 gastos más grandes
    stats.largestExpenses = transactions
      .map(t => ({
        ...t,
        amountInDOP: convertToDOP(t.amount, t.currency)
      }))
      .sort((a, b) => b.amountInDOP - a.amountInDOP)
      .slice(0, 5);

    // Top categorías
    stats.topCategories = Object.entries(categoryTotals)
      .map(([cat, total]) => ({ category: cat, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    // Promedio diario
    const uniqueDates = new Set(transactions.map(t => t.date)).size;
    const totalAmount = transactions.reduce((sum, t) => sum + convertToDOP(t.amount, t.currency), 0);
    stats.dailyAverage = totalAmount / (uniqueDates || 1);

    return stats;
  };

  /**
   * Obtener gastos por día para el mes
   */
  const getDailyExpenses = (year, month) => {
    const monthTransactions = getTransactionsByMonth(year, month)
      .filter(t => t.type.includes('gasto'));

    const dailyMap = {};
    monthTransactions.forEach(t => {
      if (!dailyMap[t.date]) {
        dailyMap[t.date] = 0;
      }
      dailyMap[t.date] += convertToDOP(t.amount, t.currency);
    });

    return Object.entries(dailyMap).map(([date, total]) => ({
      date,
      total,
      dayOfWeek: new Date(date).toLocaleDateString('es-DO', { weekday: 'short' })
    }));
  };

  return {
    data,
    loading,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    addIncomeCategory,
    addExpenseCategory,
    addRecurringTransaction,
    updateRecurringTransaction,
    deleteRecurringTransaction,
    processRecurringTransactions,
    exportData,
    importData,
    clearAllData,
    getTransactionsByMonth,
    calculateBalance,
    calculateProjection,
    searchTransactions,
    getAdvancedStats,
    getDailyExpenses
  };
};
