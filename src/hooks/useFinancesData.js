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
   * Calcular balance (ingresos - gastos)
   */
  const calculateBalance = (transactions) => {
    return transactions.reduce((acc, t) => {
      if (t.type === 'ingreso') {
        return acc + parseFloat(t.amount);
      } else {
        return acc - parseFloat(t.amount);
      }
    }, 0);
  };

  /**
   * Calcular proyección de gastos para el próximo mes
   * Suma de gastos fijos + promedio de gastos variables de los últimos 3 meses
   */
  const calculateProjection = () => {
    const now = new Date();
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    
    // Obtener transacciones de los últimos 3 meses
    const recentTransactions = data.transactions.filter(t => {
      const date = new Date(t.date);
      return date >= threeMonthsAgo;
    });

    // Gastos fijos
    const fixedExpenses = recentTransactions
      .filter(t => t.type === 'gasto-fijo')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    // Gastos variables por mes
    const variableExpensesByMonth = {};
    recentTransactions
      .filter(t => t.type === 'gasto-variable')
      .forEach(t => {
        const date = new Date(t.date);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        variableExpensesByMonth[monthKey] = (variableExpensesByMonth[monthKey] || 0) + parseFloat(t.amount);
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

  return {
    data,
    loading,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    addIncomeCategory,
    addExpenseCategory,
    exportData,
    importData,
    clearAllData,
    getTransactionsByMonth,
    calculateBalance,
    calculateProjection
  };
};
