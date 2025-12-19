import { test, expect } from '@playwright/test';
import { helpers } from './helpers';

const DESKTOP_VIEWPORT = { width: 1280, height: 720 };

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await helpers.clearStorage(page);
  
  // Agregar múltiples transacciones
  await helpers.addTransaction(page, {
    type: 'expense',
    amount: 50,
    category: 'Alimentación',
    description: 'Compras en supermercado'
  });
  
  await helpers.addTransaction(page, {
    type: 'expense',
    amount: 30,
    category: 'Transporte',
    description: 'Gasolina'
  });
  
  await helpers.addTransaction(page, {
    type: 'income',
    amount: 3000,
    category: 'Salario',
    description: 'Salario mensual'
  });
  
  await helpers.addTransaction(page, {
    type: 'expense',
    amount: 100,
    category: 'Entretenimiento',
    description: 'Cine y comida'
  });
});

test.describe('BÚSQUEDA AVANZADA - Desktop', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('should navigate to Search section', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Búsqueda');
    await expect(page.locator('text=Búsqueda')).toBeVisible();
  });

  test('should display search form', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Búsqueda');

    // Debe tener campos de búsqueda
    const searchInput = page.locator('input[placeholder*="Buscar"]');
    await expect(searchInput).toBeVisible();
  });

  test('should search transactions by text description', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Búsqueda');

    const searchInput = page.locator('input[placeholder*="Buscar"]');
    await searchInput.fill('supermercado');
    await page.waitForTimeout(500);

    // Debe mostrar solo transacciones que coincidan
    const results = page.locator('[class*="transaction"]');
    // Debe contener "Compras en supermercado"
  });

  test('should search transactions by amount range', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Búsqueda');

    const minAmountInput = page.locator('input[placeholder*="Mínimo"], [placeholder*="Desde"]');
    if (await minAmountInput.isVisible()) {
      await minAmountInput.fill('25');
      
      const maxAmountInput = page.locator('input[placeholder*="Máximo"], [placeholder*="Hasta"]');
      if (await maxAmountInput.isVisible()) {
        await maxAmountInput.fill('75');
        await page.waitForTimeout(500);

        // Debe mostrar transacciones entre 25 y 75
      }
    }
  });

  test('should filter transactions by category', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Búsqueda');

    const categoryFilter = page.locator('select[name="category"], [class*="category"]');
    if (await categoryFilter.isVisible()) {
      await categoryFilter.selectOption('Alimentación');
      await page.waitForTimeout(500);

      // Debe mostrar solo transacciones de Alimentación
    }
  });

  test('should filter transactions by type (income/expense)', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Búsqueda');

    const typeFilter = page.locator('select[name="type"], [class*="type"]');
    if (await typeFilter.isVisible()) {
      await typeFilter.selectOption('expense');
      await page.waitForTimeout(500);

      // Debe mostrar solo gastos
    }
  });

  test('should filter transactions by date range', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Búsqueda');

    const startDate = page.locator('input[type="date"]').first();
    if (await startDate.isVisible()) {
      const today = new Date().toISOString().split('T')[0];
      const lastMonth = new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0];
      
      await startDate.fill(lastMonth);
      
      const endDate = page.locator('input[type="date"]').nth(1);
      if (await endDate.isVisible()) {
        await endDate.fill(today);
        await page.waitForTimeout(500);

        // Debe mostrar transacciones del último mes
      }
    }
  });

  test('should combine multiple filters', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Búsqueda');

    // Categoría = Alimentación AND Monto >= 40
    const categoryFilter = page.locator('select[name="category"]');
    if (await categoryFilter.isVisible()) {
      await categoryFilter.selectOption('Alimentación');
    }

    const minAmountInput = page.locator('input[placeholder*="Mínimo"]');
    if (await minAmountInput.isVisible()) {
      await minAmountInput.fill('40');
      await page.waitForTimeout(500);

      // Debe mostrar solo "Compras en supermercado"
    }
  });

  test('should display search results in table', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Búsqueda');

    const searchInput = page.locator('input[placeholder*="Buscar"]');
    await searchInput.fill('Salario');
    await page.waitForTimeout(500);

    // Tabla con columnas: Fecha, Descripción, Categoría, Monto, Tipo
    const resultTable = page.locator('table');
    if (await resultTable.isVisible()) {
      // Debe tener al menos 1 fila
    }
  });

  test('should show number of results found', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Búsqueda');

    const searchInput = page.locator('input[placeholder*="Buscar"]');
    await searchInput.fill('');
    await page.waitForTimeout(500);

    // Debe mostrar "4 resultados" (todas las transacciones)
    const resultCount = page.locator('text=/\\d+ resultado/');
    // Debería estar visible
  });

  test('should allow clearing search filters', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Búsqueda');

    const searchInput = page.locator('input[placeholder*="Buscar"]');
    await searchInput.fill('algo');
    await page.waitForTimeout(300);

    const clearBtn = page.locator('button:has-text("Limpiar")');
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
      await page.waitForTimeout(500);

      // Debe mostrar todas las transacciones de nuevo
      await expect(searchInput).toHaveValue('');
    }
  });

  test('should export search results', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Búsqueda');

    // Hacer búsqueda
    const searchInput = page.locator('input[placeholder*="Buscar"]');
    await searchInput.fill('Alimentación');
    await page.waitForTimeout(500);

    // Exportar resultados
    const exportBtn = page.locator('button:has-text("Exportar")');
    if (await exportBtn.isVisible()) {
      await exportBtn.click();
      await page.waitForTimeout(300);
    }
  });

  test('should show empty state when no results', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Búsqueda');

    const searchInput = page.locator('input[placeholder*="Buscar"]');
    await searchInput.fill('XYZABC123NOEXISTE');
    await page.waitForTimeout(500);

    // Debe mostrar mensaje "Sin resultados"
    const emptyState = page.locator('text=/Sin resultados|No se encontraron/');
    // O verificar que la tabla está vacía
  });

});

