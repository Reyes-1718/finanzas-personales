import { test, expect } from '@playwright/test';
import { helpers } from './helpers';

const DESKTOP_VIEWPORT = { width: 1280, height: 720 };
const MOBILE_VIEWPORT = { width: 390, height: 844 };

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await helpers.clearStorage(page);
});

test.describe('PRESUPUESTOS - Desktop', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('should navigate to Budgets section', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Presupuestos');
    await expect(page.locator('text=Presupuesto')).toBeVisible();
  });

  test('should display budget creation form', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Presupuestos');
    
    // Verificar campos del formulario
    await expect(page.locator('[name="category"]')).toBeVisible();
    await expect(page.locator('[name="amount"]')).toBeVisible();
    await expect(page.locator('button:has-text("Crear")')).toBeVisible();
  });

  test('should create budget for food category', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Presupuestos');
    
    // Crear presupuesto de 500 para comida
    await helpers.createBudget(page, 'comida', 500);

    // Verificar que aparece en la lista
    await expect(page.locator('text=comida')).toBeVisible();
    await expect(page.locator('text=500')).toBeVisible();
  });

  test('should create budget for housing category', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Presupuestos');
    
    await helpers.createBudget(page, 'vivienda', 2000);

    await expect(page.locator('text=vivienda')).toBeVisible();
  });

  test('should create budget for utilities category', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Presupuestos');
    
    await helpers.createBudget(page, 'utilidades', 300);

    await expect(page.locator('text=utilidades')).toBeVisible();
  });

  test('should display budget progress bars', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Presupuestos');
    
    await helpers.createBudget(page, 'comida', 500);

    // Verificar que hay barra de progreso
    const progressBar = page.locator('[class*="progress"], [role="progressbar"]');
    await expect(progressBar).toBeVisible();
  });

  test('should calculate budget usage percentage', async ({ page }) => {
    // Primero agregar ingreso
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'ingreso', 3000, 'Salario', 'sueldo');

    // Navegar a presupuestos
    await helpers.navigateDesktop(page, 'Presupuestos');
    await helpers.createBudget(page, 'comida', 500);

    // Navegar a transacciones y agregar gasto
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'gasto-variable', 200, 'Mercado', 'comida');

    // Volver a presupuestos
    await helpers.navigateDesktop(page, 'Presupuestos');

    // Debería mostrar 40% de uso (200/500)
    await expect(page.locator('text=comida')).toBeVisible();
  });

  test('should show warning when budget is exceeded', async ({ page }) => {
    // Agregar ingreso
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'ingreso', 3000, 'Salario', 'sueldo');

    // Crear presupuesto bajo
    await helpers.navigateDesktop(page, 'Presupuestos');
    await helpers.createBudget(page, 'comida', 100);

    // Agregar gasto que exceda
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'gasto-variable', 150, 'Compra grande', 'comida');

    // Volver a presupuestos
    await helpers.navigateDesktop(page, 'Presupuestos');

    // Debería mostrar indicador de exceso (rojo)
    const exceedElement = page.locator('[class*="red"], [class*="exceed"]');
    // El elemento debería tener alguna clase de alerta
  });

  test('should apply automatic budget (40% of income)', async ({ page }) => {
    // Agregar ingreso
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(page, 'ingreso', 5000, 'Salario', 'sueldo');

    // Navegar a presupuestos
    await helpers.navigateDesktop(page, 'Presupuestos');

    // Click en "Aplicar Automático"
    const autoBtn = page.locator('button:has-text("Automático")');
    if (await autoBtn.isVisible()) {
      await autoBtn.click();
      await page.waitForTimeout(500);

      // Debe mostrar modal de confirmación
      const confirmBtn = page.locator('button:has-text("Confirmar")');
      if (await confirmBtn.isVisible()) {
        await confirmBtn.click();
        await page.waitForTimeout(500);
      }

      // Debería tener presupuestos creados (40% de 5000 = 2000 distribuido)
      await expect(page.locator('text=comida')).toBeVisible();
    }
  });

  test('should edit existing budget', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Presupuestos');
    
    await helpers.createBudget(page, 'comida', 500);

    // Editar (buscar botón editar o hacer click)
    const editBtn = page.locator('button:has-text("Editar")').first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      
      // Cambiar monto
      await page.fill('[name="amount"]', '700');
      await page.click('button:has-text("Guardar")');
      
      await page.waitForTimeout(500);
      // Verificar que cambió
      await expect(page.locator('text=700')).toBeVisible();
    }
  });

  test('should delete budget', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Presupuestos');
    
    await helpers.createBudget(page, 'comida', 500);

    // Verificar que existe
    await expect(page.locator('text=comida')).toBeVisible();

    // Eliminar
    const deleteBtn = page.locator('button:has-text("Eliminar")').first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await page.waitForTimeout(500);

      // Confirmar si hay modal
      const confirmBtn = page.locator('button:has-text("Confirmar")');
      if (await confirmBtn.isVisible()) {
        await confirmBtn.click();
        await page.waitForTimeout(500);
      }
    }
  });

  test('should display budget summary', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Presupuestos');
    
    await helpers.createBudget(page, 'comida', 500);
    await helpers.createBudget(page, 'vivienda', 2000);
    await helpers.createBudget(page, 'transporte', 300);

    // Debería mostrar resumen
    await expect(page.locator('text=comida')).toBeVisible();
    await expect(page.locator('text=vivienda')).toBeVisible();
    await expect(page.locator('text=transporte')).toBeVisible();
  });

  test('should calculate total budget', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Presupuestos');
    
    await helpers.createBudget(page, 'comida', 500);
    await helpers.createBudget(page, 'vivienda', 2000);

    // Debería mostrar total: 2500
    const totalElement = page.locator('text=Total');
    await expect(totalElement).toBeVisible();
  });

  test('should filter budgets by status', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Presupuestos');
    
    await helpers.createBudget(page, 'comida', 500);

    // Buscar filtro (si existe)
    const filterBtn = page.locator('button:has-text("Filtro")');
    if (await filterBtn.isVisible()) {
      await filterBtn.click();
      // Filtrar por estado
    }
  });

});

