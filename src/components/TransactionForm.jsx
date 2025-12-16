import React, { useState } from 'react';

const TransactionForm = ({ onSubmit, categories, onAddCategory }) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: categories[0] || '',
    type: 'gasto-variable'
  });

  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    setFormData({
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      category: categories[0] || '',
      type: 'gasto-variable'
    });
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setFormData(prev => ({ ...prev, category: newCategory.trim() }));
      setNewCategory('');
      setShowNewCategory(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Registrar Transacción</h2>
      
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

        {/* Monto */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Monto (€) *
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
            Categoría *
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
              {categories.map(cat => (
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
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Agregar
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