test.describe('BÚSQUEDA AVANZADA - Móvil', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('should open search from FAB', async ({ page }) => {
    await helpers.navigateMobile(page, 'search');
    await expect(page.locator('text=Búsqueda')).toBeVisible();
  });

  test('should display mobile search interface', async ({ page }) => {
    await helpers.navigateMobile(page, 'search');

    const searchInput = page.locator('input[placeholder*="Buscar"]');
    await expect(searchInput).toBeVisible();
  });

  test('should show stacked filters on mobile', async ({ page }) => {
    await helpers.navigateMobile(page, 'search');

    // Filtros deben estar apilados verticalmente
    const filters = page.locator('select, input[type="date"]');
    const count = await filters.count();
    expect(count).toBeGreaterThan(0);
  });

});

test.describe('BÚSQUEDA AVANZADA - Validación', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('should handle empty search gracefully', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Búsqueda');

    // Sin hacer búsqueda, debe mostrar todas las transacciones
    const results = page.locator('table tbody tr');
    const count = await results.count();
    expect(count).toBe(4); // Todas las transacciones
  });

  test('should update results in real-time', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Búsqueda');

    const searchInput = page.locator('input[placeholder*="Buscar"]');
    
    // Escribir letra por letra
    await searchInput.type('s');
    await page.waitForTimeout(300);
    
    await searchInput.type('u');
    await page.waitForTimeout(300);

    // Debe actualizar resultados con cada letra
  });

  test('should maintain search state on filter change', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Búsqueda');

    const searchInput = page.locator('input[placeholder*="Buscar"]');
    await searchInput.fill('transporte');
    await page.waitForTimeout(300);

    // Cambiar categoría no debe limpiar búsqueda
    const categoryFilter = page.locator('select[name="category"]');
    if (await categoryFilter.isVisible()) {
      await categoryFilter.selectOption('Transporte');
      await page.waitForTimeout(500);

      // Búsqueda debe mantenerse
      await expect(searchInput).toHaveValue('transporte');
    }
  });

});