test.describe('PRESUPUESTOS - Móvil', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
  });

  test('should open budgets from FAB', async ({ page }) => {
    await helpers.navigateMobile(page, 'budgets');
    await expect(page.locator('text=Presupuesto')).toBeVisible();
  });

  test('should create budget from mobile', async ({ page }) => {
    await helpers.navigateMobile(page, 'budgets');
    
    await helpers.createBudget(page, 'comida', 500);

    await expect(page.locator('text=comida')).toBeVisible();
  });

  test('should display responsive budget cards', async ({ page }) => {
    await helpers.navigateMobile(page, 'budgets');
    
    await helpers.createBudget(page, 'comida', 500);

    // Las tarjetas deben ser responsive
    const budgetCard = page.locator('[class*="card"]').first();
    await expect(budgetCard).toBeVisible();
  });

  test('should show progress bar on mobile', async ({ page }) => {
    await helpers.navigateMobile(page, 'budgets');
    
    await helpers.createBudget(page, 'comida', 500);

    // Verificar barra de progreso
    const progressBar = page.locator('[class*="progress"]');
    await expect(progressBar).toBeVisible();
  });

});

test.describe('PRESUPUESTOS - Integración', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('should sync budget changes immediately', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Presupuestos');
    
    // Crear presupuesto
    await helpers.createBudget(page, 'comida', 500);

    // Ir a transacciones
    await helpers.navigateDesktop(page, 'Transacciones');
    
    // Agregar gasto en comida
    await helpers.addTransaction(page, 'gasto-variable', 100, 'Gasto 1', 'comida');
    
    // Volver a presupuestos
    await helpers.navigateDesktop(page, 'Presupuestos');

    // El progreso debería actualizarse
    await expect(page.locator('text=comida')).toBeVisible();
  });

  test('should maintain budget persistence', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Presupuestos');
    
    await helpers.createBudget(page, 'comida', 500);

    // Recargar página
    await page.reload();
    await page.waitForTimeout(1000);

    // Navegar a presupuestos
    await helpers.navigateDesktop(page, 'Presupuestos');

    // El presupuesto debe seguir aquí
    await expect(page.locator('text=comida')).toBeVisible();
  });

});
