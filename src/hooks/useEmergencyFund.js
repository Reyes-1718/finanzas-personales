import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'fondoEmergencia';
const DEFAULT_RATE = 63.52;

const defaultFund = {
  meta: 0,
  recommendedMeta: 0,
  manualMeta: null,
  multiplicador: 3,
  saldoActual: 0,
  transacciones: [],
  configuracion: {
    alertas_habilitadas: true,
    umbral_alerta: 50,
    ultima_actualizacion_meta: null
  },
  lastComputation: {
    monthsUsed: 0,
    monthlyAverage: 0,
    totalFixed: 0
  }
};

const getRateFromStorage = () => {
  const stored = localStorage.getItem('exchange_rate_usd_dop');
  return stored ? parseFloat(stored) : DEFAULT_RATE;
};

const convertToDOP = (amount, currency, rateOverride) => {
  const num = parseFloat(amount) || 0;
  const rate = rateOverride || getRateFromStorage();
  return currency === 'USD' ? num * rate : num;
};

const isFixedExpense = (transaction) => {
  if (!transaction) return false;
  if (transaction.tipo_gasto === 'fijo') return true;
  return transaction.type === 'gasto-fijo';
};

const computeRecommendedMeta = (transactions, multiplier) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return { recommended: 0, monthsUsed: 0, monthlyAverage: 0, totalFixed: 0 };
  }

  const now = new Date();
  const startWindow = new Date(now.getFullYear(), now.getMonth() - 2, 1);
  const monthlyTotals = {};

  transactions.forEach((t) => {
    if (!isFixedExpense(t)) return;
    const txDate = new Date(t.date);
    if (Number.isNaN(txDate.getTime()) || txDate < startWindow) return;

    const key = `${txDate.getFullYear()}-${txDate.getMonth()}`;
    const amountInDOP = convertToDOP(t.amount, t.currency, t.exchangeRate);
    monthlyTotals[key] = (monthlyTotals[key] || 0) + amountInDOP;
  });

  const monthsUsed = Object.keys(monthlyTotals).length;
  if (monthsUsed === 0) {
    return { recommended: 0, monthsUsed: 0, monthlyAverage: 0, totalFixed: 0 };
  }

  const totalFixed = Object.values(monthlyTotals).reduce((a, b) => a + b, 0);
  const monthlyAverage = totalFixed / monthsUsed;
  const clampedMultiplier = Math.min(Math.max(multiplier, 3), 6);

  // Meta = gasto fijo mensual promedio * multiplicador (3-6 meses de cobertura)
  // Si hay <3 meses de datos, seguimos usando el promedio observado (extrapolación implícita).
  const recommended = monthlyAverage * clampedMultiplier;

  return { recommended, monthsUsed, monthlyAverage, totalFixed };
};

export const useEmergencyFund = (transactions = []) => {
  const [fund, setFund] = useState(defaultFund);

  // Cargar desde LocalStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setFund({ ...defaultFund, ...parsed });
      }
    } catch (error) {
      console.error('No se pudo cargar fondo de emergencia:', error);
      setFund(defaultFund);
    }
  }, []);

  // Persistir en LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fund));
    } catch (error) {
      console.error('No se pudo guardar fondo de emergencia:', error);
    }
  }, [fund]);

  // Recalcular meta recomendada cuando cambian transacciones o multiplicador
  useEffect(() => {
    const { recommended, monthsUsed, monthlyAverage, totalFixed } = computeRecommendedMeta(
      transactions,
      fund.multiplicador
    );

    setFund((prev) => {
      const nextMeta = prev.manualMeta !== null ? prev.manualMeta : recommended;
      if (
        prev.recommendedMeta === recommended &&
        prev.meta === nextMeta &&
        prev.lastComputation.monthsUsed === monthsUsed &&
        prev.lastComputation.monthlyAverage === monthlyAverage &&
        prev.lastComputation.totalFixed === totalFixed
      ) {
        return prev;
      }

      return {
        ...prev,
        meta: nextMeta,
        recommendedMeta: recommended,
        lastComputation: { monthsUsed, monthlyAverage, totalFixed },
        configuracion: {
          ...prev.configuracion,
          ultima_actualizacion_meta: new Date().toISOString().split('T')[0]
        }
      };
    });
  }, [transactions, fund.multiplicador]);

  const setMultiplier = (value) => {
    const clamped = Math.min(Math.max(Number(value) || 3, 3), 6);
    setFund((prev) => ({ ...prev, multiplicador: clamped }));
  };

  const setManualMeta = (value) => {
    if (value === null || value === undefined || value === '') {
      setFund((prev) => ({ ...prev, manualMeta: null, meta: prev.recommendedMeta }));
      return;
    }
    const numeric = Math.max(parseFloat(value) || 0, 0);
    setFund((prev) => ({ ...prev, manualMeta: numeric, meta: numeric }));
  };

  const addTransaction = ({
    tipo,
    monto,
    moneda = 'DOP',
    tasaCambio,
    descripcion = '',
    categoria_emergencia = null,
    fecha
  }) => {
    const rate = tasaCambio || getRateFromStorage();
    const amountDOP = convertToDOP(monto, moneda, rate);

    if (tipo === 'retiro' && amountDOP > fund.saldoActual + 0.0001) {
      return { success: false, message: 'Saldo insuficiente en el Fondo de Emergencia.' };
    }

    const tx = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      tipo,
      montoDOP: Number(amountDOP.toFixed(2)),
      montoOriginal: Number(parseFloat(monto || 0).toFixed(2)),
      monedaOriginal: moneda,
      tasaCambio: rate,
      fecha: fecha || new Date().toISOString().split('T')[0],
      categoria_emergencia,
      descripcion: descripcion || ''
    };

    setFund((prev) => ({
      ...prev,
      saldoActual: Number((prev.saldoActual + (tipo === 'deposito' ? amountDOP : -amountDOP)).toFixed(2)),
      transacciones: [tx, ...prev.transacciones]
    }));

    return { success: true, message: tipo === 'deposito' ? 'Depósito registrado' : 'Retiro registrado' };
  };

  const deposit = ({ monto, moneda, tasaCambio, descripcion, fecha }) =>
    addTransaction({ tipo: 'deposito', monto, moneda, tasaCambio, descripcion, fecha });

  const withdraw = ({ monto, moneda, tasaCambio, descripcion, categoria_emergencia, fecha }) =>
    addTransaction({ tipo: 'retiro', monto, moneda, tasaCambio, descripcion, categoria_emergencia, fecha });

  const progress = useMemo(() => {
    if (!fund.meta || fund.meta <= 0) return 0;
    return Math.min(100, (fund.saldoActual / fund.meta) * 100);
  }, [fund.meta, fund.saldoActual]);

  const shouldAlert = useMemo(() => {
    if (!fund.configuracion.alertas_habilitadas) return false;
    if (!fund.meta || fund.meta <= 0) return false;
    const threshold = (fund.configuracion.umbral_alerta / 100) * fund.meta;
    return fund.saldoActual < threshold;
  }, [fund]);

  return {
    fund,
    deposit,
    withdraw,
    setMultiplier,
    setManualMeta,
    progress,
    shouldAlert,
    getRateFromStorage
  };
};
