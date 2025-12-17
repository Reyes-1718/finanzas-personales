import React, { useState } from 'react';

const DailyExpenses = ({ 
  onAddTransaction, 
  expenseCategories, 
  addExpenseCategory 
}) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: expenseCategories[0] || 'Otros Gastos',
    currency: 'DOP'
  });

  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'amount' && value) {
      const formatted = value.replace(/[^0-9.]/g, '');
      const parts = formatted.split('.');
      const limitedValue = parts.length > 2 
        ? parts[0] + '.' + parts.slice(1).join('').slice(0, 2)
        : formatted;
      
      setFormData(prev => ({
        ...prev,
        [name]: limitedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Por favor ingresa un monto válido');
      return;
    }

    if (!formData.category) {
      alert('Por favor selecciona una categoría');
      return;
    }

    // Agregar nueva categoría si es necesaria
    if (newCategory.trim() && formData.category === newCategory) {
      addExpenseCategory(newCategory);
    }

    // Agregar transacción como gasto variable (rápido)
    onAddTransaction({
      amount: formData.amount,
      description: formData.description,
      category: formData.category,
      type: 'gasto-variable',
      currency: formData.currency,
      paymentMethod: 'efectivo',
      date: new Date().toISOString().split('T')[0]
    });

    // Resetear formulario
    setFormData({
      amount: '',
      description: '',
      category: expenseCategories[0] || 'Otros Gastos',
      currency: 'DOP'
    });
    setNewCategory('');
    setShowNewCategory(false);
    alert('✅ Gasto registrado rápidamente');
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold dark:text-white mb-4">Registro Rápido de Gastos</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Monto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Monto *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descripción
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ej: Compra en colmadón"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Categoría *
            </label>
            {!showNewCategory ? (
              <div className="space-y-2">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {expenseCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCategory(true)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  + Nueva Categoría
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Nombre de nueva categoría"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCategory(false);
                    setFormData(prev => ({ ...prev, category: newCategory }));
                  }}
                  className="text-sm text-green-600 dark:text-green-400 hover:underline"
                >
                  ✓ Usar esta categoría
                </button>
              </div>
            )}
          </div>

          {/* Moneda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Moneda
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
            >
              <option value="DOP">DOP (RD$)</option>
              <option value="USD">USD (US$)</option>
            </select>
          </div>

          {/* Botón Envío */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition dark:bg-green-700 dark:hover:bg-green-800"
          >
            🚀 Registrar Gasto Rápido
          </button>
        </form>

        {/* Info */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-800 dark:text-blue-300">
            💡 Registra rápidamente tus gastos diarios (colmadón, compras espontáneas, etc.)
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyExpenses;
