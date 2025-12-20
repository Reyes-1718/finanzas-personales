import { test, expect } from '@playwright/test';
import { helpers } from './helpers';

const DESKTOP_VIEWPORT = { width: 1280, height: 720 };

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await helpers.clearStorage(page);
  await page.setViewportSize(DESKTOP_VIEWPORT);
});

test.describe('BUG TEST - Past Date Transactions', () => {
  
  test('should register transaction with past date (1st of December)', async ({ page }) => {
    // Navegar a Transacciones
    await helpers.navigateDesktop(page, 'Transacciones');
    await expect(page.locator('text=Agregar Transacción')).toBeVisible();
    
    // Obtener fecha del 1 de diciembre del año actual
    const currentYear = new Date().getFullYear();
    const pastDate = `${currentYear}-12-01`;
    
    console.log('Intentando registrar transacción con fecha:', pastDate);
    
    // Llenar formulario con fecha pasada
    await page.selectOption('[name="type"]', 'gasto-variable');
    await page.fill('[name="amount"]', '150');
    await page.fill('[name="description"]', 'Transacción del 1 de diciembre');
    await page.selectOption('[name="category"]', 'comida');
    
    // Establecer fecha pasada
    await page.fill('[name="date"]', pastDate);
    
    // Verificar que el valor se estableció correctamente
    const dateValue = await page.inputValue('[name="date"]');
    console.log('Valor de fecha en el campo:', dateValue);
    expect(dateValue).toBe(pastDate);
    
    // Enviar formulario
    await page.click('button:has-text("Agregar Transacción")');
    
    // Esperar a que se procese
    await page.waitForTimeout(1000);
    
    // Verificar que la transacción aparece en la lista
    await helpers.verifyTransactionInList(page, 'Transacción del 1 de diciembre');
    
    // Navegar a Dashboard para verificar que la transacción se contabiliza
    await helpers.navigateDesktop(page, 'Dashboard');
    await page.waitForTimeout(500);
    
    // Verificar que los gastos no son cero (la transacción debe estar registrada)
    const expensesElement = await page.locator('text=Gastos').locator('..').locator('p').nth(1);
    const expensesText = await expensesElement.textContent();
    console.log('Total gastos en Dashboard:', expensesText);
    
    // El total debería incluir los 150 de la transacción
    expect(expensesText).toContain('150');
  });
  
  test('should register transaction with date 10 days ago', async ({ page }) => {
    // Navegar a Transacciones
    await helpers.navigateDesktop(page, 'Transacciones');
    
    // Calcular fecha de hace 10 días
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    const pastDate = tenDaysAgo.toISOString().split('T')[0];
    
    console.log('Intentando registrar transacción con fecha hace 10 días:', pastDate);
    
    // Agregar transacción con fecha pasada
    await page.selectOption('[name="type"]', 'gasto-variable');
    await page.fill('[name="amount"]', '250');
    await page.fill('[name="description"]', 'Compra hace 10 días');
    await page.selectOption('[name="category"]', 'otros');
    await page.fill('[name="date"]', pastDate);
    
    // Enviar
    await page.click('button:has-text("Agregar Transacción")');
    await page.waitForTimeout(1000);
    
    // Verificar que aparece en la lista
    await helpers.verifyTransactionInList(page, 'Compra hace 10 días');
  });
  
  test('should register transaction with date from last month', async ({ page }) => {
    // Navegar a Transacciones
    await helpers.navigateDesktop(page, 'Transacciones');
    
    // Calcular fecha del mes pasado (mismo día)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const pastDate = lastMonth.toISOString().split('T')[0];
    
    console.log('Intentando registrar transacción del mes pasado:', pastDate);
    
    // Agregar transacción
    await page.selectOption('[name="type"]', 'ingreso');
    await page.fill('[name="amount"]', '5000');
    await page.fill('[name="description"]', 'Ingreso del mes pasado');
    await page.selectOption('[name="incomeType"]', 'sueldo');
    await page.fill('[name="date"]', pastDate);
    
    // Enviar
    await page.click('button:has-text("Agregar Transacción")');
    await page.waitForTimeout(1000);
    
    // Verificar en la lista
    await helpers.verifyTransactionInList(page, 'Ingreso del mes pasado');
  });
  
  test('should display past transactions in Dashboard when selecting previous month', async ({ page }) => {
    // Agregar transacción del mes pasado
    await helpers.navigateDesktop(page, 'Transacciones');
    
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const pastDate = lastMonth.toISOString().split('T')[0];
    
    await page.selectOption('[name="type"]', 'gasto-variable');
    await page.fill('[name="amount"]', '300');
    await page.fill('[name="description"]', 'Gasto mes anterior');
    await page.selectOption('[name="category"]', 'transporte');
    await page.fill('[name="date"]', pastDate);
    await page.click('button:has-text("Agregar Transacción")');
    await page.waitForTimeout(1000);
    
    // Ir a Dashboard
    await helpers.navigateDesktop(page, 'Dashboard');
    
    // Seleccionar mes anterior
    await page.click('button:has-text("← Anterior")');
    await page.waitForTimeout(500);
    
    // Verificar que aparece la transacción
    const monthYear = `${lastMonth.toLocaleString('es', { month: 'long' })} ${lastMonth.getFullYear()}`;
    await expect(page.locator(`text=${monthYear}`)).toBeVisible();
    
    // Verificar que el gasto se refleja
    const expensesElement = await page.locator('text=Gastos').locator('..').locator('p').nth(1);
    const expensesText = await expensesElement.textContent();
    expect(expensesText).toContain('300');
  });
});
