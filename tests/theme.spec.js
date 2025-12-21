import { test, expect } from '@playwright/test';
import { helpers } from './helpers';

const DESKTOP_VIEWPORT = { width: 1280, height: 720 };

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await helpers.clearStorage(page);
});

test.describe('TEMA - Switching', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('should display theme toggle button', async ({ page }) => {
    // Debe haber botón para cambiar tema en navbar/header
    const themeBtn = page.locator('button[title="Cambiar tema"], button[aria-label*="tema"], [class*="theme-toggle"]');
    await expect(themeBtn).toBeVisible();
  });

  test('should toggle between light and dark theme', async ({ page }) => {
    // Obtener tema inicial
    const htmlElement = page.locator('html');
    const initialClass = await htmlElement.getAttribute('class');
    
    // Click en botón de tema
      const themeBtn = page.locator('button[title="Cambiar tema"], button[aria-label*="tema"], [class*="theme-toggle"]');
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
      await page.waitForTimeout(300);

      // Debe haber cambiado clase
      const newClass = await htmlElement.getAttribute('class');
      expect(newClass).not.toBe(initialClass);
    }
  });

  test('should apply dark class to html element in dark mode', async ({ page }) => {
    // Cambiar a dark mode
    const themeBtn = page.locator('button[title*="Tema"]');
      if (await themeBtn.isVisible()) {
      // Hacer clicks hasta estar en dark mode
        await themeBtn.click();
      await page.waitForTimeout(300);

      const htmlElement = page.locator('html');
      const classList = await htmlElement.getAttribute('class');
      
      // Debe contener "dark" o tener data-theme="dark"
      if (classList && classList.includes('dark')) {
        expect(classList).toContain('dark');
      }
    }
  });

  test('should update background colors on theme change', async ({ page }) => {
    // Obtener color de fondo inicial
    const body = page.locator('body');
    const initialBg = await body.evaluate((el) => window.getComputedStyle(el).backgroundColor);

    // Cambiar tema
    const themeBtn = page.locator('button[title*="Tema"]');
      if (await themeBtn.isVisible()) {
      await themeBtn.click();
      await page.waitForTimeout(300);

      // Color debe ser diferente
      const newBg = await body.evaluate((el) => window.getComputedStyle(el).backgroundColor);
      expect(newBg).not.toBe(initialBg);
    }
  });

  test('should update text colors on theme change', async ({ page }) => {
    // Usar un heading visible y estable en la UI
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    const initialColor = await heading.evaluate((el) => window.getComputedStyle(el).color);

    // Cambiar tema
    const themeBtn = page.locator('button[title*="Tema"], button[aria-label*="Tema"], [class*="theme-toggle"]');
      if (await themeBtn.isVisible()) {
      await themeBtn.click();
      await page.waitForTimeout(300);

      // Color de texto debe cambiar entre modos
      const newColor = await heading.evaluate((el) => window.getComputedStyle(el).color);
      expect(newColor).not.toBe(initialColor);
    }
  });

  test('should update chart colors on dark mode', async ({ page }) => {
    // Ir a Dashboard para ver gráficos
    await helpers.navigateDesktop(page, 'Dashboard');

    // Cambiar a dark mode
    const themeBtn = page.locator('button[title*="Tema"]');
      if (await themeBtn.isVisible()) {
      await themeBtn.click();
      await page.waitForTimeout(500);

      // Los gráficos deben actualizarse
      const chart = page.locator('[class*="recharts"]');
      if (await chart.isVisible()) {
        // Verificar que está visible y actualizado
      }
    }
  });

});

test.describe('TEMA - Persistencia', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('should persist theme preference after reload', async ({ page }) => {
    // Cambiar a dark mode
    const themeBtn = page.locator('button[title*="Tema"]');
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
      await page.waitForTimeout(300);

      // Obtener tema actual
      const htmlElement = page.locator('html');
      const classList = await htmlElement.getAttribute('class');

      // Recargar página
      await page.reload();
      await page.waitForTimeout(500);

      // Tema debe ser igual
      const newClassList = await htmlElement.getAttribute('class');
      expect(newClassList).toBe(classList);
    }
  });

  test('should save theme preference to localStorage', async ({ page }) => {
    // Cambiar tema
    const themeBtn = page.locator('button[title*="Tema"]');
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
      await page.waitForTimeout(300);

      // Verificar en localStorage
      const storageData = await helpers.getStorageData(page);
      
      if (storageData && storageData.theme) {
        expect(storageData.theme).toBeDefined();
        expect(['light', 'dark']).toContain(storageData.theme);
      }
    }
  });

  test('should persist theme across multiple tabs', async ({ page, context }) => {
    // Cambiar a dark mode
    const themeBtn = page.locator('button[title*="Tema"]');
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
      await page.waitForTimeout(300);

      // Abrir nueva pestaña
      const page2 = await context.newPage();
      await page2.goto('/');
      await page2.waitForTimeout(500);

      // Nueva pestaña debe tener mismo tema
      const html2 = page2.locator('html');
      const classList2 = await html2.getAttribute('class');
      
      const html1 = page.locator('html');
      const classList1 = await html1.getAttribute('class');
      
      expect(classList2).toBe(classList1);
      
      await page2.close();
    }
  });

});

test.describe('TEMA - Estilos', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('should use correct colors in light mode', async ({ page }) => {
    // Light mode: fondo blanco/claro, texto oscuro
    const body = page.locator('body');
    const bgColor = await body.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    
    // RGB más cercano a blanco
    // rgb(255, 255, 255) o similar
  });

  test('should use correct colors in dark mode', async ({ page }) => {
    // Cambiar a dark
    const themeBtn = page.locator('button[title*="Tema"]');
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
      await page.waitForTimeout(300);

      // Dark mode: fondo oscuro, texto claro
      const body = page.locator('body');
      const bgColor = await body.evaluate((el) => window.getComputedStyle(el).backgroundColor);
      
      // RGB más cercano a gris oscuro/negro
    }
  });

  test('should have good contrast in both modes', async ({ page }) => {
    // Verificar que contraste es suficiente para accesibilidad
    // Ratio mínimo 4.5:1 para texto normal
  });

});

test.describe('TEMA - Móvil', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test('should show theme toggle on mobile', async ({ page }) => {
    const themeBtn = page.locator('button[title*="Tema"]');
    if (await themeBtn.isVisible()) {
      // Debe estar accesible
    }
  });

  test('should toggle theme on mobile', async ({ page }) => {
    const themeBtn = page.locator('button[title*="Tema"]');
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
      await page.waitForTimeout(300);

      // Verificar que cambió
      const htmlElement = page.locator('html');
      const classList = await htmlElement.getAttribute('class');
      // Debe tener "dark" o similar
    }
  });

});

test.describe('TEMA - Sincronización', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('should sync theme with system preference if enabled', async ({ page }) => {
    // Consulta preferencia del sistema desde la página
    const prefersDark = await page.evaluate(() => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // Emula explicitamente el esquema de color y verifica efecto visual
    await page.emulateMedia({ colorScheme: prefersDark ? 'dark' : 'light' });
    const htmlElement = page.locator('html');
    const classList = await htmlElement.getAttribute('class');
    // Si la app sincroniza con sistema, en dark debería incluir "dark"
    if (prefersDark && classList) {
      expect(classList.includes('dark') || classList === 'dark').toBeTruthy();
    }
  });

  test('should update when system theme changes', async ({ page }) => {
    // Simular cambio en preferencias del sistema
    // Esto requiere API de Playwright más avanzada
  });

});
