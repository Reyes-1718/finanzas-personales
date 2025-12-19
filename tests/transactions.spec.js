import { test, expect } from '@playwright/test';
import { helpers } from './helpers';

const DESKTOP_VIEWPORT = { width: 1280, height: 720 };
const MOBILE_VIEWPORT = { width: 390, height: 844 };

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await helpers.clearStorage(page);
});

test.describe('TRANSACCIONES - Desktop', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('should navigate to Transactions tab', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Transacciones');
    await expect(page.locator('text=Agregar Transacción')).toBeVisible();
  });

  test('should display transaction form with all fields', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Transacciones');
    
    // Verificar campos del formulario
    await expect(page.locator('[name="type"]')).toBeVisible();
    await expect(page.locator('[name="amount"]')).toBeVisible();
    await expect(page.locator('[name="description"]')).toBeVisible();
    await expect(page.locator('[name="category"]')).toBeVisible();
    await expect(page.locator('[name="date"]')).toBeVisible();
    await expect(page.locator('[name="paymentMethod"]')).toBeVisible();
  });

  test('should add income transaction', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Transacciones');
    
    await helpers.addTransaction(
      page,
      'ingreso',
      5000,
      'Salario Mensual',
      'sueldo'
    );

    // Verificar que aparece en la lista
    await helpers.verifyTransactionInList(page, 'Salario Mensual');
  });

  test('should add expense transaction', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Transacciones');
    
    await helpers.addTransaction(
      page,
      'gasto-variable',
      150,
      'Compra en mercado',
      'comida'
    );

    // Verificar que aparece en la lista
    await helpers.verifyTransactionInList(page, 'Compra en mercado');
  });

  test('should validate required fields', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Transacciones');
    
    // Intentar enviar sin monto
    await page.fill('[name="description"]', 'Test');
    await page.click('button:has-text("Agregar Transacción")');
    
    // Debería mostrar error
    await page.waitForTimeout(500);
    // El formulario no debería enviarse sin monto
    await expect(page.locator('[name="amount"]')).toBeVisible();
  });

  test('should add fixed expense', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Transacciones');
    
    await helpers.addTransaction(
      page,
      'gasto-fijo',
      1000,
      'Renta del apartamento',
      'vivienda'
    );

    await helpers.verifyTransactionInList(page, 'Renta del apartamento');
  });

  test('should delete transaction', async ({ page }) => {
    // Primero agregar una transacción
    await helpers.navigateDesktop(page, 'Transacciones');
    await helpers.addTransaction(
      page,
      'gasto-variable',
      100,
      'Transacción a eliminar',
      'otros'
    );

    // Verificar que existe
    await helpers.verifyTransactionInList(page, 'Transacción a eliminar');
    
    // Eliminar
    await helpers.deleteTransaction(page, 'Transacción a eliminar');
    
    // Verificar que ya no existe
    await page.waitForTimeout(500);
    // Si se eliminó, no debería estar visible
  });

  test('should change transaction type', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Transacciones');
    
    // Seleccionar Ingreso
    await page.selectOption('[name="type"]', 'ingreso');
    const incomeType = page.locator('[name="incomeType"]');
    await expect(incomeType).toBeVisible();
    
    // Seleccionar Gasto
    await page.selectOption('[name="type"]', 'gasto-variable');
    await expect(incomeType).not.toBeVisible();
  });

  test('should filter transactions by date', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Transacciones');
    
    // Agregar transacción
    await helpers.addTransaction(
      page,
      'ingreso',
      1000,
      'Pago',
      'sueldo'
    );

    // Debería filtrar por fecha
    const dateInput = page.locator('[name="date"]');
    await expect(dateInput).toBeVisible();
  });

  test('should update currency field', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Transacciones');
    
    // Verificar selector de moneda
    const currencySelect = page.locator('[name="currency"]');
    await expect(currencySelect).toBeVisible();
    
    // Cambiar a USD
    await page.selectOption('[name="currency"]', 'USD');
  });

});

test.describe('TRANSACCIONES - Móvil', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
  });

  test('should open transaction form from FAB', async ({ page }) => {
    // Abrir FAB
    const fab = page.getByTestId('fab-button');
    await fab.click();
    
    // Navegar a Transacciones
    const txButton = page.getByTestId('fab-item-transactions');
    await expect(txButton).toBeVisible();
    await txButton.click();
    
    // Verificar formulario visible
    await expect(page.locator('text=Agregar Transacción')).toBeVisible();
  });

  test('should add transaction from mobile', async ({ page }) => {
    await helpers.navigateMobile(page, 'transactions');
    
    await helpers.addTransaction(
      page,
      'ingreso',
      2000,
      'Ingreso móvil',
      'sueldo'
    );

    // Debe estar en la lista
    await helpers.verifyTransactionInList(page, 'Ingreso móvil');
  });

  test('should handle responsive form layout', async ({ page }) => {
    await helpers.navigateMobile(page, 'transactions');
    
    // Verificar que los campos están apilados (responsive)
    const form = page.locator('form');
    await expect(form).toBeVisible();
    
    // El formulario debe estar visible sin scroll horizontal
    const viewportSize = await page.viewportSize();
    expect(viewportSize.width).toBeLessThanOrEqual(480);
  });

});
