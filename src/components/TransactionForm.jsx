import React, { useState } from 'react';
import { PAYMENT_METHODS } from '../config/categoryConfig';

const TransactionForm = ({ 
  onAddTransaction,
  onAddRecurring,
  incomeCategories, 
  expenseCategories, 
  addIncomeCategory, 
  addExpenseCategory 
}) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    type: 'gasto-variable',
    incomeType: 'sueldo',
    currency: 'DOP',
    paymentMethod: 'efectivo'
  });

  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('mensual');
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);

  const getCurrentCategories = () => {
    return formData.type === 'ingreso' ? incomeCategories : expenseCategories;
  };

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
    } else if (name === 'type') {
      const newCategories = value === 'ingreso' ? incomeCategories : expenseCategories;
      setFormData(prev => ({
        ...prev,
        [name]: value,
        category: newCategories[0] || ''
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
      if (formData.type === 'ingreso') {
        addIncomeCategory(newCategory);
      } else {
        addExpenseCategory(newCategory);
      }
    }

    // Agregar transacción
    onAddTransaction(formData);

    // Si es recurrente, agregar transacción recurrente
    if (isRecurring) {
      onAddRecurring({
        ...formData,
        frequency: recurringFrequency,
        active: true
      });
    }

    // Resetear formulario
    setFormData({
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      category: expenseCategories[0] || '',
      type: 'gasto-variable',
      incomeType: 'sueldo',
      currency: 'DOP',
      paymentMethod: 'efectivo'
    });
    setNewCategory('');
    setShowNewCategory(false);
    setIsRecurring(false);
  };

  const categories = getCurrentCategories();

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Agregar Transacción</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Tipo de Transacción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tipo de Transacción
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
          >
            <option value="ingreso">Ingreso</option>
            <option value="gasto-fijo">Gasto Fijo</option>
            <option value="gasto-variable">Gasto Variable</option>
          </select>
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

        {/* Monto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Monto
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
          />
        </div>

        {/* Tipo de Ingreso (solo para ingresos) */}
        {formData.type === 'ingreso' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tipo de Ingreso
            </label>
            <select
              name="incomeType"
              value={formData.incomeType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
            >
              <option value="sueldo">Sueldo</option>
              <option value="extra">Extra</option>
            </select>
          </div>
        )}

        {/* Categoría */}
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
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
            {newCategory && <option value={newCategory}>{newCategory} (nueva)</option>}
          </select>
        </div>

        {/* Método de Pago */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Método de Pago
          </label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
          >
            {PAYMENT_METHODS.map(method => (
              <option key={method.id} value={method.id}>
                {method.emoji} {method.name}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fecha
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
          />
        </div>
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Descripción (opcional)
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Ej: Mercado Jumbo - Compra de viandas"
          rows="2"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
        />
      </div>

      {/* Nueva Categoría */}
      <div>
        <label className="flex items-center text-sm">
          <input
            type="checkbox"
            checked={showNewCategory}
            onChange={(e) => setShowNewCategory(e.target.checked)}
            className="mr-2"
          />
          <span className="text-gray-700 dark:text-gray-300">Agregar nueva categoría</span>
        </label>
        {showNewCategory && (
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nombre de la nueva categoría"
            className="w-full mt-2 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
          />
        )}
      </div>

      {/* Transacción Recurrente */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <label className="flex items-center text-sm">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="mr-2"
          />
          <span className="text-gray-700 dark:text-gray-300 font-medium">Esta es una transacción recurrente</span>
        </label>
        
        {isRecurring && (
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Frecuencia
            </label>
            <select
              value={recurringFrequency}
              onChange={(e) => setRecurringFrequency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
            >
              <option value="diaria">Diaria</option>
              <option value="semanal">Semanal</option>
              <option value="quincenal">Quincenal</option>
              <option value="mensual">Mensual</option>
              <option value="anual">Anual</option>
            </select>
          </div>
        )}
      </div>

      {/* Botón de Envío */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition dark:bg-blue-700 dark:hover:bg-blue-800"
      >
        Agregar Transacción
      </button>
    </form>
  );
};

export default TransactionForm;
