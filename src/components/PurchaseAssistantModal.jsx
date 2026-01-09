import React, { useState, useMemo } from 'react';
import { usePurchaseAssistant } from '../hooks/usePurchaseAssistant';

/**
 * Modal del Asistente de Compras
 * 3 pasos: Formulario → Resultados → Motor de Sacrificios
 */
export default function PurchaseAssistantModal({
  isOpen,
  onClose,
  transactions = [],
  savingsGoals = [],
  monthlyIncome = 0,
  currentBalance = 0,
  darkMode = false
}) {
  const {
    calculatePurchaseImpact,
    generateSacrificesSuggestions,
    getInterestRateByType
  } = usePurchaseAssistant();

  // Estados del modal
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    productName: '',
    amount: '',
    category: 'electronica',
    paymentMethod: 'efectivo',
    debtType: 'sin-interes',
    months: 12
  });
  const [result, setResult] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [errors, setErrors] = useState({});

  // Calcular métricas
  const metrics = useMemo(() => {
    const fixedExpenses = transactions
      .filter(t => t.type === 'gasto-fijo')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    const currentDebtPayments = 0; // Será calculado desde deudas activas
    const avgFixedExpenses = fixedExpenses / 3; // Promedio últimos 3 meses

    return {
      monthlyIncome: monthlyIncome || 0,
      currentBalance: currentBalance || 0,
      fixedExpenses,
      currentDebtPayments,
      avgFixedExpenses
    };
  }, [transactions, monthlyIncome, currentBalance]);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCalculate = () => {
    const newErrors = {};
    
    if (!formData.productName.trim()) {
      newErrors.productName = 'El nombre del producto es requerido';
    }
    
    const amount = parseFloat(formData.amount);
    if (!amount || amount <= 0) {
      newErrors.amount = 'Ingresa un monto válido mayor a 0';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Permitir cálculo incluso sin income, pero mostrar warning
    const effectiveIncome = metrics.monthlyIncome || 10000; // Valor por defecto para demo

    const impact = calculatePurchaseImpact(
      amount,
      effectiveIncome,
      metrics.currentBalance,
      metrics.currentDebtPayments,
      metrics.fixedExpenses,
      0, // sacred goal payments
      parseInt(formData.months),
      formData.debtType,
      6, // emergency fund months target
      metrics.avgFixedExpenses
    );

    // Agregar warning si no hay income configurado
    if (!metrics.monthlyIncome || metrics.monthlyIncome <= 0) {
      impact.alerts.unshift({
        type: 'warning',
        message: 'Los cálculos usan un ingreso mensual estimado de RD$ 10,000. Configura tu ingreso real para resultados precisos.',
        code: 'ESTIMATED_INCOME'
      });
      if (impact.criticalityLevel < 1) impact.criticalityLevel = 1;
    }

    setResult(impact);
    setStep(2);
  };

  const handleConfirmPurchase = () => {
    if (result) {
      // Aquí se crearía la transacción en useFinancesData
      // Por ahora solo cerramos
      alert(`Compra registrada: ${formData.productName} por RD$ ${formData.amount}`);
      handleClose();
    }
  };

  const handleClose = () => {
    setStep(1);
    setFormData({
      productName: '',
      amount: '',
      category: 'electronica',
      paymentMethod: 'efectivo',
      debtType: 'sin-interes',
      months: 12
    });
    setResult(null);
    setSelectedGoal(null);
    onClose();
  };

  if (!isOpen) return null;

  const bgColor = darkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = darkMode ? 'text-gray-100' : 'text-gray-900';
  const inputBg = darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300';
  const overlayBg = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-40';

  return (
    <>
      {/* Overlay */}
      <div className={overlayBg} onClick={handleClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className={`${bgColor} rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center sticky top-0">
            <h2 className="text-2xl font-bold text-white">
              {step === 1 ? '🛍️ Asistente de Compras' : step === 2 ? '📊 Análisis de Viabilidad' : '💡 Plan de Acción'}
            </h2>
            <button
              onClick={handleClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full transition ${
                  s <= step ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className={`p-6 ${textColor}`}>
            {/* PASO 1: FORMULARIO */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    ¿Qué quieres comprar? *
                  </label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) => handleFormChange('productName', e.target.value)}
                    placeholder="Ej: iPhone 15 Pro"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} ${errors.productName ? 'border-red-500' : ''}`}
                  />
                  {errors.productName && (
                    <p className="text-red-500 text-sm mt-1">{errors.productName}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Monto Total (RD$) *
                    </label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (value >= 0 || e.target.value === '') {
                          handleFormChange('amount', e.target.value);
                        }
                      }}
                      placeholder="65000"
                      step="100"
                      min="0"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} ${errors.amount ? 'border-red-500' : ''}`}
                    />
                    {errors.amount && (
                      <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Categoría
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleFormChange('category', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg}`}
                    >
                      <option value="electronica">Electrónica</option>
                      <option value="hogar">Hogar</option>
                      <option value="vehiculo">Vehículo</option>
                      <option value="vacaciones">Vacaciones</option>
                      <option value="educacion">Educación</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Método de Pago
                    </label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => handleFormChange('paymentMethod', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg}`}
                    >
                      <option value="efectivo">Efectivo/Débito</option>
                      <option value="cuotas">Cuotas</option>
                    </select>
                  </div>

                  {formData.paymentMethod === 'cuotas' && (
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Tipo de Deuda
                      </label>
                      <select
                        value={formData.debtType}
                        onChange={(e) => handleFormChange('debtType', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg}`}
                      >
                        <option value="sin-interes">Sin Intereses (0%)</option>
                        <option value="prestamo-personal">Préstamo Personal (15.5%)</option>
                        <option value="tarjeta-credito">Tarjeta de Crédito (54%)</option>
                      </select>
                    </div>
                  )}
                </div>

                {formData.paymentMethod === 'cuotas' && (
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Plazo: {formData.months} meses
                    </label>
                    <input
                      type="range"
                      min="3"
                      max="60"
                      value={formData.months}
                      onChange={(e) => handleFormChange('months', e.target.value)}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>3 meses</span>
                      <span>60 meses</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleCalculate}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition transform hover:scale-105"
                >
                  Calcular Viabilidad →
                </button>
              </div>
            )}

            {/* PASO 2: RESULTADOS */}
            {step === 2 && result && (
              <div className="space-y-5">
                {/* Mensaje Principal */}
                <div className={`p-4 rounded-lg border-l-4 ${
                  result.criticalityLevel === 0 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                    : result.criticalityLevel === 1
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                    : result.criticalityLevel === 2
                    ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-500'
                }`}>
                  <p className={`font-bold ${
                    result.criticalityLevel === 0
                      ? 'text-green-900 dark:text-green-300'
                      : result.criticalityLevel === 1
                      ? 'text-yellow-900 dark:text-yellow-300'
                      : result.criticalityLevel === 2
                      ? 'text-orange-900 dark:text-orange-300'
                      : 'text-red-900 dark:text-red-300'
                  }`}>
                    {result.isFeasible 
                      ? `✅ Puedes comprarlo, pero tu patrimonio se reduce`
                      : `⚠️ Esta compra presenta riesgos financieros`
                    }
                  </p>
                </div>

                {/* Tabla de Impactos */}
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className="font-bold mb-3 text-lg">Análisis de Impacto</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Cuota Mensual:</span>
                      <span className="font-bold">RD$ {parseFloat(result.monthlyPayment).toLocaleString('es-DO', {maximumFractionDigits: 2})}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Plazo:</span>
                      <span className="font-bold">{result.months} meses</span>
                    </div>
                    <div className="flex justify-between border-t dark:border-gray-600 pt-2">
                      <span className="text-gray-600 dark:text-gray-400">Balance Disponible:</span>
                      <span className={`font-bold ${result.balanceAfterPurchase >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        RD$ {result.balanceAfterPurchase.toLocaleString('es-DO', {maximumFractionDigits: 2})}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Ratio de Deuda:</span>
                      <span className={`font-bold ${parseFloat(result.debtRatio) > 30 ? 'text-red-600' : 'text-green-600'}`}>
                        {result.debtRatio}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Fondo Emergencia:</span>
                      <span className={`font-bold ${parseFloat(result.emergencyFundMonthsAfter) < 6 ? 'text-orange-600' : 'text-green-600'}`}>
                        {result.emergencyFundMonthsAfter} meses (objetivo: 6)
                      </span>
                    </div>
                    {parseFloat(result.totalInterest) > 0 && (
                      <div className="flex justify-between border-t dark:border-gray-600 pt-2">
                        <span className="text-gray-600 dark:text-gray-400">Costo en Intereses:</span>
                        <span className="font-bold text-red-600">RD$ {parseFloat(result.totalInterest).toLocaleString('es-DO', {maximumFractionDigits: 2})}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Alertas */}
                {result.alerts.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-bold">⚠️ Advertencias</h3>
                    {result.alerts.map((alert, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg text-sm ${
                          alert.type === 'critical'
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                            : alert.type === 'danger'
                            ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                        }`}
                      >
                        {alert.message}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border-2 border-blue-600 text-blue-600 dark:text-blue-400 font-bold py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                  >
                    ← Volver
                  </button>
                  {result.isFeasible && (
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition"
                    >
                      Ver Opciones →
                    </button>
                  )}
                  <button
                    onClick={handleConfirmPurchase}
                    className={`flex-1 font-bold py-3 rounded-lg transition ${
                      result.isFeasible
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    }`}
                    disabled={!result.isFeasible}
                  >
                    ✓ Registrar
                  </button>
                </div>
              </div>
            )}

            {/* PASO 3: MOTOR DE SACRIFICIOS */}
            {step === 3 && result && (
              <div className="space-y-5">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Si haces pequeños ajustes en tus gastos, podrías acelerar esta compra o reducir intereses.
                </p>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-4 rounded-lg">
                  <h3 className="font-bold mb-3 text-blue-900 dark:text-blue-300">💡 Plan de Acción Sugerido</h3>
                  <p className="text-sm">
                    Si reduces tus gastos pequeños (café, comidas, etc.) a la mitad durante {Math.ceil(parseFloat(result.monthlyPayment))} meses, 
                    podrías pagar esta compra sin financiar o acelerar el pago.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      alert('Función de Ahorro Confirmado activa');
                      setStep(2);
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition"
                  >
                    ✓ Aceptar Sacrificio y crear plan
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="w-full border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    Volver al análisis
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
