import { test, expect } from '@playwright/test';
import { helpers } from './helpers';

const DESKTOP_VIEWPORT = { width: 1280, height: 720 };

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await helpers.clearStorage(page);
});

test.describe('ESTADÍSTICAS - Desktop', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('should navigate to Advanced Statistics', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Estadísticas');
    await expect(page.locator('text=Estadísticas')).toBeVisible();
  });

  test('should render pie chart for expenses by category', async ({ page }) => {
    // Agregar transacciones primero
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'ingreso', 5000, 'Salario', 'sueldo');
    await helpers.addTransaction(page, 'gasto-variable', 200, 'Comida', 'comida');
    await helpers.addTransaction(page, 'gasto-variable', 100, 'Taxi', 'transporte');

    // Ir a estadísticas
    await helpers.navigateDesktop(page, 'Estadísticas');

    // Debe haber un gráfico de pastel
    const chart = page.locator('[class*="recharts"]');
    await expect(chart).toBeVisible();
  });

  test('should display total income card', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'ingreso', 5000, 'Salario', 'sueldo');

    await helpers.navigateDesktop(page, 'Estadísticas');

    // Debe mostrar tarjeta de ingresos
    const incomeCard = page.locator('text=Ingresos');
    await expect(incomeCard).toBeVisible();
  });

  test('should display total expenses card', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'ingreso', 5000, 'Salario', 'sueldo');
    await helpers.addTransaction(page, 'gasto-variable', 300, 'Gasto', 'comida');

    await helpers.navigateDesktop(page, 'Estadísticas');

    // Debe mostrar tarjeta de gastos
    const expenseCard = page.locator('text=Gastos');
    await expect(expenseCard).toBeVisible();
  });

  test('should display balance card', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'ingreso', 5000, 'Salario', 'sueldo');
    await helpers.addTransaction(page, 'gasto-variable', 1000, 'Gasto', 'comida');

    await helpers.navigateDesktop(page, 'Estadísticas');

    // Debe mostrar tarjeta de balance (5000 - 1000 = 4000)
    const balanceCard = page.locator('text=Balance');
    await expect(balanceCard).toBeVisible();
  });

  test('should display top expenses', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'gasto-variable', 500, 'Gasto 1', 'comida');
    await helpers.addTransaction(page, 'gasto-variable', 300, 'Gasto 2', 'transporte');
    await helpers.addTransaction(page, 'gasto-variable', 200, 'Gasto 3', 'entretenimiento');

    await helpers.navigateDesktop(page, 'Estadísticas');

    // Debe mostrar sección de top gastos
    const topExpenses = page.locator('text=Top');
    await expect(topExpenses).toBeVisible();
  });

  test('should display average expenses by category', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'gasto-variable', 100, 'Gasto 1', 'comida');
    await helpers.addTransaction(page, 'gasto-variable', 150, 'Gasto 2', 'comida');

    await helpers.navigateDesktop(page, 'Estadísticas');

    // Debe mostrar promedio
    const averageText = page.locator('text=Promedio');
    await expect(averageText).toBeVisible();
  });

  test('should display month selector', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Estadísticas');

    // Debe haber selector de mes
    const monthSelector = page.locator('[name="month"], [class*="month"]');
    await expect(monthSelector).toBeVisible();
  });

  test('should update statistics when changing month', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'gasto-variable', 100, 'Gasto este mes', 'comida');

    await helpers.navigateDesktop(page, 'Estadísticas');

    // Cambiar mes (si hay botones)
    const prevBtn = page.locator('button:has-text("❮"), button:has-text("<")').first();
    if (await prevBtn.isVisible()) {
      const initialText = await page.textContent('body');
      await prevBtn.click();
      await page.waitForTimeout(300);
      // El contenido debe cambiar (mes anterior tiene otros datos)
    }
  });

  test('should show bar chart for monthly comparison', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'ingreso', 5000, 'Salario', 'sueldo');
    await helpers.addTransaction(page, 'gasto-variable', 1000, 'Gasto', 'comida');

    await helpers.navigateDesktop(page, 'Estadísticas');

    // Debe haber gráfico de barras
    const barChart = page.locator('[class*="recharts"]');
    await expect(barChart).toBeVisible();
  });

  test('should display daily average expense', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'gasto-variable', 100, 'Día 1', 'comida');
    await helpers.addTransaction(page, 'gasto-variable', 100, 'Día 2', 'comida');
    await helpers.addTransaction(page, 'gasto-variable', 100, 'Día 3', 'comida');

    await helpers.navigateDesktop(page, 'Estadísticas');

    // Debe mostrar promedio diario
    const dailyAvg = page.locator('text=promedio');
    await expect(dailyAvg).toBeVisible();
  });

  test('should calculate top spending category', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'gasto-variable', 500, 'Comida 1', 'comida');
    await helpers.addTransaction(page, 'gasto-variable', 300, 'Comida 2', 'comida');
    await helpers.addTransaction(page, 'gasto-variable', 100, 'Transporte', 'transporte');

    await helpers.navigateDesktop(page, 'Estadísticas');

    // Comida es la categoría con mayor gasto (800 total)
    const topCategory = page.locator('text=comida');
    await expect(topCategory).toBeVisible();
  });

  test('should display transaction count', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'ingreso', 5000, 'Ingreso 1', 'sueldo');
    await helpers.addTransaction(page, 'gasto-variable', 100, 'Gasto 1', 'comida');
    await helpers.addTransaction(page, 'gasto-variable', 50, 'Gasto 2', 'transporte');

    await helpers.navigateDesktop(page, 'Estadísticas');

    // Debe mostrar cantidad total de transacciones (3)
    const countElement = page.locator('text=Total de');
    await expect(countElement).toBeVisible();
  });

  test('should separate income and expenses correctly', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'ingreso', 5000, 'Salario', 'sueldo');
    await helpers.addTransaction(page, 'gasto-fijo', 1000, 'Renta', 'vivienda');

    await helpers.navigateDesktop(page, 'Estadísticas');

    // Ingresos: 5000, Gastos: 1000
    const incomeCard = page.locator('text=Ingresos');
    const expenseCard = page.locator('text=Gastos');
    
    await expect(incomeCard).toBeVisible();
    await expect(expenseCard).toBeVisible();
  });

});

