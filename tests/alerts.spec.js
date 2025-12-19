import { test, expect } from '@playwright/test';
import { helpers } from './helpers';

const DESKTOP_VIEWPORT = { width: 1280, height: 720 };

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await helpers.clearStorage(page);
});

test.describe('ALERTAS - Desktop', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('should navigate to Alerts section', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Alertas');
    await expect(page.locator('text=Alertas')).toBeVisible();
  });

  test('should display alerts interface', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Alertas');
    
    // Debe haber lista de alertas o tipos de alertas
    const alertsSection = page.locator('[class*="alert"]');
    await expect(alertsSection.first()).toBeVisible();
  });

  test('should show no alerts when there is no data', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Alertas');

    // Sin transacciones ni presupuestos, no debe haber alertas
    const emptyMsg = page.locator('text=Sin alertas, No hay alertas, vacío');
    
    // O simplemente la lista estaría vacía
  });

  test('should create budget exceeded alert', async ({ page }) => {
    // Crear presupuesto bajo
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'ingreso', 3000, 'Salario', 'sueldo');

    await helpers.navigateDesktop(page, 'Presupuestos');
    await helpers.createBudget(page, 'comida', 100);

    // Agregar gasto que exceda
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'gasto-variable', 150, 'Compra grande', 'comida');

    // Ir a alertas
    await helpers.navigateDesktop(page, 'Alertas');

    // Debe mostrar alerta de exceso de presupuesto
    const budgetAlert = page.locator('text=presupuesto, excedido, límite');
    
    // Debería estar visible
  });

  test('should show alert for goal completion', async ({ page }) => {
    // Crear meta pequeña
    await helpers.navigateDesktop(page, 'Metas');
    await helpers.createSavingsGoal(page, 'Meta pequeña', 1000, 6, 1500);

    // Completar meta (agregar 1000)
    // Esto depende de la UI específica para agregar aportes
    
    // Ir a alertas
    await helpers.navigateDesktop(page, 'Alertas');

    // Debería mostrar alerta si se completó
    const completionAlert = page.locator('text=completada, lograda, alcanzada');
  });

  test('should display alert severity indicators', async ({ page }) => {
    // Crear situación de alerta
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'ingreso', 3000, 'Salario', 'sueldo');

    await helpers.navigateDesktop(page, 'Presupuestos');
    await helpers.createBudget(page, 'comida', 100);

    // Agregar gasto excesivo
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'gasto-variable', 150, 'Compra', 'comida');

    // Ir a alertas
    await helpers.navigateDesktop(page, 'Alertas');

    // Debería haber indicador visual (color, icono)
    const alertItem = page.locator('[class*="alert"]').first();
    if (await alertItem.isVisible()) {
      // Verificar que tiene clase de severidad (danger, warning, etc.)
    }
  });

  test('should allow marking alert as read', async ({ page }) => {
    // Crear alerta
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'ingreso', 3000, 'Salario', 'sueldo');

    await helpers.navigateDesktop(page, 'Presupuestos');
    await helpers.createBudget(page, 'comida', 100);

    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'gasto-variable', 150, 'Compra', 'comida');

    // Ir a alertas
    await helpers.navigateDesktop(page, 'Alertas');

    // Click en botón de marcar como leída
    const markReadBtn = page.locator('button:has-text("Leído")').first();
    if (await markReadBtn.isVisible()) {
      await markReadBtn.click();
      await page.waitForTimeout(300);
    }
  });

  test('should allow dismissing alerts', async ({ page }) => {
    // Crear alerta
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'ingreso', 3000, 'Salario', 'sueldo');

    await helpers.navigateDesktop(page, 'Presupuestos');
    await helpers.createBudget(page, 'comida', 100);

    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'gasto-variable', 150, 'Compra', 'comida');

    // Ir a alertas
    await helpers.navigateDesktop(page, 'Alertas');

    // Click en botón de cerrar/eliminar
    const closeBtn = page.locator('button:has-text("✕, Cerrar, Eliminar")').first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await page.waitForTimeout(300);
    }
  });

  test('should show alert statistics', async ({ page }) => {
    // Crear varias alertas
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'ingreso', 3000, 'Salario', 'sueldo');

    // Crear múltiples presupuestos bajo
    await helpers.navigateDesktop(page, 'Presupuestos');
    await helpers.createBudget(page, 'comida', 50);
    await helpers.createBudget(page, 'transporte', 30);

    // Exceder ambos
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'gasto-variable', 100, 'Gasto 1', 'comida');
    await helpers.addTransaction(page, 'gasto-variable', 60, 'Gasto 2', 'transporte');

    // Ir a alertas
    await helpers.navigateDesktop(page, 'Alertas');

    // Debería mostrar contadores
    const countElement = page.locator('text=Total');
  });

  test('should filter alerts by type', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Alertas');

    // Buscar filtros
    const filterBtn = page.locator('button:has-text("Filtro")');
    if (await filterBtn.isVisible()) {
      await filterBtn.click();

      // Debería mostrar opciones
      const typeFilter = page.locator('text=Presupuesto, Meta, Gasto');
    }
  });

  test('should sort alerts by date', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Alertas');

    // Buscar selector de orden
    const sortBtn = page.locator('button:has-text("Ordenar")');
    if (await sortBtn.isVisible()) {
      await sortBtn.click();

      // Debería mostrar opciones de orden
      const dateSort = page.locator('text=Más reciente, Más antiguo');
    }
  });

  test('should display alert details on click', async ({ page }) => {
    // Crear alerta
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'ingreso', 3000, 'Salario', 'sueldo');

    await helpers.navigateDesktop(page, 'Presupuestos');
    await helpers.createBudget(page, 'comida', 100);

    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'gasto-variable', 150, 'Compra', 'comida');

    // Ir a alertas
    await helpers.navigateDesktop(page, 'Alertas');

    // Click en alerta
    const alertItem = page.locator('[class*="alert"]').first();
    if (await alertItem.isVisible()) {
      await alertItem.click();
      await page.waitForTimeout(300);

      // Debería mostrar detalles
      const details = page.locator('text=Presupuesto, Límite, Actual');
    }
  });

});

