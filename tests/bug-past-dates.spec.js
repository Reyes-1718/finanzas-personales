import { test, expect } from '@playwright/test';
import { helpers } from './helpers';

const DESKTOP_VIEWPORT = { width: 1280, height: 720 };

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await helpers.clearStorage(page);
  await page.setViewportSize(DESKTOP_VIEWPORT);
});

test.describe('BUG TEST - Past Date Transactions', () => {
  
  test('BUG: should register transaction with date 10 days ago', async ({ page }) => {
    // Navegar a Transacciones usando role-based locator
    await page.getByRole('button', { name: 'Transacciones' }).click();
    await page.waitForTimeout(300);
    
    // Calcular fecha de hace 10 días
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    const pastDate = tenDaysAgo.toISOString().split('T')[0];
    
    console.log('Intentando registrar transacción con fecha hace 10 días:', pastDate);
    
    // Agregar transacción con fecha pasada usando categoría que existe
    await page.selectOption('[name="type"]', 'gasto-variable');
    await page.fill('[name="amount"]', '250');
    await page.fill('[name="description"]', 'Compra hace 10 días');
    await page.selectOption('[name="category"]', 'Alimentación');
    await page.fill('[name="date"]', pastDate);
    
    // Enviar usando role-based locator para evitar strict mode
    await page.getByRole('button', { name: /Agregar Transacción/i }).click();
    await page.waitForTimeout(1000);
    
    // Verificar que la transacción se registró buscando en la página
    const description = await page.getByText('Compra hace 10 días').isVisible();
    console.log('¿Transacción visible después del registro?', description);
    
    expect(description).toBe(true);
  });
  
  test('BUG: should register transaction with past date (1st of December)', async ({ page }) => {
    // Navegar a Transacciones
    await page.getByRole('button', { name: 'Transacciones' }).click();
    await page.waitForTimeout(300);
    
    // Obtener fecha del 1 de diciembre del año actual
    const currentYear = new Date().getFullYear();
    const pastDate = `${currentYear}-12-01`;
    
    console.log('Intentando registrar transacción con fecha del 1 de diciembre:', pastDate);
    
    // Llenar formulario con fecha pasada
    await page.selectOption('[name="type"]', 'gasto-variable');
    await page.fill('[name="amount"]', '150');
    await page.fill('[name="description"]', 'Transacción del 1 de diciembre');
    await page.selectOption('[name="category"]', 'Alimentación');
    await page.fill('[name="date"]', pastDate);
    
    // Enviar
    await page.getByRole('button', { name: /Agregar Transacción/i }).click();
    await page.waitForTimeout(1000);
    
    // Verificar que aparece en la lista
    const isVisible = await page.getByText('Transacción del 1 de diciembre').isVisible();
    console.log('¿Transacción visible?', isVisible);
    
    expect(isVisible).toBe(true);
  });
});
