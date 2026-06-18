import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, renderHook } from '@testing-library/react';
import { useFinancesData } from '../../src/hooks/useFinancesData';

// recharts usa ResizeObserver/medición que jsdom no soporta bien; lo mockeamos
// para poder renderizar Dashboard sin que falle. La lógica de Dashboard
// (expensesByCategory / totalExpenses) se ejecuta igual, no se toca.
vi.mock('recharts', () => {
  const Passthrough = ({ children }) => children ?? null;
  return {
    ResponsiveContainer: Passthrough,
    PieChart: Passthrough,
    Pie: Passthrough,
    Cell: Passthrough,
    Legend: Passthrough,
    Tooltip: Passthrough,
  };
});

import Dashboard from '../../src/components/Dashboard';
import Budgets from '../../src/components/Budgets';

// Comparación de las 3 implementaciones de "suma de gastos por categoría":
//   #1 Budgets.getSpentByCategory   (Budgets.jsx:45-51)   filtro: t.type.includes('gasto')
//   #2 getAdvancedStats categoryTotals (useFinancesData.js:489-516) filtro: t.type.includes('gasto')
//   #3 Dashboard.expensesByCategory (Dashboard.jsx:58-72) filtro: t.type !== 'ingreso'  (+ redondeo)
//
// Input con una transacción type:'transferencia' (no es ingreso, NO contiene 'gasto').
// Sirve para revelar si las 3 dan el mismo resultado o ya divergieron.

const now = new Date();
const m = now.getMonth();
const y = now.getFullYear();
const d = new Date(y, m, 12).toISOString().split('T')[0];

const txns = [
  { type: 'ingreso', amount: '900', category: 'Salario', currency: 'DOP', date: d },
  { type: 'gasto-variable', amount: '100', category: 'Alimentación', currency: 'DOP', date: d },
  { type: 'gasto-fijo', amount: '50', category: 'Alimentación', currency: 'DOP', date: d },
  { type: 'transferencia', amount: '25', category: 'Alimentación', currency: 'DOP', date: d },
];

const noop = () => {};

beforeEach(() => localStorage.clear());

describe('Suma por categoría: ¿las 3 implementaciones coinciden?', () => {
  it('#2 getAdvancedStats EXCLUYE transferencia → Alimentación = 150', () => {
    const { result } = renderHook(() => useFinancesData());
    const stats = result.current.getAdvancedStats(txns);
    const alimentacion = stats.topCategories.find((c) => c.category === 'Alimentación');
    expect(alimentacion.total).toBe(150); // 100 + 50, sin la transferencia
    expect(stats.totalExpenses).toBe(150);
  });

  it('#1 Budgets.getSpentByCategory EXCLUYE transferencia → muestra "RD$ 150.00"', () => {
    const { container } = render(
      <Budgets
        budgets={[]}
        setBudget={noop}
        getAllBudgetsForMonth={() => [
          { key: `Alimentación-${y}-${m}`, category: 'Alimentación', amount: 1000, month: m, year: y },
        ]}
        deleteBudget={noop}
        transactions={txns}
        month={m}
        year={y}
        categories={['Alimentación']}
        monthlyIncome={0}
        getAutoBudgetAmount={() => 0}
        getSuggestedBudgets={() => []}
        applyAutoBudgets={noop}
      />
    );
    expect(container.textContent).toContain('RD$ 150.00'); // 100 + 50
    expect(container.textContent).not.toContain('RD$ 175.00');
  });

  it('#3 Dashboard INCLUYE transferencia (t.type !== "ingreso") → "Gastos" = RD$ 175.00', () => {
    const { container } = render(
      <Dashboard
        transactions={txns}
        selectedMonth={m}
        selectedYear={y}
        calculateBalance={() => 0}
        deleteTransaction={noop}
      />
    );
    // El total de "Gastos" usa el mismo predicado que expensesByCategory.
    expect(container.textContent).toContain('RD$ 175.00'); // 100 + 50 + 25
  });

  it('CONCLUSIÓN: #1 y #2 coinciden (150) pero #3 DIVERGE (175)', () => {
    // Resumen de los 3 resultados para el mismo input:
    const resultados = {
      budgets_getSpentByCategory: 150, // filtro includes('gasto')
      getAdvancedStats: 150, // filtro includes('gasto')
      dashboard_expensesByCategory: 175, // filtro !== 'ingreso' (cuenta transferencia)
    };
    expect(resultados.budgets_getSpentByCategory).toBe(resultados.getAdvancedStats);
    expect(resultados.dashboard_expensesByCategory).not.toBe(resultados.getAdvancedStats);
  });
});
