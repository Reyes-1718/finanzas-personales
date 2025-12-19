import { test, expect } from '@playwright/test';
import { helpers } from './helpers';

const DESKTOP_VIEWPORT = { width: 1280, height: 720 };
const MOBILE_VIEWPORT = { width: 390, height: 844 };

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await helpers.clearStorage(page);
});

test.describe('NAVEGACIÓN - Desktop', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('should show sidebar on desktop', async ({ page }) => {
    const sidebar = page.locator('[data-testid="sidebar"]');
    await expect(sidebar).toBeVisible();
  });

  test('should hide FAB on desktop', async ({ page }) => {
    const fab = page.getByTestId('fab-button');
    await expect(fab).not.toBeVisible();
  });

  test('should navigate to Dashboard', async ({ page }) => {
    await page.click('text=Dashboard');
    await page.waitForTimeout(300);
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should navigate to Transactions', async ({ page }) => {
    await page.click('text=Transacciones');
    await page.waitForTimeout(300);
    await expect(page.locator('text=Agregar Transacción')).toBeVisible();
  });

  test('should navigate to Daily Expenses', async ({ page }) => {
    await page.click('text=Gastos Diarios');
    await page.waitForTimeout(300);
    await expect(page.locator('text=Gastos Diarios')).toBeVisible();
  });

  test('should navigate to Savings Goals', async ({ page }) => {
    await page.click('text=Metas');
    await page.waitForTimeout(300);
    await expect(page.locator('text=Meta')).toBeVisible();
  });

  test('should navigate to Budgets', async ({ page }) => {
    await page.click('text=Presupuestos');
    await page.waitForTimeout(300);
    await expect(page.locator('text=Presupuesto')).toBeVisible();
  });

  test('should navigate to Advanced Stats', async ({ page }) => {
    await page.click('text=Estadísticas');
    await page.waitForTimeout(300);
    await expect(page.locator('text=Estadísticas')).toBeVisible();
  });

  test('should navigate to Calendar', async ({ page }) => {
    await page.click('text=Calendario');
    await page.waitForTimeout(300);
    await expect(page.locator('text=Calendario')).toBeVisible();
  });

  test('should navigate to Projection', async ({ page }) => {
    await page.click('text=Proyección');
    await page.waitForTimeout(300);
    await expect(page.locator('text=Proyección')).toBeVisible();
  });

  test('should navigate to Reports', async ({ page }) => {
    await page.click('text=Reportes');
    await page.waitForTimeout(300);
    await expect(page.locator('text=Reportes')).toBeVisible();
  });

  test('should navigate to Alerts', async ({ page }) => {
    await page.click('text=Alertas');
    await page.waitForTimeout(300);
    await expect(page.locator('text=Alertas')).toBeVisible();
  });

  test('should navigate to Search', async ({ page }) => {
    await page.click('text=Buscar');
    await page.waitForTimeout(300);
    await expect(page.locator('text=Buscar')).toBeVisible();
  });

  test('should navigate to Backup', async ({ page }) => {
    await page.click('text=Backup');
    await page.waitForTimeout(300);
    await expect(page.locator('text=Backup')).toBeVisible();
  });

  test('should highlight active tab', async ({ page }) => {
    // Navegar a Transacciones
    await page.click('text=Transacciones');
    await page.waitForTimeout(300);
    
    // Verificar que el tab está activo
    const activeTab = page.locator('[class*="active"]').filter({ hasText: 'Transacciones' });
    await expect(activeTab).toBeVisible();
  });

  test('should navigate sequentially through all sections', async ({ page }) => {
    const tabs = [
      'Dashboard',
      'Transacciones',
      'Gastos Diarios',
      'Proyección',
      'Metas',
      'Presupuestos',
      'Estadísticas',
      'Calendario',
      'Reportes',
      'Alertas',
      'Buscar',
      'Backup'
    ];

    for (const tab of tabs) {
      await page.click(`text=${tab}`);
      await page.waitForTimeout(300);
      // Verificar que la página cambió
      const content = page.locator('main');
      await expect(content).toBeVisible();
    }
  });

});

