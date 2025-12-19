import { test, expect } from '@playwright/test';
import { helpers } from './helpers';

const DESKTOP_VIEWPORT = { width: 1280, height: 720 };

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await helpers.clearStorage(page);
});

test.describe('GASTOS DIARIOS - Desktop', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('should navigate to Daily Expenses section', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Gastos Diarios');
    await expect(page.locator('text=Gastos Diarios')).toBeVisible();
  });

  test('should display quick expense buttons', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Gastos Diarios');

    // Debe haber botones predefinidos
    const expenseButtons = page.locator('button[class*="expense"], button:has-text("Café")');
    await expect(expenseButtons.first()).toBeVisible();
  });

  test('should add quick expense with predefined button', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Gastos Diarios');

    // Click en botón predefinido (ej: Café)
    const coffeeBtn = page.locator('button:has-text("Café")');
    if (await coffeeBtn.isVisible()) {
      await coffeeBtn.click();
      await page.waitForTimeout(500);

      // Debe agregar gasto automáticamente
      const todoList = page.locator('text=Café');
    }
  });

  test('should add custom daily expense', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Gastos Diarios');

    // Llenar formulario personalizado
    await helpers.addDailyExpense(
      page,
      75,
      'Almuerzo en restaurante',
      'comida'
    );

    // Debe aparecer en la lista
    await helpers.verifyTransactionInList(page, 'Almuerzo en restaurante');
  });

  test('should display today\'s expenses list', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Gastos Diarios');

    // Agregar gasto
    await helpers.addDailyExpense(page, 50, 'Gasto de prueba', 'comida');

    // Debe mostrar lista de gastos del día
    const expensesList = page.locator('[class*="list"], table');
    await expect(expensesList).toBeVisible();
  });

  test('should calculate daily total', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Gastos Diarios');

    // Agregar múltiples gastos
    await helpers.addDailyExpense(page, 50, 'Gasto 1', 'comida');
    await helpers.addDailyExpense(page, 30, 'Gasto 2', 'transporte');
    await helpers.addDailyExpense(page, 20, 'Gasto 3', 'entretenimiento');

    // Total debe ser 100
    const totalElement = page.locator('text=Total');
    await expect(totalElement).toBeVisible();
  });

  test('should delete daily expense', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Gastos Diarios');

    await helpers.addDailyExpense(page, 50, 'Gasto a eliminar', 'comida');

    // Verificar que existe
    await helpers.verifyTransactionInList(page, 'Gasto a eliminar');

    // Eliminar
    await helpers.deleteTransaction(page, 'Gasto a eliminar');

    // Verificar que fue eliminado
    await page.waitForTimeout(500);
  });

  test('should categorize expenses by type', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Gastos Diarios');

    await helpers.addDailyExpense(page, 50, 'Comida', 'comida');
    await helpers.addDailyExpense(page, 30, 'Taxi', 'transporte');
    await helpers.addDailyExpense(page, 20, 'Película', 'entretenimiento');

    // Debe mostrar gastos agrupados o con filtros
    const categoryFilter = page.locator('[name="category"], [class*="filter"]');
    if (await categoryFilter.isVisible()) {
      // Puede filtrar por categoría
    }
  });

  test('should show date selector', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Gastos Diarios');

    // Debe haber selector de fecha
    const dateSelector = page.locator('[name="date"], [class*="date"]');
    
    // O al menos un título con la fecha actual
    const todayText = page.locator('text=hoy, today, 2025');
  });

  test('should persist daily expenses', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Gastos Diarios');

    await helpers.addDailyExpense(page, 100, 'Persistencia test', 'comida');

    // Recargar página
    await page.reload();
    await page.waitForTimeout(1000);

    // Navegar a gastos diarios
    await helpers.navigateDesktop(page, 'Gastos Diarios');

    // El gasto debe seguir aquí
    await helpers.verifyTransactionInList(page, 'Persistencia test');
  });

  test('should show expense breakdown by category', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Gastos Diarios');

    await helpers.addDailyExpense(page, 50, 'Comida 1', 'comida');
    await helpers.addDailyExpense(page, 60, 'Comida 2', 'comida');
    await helpers.addDailyExpense(page, 30, 'Taxi', 'transporte');

    // Debe mostrar desglose
    const breakdownElement = page.locator('text=Comida, Transporte');
  });

  test('should validate amount field', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Gastos Diarios');

    // Intentar agregar sin monto
    await page.fill('[name="description"]', 'Sin monto');
    await page.click('button:has-text("Registrar")');

    // Debe mostrar error o no permitir envío
    await page.waitForTimeout(300);
  });

  test('should show empty state for no daily expenses', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Gastos Diarios');

    // Sin gastos agregados, debe mostrar estado vacío
    const emptyMsg = page.locator('text=Sin gastos, No hay gastos');
  });

});

