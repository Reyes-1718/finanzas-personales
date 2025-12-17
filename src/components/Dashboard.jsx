import React, { useState, useMemo, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#6B7280'];

const Dashboard = ({ 
  transactions, 
  selectedMonth, 
  selectedYear, 
  calculateBalance,
  deleteTransaction
}) => {
  const [sortBy, setSortBy] = useState('date'); // 'date', 'amount', 'category'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

  // Función para convertir USD a DOP (memoizada)
  const convertToDOP = useCallback((amount, currency) => {
    const rate = localStorage.getItem('exchange_rate_usd_dop') 
      ? parseFloat(localStorage.getItem('exchange_rate_usd_dop')) 
      : 63.52;
    if (currency === 'USD') {
      return parseFloat(amount) * rate;
    }
    return parseFloat(amount);
  }, []);

  // Filtrar transacciones del mes seleccionado
  const monthTransactions = useMemo(() => {
    return transactions.filter(t => {
      const date = new Date(t.date);
      return date.getFullYear() === selectedYear && date.getMonth() === selectedMonth;
    }).sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'date') {
        comparison = new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'amount') {
        comparison = parseFloat(a.amount) - parseFloat(b.amount);
      } else if (sortBy === 'category') {
        comparison = a.category.localeCompare(b.category);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [transactions, selectedMonth, selectedYear, sortBy, sortOrder]);

  // Calcular balance del mes
  const balance = useMemo(() => calculateBalance(monthTransactions), [monthTransactions, calculateBalance]);

  // Calcular ingresos y gastos totales (convertidos a DOP)
  const { totalIncome, totalExpenses } = useMemo(() => {
    const income = monthTransactions
      .filter(t => t.type === 'ingreso')
      .reduce((sum, t) => sum + convertToDOP(t.amount, t.currency), 0);
    
    const expenses = monthTransactions
      .filter(t => t.type !== 'ingreso')
      .reduce((sum, t) => sum + convertToDOP(t.amount, t.currency), 0);
    
    return { totalIncome: income, totalExpenses: expenses };
  }, [monthTransactions, convertToDOP]);

  // Preparar datos para el gráfico de pastel (gastos por categoría)
  const expensesByCategory = useMemo(() => {
    const categoryMap = {};
    
    monthTransactions
      .filter(t => t.type !== 'ingreso')
      .forEach(t => {
        const amountInDOP = convertToDOP(t.amount, t.currency);
        categoryMap[t.category] = (categoryMap[t.category] || 0) + amountInDOP;
      });
    
    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2))
    }));
  }, [monthTransactions, convertToDOP]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const formatCurrency = (amount, currency = 'DOP') => {
    const symbol = currency === 'USD' ? 'US$' : 'RD$';
    return `${symbol} ${new Intl.NumberFormat('es-DO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)}`;
  };

  const getTypeLabel = (type, incomeType) => {
    switch(type) {
      case 'ingreso': 
        return incomeType === 'sueldo' ? 'Ingreso - Sueldo' : 'Ingreso - Extra';
      case 'gasto-fijo': return 'Gasto Fijo';
      case 'gasto-variable': return 'Gasto Variable';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Ingresos</h3>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Gastos</h3>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Balance</h3>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(balance)}
          </p>
        </div>
      </div>

      {/* Gráfico de gastos por categoría */}
      {expensesByCategory.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold dark:text-white mb-4">Distribución de Gastos por Categoría</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expensesByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expensesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Tabla de transacciones */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold dark:text-white">Movimientos del Mes</h3>
        </div>
        
        {monthTransactions.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
            No hay transacciones para este mes
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort('date')}
                  >
                    Fecha {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort('category')}
                  >
                    Categoría {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort('amount')}
                  >
                    Monto {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {monthTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {new Date(transaction.date).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {transaction.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.type === 'ingreso' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                          : transaction.type === 'gasto-fijo'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                          : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100'
                      }`}>
                        {getTypeLabel(transaction.type, transaction.incomeType)}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                      transaction.type === 'ingreso' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'ingreso' ? '+' : '-'}
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <button
                        onClick={() => {
                          if (window.confirm('¿Estás seguro de que deseas eliminar esta transacción?')) {
                            deleteTransaction(transaction.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-medium"
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