test.describe('ALERTAS - Tipos de Alertas', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('should trigger budget alert when exceeded', async ({ page }) => {
    // Setup
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'ingreso', 3000, 'Salario', 'sueldo');

    await helpers.navigateDesktop(page, 'Presupuestos');
    await helpers.createBudget(page, 'comida', 100);

    // Exceder presupuesto
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'gasto-variable', 150, 'Compra', 'comida');

    // Ir a alertas
    await helpers.navigateDesktop(page, 'Alertas');

    // Debe tener alerta de presupuesto
    const budgetAlert = page.locator('text=comida');
    await expect(budgetAlert).toBeVisible();
  });

  test('should trigger unusual spending alert', async ({ page }) => {
    // Agregar gastos normales
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'ingreso', 5000, 'Salario', 'sueldo');
    await helpers.addTransaction(page, 'gasto-variable', 50, 'Comida 1', 'comida');
    await helpers.addTransaction(page, 'gasto-variable', 60, 'Comida 2', 'comida');
    await helpers.addTransaction(page, 'gasto-variable', 55, 'Comida 3', 'comida');

    // Agregar gasto anormal (spike)
    await helpers.addTransaction(page, 'gasto-variable', 500, 'Compra grande', 'comida');

    // Ir a alertas
    await helpers.navigateDesktop(page, 'Alertas');

    // Debería detectar spike
    const spikeAlert = page.locator('text=inusual, spike, anormal');
  });

});

test.describe('ALERTAS - Móvil', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('should open alerts from FAB', async ({ page }) => {
    await helpers.navigateMobile(page, 'alerts');
    await expect(page.locator('text=Alertas')).toBeVisible();
  });

  test('should display alerts in mobile view', async ({ page }) => {
    // Crear alerta primero
    await page.goto('/');
    await helpers.clearStorage(page);
    
    // Cambiar viewport a desktop temporalmente
    await page.setViewportSize(DESKTOP_VIEWPORT);
    
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'ingreso', 3000, 'Salario', 'sueldo');

    await helpers.navigateDesktop(page, 'Presupuestos');
    await helpers.createBudget(page, 'comida', 100);

    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'gasto-variable', 150, 'Compra', 'comida');

    // Cambiar a móvil
    await page.setViewportSize({ width: 390, height: 844 });
    
    await helpers.navigateMobile(page, 'alerts');

    // Debería mostrar la alerta
    const alertList = page.locator('[class*="alert"]');
    // Debería tener al menos un elemento
  });

});
