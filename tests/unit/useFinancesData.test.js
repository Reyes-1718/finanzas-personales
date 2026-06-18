import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useFinancesData } from '../../src/hooks/useFinancesData';

// Tests de CARACTERIZACIÓN del hook useFinancesData.
// Las funciones (calculateProjection, getAdvancedStats, etc.) no están
// exportadas como funciones puras: solo se acceden vía el hook. No se puede
// modificar el archivo (regla del paso 1), así que se ejercita vía renderHook.

// Fechas del mes actual del reloj real → robustas frente a la fecha del sistema.
const now = new Date();
const isoThisMonth = (day) =>
  new Date(now.getFullYear(), now.getMonth(), day).toISOString().split('T')[0];

beforeEach(() => localStorage.clear());

describe('calculateBalance — comportamiento actual', () => {
  it('ingresos - gastos, convirtiendo a DOP', () => {
    const { result } = renderHook(() => useFinancesData());
    const balance = result.current.calculateBalance([
      { type: 'ingreso', amount: '1000', currency: 'DOP' },
      { type: 'gasto-fijo', amount: '400', currency: 'DOP' },
      { type: 'gasto-variable', amount: '100', currency: 'DOP' },
    ]);
    expect(balance).toBe(500);
  });

  it('array vacío → 0', () => {
    const { result } = renderHook(() => useFinancesData());
    expect(result.current.calculateBalance([])).toBe(0);
  });
});

describe('calculateProjection — comportamiento actual', () => {
  it('gastos fijos del periodo + promedio de variables (1 mes de datos)', () => {
    const { result } = renderHook(() => useFinancesData());

    act(() => {
      result.current.addTransaction({ amount: '1000', type: 'gasto-fijo', category: 'Vivienda', currency: 'DOP', date: isoThisMonth(5) });
    });
    act(() => {
      result.current.addTransaction({ amount: '500', type: 'gasto-fijo', category: 'Servicios', currency: 'DOP', date: isoThisMonth(6) });
    });
    act(() => {
      result.current.addTransaction({ amount: '300', type: 'gasto-variable', category: 'Alimentación', currency: 'DOP', date: isoThisMonth(7) });
    });
    act(() => {
      result.current.addTransaction({ amount: '200', type: 'gasto-variable', category: 'Transporte', currency: 'DOP', date: isoThisMonth(8) });
    });

    const projection = result.current.calculateProjection();
    expect(projection.fixedExpenses).toBe(1500);
    expect(projection.avgVariableExpenses).toBe(500); // 500 en 1 mes
    expect(projection.totalProjection).toBe(2000);
  });

  it('sin transacciones → todo en 0 (monthCount default 1)', () => {
    const { result } = renderHook(() => useFinancesData());
    const projection = result.current.calculateProjection();
    expect(projection).toEqual({ fixedExpenses: 0, avgVariableExpenses: 0, totalProjection: 0 });
  });
});

describe('getAdvancedStats — comportamiento actual', () => {
  it('separa ingresos/gastos, top categorías y promedio diario', () => {
    const { result } = renderHook(() => useFinancesData());
    const stats = result.current.getAdvancedStats([
      { type: 'ingreso', amount: '1000', category: 'Salario', currency: 'DOP', date: '2026-06-01' },
      { type: 'gasto-fijo', amount: '400', category: 'Vivienda', currency: 'DOP', date: '2026-06-02' },
      { type: 'gasto-variable', amount: '100', category: 'Alimentación', currency: 'DOP', date: '2026-06-03' },
    ]);

    expect(stats.totalIncome).toBe(1000);
    expect(stats.totalExpenses).toBe(500);
    expect(stats.balance).toBe(500);
    expect(stats.transactionCount).toBe(2); // solo gastos
    expect(stats.largestExpenses[0].category).toBe('Vivienda');
    expect(stats.topCategories[0]).toEqual({ category: 'Vivienda', total: 400 });
    expect(stats.dailyAverage).toBe(250); // 500 / 2 fechas distintas
  });

  it('sin gastos → objeto vacío SIN campo balance (rama temprana)', () => {
    const { result } = renderHook(() => useFinancesData());
    const stats = result.current.getAdvancedStats([
      { type: 'ingreso', amount: '1000', category: 'Salario', currency: 'DOP', date: '2026-06-01' },
    ]);
    // Caracteriza una inconsistencia: la rama temprana omite `balance`.
    expect(stats.totalExpenses).toBe(0);
    expect('balance' in stats).toBe(false);
  });

  // BUG CONOCIDO: getAdvancedStats hace t.type.includes('gasto') sin validar
  // que t.type exista → TypeError con datos importados sin `type`.
  it('BUG CONOCIDO (pendiente paso 2): lanza TypeError si una transacción no tiene `type`', () => {
    const { result } = renderHook(() => useFinancesData());
    expect(() =>
      result.current.getAdvancedStats([
        { amount: '100', category: 'Alimentación', currency: 'DOP', date: '2026-06-03' },
      ])
    ).toThrow(TypeError);
  });
});
