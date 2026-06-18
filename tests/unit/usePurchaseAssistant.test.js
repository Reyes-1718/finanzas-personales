import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { usePurchaseAssistant } from '../../src/hooks/usePurchaseAssistant';

// Tests de CARACTERIZACIÓN de usePurchaseAssistant. Funciones accesibles vía hook.

describe('calculateMonthlyPayment / getInterestRateByType — comportamiento actual', () => {
  it('amortización francesa con tasa 0 → principal / meses', () => {
    const { result } = renderHook(() => usePurchaseAssistant());
    expect(result.current.calculateMonthlyPayment(1200, 0, 12)).toBe(100);
  });

  it('meses 0 → devuelve el principal completo', () => {
    const { result } = renderHook(() => usePurchaseAssistant());
    expect(result.current.calculateMonthlyPayment(1200, 0, 0)).toBe(1200);
  });

  it('tasas por tipo de deuda conocidas y default 0', () => {
    const { result } = renderHook(() => usePurchaseAssistant());
    expect(result.current.getInterestRateByType('tarjeta-credito')).toBe(54);
    expect(result.current.getInterestRateByType('prestamo-personal')).toBe(15.5);
    expect(result.current.getInterestRateByType('sin-interes')).toBe(0);
    expect(result.current.getInterestRateByType('desconocido')).toBe(0);
  });
});

describe('calculatePurchaseImpact — comportamiento actual', () => {
  it('caso viable: ratio de deuda bajo, pero alerta de fondo de emergencia', () => {
    const { result } = renderHook(() => usePurchaseAssistant());
    let res;
    act(() => {
      // (purchaseAmount, monthlyIncome, currentBalance, currentDebtPayments,
      //  fixedExpenses, sacredGoalPayments, months, debtType, emergencyFundMonths, averageFixedExpenses)
      res = result.current.calculatePurchaseImpact(1000, 10000, 5000, 0, 0, 0, 12, 'sin-interes', 6, 1000);
    });
    expect(res.monthlyPayment).toBe('83.33'); // string (toFixed)
    expect(res.debtRatio).toBe('0.8'); // string
    expect(res.balanceAfterPurchase).toBe(4000);
    expect(res.isFeasible).toBe(true);
    // EF baja de 5.0 a 4.0 meses (< 6) → alerta y criticidad 1
    expect(res.criticalityLevel).toBe(1);
    expect(res.alerts.some((a) => a.code === 'EMERGENCY_FUND_COMPROMISED')).toBe(true);
  });

  // BUG CONOCIDO: divide entre monthlyIncome sin proteger el 0.
  it('BUG CONOCIDO (pendiente paso 2): monthlyIncome=0 → debtRatio "Infinity"', () => {
    const { result } = renderHook(() => usePurchaseAssistant());
    let res;
    act(() => {
      res = result.current.calculatePurchaseImpact(1000, 0, 5000, 0, 0, 0, 12, 'sin-interes', 6, 0);
    });
    expect(res.debtRatio).toBe('Infinity');
    expect(res.isFeasible).toBe(false);
  });

  // BUG CONOCIDO: 0/0 produce NaN en el ratio.
  it('BUG CONOCIDO (pendiente paso 2): monthlyIncome=0 y pago 0 → debtRatio "NaN"', () => {
    const { result } = renderHook(() => usePurchaseAssistant());
    let res;
    act(() => {
      // months=0 → monthlyPayment = principal... usar montos que den pago 0:
      // purchaseAmount 0 → monthlyPayment 0, monthlyIncome 0 → 0/0 = NaN
      res = result.current.calculatePurchaseImpact(0, 0, 5000, 0, 0, 0, 12, 'sin-interes', 6, 0);
    });
    expect(res.debtRatio).toBe('NaN');
  });
});
