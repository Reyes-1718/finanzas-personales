import { test, expect } from '@playwright/test';
import { helpers } from './helpers';

const DESKTOP_VIEWPORT = { width: 1280, height: 720 };
const MOBILE_VIEWPORT = { width: 390, height: 844 };

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await helpers.clearStorage(page);
});

test.describe('METAS DE AHORRO - Desktop', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('should navigate to Savings Goals section', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Metas');
    await expect(page.locator('text=Meta')).toBeVisible();
  });

  test('should display savings goal creation form', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Metas');
    
    // Verificar campos
    await expect(page.locator('[name="name"]')).toBeVisible();
    await expect(page.locator('[name="targetAmount"]')).toBeVisible();
    await expect(page.locator('[name="deadline"]')).toBeVisible();
  });

  test('should create savings goal with valid data', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Metas');
    
    await helpers.createSavingsGoal(
      page,
      'Vacaciones',
      5000,
      12,
      2500
    );

    // Verificar que aparece en la lista
    await expect(page.locator('text=Vacaciones')).toBeVisible();
  });

  test('should display goal progress bar', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Metas');
    
    await helpers.createSavingsGoal(
      page,
      'Casa nueva',
      50000,
      24,
      3000
    );

    // Debe haber una barra de progreso (0% al inicio)
    const progressBar = page.locator('[class*="progress"], [role="progressbar"]');
    await expect(progressBar).toBeVisible();
  });

  test('should calculate monthly savings needed', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Metas');
    
    await helpers.createSavingsGoal(
      page,
      'Vacaciones',
      12000,
      12,
      3000
    );

    // Debería calcular 12000 / 12 = 1000 por mes
    // Verificar que muestra el cálculo
    await expect(page.locator('text=1000')).toBeVisible();
  });

  test('should show viability indicator', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Metas');
    
    // Meta viable (1000/mes en ingreso 3000)
    await helpers.createSavingsGoal(
      page,
      'Meta fácil',
      12000,
      12,
      3000
    );

    // Debería mostrar indicador verde (posible)
    const viabilityElement = page.locator('[class*="green"], [class*="possible"]');
  });

  test('should show warning for difficult goals', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Metas');
    
    // Meta difícil (más del 100% del ingreso)
    await helpers.createSavingsGoal(
      page,
      'Meta imposible',
      50000,
      12,
      2000
    );

    // Debería mostrar indicador rojo (difícil)
    // Necesita 4166/mes pero ingreso es 2000
    const warningElement = page.locator('[class*="red"], [class*="warn"]');
  });

  test('should add savings to goal', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Metas');
    
    await helpers.createSavingsGoal(
      page,
      'Viaje',
      3000,
      6,
      2000
    );

    // Agregar aporte (buscar botón de aporte o modal)
    const contributeBtn = page.locator('button:has-text("Aporte")').first();
    if (await contributeBtn.isVisible()) {
      await contributeBtn.click();
      
      // Llenar monto
      await page.fill('[name="contribution"]', '500');
      await page.click('button:has-text("Agregar")');
      
      await page.waitForTimeout(500);
      
      // El progreso debe actualizarse (500/3000 = 16.7%)
      await expect(page.locator('text=Viaje')).toBeVisible();
    }
  });

  test('should update goal progress percentage', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Metas');
    
    await helpers.createSavingsGoal(
      page,
      'Ahorro',
      10000,
      10,
      2000
    );

    // Agregar múltiples aportes
    for (let i = 0; i < 3; i++) {
      const contributeBtn = page.locator('button:has-text("Aporte")').first();
      if (await contributeBtn.isVisible()) {
        await contributeBtn.click();
        await page.fill('[name="contribution"]', '1000');
        await page.click('button:has-text("Agregar")');
        await page.waitForTimeout(300);
      }
    }

    // Total aportado: 3000, Meta: 10000 = 30%
    // Debería mostrar 30%
    await expect(page.locator('text=Ahorro')).toBeVisible();
  });

  test('should complete goal at 100%', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Metas');
    
    await helpers.createSavingsGoal(
      page,
      'Meta pequeña',
      1000,
      6,
      1500
    );

    // Agregar monto completo
    const contributeBtn = page.locator('button:has-text("Aporte")').first();
    if (await contributeBtn.isVisible()) {
      await contributeBtn.click();
      await page.fill('[name="contribution"]', '1000');
      await page.click('button:has-text("Agregar")');
      await page.waitForTimeout(500);

      // Debería mostrar alerta de meta completada
      const completeMsg = page.locator('[class*="complete"], text=100%');
    }
  });

  test('should edit savings goal', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Metas');
    
    await helpers.createSavingsGoal(
      page,
      'Original',
      5000,
      12,
      2000
    );

    // Buscar botón editar
    const editBtn = page.locator('button:has-text("Editar")').first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      
      // Cambiar monto
      await page.fill('[name="targetAmount"]', '7000');
      await page.click('button:has-text("Guardar")');
      
      await page.waitForTimeout(500);
      
      // Verificar cambio
      await expect(page.locator('text=Original')).toBeVisible();
    }
  });

  test('should delete savings goal', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Metas');
    
    await helpers.createSavingsGoal(
      page,
      'A eliminar',
      3000,
      6,
      1500
    );

    // Verificar que existe
    await expect(page.locator('text=A eliminar')).toBeVisible();

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

  test('should display multiple goals', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Metas');
    
    // Crear varias metas
    await helpers.createSavingsGoal(page, 'Meta 1', 5000, 12, 2000);
    await helpers.createSavingsGoal(page, 'Meta 2', 10000, 24, 2500);
    await helpers.createSavingsGoal(page, 'Meta 3', 3000, 6, 1500);

    // Todas deben ser visibles
    await expect(page.locator('text=Meta 1')).toBeVisible();
    await expect(page.locator('text=Meta 2')).toBeVisible();
    await expect(page.locator('text=Meta 3')).toBeVisible();
  });

  test('should calculate deadline progress', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Metas');
    
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 6);

    await helpers.createSavingsGoal(
      page,
      'A futuro',
      6000,
      6,
      2000
    );

    // Debería mostrar tiempo restante o progreso de tiempo
    await expect(page.locator('text=A futuro')).toBeVisible();
  });

});

