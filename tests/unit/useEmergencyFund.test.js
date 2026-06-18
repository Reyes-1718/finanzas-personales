import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useEmergencyFund } from '../../src/hooks/useEmergencyFund';

// computeRecommendedMeta NO está exportada (módulo interno de useEmergencyFund.js).
// Sin modificar el archivo, se caracteriza vía el hook: el resultado se observa
// en result.current.fund.recommendedMeta y fund.lastComputation.

// Fechas del mes actual del reloj real → robustas frente a la fecha del sistema.
const now = new Date();
const isoThisMonth = (day) =>
  new Date(now.getFullYear(), now.getMonth(), day).toISOString().split('T')[0];

beforeEach(() => localStorage.clear());

describe('computeRecommendedMeta (vía useEmergencyFund) — comportamiento actual', () => {
  it('meta = promedio mensual de gastos fijos * multiplicador (default 3)', () => {
    const transactions = [
      { type: 'gasto-fijo', amount: '1000', currency: 'DOP', date: isoThisMonth(5) },
      { type: 'gasto-fijo', amount: '500', currency: 'DOP', date: isoThisMonth(10) },
    ];
    const { result } = renderHook(() => useEmergencyFund(transactions));

    expect(result.current.fund.lastComputation.monthsUsed).toBe(1);
    expect(result.current.fund.lastComputation.monthlyAverage).toBe(1500);
    expect(result.current.fund.recommendedMeta).toBe(4500); // 1500 * 3
    expect(result.current.fund.meta).toBe(4500); // sin meta manual, meta = recomendada
  });

  it('ignora gastos no-fijos (variables / ingresos)', () => {
    const transactions = [
      { type: 'gasto-fijo', amount: '1000', currency: 'DOP', date: isoThisMonth(5) },
      { type: 'gasto-variable', amount: '9999', currency: 'DOP', date: isoThisMonth(6) },
      { type: 'ingreso', amount: '9999', currency: 'DOP', date: isoThisMonth(7) },
    ];
    const { result } = renderHook(() => useEmergencyFund(transactions));
    expect(result.current.fund.recommendedMeta).toBe(3000); // 1000 * 3
  });

  it('sin gastos fijos → meta recomendada 0 y monthsUsed 0', () => {
    const { result } = renderHook(() => useEmergencyFund([]));
    expect(result.current.fund.recommendedMeta).toBe(0);
    expect(result.current.fund.lastComputation.monthsUsed).toBe(0);
  });

  it('el multiplicador se clampa a [3,6]', () => {
    const transactions = [
      { type: 'gasto-fijo', amount: '1000', currency: 'DOP', date: isoThisMonth(5) },
    ];
    const { result } = renderHook(() => useEmergencyFund(transactions));

    act(() => result.current.setMultiplier(10)); // se clampa a 6
    expect(result.current.fund.multiplicador).toBe(6);
    expect(result.current.fund.recommendedMeta).toBe(6000); // 1000 * 6
  });

  it('[comportamiento real] gasto fijo USD sin exchangeRate se convierte a la tasa actual (no NaN)', () => {
    localStorage.setItem('exchange_rate_usd_dop', '70'); // tasa "de hoy"
    const transactions = [
      // sin campo exchangeRate (transacción "vieja")
      { type: 'gasto-fijo', amount: '10', currency: 'USD', date: isoThisMonth(5) },
    ];
    const { result } = renderHook(() => useEmergencyFund(transactions));
    // 10 USD * 70 = 700 → meta = 700 * 3 = 2100 (usa tasa de HOY, no la histórica)
    expect(Number.isNaN(result.current.fund.recommendedMeta)).toBe(false);
    expect(result.current.fund.recommendedMeta).toBe(2100);
  });
});
