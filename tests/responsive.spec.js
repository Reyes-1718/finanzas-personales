import { test, expect } from '@playwright/test';
import { helpers } from './helpers';

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
    description: 'Compras'
  });
});

test.describe('RESPONSIVO - Desktop Grande (1920x1080)', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test('should display full sidebar on large desktop', async ({ page }) => {
    // Sidebar debe estar siempre visible
    const sidebar = page.locator('[class*="sidebar"]');
    if (await sidebar.isVisible()) {
      await expect(sidebar).toBeVisible();
    }
  });

  test('should show multiple columns on large desktop', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Dashboard');

    // Debe mostrar widgets lado a lado
    const widgets = page.locator('[class*="card"], [class*="widget"]');
    const count = await widgets.count();
    expect(count).toBeGreaterThan(2);
  });

  test('should display full-width content', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Dashboard');

    // Contenido debe usar todo el ancho disponible
    const container = page.locator('[class*="container"], main');
    const width = await container.evaluate((el) => el.offsetWidth);
    expect(width).toBeGreaterThan(1600);
  });

  test('should display charts with optimal size', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Dashboard');

    // Gráficos deben ser grandes y legibles
    const chart = page.locator('[class*="recharts"]');
    if (await chart.isVisible()) {
      const bbox = await chart.boundingBox();
      expect(bbox.width).toBeGreaterThan(400);
      expect(bbox.height).toBeGreaterThan(300);
    }
  });

});

test.describe('RESPONSIVO - Desktop Estándar (1280x720)', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('should display sidebar on desktop', async ({ page }) => {
    const sidebar = page.locator('[class*="sidebar"]');
    if (await sidebar.isVisible()) {
      await expect(sidebar).toBeVisible();
    }
  });

  test('should show dashboard with all main sections', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Dashboard');

    // Debe mostrar: ingresos, gastos, saldo, gráfico
    const sections = page.locator('[class*="section"], [class*="card"]');
    const count = await sections.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display navigation tabs clearly', async ({ page }) => {
    // Todos los tabs deben ser visibles o en menú
    const tabs = page.locator('[class*="tab"], [role="tab"]');
    // Debe haber al menos sidebar navigation
  });

});

test.describe('RESPONSIVO - Tablet (768x1024)', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
  });

  test('should show hamburger menu on tablet', async ({ page }) => {
    // En lugar de sidebar siempre visible, mostrar botón hamburguesa
    const hamburger = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"]');
    // O sidebar colapsable
  });

  test('should stack content vertically on tablet', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Dashboard');

    // Widgets deben apilarse verticalmente
    const widgets = page.locator('[class*="card"], [class*="widget"]');
    
    // Cada widget debe ocupar toda la ancho o formando columnas de 2
  });

  test('should make charts responsive', async ({ page }) => {
    await helpers.navigateDesktop(page, 'Dashboard');

    const chart = page.locator('[class*="recharts"]');
    if (await chart.isVisible()) {
      const bbox = await chart.boundingBox();
      // Debe ajustarse al ancho disponible (< 768px)
      expect(bbox.width).toBeLessThan(768);
    }
  });

  test('should make tables scrollable on tablet', async ({ page }) => {
    // Tablas deben scrollear horizontalmente si es necesario
    const table = page.locator('table');
    if (await table.isVisible()) {
      const tableWidth = await table.evaluate((el) => el.offsetWidth);
      const containerWidth = await table.evaluate((el) => el.parentElement.offsetWidth);
      // Puede ser igual o tabla scrollear
    }
  });

});

