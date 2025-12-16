import React, { useState } from 'react';
import { PAYMENT_METHODS } from '../config/categoryConfig';

const SearchFilter = ({ onSearch, categories, clearSearch }) => {
  const [criteria, setCriteria] = useState({
    description: '',
    category: '',
    type: '',
    currency: '',
    paymentMethod: '',
    minAmount: '',
    maxAmount: '',
    startDate: '',
    endDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCriteria(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanCriteria = Object.fromEntries(
      Object.entries(criteria).filter(([, v]) => v !== '')
    );
    if (cleanCriteria.minAmount) cleanCriteria.minAmount = parseFloat(cleanCriteria.minAmount);
    if (cleanCriteria.maxAmount) cleanCriteria.maxAmount = parseFloat(cleanCriteria.maxAmount);
    onSearch(cleanCriteria);
  };

  const handleClear = () => {
    setCriteria({
      description: '',
      category: '',
      type: '',
      currency: '',
      paymentMethod: '',
      minAmount: '',
      maxAmount: '',
      startDate: '',
      endDate: ''
    });
    clearSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filtrar Transacciones</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <input
          type="text"
          name="description"
          value={criteria.description}
          onChange={handleChange}
          placeholder="Buscar por descripción..."
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
        />

        <select
          name="category"
          value={criteria.category}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
        >
          <option value="">Todas las categorías</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          name="type"
          value={criteria.type}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
        >
          <option value="">Todos los tipos</option>
          <option value="ingreso">Ingreso</option>
          <option value="gasto-fijo">Gasto Fijo</option>
          <option value="gasto-variable">Gasto Variable</option>
        </select>

        <select
          name="currency"
          value={criteria.currency}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
        >
          <option value="">Todas las monedas</option>
          <option value="DOP">DOP</option>
          <option value="USD">USD</option>
        </select>

        <select
          name="paymentMethod"
          value={criteria.paymentMethod}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
        >
          <option value="">Todos los métodos</option>
          {PAYMENT_METHODS.map(method => (
            <option key={method.id} value={method.id}>
              {method.emoji} {method.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="minAmount"
          value={criteria.minAmount}
          onChange={handleChange}
          placeholder="Monto mínimo"
          step="0.01"
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
        />

        <input
          type="number"
          name="maxAmount"
          value={criteria.maxAmount}
          onChange={handleChange}
          placeholder="Monto máximo"
          step="0.01"
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
        />

        <input
          type="date"
          name="startDate"
          value={criteria.startDate}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
        />

        <input
          type="date"
          name="endDate"
          value={criteria.endDate}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
        >
          Buscar
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 rounded-lg transition"
        >
          Limpiar Filtros
        </button>
      </div>
    </form>
  );
};

export default SearchFilter;