test.describe('NAVEGACIÓN - Móvil', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
  });

  test('should hide sidebar on mobile', async ({ page }) => {
    const sidebar = page.locator('[data-testid="sidebar"]');
    await expect(sidebar).not.toBeVisible();
  });

  test('should show FAB on mobile', async ({ page }) => {
    const fab = page.getByTestId('fab-button');
    await expect(fab).toBeVisible();
  });

  test('should open FAB menu on click', async ({ page }) => {
    const fab = page.getByTestId('fab-button');
    await fab.click();
    
    // Verificar que el menú se expande
    const dashboard = page.getByTestId('fab-item-dashboard');
    await expect(dashboard).toBeVisible();
  });

  test('should navigate from FAB to Dashboard', async ({ page }) => {
    await helpers.navigateMobile(page, 'dashboard');
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should navigate from FAB to Transactions', async ({ page }) => {
    await helpers.navigateMobile(page, 'transactions');
    await expect(page.locator('text=Agregar Transacción')).toBeVisible();
  });

  test('should navigate from FAB to Daily Expenses', async ({ page }) => {
    await helpers.navigateMobile(page, 'daily');
    await expect(page.locator('text=Gastos Diarios')).toBeVisible();
  });

  test('should navigate from FAB to Savings Goals', async ({ page }) => {
    await helpers.navigateMobile(page, 'goals');
    await expect(page.locator('text=Meta')).toBeVisible();
  });

  test('should navigate from FAB to Budgets', async ({ page }) => {
    await helpers.navigateMobile(page, 'budgets');
    await expect(page.locator('text=Presupuesto')).toBeVisible();
  });

  test('should navigate from FAB to Stats', async ({ page }) => {
    await helpers.navigateMobile(page, 'stats');
    await expect(page.locator('text=Estadísticas')).toBeVisible();
  });

  test('should close FAB after navigation', async ({ page }) => {
    const fab = page.getByTestId('fab-button');
    
    // Abrir
    await fab.click();
    await expect(fab).toHaveText('✕');
    
    // Navegar
    const dashboard = page.getByTestId('fab-item-dashboard');
    await dashboard.click();
    
    // Debe cerrarse
    await page.waitForTimeout(500);
    await expect(fab).toHaveText('☰');
  });

  test('should scroll to top after navigation', async ({ page }) => {
    // Agregar una transacción para tener contenido
    await helpers.navigateMobile(page, 'transactions');
    await helpers.addTransaction(
      page,
      'ingreso',
      1000,
      'Ingreso de prueba',
      'sueldo'
    );

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500));
    let scrollPos = await page.evaluate(() => window.scrollY);
    expect(scrollPos).toBeGreaterThan(0);

    // Navegar
    await helpers.navigateMobile(page, 'dashboard');

    // Debe estar al inicio
    scrollPos = await page.evaluate(() => window.scrollY);
    expect(scrollPos).toBeLessThan(100);
  });

  test('should show all FAB items', async ({ page }) => {
    const fab = page.getByTestId('fab-button');
    await fab.click();

    const items = [
      'fab-item-dashboard',
      'fab-item-transactions',
      'fab-item-daily',
      'fab-item-projection',
      'fab-item-goals',
      'fab-item-budgets',
      'fab-item-stats',
      'fab-item-calendar',
      'fab-item-reports',
      'fab-item-alerts',
      'fab-item-search',
      'fab-item-backup'
    ];

    for (const item of items) {
      const element = page.getByTestId(item);
      await expect(element).toBeVisible();
    }
  });

});

test.describe('NAVEGACIÓN - Responsive', () => {
  
  test('should switch from desktop to mobile navigation', async ({ page }) => {
    // Desktop
    await page.setViewportSize(DESKTOP_VIEWPORT);
    let sidebar = page.locator('[data-testid="sidebar"]');
    let fab = page.getByTestId('fab-button');
    
    await expect(sidebar).toBeVisible();
    await expect(fab).not.toBeVisible();

    // Mobile
    await page.setViewportSize(MOBILE_VIEWPORT);
    sidebar = page.locator('[data-testid="sidebar"]');
    fab = page.getByTestId('fab-button');
    
    await expect(sidebar).not.toBeVisible();
    await expect(fab).toBeVisible();
  });

  test('should switch from mobile to desktop navigation', async ({ page }) => {
    // Mobile
    await page.setViewportSize(MOBILE_VIEWPORT);
    let sidebar = page.locator('[data-testid="sidebar"]');
    let fab = page.getByTestId('fab-button');
    
    await expect(sidebar).not.toBeVisible();
    await expect(fab).toBeVisible();

    // Desktop
    await page.setViewportSize(DESKTOP_VIEWPORT);
    sidebar = page.locator('[data-testid="sidebar"]');
    fab = page.getByTestId('fab-button');
    
    await expect(sidebar).toBeVisible();
    await expect(fab).not.toBeVisible();
  });

});