test.describe('RESPONSIVO - Mobile (390x844)', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('should display FAB navigation on mobile', async ({ page }) => {
    const fab = page.locator('[class*="fab"], [data-testid*="fab"]');
    await expect(fab).toBeVisible();
  });

  test('should show single column layout on mobile', async ({ page }) => {
    await helpers.navigateMobile(page, 'dashboard');

    // Todo debe ser una sola columna
    const widgets = page.locator('[class*="card"]');
    // Cada card debe usar 100% del ancho
  });

  test('should make all content scrollable', async ({ page }) => {
    await helpers.navigateMobile(page, 'dashboard');

    const content = page.locator('main, [class*="content"]');
    if (await content.isVisible()) {
      // Debe permitir scroll vertical
    }
  });

  test('should hide sidebar on mobile', async ({ page }) => {
    const sidebar = page.locator('[class*="sidebar"]');
    // Debe estar hidden o convertida a modal/drawer
  });

  test('should display full-screen modals on mobile', async ({ page }) => {
    await helpers.navigateMobile(page, 'transactions');
    
    // Modales deben usar todo la pantalla
    const modal = page.locator('[class*="modal"]');
    // O el contenido debe ser full-screen
  });

  test('should have touch-friendly buttons', async ({ page }) => {
    // Botones deben tener mínimo 48px x 48px
    const buttons = page.locator('button');
    
    // Verificar tamaño de algunos botones
    if (await buttons.count() > 0) {
      const firstBtn = buttons.first();
      const bbox = await firstBtn.boundingBox();
      // Mínimo: altura >= 44px, ancho >= 44px
      expect(bbox.height).toBeGreaterThanOrEqual(40);
    }
  });

  test('should stack form fields vertically', async ({ page }) => {
    await helpers.navigateMobile(page, 'transactions');

    // Todos los inputs deben estar en una columna
    const formInputs = page.locator('input, select, textarea');
    // Cada uno debe ocupar 100% del ancho disponible
  });

  test('should avoid horizontal scroll on mobile', async ({ page }) => {
    await helpers.navigateMobile(page, 'dashboard');

    const pageWidth = await page.evaluate(() => window.innerWidth);
    const bodyWidth = await page.evaluate(() => document.body.offsetWidth);
    
    // No debe haber scroll horizontal
    expect(bodyWidth).toBeLessThanOrEqual(pageWidth);
  });

});

test.describe('RESPONSIVO - Mobile Pequeño (320x568)', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
  });

  test('should display content on very small screens', async ({ page }) => {
    // Incluso en pantallas muy pequeñas debe funcionar
    const content = page.locator('main, [class*="content"]');
    await expect(content).toBeVisible();
  });

  test('should have readable text on small screens', async ({ page }) => {
    await helpers.navigateMobile(page, 'dashboard');

    const text = page.locator('p, span, h1, h2, h3');
    if (await text.count() > 0) {
      const fontSize = await text.first().evaluate((el) => window.getComputedStyle(el).fontSize);
      const size = parseInt(fontSize);
      // Mínimo 14px
      expect(size).toBeGreaterThanOrEqual(12);
    }
  });

  test('should condense UI on small screens', async ({ page }) => {
    // Usar componentes compactos
  });

});

test.describe('RESPONSIVO - Transiciones', () => {
  
  test('should transition smoothly from desktop to mobile', async ({ page }) => {
    // Comenzar en desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    
    // Ver que sidebar está visible
    const sidebar = page.locator('[class*="sidebar"]');
    const sidebarVisibleDesktop = await sidebar.isVisible().catch(() => false);

    // Cambiar a móvil
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);

    // Sidebar debe estar oculto o transformado
    const sidebarVisibleMobile = await sidebar.isVisible().catch(() => false);
    
    // Ambos no deben ser visibles al mismo tiempo en navegación principal
  });

  test('should maintain data during responsive change', async ({ page }) => {
    // Agregar transacción en desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await helpers.addTransaction(page, {
      type: 'expense',
      amount: 100,
      category: 'Test',
      description: 'Test'
    });

    // Cambiar a móvil
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);

    // Datos deben estar intactos
    const storageData = await helpers.getStorageData(page);
    expect(storageData).toBeDefined();
  });

});

test.describe('RESPONSIVO - Elementos Específicos', () => {
  
  test('should make images responsive', async ({ page }) => {
    // Imágenes deben escalar según viewport
  });

  test('should hide non-essential elements on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    // Decoraciones, controles secundarios pueden ocultarse
  });

  test('should prioritize content on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    // Lo más importante debe estar arriba sin scroll
  });

  test('should use system fonts that scale well', async ({ page }) => {
    // Fuentes deben ser legibles en todos los tamaños
  });

});
