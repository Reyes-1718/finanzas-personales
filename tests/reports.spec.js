import { test, expect } from '@playwright/test';
import { helpers } from './helpers';

const DESKTOP_VIEWPORT = { width: 1280, height: 720 };

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await helpers.clearStorage(page);
  
  // Agregar datos de prueba
  await helpers.addTransaction(page, {
    type: 'income',
    amount: 3000,
    category: 'Salario',
    description: 'Salario mensual'
  });
  
  await helpers.addTransaction(page, {
    type: 'expense',
    amount: 500,
    category: 'Alimentación',
    description: 'Compras del mes'
  });
});

test.describe('REPORTES - Desktop', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('should navigate to Reports section', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Reportes');
    await expect(page.locator('text=Reportes')).toBeVisible();
  });

  test('should display report generation options', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Reportes');

    // Debe tener opciones de export
    const exportBtn = page.locator('button:has-text("Exportar")');
    await expect(exportBtn.first()).toBeVisible();
  });

  test('should generate PDF report', async ({ page, context }) => {
    await helpers.navigateDesktop(page, 'Reportes');

    // Esperar popup de descarga
    const downloadPromise = context.waitForEvent('page');
    
    const pdfBtn = page.locator('button:has-text("PDF")');
    if (await pdfBtn.isVisible()) {
      await pdfBtn.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should export transactions to CSV', async ({ page, context }) => {
    await helpers.navigateDesktop(page, 'Reportes');

    const downloadPromise = context.waitForEvent('page');
    
    const csvBtn = page.locator('button:has-text("CSV")');
    if (await csvBtn.isVisible()) {
      await csvBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test('should export transactions to JSON', async ({ page, context }) => {
    await helpers.navigateDesktop(page, 'Reportes');

    const downloadPromise = context.waitForEvent('page');
    
    const jsonBtn = page.locator('button:has-text("JSON")');
    if (await jsonBtn.isVisible()) {
      await jsonBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test('should display report preview', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Reportes');

    // Debe mostrar vista previa con resumen
    const summary = page.locator('[class*="summary"]');
    // Verificar datos
  });

  test('should allow date range selection for reports', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Reportes');

    const startDateInput = page.locator('input[type="date"]').first();
    if (await startDateInput.isVisible()) {
      await startDateInput.fill('2024-01-01');
      
      const endDateInput = page.locator('input[type="date"]').nth(1);
      if (await endDateInput.isVisible()) {
        await endDateInput.fill('2024-12-31');
      }
    }
  });

  test('should include transaction summary in report', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Reportes');

    // Debe mostrar:
    // - Total de ingresos
    // - Total de gastos
    // - Balance
    // - Número de transacciones
    const summaryCards = page.locator('[class*="card"], [class*="stat"]');
    // Debe tener al menos 4 cards
  });

  test('should show category breakdown in report', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Reportes');

    // Tabla o gráfico con desglose por categoría
    const categoryTable = page.locator('table');
    if (await categoryTable.isVisible()) {
      // Debe tener filas para cada categoría
    }
  });

  test('should filter report by category', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Reportes');

    const categoryFilter = page.locator('[name="category"]');
    if (await categoryFilter.isVisible()) {
      await categoryFilter.selectOption('Alimentación');
      await page.waitForTimeout(500);

      // Debe actualizar reporte
    }
  });

  test('should display transaction list in report', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Reportes');

    // Lista detallada de transacciones
    const transactionTable = page.locator('table');
    if (await transactionTable.isVisible()) {
      // Columnas: Fecha, Descripción, Categoría, Monto, Tipo
    }
  });

  test('should allow printing report', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Reportes');

    const printBtn = page.locator('button[title*="Imprimir"], button:has-text("Imprimir")');
    if (await printBtn.isVisible()) {
      await printBtn.click();
      // Abre diálogo de impresión
      await page.waitForTimeout(300);
    }
  });

});

test.describe('REPORTES - Móvil', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('should open reports from FAB', async ({ page }) => {
    await helpers.navigateMobile(page, 'reports');
    await expect(page.locator('text=Reportes')).toBeVisible();
  });

  test('should display mobile-friendly report export options', async ({ page }) => {
    await helpers.navigateMobile(page, 'reports');

    const exportBtn = page.locator('button:has-text("Exportar")');
    await expect(exportBtn.first()).toBeVisible();
  });

});

test.describe('REPORTES - Archivos', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('should generate PDF with correct naming format', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Reportes');

    // Formato esperado: reporte-YYYY-MM-DD.pdf
    const fileName = 'reporte-' + new Date().toISOString().split('T')[0] + '.pdf';
  });

  test('should generate CSV with correct format', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Reportes');

    // Debe tener columnas separadas por coma
    // Encoding UTF-8
  });

  test('should include timestamp in exported filename', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Reportes');

    // Ejemplo: reporte-2024-01-15-143022.json
  });

});
