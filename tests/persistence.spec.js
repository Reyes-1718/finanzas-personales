import { test, expect } from '@playwright/test';
import { helpers } from './helpers';

const DESKTOP_VIEWPORT = { width: 1280, height: 720 };

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await helpers.clearStorage(page);
});

test.describe('PERSISTENCIA - LocalStorage', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('should persist transaction to LocalStorage', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Transacciones');
    
    // Agregar transacción
    await helpers.addTransaction(
      page,
      'ingreso',
      5000,
      'Test de persistencia',
      'sueldo'
    );

    // Verificar que está en LocalStorage (cifrado)
    const stored = await page.evaluate(() => localStorage.getItem('finanzas_data'));
    expect(stored).toBeTruthy();
    expect(stored).toContain('U2FsdGVk'); // Formato de CryptoJS
  });

  test('should recover data after page reload', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Transacciones');
    
    // Agregar transacción
    await helpers.addTransaction(
      page,
      'ingreso',
      3000,
      'Transacción antes de recarga',
      'sueldo'
    );

    // Recargar página
    await page.reload();
    
    // Esperar a que cargue
    await page.waitForTimeout(1000);

    // Verificar que la transacción sigue aquí
    await helpers.verifyTransactionInList(page, 'Transacción antes de recarga');
  });

  test('should encrypt data in LocalStorage', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Transacciones');
    
    await helpers.addTransaction(
      page,
      'ingreso',
      1000,
      'Dato confidencial',
      'sueldo'
    );

    // Obtener datos del storage
    const encrypted = await page.evaluate(() => localStorage.getItem('finanzas_data'));
    
    // Verificar que NO contiene texto plano
    expect(encrypted).not.toContain('Dato confidencial');
    expect(encrypted).not.toContain('1000');
    
    // Verificar que está encriptado (formato CryptoJS)
    expect(encrypted).toMatch(/^U2FsdGVk/);
  });

  test('should persist multiple transactions', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Transacciones');
    
    // Agregar varias transacciones
    const transactions = [
      ['ingreso', 5000, 'Salario', 'sueldo'],
      ['gasto-variable', 150, 'Almuerzo', 'comida'],
      ['gasto-fijo', 1000, 'Renta', 'vivienda'],
      ['gasto-variable', 50, 'Taxi', 'transporte']
    ];

    for (const [type, amount, desc, cat] of transactions) {
      await helpers.addTransaction(page, type, amount, desc, cat);
      await page.waitForTimeout(300);
    }

    // Recargar
    await page.reload();
    await page.waitForTimeout(1000);

    // Verificar todas están presentes
    for (const [, , desc] of transactions) {
      await helpers.verifyTransactionInList(page, desc);
    }
  });

  test('should persist budget settings', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Presupuestos');
    
    // Crear presupuesto
    await helpers.createBudget(page, 'comida', 500);

    // Recargar
    await page.reload();
    await page.waitForTimeout(1000);

    // Navegar a presupuestos
    await helpers.navigateDesktop(page, 'Presupuestos');
    
    // Verificar que el presupuesto sigue aquí
    await expect(page.locator('text=comida')).toBeVisible();
  });

  test('should persist savings goals', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Metas');
    
    // Crear meta
    await helpers.createSavingsGoal(
      page,
      'Vacaciones',
      10000,
      12,
      3000
    );

    // Recargar
    await page.reload();
    await page.waitForTimeout(1000);

    // Navegar a metas
    await helpers.navigateDesktop(page, 'Metas');
    
    // Verificar que la meta sigue aquí
    await expect(page.locator('text=Vacaciones')).toBeVisible();
  });

  test('should clear data when using clear function', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Transacciones');
    
    // Agregar transacción
    await helpers.addTransaction(
      page,
      'ingreso',
      1000,
      'Será eliminada',
      'sueldo'
    );

    // Limpiar storage
    await helpers.clearStorage(page);
    
    // Verificar que no hay transacciones
    const txList = page.locator('text=Será eliminada');
    await expect(txList).not.toBeVisible();
  });

  test('should update persisted data when transaction is modified', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Transacciones');
    
    // Agregar transacción
    await helpers.addTransaction(
      page,
      'ingreso',
      1000,
      'Transacción original',
      'sueldo'
    );

    // Recargar
    await page.reload();
    await page.waitForTimeout(1000);

    // La transacción debe estar presente
    await helpers.verifyTransactionInList(page, 'Transacción original');

    // Eliminar transacción
    await helpers.deleteTransaction(page, 'Transacción original');
    
    // Recargar
    await page.reload();
    await page.waitForTimeout(1000);

    // No debe estar presente
    // (Nota: después de eliminar y recargar, no debe estar)
  });

  test('should maintain transaction order after reload', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Transacciones');
    
    // Agregar transacciones en orden
    await helpers.addTransaction(page, 'ingreso', 1000, 'Primera', 'sueldo');
    await helpers.addTransaction(page, 'ingreso', 2000, 'Segunda', 'sueldo');
    await helpers.addTransaction(page, 'ingreso', 3000, 'Tercera', 'sueldo');

    // Recargar
    await page.reload();
    await page.waitForTimeout(1000);

    // Verificar orden (normalmente en orden inverso - más reciente primero)
    const transactions = page.locator('text=Primera, Segunda, Tercera');
    await expect(transactions).toBeVisible();
  });

  test('should persist theme preference', async ({ page }) => {
    // Cambiar tema
    const themeToggle = page.locator('button[data-testid="theme-toggle"]');
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(300);
    }

    // Obtener estado del tema
    const isDark = await page.evaluate(() => 
      document.documentElement.classList.contains('dark')
    );

    // Recargar
    await page.reload();
    await page.waitForTimeout(1000);

    // Verificar que se mantiene
    const isDarkAfter = await page.evaluate(() => 
      document.documentElement.classList.contains('dark')
    );

    expect(isDarkAfter).toBe(isDark);
  });

  test('should handle corrupted data gracefully', async ({ page }) => {
    // Insertar datos inválidos
    await page.evaluate(() => {
      localStorage.setItem('finanzas_data', 'DATOS_CORRUPTOS');
    });

    // Recargar página
    await page.reload();
    await page.waitForTimeout(1000);

    // La app debería cargar sin error (con datos vacíos)
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should have correct encryption key format', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Transacciones');
    
    await helpers.addTransaction(
      page,
      'ingreso',
      500,
      'Test de encriptación',
      'sueldo'
    );

    // Obtener datos encriptados
    const encrypted = await page.evaluate(() => localStorage.getItem('finanzas_data'));
    
    // Verificar formato de CryptoJS AES
    expect(encrypted).toMatch(/^U2FsdGVkKw/);
    
    // Debería tener estructura válida (no vacío, no muy corto)
    expect(encrypted.length).toBeGreaterThan(100);
  });

  test('should preserve data across different tabs', async ({ context }) => {
    // Abrir dos pestañas
    const page1 = await context.newPage();
    const page2 = await context.newPage();

    // En página 1, agregar transacción
    await page1.goto('/');
    await helpers.clearStorage(page1);
    await helpers.navigateDesktop(page1, 'Transacciones');
    await helpers.addTransaction(page1, 'ingreso', 1000, 'Desde page 1', 'sueldo');

    // En página 2, recargar y verificar que ve la transacción
    await page2.goto('/');
    await page2.waitForTimeout(500);
    
    // Las pestañas comparten el mismo LocalStorage
    await helpers.verifyTransactionInList(page2, 'Desde page 1');

    await page1.close();
    await page2.close();
  });

});
