import { useState, useCallback } from 'react';

/**
 * Hook para gestionar la lógica del Asistente de Compras
 * Incluye: Cálculo de viabilidad, amortización, ratios, y sugerencias de sacrificio
 */
export function usePurchaseAssistant() {
  const [precalculation, setPrecalculation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Calcula la cuota mensual usando Amortización Francesa
   * @param {number} principal - Monto principal
   * @param {number} annualRate - Tasa anual en porcentaje
   * @param {number} months - Número de meses
   * @returns {number} Cuota mensual
   */
  const calculateMonthlyPayment = useCallback((principal, annualRate, months) => {
    if (months === 0) return principal;
    if (annualRate === 0) return principal / months;

    const monthlyRate = annualRate / 100 / 12;
    const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, months);
    const denominator = Math.pow(1 + monthlyRate, months) - 1;
    return numerator / denominator;
  }, []);

  /**
   * Obtiene la tasa de interés predeterminada según el tipo de deuda
   */
  const getInterestRateByType = useCallback((debtType) => {
    const rates = {
      'sin-interes': 0,
      'prestamo-personal': 15.5,
      'tarjeta-credito': 54,
    };
    return rates[debtType] || 0;
  }, []);

  /**
   * Calcula el impacto completo de una compra
   */
  const calculatePurchaseImpact = useCallback((
    purchaseAmount,
    monthlyIncome,
    currentBalance,
    currentDebtPayments,
    fixedExpenses,
    sacredGoalPayments,
    months,
    debtType = 'sin-interes',
    emergencyFundMonths = 6,
    averageFixedExpenses = 0
  ) => {
    setIsLoading(true);

    try {
      // 1. Calcular cuota mensual
      const annualRate = getInterestRateByType(debtType);
      const monthlyPayment = calculateMonthlyPayment(purchaseAmount, annualRate, months);

      // 2. Calcular nuevo ratio de endeudamiento
      const totalMonthlyPayments = currentDebtPayments + monthlyPayment;
      const debtRatio = (totalMonthlyPayments / monthlyIncome) * 100;

      // 3. Calcular nuevo balance después de compra
      const balanceAfterPurchase = currentBalance - purchaseAmount;

      // 4. Calcular meses de cobertura de fondo de emergencia
      const emergencyFundMonthsBefore = averageFixedExpenses > 0 
        ? currentBalance / averageFixedExpenses 
        : emergencyFundMonths;
      const emergencyFundMonthsAfter = averageFixedExpenses > 0 
        ? balanceAfterPurchase / averageFixedExpenses 
        : emergencyFundMonths;

      // 5. Identificar alertas
      const alerts = [];
      let criticalityLevel = 0; // 0: OK, 1: Yellow, 2: Orange, 3: Red

      if (balanceAfterPurchase < 0) {
        alerts.push({
          type: 'critical',
          message: '¡Fondos insuficientes! Esta compra requiere financiamiento o reduces el monto.',
          code: 'INSUFFICIENT_FUNDS'
        });
        criticalityLevel = 3;
      }

      if (emergencyFundMonthsAfter < emergencyFundMonths) {
        alerts.push({
          type: 'warning',
          message: `Tu fondo de emergencia bajará de ${emergencyFundMonthsBefore.toFixed(1)} a ${emergencyFundMonthsAfter.toFixed(1)} meses. Estarás en zona de riesgo.`,
          code: 'EMERGENCY_FUND_COMPROMISED'
        });
        if (criticalityLevel < 1) criticalityLevel = 1;
      }

      if (debtRatio > 30) {
        alerts.push({
          type: 'danger',
          message: `RIESGO DE INSOLVENCIA. Tu ratio de endeudamiento sería ${debtRatio.toFixed(1)}% (límite 30%). No recomendamos esta compra.`,
          code: 'DEBT_RATIO_EXCEEDED'
        });
        if (criticalityLevel < 2) criticalityLevel = 2;
      }

      if (balanceAfterPurchase === 0) {
        alerts.push({
          type: 'critical',
          message: 'VULNERABILIDAD FINANCIERA. Quedarías sin liquidez. Considera los riesgos operativos.',
          code: 'ZERO_LIQUIDITY'
        });
        if (criticalityLevel < 3) criticalityLevel = 3;
      }

      // 6. Calcular costo de oportunidad
      const totalInterest = (monthlyPayment * months) - purchaseAmount;
      const opportunityCost = totalInterest > 0 
        ? totalInterest 
        : 0;

      const result = {
        purchaseAmount,
        monthlyIncome,
        currentBalance,
        balanceAfterPurchase,
        monthlyPayment: monthlyPayment.toFixed(2),
        months,
        debtType,
        annualRate,
        totalInterest: opportunityCost.toFixed(2),
        debtRatio: debtRatio.toFixed(1),
        emergencyFundMonthsBefore: emergencyFundMonthsBefore.toFixed(1),
        emergencyFundMonthsAfter: emergencyFundMonthsAfter.toFixed(1),
        alerts,
        isFeasible: debtRatio <= 30 && balanceAfterPurchase >= 0,
        criticalityLevel,
        timestamp: new Date().toISOString()
      };

      setPrecalculation(result);
      return result;
    } catch (error) {
      console.error('Error en calculatePurchaseImpact:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [calculateMonthlyPayment, getInterestRateByType]);

  /**
   * Calcula el retraso en metas
   */
  const calculateGoalDelay = useCallback((purchaseAmount, monthlySavingsForGoal) => {
    if (monthlySavingsForGoal === 0) return Infinity;
    return Math.ceil(purchaseAmount / monthlySavingsForGoal);
  }, []);

  /**
   * Genera sugerencias de sacrificio
   */
  const generateSacrificesSuggestions = useCallback((
    monthlyHormigaSpending,
    currentSavingsCapacity,
    purchaseAmount,
    monthlyIncome
  ) => {
    const suggestions = [];

    if (monthlyHormigaSpending > 0) {
      const halfHormiga = monthlyHormigaSpending / 2;
      const newSavingsCapacity = currentSavingsCapacity + halfHormiga;
      const monthsToSave = Math.ceil(purchaseAmount / newSavingsCapacity);

      suggestions.push({
        type: 'hormiga-reduction',
        title: `Reduce gastos pequeños a la mitad`,
        description: `Si reduces tu gasto hormiga de RD$ ${monthlyHormigaSpending.toFixed(2)} a RD$ ${halfHormiga.toFixed(2)}...`,
        impact: `Podrías comprar sin financiar en ${monthsToSave} meses`,
        reduction: halfHormiga.toFixed(2),
        newCapacity: newSavingsCapacity.toFixed(2),
        newTimeline: monthsToSave
      });
    }

    return suggestions;
  }, []);

  /**
   * Calcula el "Gasto Máximo Mensual" disponible
   */
  const calculateMaxMonthlySpending = useCallback((
    monthlyIncome,
    carriedBalance,
    fixedExpenses,
    sacredGoalPayments
  ) => {
    return (monthlyIncome + carriedBalance) - (fixedExpenses + sacredGoalPayments);
  }, []);

  const clearPrecalculation = useCallback(() => {
    setPrecalculation(null);
  }, []);

  return {
    precalculation,
    isLoading,
    calculatePurchaseImpact,
    calculateGoalDelay,
    generateSacrificesSuggestions,
    calculateMaxMonthlySpending,
    calculateMonthlyPayment,
    getInterestRateByType,
    clearPrecalculation
  };
}
