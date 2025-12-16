import React, { useState } from 'react';

const SavingsGoals = ({ goals, addGoal, updateGoal, deleteGoal, getGoalProgress }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    currentAmount: '',
    category: '',
    deadline: ''
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
    
    if (!formData.name || !formData.targetAmount) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    addGoal({
      name: formData.name,
      description: formData.description,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount) || 0,
      category: formData.category,
      deadline: formData.deadline
    });

    setFormData({
      name: '',
      description: '',
      targetAmount: '',
      currentAmount: '',
      category: '',
      deadline: ''
    });
  };

  const handleMarkAchieved = (goalId) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      updateGoal(goalId, { achieved: true });
    }
  };

  const activeGoals = goals.filter(g => !g.achieved);
  const achievedGoals = goals.filter(g => g.achieved);

  return (
    <div className="space-y-6">
      {/* Formulario */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Nueva Meta de Ahorro</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre de la Meta
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Vacaciones"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Monto Objetivo
              </label>
              <input
                type="number"
                name="targetAmount"
                value={formData.targetAmount}
                onChange={handleChange}
                placeholder="50000"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Monto Actual
              </label>
              <input
                type="number"
                name="currentAmount"
                value={formData.currentAmount}
                onChange={handleChange}
                placeholder="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha Límite
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descripción (opcional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Escribe los detalles de tu meta"
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition"
          >
            Crear Meta
          </button>
        </form>
      </div>

      {/* Metas Activas */}
      {activeGoals.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Metas Activas</h3>
          <div className="space-y-4">
            {activeGoals.map(goal => {
              const progress = getGoalProgress(goal.id, goal.currentAmount);
              return (
                <div key={goal.id} className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{goal.name}</h4>
                      {goal.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{goal.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        RD$ {goal.currentAmount.toFixed(2)} / RD$ {goal.targetAmount.toFixed(2)}
                      </span>
                      <span className="font-semibold text-blue-600">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full transition-all"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  {goal.deadline && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      Fecha límite: {new Date(goal.deadline).toLocaleDateString('es-DO')}
                    </p>
                  )}

                  <button
                    onClick={() => handleMarkAchieved(goal.id)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-1 rounded transition"
                  >
                    Marcar como Lograda
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Metas Logradas */}
      {achievedGoals.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">🏆 Metas Logradas</h3>
          <div className="space-y-2">
            {achievedGoals.map(goal => (
              <div key={goal.id} className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg flex justify-between items-center border border-green-200 dark:border-green-700">
                <div>
                  <p className="font-semibold text-green-900 dark:text-green-100">{goal.name}</p>
                  <p className="text-sm text-green-700 dark:text-green-300">RD$ {goal.targetAmount.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsGoals;