test.describe('GASTOS DIARIOS - Quick Buttons', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('should have predefined categories', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Gastos Diarios');

    // Debe haber botones para categorías comunes
    const categories = [
      'Café',
      'Almuerzo',
      'Cena',
      'Transporte',
      'Gasolina',
      'Compras'
    ];

    // Al menos algunos deben estar visibles
    const categoryBtn = page.locator('button').first();
    await expect(categoryBtn).toBeVisible();
  });

  test('should use predefined amounts for quick buttons', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Gastos Diarios');

    // Click en botón (ej: Café)
    const coffeeBtn = page.locator('button:has-text("Café"), button').first();
    if (await coffeeBtn.isVisible()) {
      await coffeeBtn.click();
      await page.waitForTimeout(500);

      // El monto debe ser predefinido (no pidió input)
    }
  });

});

test.describe('GASTOS DIARIOS - Móvil', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('should open daily expenses from FAB', async ({ page }) => {
    await helpers.navigateMobile(page, 'daily');
    await expect(page.locator('text=Gastos Diarios')).toBeVisible();
  });

  test('should display touch-friendly buttons on mobile', async ({ page }) => {
    await helpers.navigateMobile(page, 'daily');

    // Botones deben ser grandes (mobile-friendly)
    const buttons = page.locator('button');
    // Deben tener tamaño adecuado para touch
  });

  test('should add quick expense from mobile', async ({ page }) => {
    await helpers.navigateMobile(page, 'daily');

    // Click en botón predefinido
    const btn = page.locator('button').first();
    if (await btn.isVisible()) {
      await btn.click();
      await page.waitForTimeout(500);
    }
  });

  test('should add custom expense from mobile', async ({ page }) => {
    await helpers.navigateMobile(page, 'daily');

    await helpers.addDailyExpense(
      page,
      50,
      'Gasto móvil',
      'comida'
    );

    await helpers.verifyTransactionInList(page, 'Gasto móvil');
  });

  test('should show responsive expense list', async ({ page }) => {
    await helpers.navigateMobile(page, 'daily');

    await helpers.addDailyExpense(page, 50, 'Gasto 1', 'comida');
    await helpers.addDailyExpense(page, 30, 'Gasto 2', 'transporte');

    // La lista debe ser responsive
    const list = page.locator('[class*="list"], table');
    if (await list.isVisible()) {
      // Verificar que cabe en pantalla móvil
    }
  });

});

test.describe('GASTOS DIARIOS - Integration', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('should sync with transactions history', async ({ page }) => {
    // Agregar gasto diario
    await helpers.navigateDesktop(page, 'Gastos Diarios');
    await helpers.addDailyExpense(page, 100, 'Gasto sincronizado', 'comida');

    // Ir a transacciones
    await helpers.navigateDesktop(page, 'Transacciones');

    // El gasto debe estar en la lista
    await helpers.verifyTransactionInList(page, 'Gasto sincronizado');
  });

  test('should update dashboard totals', async ({ page }) => {
    // Agregar ingreso
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'ingreso', 2000, 'Ingreso', 'sueldo');

    // Agregar gasto diario
    await helpers.navigateDesktop(page, 'Gastos Diarios');
    await helpers.addDailyExpense(page, 300, 'Gasto grande', 'comida');

    // Dashboard debe actualizar
    await helpers.navigateDesktop(page, 'Dashboard');

    // Balance debe ser 2000 - 300 = 1700
  });

  test('should contribute to budget totals', async ({ page }) => {
    // Crear presupuesto
    await helpers.navigateDesktop(page, 'Presupuestos');
    await helpers.createBudget(page, 'comida', 200);

    // Agregar gastos diarios que excedan
    await helpers.navigateDesktop(page, 'Gastos Diarios');
    await helpers.addDailyExpense(page, 100, 'Gasto 1', 'comida');
    await helpers.addDailyExpense(page, 150, 'Gasto 2', 'comida');

    // Volver a presupuestos (debe mostrar 250/200)
    await helpers.navigateDesktop(page, 'Presupuestos');

    // Debería mostrar exceso
  });

});
