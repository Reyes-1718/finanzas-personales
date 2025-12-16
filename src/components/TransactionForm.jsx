import React, { useState } from 'react';

const TransactionForm = ({ onSubmit, incomeCategories, expenseCategories, onAddIncomeCategory, onAddExpenseCategory }) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    type: 'gasto-variable',
    incomeType: 'sueldo',
    currency: 'DOP'
  });

  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  // Obtener las categorías según el tipo de transacción
  const getCurrentCategories = () => {
    return formData.type === 'ingreso' ? incomeCategories : expenseCategories;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Si cambia el tipo, actualizar la categoría a la primera de la nueva lista
    if (name === 'type') {
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
    
    if (!formData.amount || !formData.description || !formData.category) {
      alert('Por favor, completa todos los campos obligatorios');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      alert('El monto debe ser mayor a 0');
      return;
    }

    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    });

    // Reset form
    const defaultCategories = formData.type === 'ingreso' ? incomeCategories : expenseCategories;
    setFormData({
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      category: defaultCategories[0] || '',
      type: 'gasto-variable',
      incomeType: 'sueldo',
      currency: 'DOP'
    });
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      // Agregar a la categoría correcta según el tipo
      if (formData.type === 'ingreso') {
        onAddIncomeCategory(newCategory.trim());
      } else {
        onAddExpenseCategory(newCategory.trim());
      }
      setFormData(prev => ({ ...prev, category: newCategory.trim() }));
      setNewCategory('');
      setShowNewCategory(false);
    } else {
      // Ocultar si está vacío
      setShowNewCategory(false);
    }
  };

  const handleCancelNewCategory = () => {
    setNewCategory('');
    setShowNewCategory(false);
  };

  // Estilos dinámicos según el tipo
  const getContainerStyle = () => {
    switch(formData.type) {
      case 'ingreso':
        return 'bg-green-50 border-2 border-green-200';
      case 'gasto-fijo':
        return 'bg-red-50 border-2 border-red-200';
      case 'gasto-variable':
        return 'bg-orange-50 border-2 border-orange-200';
      default:
        return 'bg-white';
    }
  };

  const getHeaderStyle = () => {
    switch(formData.type) {
      case 'ingreso':
        return 'text-green-800';
      case 'gasto-fijo':
        return 'text-red-800';
      case 'gasto-variable':
        return 'text-orange-800';
      default:
        return 'text-gray-900';
    }
  };

  return (
    <div className={`rounded-lg shadow p-6 transition-all duration-300 ${getContainerStyle()}`}>
      <h2 className={`text-xl font-semibold mb-4 ${getHeaderStyle()}`}>Registrar Transacción</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tipo de movimiento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Movimiento *
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="ingreso"
                checked={formData.type === 'ingreso'}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm">Ingreso</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="gasto-fijo"
                checked={formData.type === 'gasto-fijo'}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm">Gasto Fijo</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="gasto-variable"
                checked={formData.type === 'gasto-variable'}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm">Gasto Variable</span>
            </label>
          </div>
        </div>

        {/* Tipo de Ingreso - solo si es ingreso */}
        {formData.type === 'ingreso' && (
          <div className="bg-green-100 p-3 rounded-md border border-green-300">
            <label className="block text-sm font-medium text-green-800 mb-2">
              Tipo de Ingreso *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="incomeType"
                  value="sueldo"
                  checked={formData.incomeType === 'sueldo'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm text-green-800">Sueldo</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="incomeType"
                  value="extra"
                  checked={formData.incomeType === 'extra'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm text-green-800">Ingreso Extra</span>
              </label>
            </div>
          </div>
        )}

        {/* Moneda y Monto */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
              Moneda *
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="DOP">RD$ (Peso)</option>
              <option value="USD">US$ (Dólar)</option>
            </select>
          </div>
          <div className="col-span-2">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Monto ({formData.currency === 'DOP' ? 'RD$' : 'US$'}) *
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción *
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Ej: Compra en supermercado"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Fecha */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Categoría */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Categoría {formData.type === 'ingreso' ? '(Ingreso)' : '(Gasto)'} *
          </label>
          <div className="flex gap-2">
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {getCurrentCategories().map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowNewCategory(!showNewCategory)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              +
            </button>
          </div>
          
          {showNewCategory && (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Nueva categoría"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onBlur={() => {
                  if (!newCategory.trim()) {
                    setShowNewCategory(false);
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Agregar
              </button>
              <button
                type="button"
                onClick={handleCancelNewCategory}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        {/* Botón submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Registrar Transacción
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
