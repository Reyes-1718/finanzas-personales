import { describe, it, expect, beforeEach } from 'vitest';
import {
  convertToDOP,
  getStoredExchangeRate,
  formatCurrency,
  DEFAULT_EXCHANGE_RATE,
} from '../../src/utils/currency';
import { STORAGE_KEYS } from '../../src/constants/storageKeys';

// Tests de CARACTERIZACIÓN: fijan el comportamiento que existe HOY en
// src/utils/currency.js (incluso si es incorrecto). Cero cambios de lógica.

describe('convertToDOP — comportamiento actual', () => {
  beforeEach(() => localStorage.clear());

  it('DOP devuelve el mismo monto (sin conversión)', () => {
    expect(convertToDOP(100, 'DOP')).toBe(100);
  });

  it('USD usa el rateOverride explícito cuando se pasa', () => {
    expect(convertToDOP(10, 'USD', 60)).toBe(600);
  });

  it('USD sin rate usa la tasa por defecto (63.52) si no hay nada en localStorage', () => {
    expect(DEFAULT_EXCHANGE_RATE).toBe(63.52);
    expect(convertToDOP(10, 'USD')).toBeCloseTo(635.2, 5);
  });

  it('USD usa la tasa guardada en localStorage cuando existe', () => {
    localStorage.setItem(STORAGE_KEYS.EXCHANGE_RATE, '50');
    expect(convertToDOP(10, 'USD')).toBe(500);
    expect(getStoredExchangeRate()).toBe(50);
  });

  it('amount no numérico → 0 (parseFloat || 0)', () => {
    expect(convertToDOP('abc', 'DOP')).toBe(0);
    expect(convertToDOP('abc', 'USD', 60)).toBe(0); // 0 * 60
  });

  // ----------------------------------------------------------------------
  // HALLAZGO IMPORTANTE sobre el supuesto "bug del NaN":
  //
  // El diagnóstico inicial afirmaba: "USD con exchangeRate undefined → NaN".
  // Estos tests demuestran que ESO NO OCURRE: por el parámetro por defecto
  // `rateOverride = null`, pasar `undefined` cae al valor por defecto (null)
  // y entonces usa la tasa actual (localStorage/63.52). NO retorna NaN.
  //
  // El problema REAL que sí existe es otro y queda fijado aquí para el paso 2:
  // una transacción USD vieja SIN exchangeRate se reconvierte a la tasa de
  // HOY, rompiendo la inmutabilidad histórica de la tasa.
  // ----------------------------------------------------------------------
  it('[comportamiento real] USD con exchangeRate=undefined NO da NaN: usa la tasa actual (rompe inmutabilidad)', () => {
    localStorage.setItem(STORAGE_KEYS.EXCHANGE_RATE, '70'); // "tasa de hoy"
    const result = convertToDOP(10, 'USD', undefined);
    expect(Number.isNaN(result)).toBe(false);
    expect(result).toBe(700); // 10 * 70 (tasa de HOY, no la histórica)
  });

  it('[comportamiento real] USD con exchangeRate=null tampoco da NaN: usa la tasa actual', () => {
    localStorage.setItem(STORAGE_KEYS.EXCHANGE_RATE, '70');
    expect(convertToDOP(10, 'USD', null)).toBe(700);
  });

  // El NaN SÍ aparece, pero solo con un rate explícitamente no-numérico
  // (p.ej. localStorage corrupto o un valor NaN ya grabado). Se documenta
  // como fragilidad conocida pendiente del paso 2.
  it('BUG CONOCIDO (pendiente paso 2): USD con rate NaN explícito → NaN', () => {
    expect(Number.isNaN(convertToDOP(10, 'USD', NaN))).toBe(true);
  });

  it('BUG CONOCIDO (pendiente paso 2): USD con rate no-numérico ("x") → NaN', () => {
    expect(Number.isNaN(convertToDOP(10, 'USD', 'x'))).toBe(true);
  });

  it('BUG CONOCIDO (pendiente paso 2): localStorage corrupto hace que getStoredExchangeRate devuelva NaN', () => {
    localStorage.setItem(STORAGE_KEYS.EXCHANGE_RATE, 'corrupto');
    expect(Number.isNaN(getStoredExchangeRate())).toBe(true);
    // y se propaga a convertToDOP cuando no hay override
    expect(Number.isNaN(convertToDOP(10, 'USD'))).toBe(true);
  });
});

describe('formatCurrency — comportamiento actual', () => {
  it('formatea DOP con símbolo RD$ y 2 decimales', () => {
    expect(formatCurrency(1500, 'DOP')).toBe('RD$ 1,500.00');
  });

  it('formatea USD con símbolo US$', () => {
    expect(formatCurrency(10, 'USD')).toBe('US$ 10.00');
  });

  it('por defecto usa DOP', () => {
    expect(formatCurrency(175)).toBe('RD$ 175.00');
  });
});