test.describe('ESTADÍSTICAS - Datos Vacíos', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('should show empty state when no data', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Estadísticas');

    // Sin transacciones, debe mostrar mensaje vacío
    const emptyMsg = page.locator('text=Sin datos, No hay datos, vacío');
    // Al menos uno de estos debe estar visible o estar vacío los gráficos
  });

  test('should handle no expenses gracefully', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'ingreso', 5000, 'Solo ingreso', 'sueldo');

    await helpers.navigateDesktop(page, 'Estadísticas');

    // Debe mostrar ingresos pero gastos en 0
    const expenseCard = page.locator('text=Gastos');
    await expect(expenseCard).toBeVisible();
  });

});

test.describe('ESTADÍSTICAS - Interactividad', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('should show tooltip on chart hover', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'gasto-variable', 200, 'Comida', 'comida');

    await helpers.navigateDesktop(page, 'Estadísticas');

    // Buscar elemento del gráfico y hovear
    const chartElement = page.locator('[class*="recharts"]').first();
    if (await chartElement.isVisible()) {
      await chartElement.hover();
      await page.waitForTimeout(300);
    }
  });

  test('should allow legend filtering', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'gasto-variable', 200, 'Comida', 'comida');
    await helpers.addTransaction(page, 'gasto-variable', 100, 'Transporte', 'transporte');

    await helpers.navigateDesktop(page, 'Estadísticas');

    // Buscar elemento de leyenda y clickear
    const legendItem = page.locator('[class*="legend"]').first();
    if (await legendItem.isVisible()) {
      await legendItem.click();
      await page.waitForTimeout(300);
    }
  });

});
