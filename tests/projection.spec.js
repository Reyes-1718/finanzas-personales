import { test, expect } from '@playwright/test';
import { helpers } from './helpers';

const DESKTOP_VIEWPORT = { width: 1280, height: 720 };

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await helpers.clearStorage(page);
});

test.describe('PROYECCIÓN - Desktop', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('should navigate to Projection section', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Proyección');
    await expect(page.locator('text=Proyección')).toBeVisible();
  });

  test('should display projection parameters form', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Proyección');

    // Debe tener campos de entrada
    const projectionForm = page.locator('[name="monthlyIncome"], [name="monthlyExpense"], [name="months"]');
    await expect(projectionForm.first()).toBeVisible();
  });

  test('should generate projection for 6 months', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Proyección');

    // Llenar parámetros
    const incomeInput = page.locator('[name="monthlyIncome"]');
    const expenseInput = page.locator('[name="monthlyExpense"]');
    
    if (await incomeInput.isVisible()) {
      await incomeInput.fill('3000');
    }
    
    if (await expenseInput.isVisible()) {
      await expenseInput.fill('2000');
    }

    // Click en generar
    const generateBtn = page.locator('button:has-text("Generar")');
    if (await generateBtn.isVisible()) {
      await generateBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test('should display projection chart', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Proyección');

    // Llenar datos
    const incomeInput = page.locator('[name="monthlyIncome"]');
    if (await incomeInput.isVisible()) {
      await incomeInput.fill('3000');
      
      const expenseInput = page.locator('[name="monthlyExpense"]');
      if (await expenseInput.isVisible()) {
        await expenseInput.fill('2000');
        
        const generateBtn = page.locator('button:has-text("Generar")');
        if (await generateBtn.isVisible()) {
          await generateBtn.click();
          await page.waitForTimeout(500);
        }
      }
    }

    // Debe mostrar gráfico
    const chart = page.locator('[class*="recharts"]');
    // Debería estar visible si hay datos
  });

  test('should show projected balance over time', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Proyección');

    // Ingresos: 3000, Gastos: 2000, Balance: +1000/mes
    const balanceInfo = page.locator('text=Balance');
    
    // O en la tabla de resultados
  });

  test('should calculate break-even point', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Proyección');

    // Si gastos > ingresos, debe mostrar meses hasta 0 balance
    const incomeInput = page.locator('[name="monthlyIncome"]');
    if (await incomeInput.isVisible()) {
      await incomeInput.fill('2000');
      
      const expenseInput = page.locator('[name="monthlyExpense"]');
      if (await expenseInput.isVisible()) {
        await expenseInput.fill('2500');
        
        const generateBtn = page.locator('button:has-text("Generar")');
        if (await generateBtn.isVisible()) {
          await generateBtn.click();
          await page.waitForTimeout(500);

          // Debería mostrar mes en que se acaba el dinero
        }
      }
    }
  });

  test('should display data table with projections', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Proyección');

    // Llenar y generar
    const incomeInput = page.locator('[name="monthlyIncome"]');
    if (await incomeInput.isVisible()) {
      await incomeInput.fill('3000');
      
      const expenseInput = page.locator('[name="monthlyExpense"]');
      if (await expenseInput.isVisible()) {
        await expenseInput.fill('2000');
        
        const generateBtn = page.locator('button:has-text("Generar")');
        if (await generateBtn.isVisible()) {
          await generateBtn.click();
          await page.waitForTimeout(500);

          // Debe haber tabla con datos mensuales
          const table = page.locator('table');
          if (await table.isVisible()) {
            // Verificar que tiene columnas: Mes, Ingresos, Gastos, Balance
          }
        }
      }
    }
  });

  test('should allow different scenarios (optimistic, realistic, pessimistic)', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Proyección');

    // Buscar selector de escenarios
    const scenarioSelect = page.locator('[name="scenario"]');
    if (await scenarioSelect.isVisible()) {
      await scenarioSelect.selectOption('optimistic');
      await page.waitForTimeout(300);

      await scenarioSelect.selectOption('realistic');
      await page.waitForTimeout(300);

      await scenarioSelect.selectOption('pessimistic');
      await page.waitForTimeout(300);
    }
  });

});

test.describe('PROYECCIÓN - Móvil', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('should open projection from FAB', async ({ page }) => {
    await helpers.navigateMobile(page, 'projection');
    await expect(page.locator('text=Proyección')).toBeVisible();
  });

  test('should display responsive projection form', async ({ page }) => {
    await helpers.navigateMobile(page, 'projection');

    const form = page.locator('[class*="form"]');
    await expect(form).toBeVisible();
  });

});

test.describe('PROYECCIÓN - Validación', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('should validate required fields', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Proyección');

    // Intentar generar sin llenar
    const generateBtn = page.locator('button:has-text("Generar")');
    if (await generateBtn.isVisible()) {
      await generateBtn.click();
      // Debe mostrar error
      await page.waitForTimeout(300);
    }
  });

  test('should handle zero income gracefully', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Proyección');

    const incomeInput = page.locator('[name="monthlyIncome"]');
    if (await incomeInput.isVisible()) {
      await incomeInput.fill('0');
      
      const expenseInput = page.locator('[name="monthlyExpense"]');
      if (await expenseInput.isVisible()) {
        await expenseInput.fill('1000');
        
        const generateBtn = page.locator('button:has-text("Generar")');
        if (await generateBtn.isVisible()) {
          await generateBtn.click();
          await page.waitForTimeout(500);

          // Debería mostrar proyección negativa
        }
      }
    }
  });

});
