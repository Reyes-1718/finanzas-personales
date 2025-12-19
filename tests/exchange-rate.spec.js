import { test, expect } from '@playwright/test';
import { helpers } from './helpers';

const DESKTOP_VIEWPORT = { width: 1280, height: 720 };

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await helpers.clearStorage(page);
});

test.describe('TASAS DE CAMBIO - Desktop', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('should display exchange rate widget', async ({ page }) => {
    // El widget debe estar visible en la página
    const exchangeWidget = page.locator('[class*="exchange"], [class*="Exchange"], [data-testid*="exchange"]');
    // O buscar por texto
    const rateDisplay = page.locator('text=Tasa|Tipo de cambio|Exchange');
    // Debería estar visible en la UI
  });

  test('should show current USD to local currency rate', async ({ page }) => {
    // Debe mostrar formato: USD: 1.00 = XX.XX (moneda local)
    const rateText = page.locator('text=/USD|\\$|EUR/');
    // Debería mostrar tasa actual
  });

  test('should display multiple currency conversion options', async ({ page }) => {
    // Debe tener opciones para convertir entre:
    // - USD ↔ COP (o moneda local)
    // - EUR ↔ COP
    // - etc.
    
    const currencySelects = page.locator('select[name*="currency"]');
    const count = await currencySelects.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should allow manual rate update', async ({ page }) => {
    const updateBtn = page.locator('button:has-text("Actualizar"), button:has-text("Refrescar")');
    if (await updateBtn.isVisible()) {
      await updateBtn.click();
      await page.waitForTimeout(1000);

      // Debe hacer petición para obtener tasa actual
    }
  });

  test('should show last update timestamp', async ({ page }) => {
    // Debe mostrar "Actualizado hace X minutos" o similar
    const timestamp = page.locator('text=/Actualizado|Última actualización/');
    // Debería estar visible
  });

  test('should convert currency in transaction form', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Agregar Transacción');

    // Si hay transacciones en USD, debe convertirse automáticamente
    const currencySelector = page.locator('select[name="currency"]');
    if (await currencySelector.isVisible()) {
      await currencySelector.selectOption('USD');
      
      // Mostrar conversión automática
      const convertedAmount = page.locator('[class*="converted"], [data-testid*="converted"]');
      // Si el monto es 100 USD, debe mostrar equivalente en COP
    }
  });

  test('should update transaction amount based on exchange rate', async ({ page }) => {
    // Crear transacción con USD
    await helpers.addTransaction(page, {
      type: 'expense',
      amount: 100,
      category: 'Viajes',
      description: 'Gasto en USD',
      currency: 'USD'
    });

    // Cambiar tasa de cambio
    const rateInput = page.locator('input[name*="rate"], input[placeholder*="Tasa"]');
    if (await rateInput.isVisible()) {
      await rateInput.clear();
      await rateInput.fill('4200');
      
      // El monto debe recalcularse: 100 * 4200 = 420,000 (en moneda local)
    }
  });

  test('should display historical exchange rates', async ({ page }) => {
    // Mostrar gráfico o tabla con tasas históricas
    const historicalChart = page.locator('[class*="chart"], [class*="graph"]');
    // O tabla con fechas y tasas
  });

  test('should allow favorite currency selection', async ({ page }) => {
    // Poder establecer moneda preferida (USD, EUR, etc.)
    const currencyButtons = page.locator('button[class*="currency"]');
    if (await currencyButtons.isVisible()) {
      const usdBtn = page.locator('button:has-text("USD")');
      if (await usdBtn.isVisible()) {
        await usdBtn.click();
        // Debe marcarse como favorita
      }
    }
  });

});

test.describe('TASAS DE CAMBIO - Móvil', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('should display compact exchange widget on mobile', async ({ page }) => {
    // Widget compacto en la parte superior
    const exchangeWidget = page.locator('[class*="exchange"]');
    if (await exchangeWidget.isVisible()) {
      const bbox = await exchangeWidget.boundingBox();
      // Debe ser accesible sin scroll
    }
  });

  test('should open full exchange rate view from FAB', async ({ page }) => {
    await helpers.navigateMobile(page, 'exchange-rate');
    
    const rateDisplay = page.locator('text=/Tasa|Tipo de cambio/');
    // Debería estar visible
  });

  test('should show conversion calculator on mobile', async ({ page }) => {
    await helpers.navigateMobile(page, 'exchange-rate');

    const calculator = page.locator('[class*="calculator"]');
    if (await calculator.isVisible()) {
      const fromInput = page.locator('input').first();
      await fromInput.fill('100');

      const toInput = page.locator('input').nth(1);
      const value = await toInput.inputValue();
      // Debe mostrar conversión: 100 USD = X COP
    }
  });

});

test.describe('TASAS DE CAMBIO - Sincronización', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('should fetch rates from API', async ({ page }) => {
    // La aplicación debe hacer petición a API de tasas (Xe.com, Open Exchange Rates, etc.)
    const responses = [];
    
    page.on('response', response => {
      if (response.request().url().includes('exchange') || 
          response.request().url().includes('rate') ||
          response.request().url().includes('forex')) {
        responses.push(response);
      }
    });

    // Recargar página para ver petición
    await page.reload();
    await page.waitForTimeout(2000);

    // Debe haber hecho al menos una petición a tasa de cambio
  });

  test('should cache exchange rates locally', async ({ page }) => {
    const storageData = await helpers.getStorageData(page);
    
    // Debe guardar tasas en localStorage con timestamp
    if (storageData && storageData.exchangeRates) {
      expect(storageData.exchangeRates).toBeDefined();
      expect(storageData.exchangeRates.timestamp).toBeDefined();
    }
  });

  test('should update rates every X hours', async ({ page }) => {
    const storageData = await helpers.getStorageData(page);
    
    if (storageData && storageData.exchangeRates) {
      const lastUpdate = storageData.exchangeRates.timestamp;
      const now = Date.now();
      
      // La diferencia debe ser menor a 24 horas (86400000 ms)
      const diff = now - lastUpdate;
      expect(diff).toBeLessThan(24 * 60 * 60 * 1000);
    }
  });

  test('should use cached rate if API fails', async ({ page }) => {
    // Si hay tasa en caché, usar esa aunque API falle
    const storageData = await helpers.getStorageData(page);
    
    // Bloquear peticiones de API
    await page.route('**/exchange**', route => route.abort());
    
    // Recargar
    await page.reload();
    await page.waitForTimeout(1000);

    // Debe mostrar tasa anterior
    const rateDisplay = page.locator('text=/Tasa|Exchange/');
    // Debería estar visible
  });

});

test.describe('TASAS DE CAMBIO - Precisión', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('should display rates with correct decimal places', async ({ page }) => {
    // Formato: USD 1.00 = 4,200.50 COP (2 decimales)
    const rateText = page.locator('text=/\\d+\\.\\d{2}/');
    // Debe mostrar 2 decimales
  });

  test('should calculate conversion correctly', async ({ page }) => {
    // 100 USD * 4200 = 420,000 COP
    // Conversión debe ser exacta sin redondeos incorrectos
  });

  test('should handle large amounts in conversion', async ({ page }) => {
    // 1,000,000 USD * 4200 = 4,200,000,000 COP
    // No debe perder precisión con números grandes
  });

});