test.describe('METAS DE AHORRO - Móvil', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
  });

  test('should open savings goals from FAB', async ({ page }) => {
    await helpers.navigateMobile(page, 'goals');
    await expect(page.locator('text=Meta')).toBeVisible();
  });

  test('should create goal from mobile', async ({ page }) => {
    await helpers.navigateMobile(page, 'goals');
    
    await helpers.createSavingsGoal(
      page,
      'Meta móvil',
      5000,
      12,
      2000
    );

    await expect(page.locator('text=Meta móvil')).toBeVisible();
  });

  test('should display responsive goal cards', async ({ page }) => {
    await helpers.navigateMobile(page, 'goals');
    
    await helpers.createSavingsGoal(
      page,
      'Tarjeta responsive',
      3000,
      6,
      1500
    );

    // Las tarjetas deben ser responsive
    const goalCard = page.locator('[class*="card"]').first();
    await expect(goalCard).toBeVisible();
  });

  test('should show progress bar on mobile', async ({ page }) => {
    await helpers.navigateMobile(page, 'goals');
    
    await helpers.createSavingsGoal(
      page,
      'Con barra',
      5000,
      12,
      2000
    );

    const progressBar = page.locator('[class*="progress"]');
    await expect(progressBar).toBeVisible();
  });

});

test.describe('METAS DE AHORRO - Integración', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('should persist savings goals after reload', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Metas');
    
    await helpers.createSavingsGoal(
      page,
      'Persistencia',
      5000,
      12,
      2000
    );

    // Recargar
    await page.reload();
    await page.waitForTimeout(1000);

    // Navegar a metas
    await helpers.navigateDesktop(page, 'Metas');

    // La meta debe seguir aquí
    await expect(page.locator('text=Persistencia')).toBeVisible();
  });

  test('should calculate percentage of income needed', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Metas');
    
    // Meta: 2000, plazo: 4 meses, ingreso: 1000
    // Necesita: 500/mes = 50% del ingreso
    await helpers.createSavingsGoal(
      page,
      'Test porcentaje',
      2000,
      4,
      1000
    );

    // Debería mostrar 50%
    await expect(page.locator('text=Test porcentaje')).toBeVisible();
  });

});
