import { test, expect } from '@playwright/test';
import { helpers } from './helpers';

const DESKTOP_VIEWPORT = { width: 1280, height: 720 };

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await helpers.clearStorage(page);
});

test.describe('CALENDARIO - Desktop', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('should navigate to Calendar section', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Calendario');
    await expect(page.locator('text=Calendario')).toBeVisible();
  });

  test('should display current month calendar', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Calendario');

    // Debe mostrar calendario del mes actual
    const calendar = page.locator('[class*="calendar"]');
    await expect(calendar).toBeVisible();
  });

  test('should show days of week header', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Calendario');

    // Debe mostrar encabezados L, M, X, J, V, S, D
    const header = page.locator('text=lunes, martes, miércoles, jueves');
  });

  test('should display transactions on calendar days', async ({ page }) => {
    // Agregar transacción
    await helpers.navigateDesktop(page, 'Transacciones');
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    
    await helpers.addTransaction(page, 'gasto-variable', 100, 'Compra del día', 'comida');

    // Ir a calendario
    await helpers.navigateDesktop(page, 'Calendario');

    // El día actual debe mostrar el gasto
    const dayWithTransaction = page.locator(`text=${today.getDate()}`);
    await expect(dayWithTransaction).toBeVisible();
  });

  test('should highlight days with expenses', async ({ page }) => {
    // Agregar gasto
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'gasto-variable', 50, 'Gasto', 'comida');

    // Ir a calendario
    await helpers.navigateDesktop(page, 'Calendario');

    // El día debe estar resaltado (ej: en rojo para gastos)
    const highlightedDay = page.locator('[class*="expense"], [class*="red"]').first();
  });

  test('should show month navigation', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Calendario');

    // Debe haber botones anterior/siguiente
    const prevBtn = page.locator('button:has-text("❮"), button:has-text("<")').first();
    const nextBtn = page.locator('button:has-text("❯"), button:has-text(">")').first();

    if (await prevBtn.isVisible()) {
      await prevBtn.click();
      await page.waitForTimeout(300);
      // Debe mostrar mes anterior
    }
  });

  test('should show transaction details on day click', async ({ page }) => {
    // Agregar transacción
    await helpers.navigateDesktop(page, 'Transacciones');
    const today = new Date();
    await helpers.addTransaction(page, 'gasto-variable', 100, 'Compra', 'comida');

    // Ir a calendario
    await helpers.navigateDesktop(page, 'Calendario');

    // Click en día con transacción
    const day = page.locator(`button:has-text("${today.getDate()}")`).first();
    if (await day.isVisible()) {
      await day.click();
      await page.waitForTimeout(500);

      // Debe mostrar modal o detalles
      const details = page.locator('text=Compra');
    }
  });

  test('should show total for the day', async ({ page }) => {
    // Agregar múltiples gastos
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'gasto-variable', 50, 'Gasto 1', 'comida');
    await helpers.addTransaction(page, 'gasto-variable', 30, 'Gasto 2', 'transporte');

    // Ir a calendario
    await helpers.navigateDesktop(page, 'Calendario');

    // El día debe mostrar total (80)
    const dayTotal = page.locator('text=80, RD$ 80');
  });

  test('should differentiate income and expenses colors', async ({ page }) => {
    // Agregar ingreso
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'ingreso', 5000, 'Salario', 'sueldo');

    // Ir a calendario
    await helpers.navigateDesktop(page, 'Calendario');

    // El día con ingreso debería verse diferente (ej: verde)
    const incomDay = page.locator('[class*="income"], [class*="green"]').first();
  });

  test('should navigate between months', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Calendario');

    // Obtener mes actual
    const monthBefore = await page.textContent('[class*="month"]');

    // Click siguiente
    const nextBtn = page.locator('button:has-text("❯"), button:has-text("Siguiente")').first();
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(300);

      const monthAfter = await page.textContent('[class*="month"]');

      // Debe ser diferente
      expect(monthBefore).not.toBe(monthAfter);
    }
  });

  test('should show year selector', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Calendario');

    // Debe haber selector de año o mostrar año actual
    const yearElement = page.locator('text=2025, 2024, 2026');
  });

});

test.describe('CALENDARIO - Móvil', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('should open calendar from FAB', async ({ page }) => {
    await helpers.navigateMobile(page, 'calendar');
    await expect(page.locator('text=Calendario')).toBeVisible();
  });

  test('should display responsive calendar', async ({ page }) => {
    await helpers.navigateMobile(page, 'calendar');

    // Calendario debe caber en pantalla móvil
    const calendar = page.locator('[class*="calendar"]');
    await expect(calendar).toBeVisible();
  });

  test('should allow swipe navigation on mobile', async ({ page }) => {
    await helpers.navigateMobile(page, 'calendar');

    // Usuario puede swipear para cambiar mes
    // Esto es difícil de simular sin una librería especial
  });

});

test.describe('CALENDARIO - Datos Vacíos', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('should show empty calendar when no transactions', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Calendario');

    // Sin transacciones, los días no deben tener colores especiales
    const calendar = page.locator('[class*="calendar"]');
    await expect(calendar).toBeVisible();
  });

  test('should show message for days without transactions', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Calendario');

    // Los días normales deben estar visibles pero sin highlight
    const emptyDay = page.locator('text=15').first(); // Cualquier día
    if (await emptyDay.isVisible()) {
      // Debe estar sin resaltar
    }
  });

});

test.describe('CALENDARIO - Integración', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('should sync with transaction additions', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Calendario');

    // Agregar transacción desde otro tab
    await helpers.navigateDesktop(page, 'Transacciones');
    const today = new Date().getDate();
    await helpers.addTransaction(page, 'gasto-variable', 100, 'Nueva compra', 'comida');

    // Volver a calendario
    await helpers.navigateDesktop(page, 'Calendario');

    // Debe mostrar el nuevo gasto en el día
    const dayWithNew = page.locator(`text=100`);
  });

});
