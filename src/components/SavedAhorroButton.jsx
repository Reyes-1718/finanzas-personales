import React, { useState } from 'react';

/**
 * Componente para registrar "Ahorro Confirmado"
 * Permite al usuario registrar dinero ahorrado por reducción de gastos
 */
export default function SavedAhorroButton({
  onSave,
  savingsGoals = [],
  darkMode = false,
  isMobile = false,
  position = 'floating' // 'floating', 'dashboard', 'inline'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: 'Ahorro por sacrificio',
    targetGoal: ''
  });

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfirm = () => {
    const amount = parseFloat(formData.amount);
    
    if (!amount || amount <= 0) {
      alert('Por favor ingresa un monto válido');
      return;
    }

    const savings = {
      amount,
      category: formData.category || 'ahorro-puntual',
      description: formData.description,
      targetGoal: formData.targetGoal || null,
      timestamp: new Date().toISOString(),
      type: 'ingreso',
      date: new Date().toISOString().split('T')[0]
    };

    if (onSave) {
      onSave(savings);
    }

    // Reset form
    setFormData({
      amount: '',
      category: '',
      description: 'Ahorro por sacrificio',
      targetGoal: ''
    });
    setIsOpen(false);
  };

  const bgColor = darkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = darkMode ? 'text-gray-100' : 'text-gray-900';
  const inputBg = darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300';

  // Botón Flotante
  if (position === 'floating') {
    return (
      <>
        {/* Botón */}
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed z-35 w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg flex items-center justify-center transition transform hover:scale-110 active:scale-95 text-xl ${
            isMobile ? 'bottom-40 right-6' : 'bottom-20 right-6'
          }`}
          title="Registrar Ahorro Confirmado"
        >
          💰
        </button>

        {/* Modal */}
        {isOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className={`fixed inset-0 z-50 flex items-center justify-center p-4`}>
              <div className={`${bgColor} rounded-lg shadow-xl max-w-sm w-full`}>
                <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">💰 Ahorro Confirmado</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 p-1 rounded transition"
                  >
                    ✕
                  </button>
                </div>

                <div className={`p-6 space-y-4 ${textColor}`}>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Registra dinero que ahorraste por reducir gastos innecesarios.
                  </p>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Monto Ahorrado (RD$) *
                    </label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => handleFormChange('amount', e.target.value)}
                      placeholder="500"
                      step="10"
                      min="0"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${inputBg}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Categoría que Reduciste
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => handleFormChange('category', e.target.value)}
                      placeholder="Ej: Cafetería"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${inputBg}`}
                    />
                  </div>

                  {savingsGoals.length > 0 && (
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Destinar a Meta (Opcional)
                      </label>
                      <select
                        value={formData.targetGoal}
                        onChange={(e) => handleFormChange('targetGoal', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${inputBg}`}
                      >
                        <option value="">Sin destino específico</option>
                        {savingsGoals.map(goal => (
                          <option key={goal.id} value={goal.id}>
                            🎯 {goal.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="flex-1 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleConfirm}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition"
                    >
                      ✓ Registrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // Botón Inline (para Dashboard)
  return (
    <button
      onClick={() => setIsOpen(true)}
      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center gap-2"
    >
      💰 +Ahorro
    </button>
  );
}
