import React, { useState } from 'react';
import { convertToDOP } from '../utils/currency';

const Budgets = ({ budgets, setBudget, getAllBudgetsForMonth, deleteBudget, transactions, month, year, categories, monthlyIncome = 0, getAutoBudgetAmount, getSuggestedBudgets, applyAutoBudgets }) => {
    // Diagnóstico
    console.log('Budgets recibió props:', { budgets, setBudget, getAllBudgetsForMonth, deleteBudget, categories, monthlyIncome, getAutoBudgetAmount });
  
  const [formData, setFormData] = useState({
    category: '',
    amount: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.amount) {
      alert('Por favor completa todos los campos');
      return;
    }
    setBudget(formData.category, parseFloat(formData.amount), month, year);
    setFormData({ category: '', amount: '' });
  };

  const handleApplyAutoBudget = () => {
    if (!monthlyIncome) {
      alert('No se puede calcular presupuesto automático sin ingreso mensual');
      return;
    }
    
    if (window.confirm(`¿Aplicar presupuesto automático del 40% del ingreso (RD$ ${getAutoBudgetAmount(monthlyIncome).toFixed(2)}) distribuido entre ${categories.length} categorías?`)) {
      applyAutoBudgets(monthlyIncome, categories, month, year);
      alert('Presupuestos automáticos aplicados correctamente');
    }
  };

  const monthBudgets = getAllBudgetsForMonth(month, year);
  
  const getSpentByCategory = (category) => {
    return transactions
      .filter(t => t.category === category && t.type.includes('gasto'))
      .reduce((sum, t) => {
        return sum + convertToDOP(t.amount, t.currency, t.exchangeRate);
      }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Presupuesto Mensual</h2>
        
        {/* Información de presupuesto automático */}
        {monthlyIncome > 0 && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">💡 Presupuesto Automático Disponible</p>
                <p className="text-xs text-blue-700 dark:text-blue-300">40% de tu ingreso mensual = RD$ {getAutoBudgetAmount(monthlyIncome).toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <button
                onClick={handleApplyAutoBudget}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
              >
                Aplicar Automático
              </button>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Categoría
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
              >
                <option value="">Seleccionar categoría</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Monto Presupuestado (RD$)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="5000"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition"
          >
            Asignar Presupuesto Manual
          </button>
        </form>

        <div className="space-y-3">
          {monthBudgets.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No hay presupuestos asignados</p>
          ) : (
            monthBudgets.map(budget => {
              const spent = getSpentByCategory(budget.category);
              const percentage = (spent / budget.amount) * 100;
              const isExceeded = spent > budget.amount;

              return (
                <div key={budget.key} className={`p-4 rounded-lg border-l-4 ${
                  isExceeded ? 'bg-red-50 dark:bg-red-900/20 border-red-500' : 'bg-green-50 dark:bg-green-900/20 border-green-500'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{budget.category}</h4>
                    <button
                      onClick={() => deleteBudget(budget.category, month, year)}
                      className="text-red-600 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      RD$ {spent.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / RD$ {budget.amount.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className={`font-semibold ${isExceeded ? 'text-red-600' : 'text-green-600'}`}>
                      {Math.round(percentage)}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${isExceeded ? 'bg-red-600' : 'bg-green-600'}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Budgets;
