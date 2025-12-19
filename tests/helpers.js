/**
 * Helpers y Utilidades para Tests E2E
 * Funciones reutilizables para todas las suites de tests
 */

export const helpers = {
  
  /**
   * Navegar en desktop usando sidebar
   * @param {Page} page - Página de Playwright
   * @param {string} tabName - Nombre del tab a navegar
   */
  navigateDesktop: async (page, tabName) => {
    await page.click(`text=${tabName}`);
    await page.waitForTimeout(300);
  },

  /**
   * Navegar en móvil usando FAB circular
   * @param {Page} page - Página de Playwright
   * @param {string} tabId - ID del tab en FAB (ej: 'transactions', 'dashboard')
   */
  navigateMobile: async (page, tabId) => {
    const fab = page.getByTestId('fab-button');
    await fab.click();
    const tabButton = page.getByTestId(`fab-item-${tabId}`);
    await tabButton.waitFor({ state: 'visible' });
    await tabButton.click();
    await page.waitForTimeout(500);
  },

  /**
   * Agregar una transacción
   * @param {Page} page - Página de Playwright
   * @param {string} type - Tipo: 'ingreso', 'gasto-fijo', 'gasto-variable'
   * @param {number} amount - Monto de la transacción
   * @param {string} description - Descripción
   * @param {string} category - Categoría
   */
  addTransaction: async (page, type, amount, description, category) => {
    // Seleccionar tipo
    await page.selectOption('[name="type"]', type);
    
    // Llenar descripción
    await page.fill('[name="description"]', description);
    
    // Llenar monto
    await page.fill('[name="amount"]', amount.toString());
    
    // Seleccionar categoría
    await page.selectOption('[name="category"]', category);
    
    // Click en botón agregar
    await page.click('button:has-text("Agregar Transacción")');
    
    // Esperar a que se procese
    await page.waitForTimeout(500);
  },

  /**
   * Limpiar LocalStorage y recargar página
   * @param {Page} page - Página de Playwright
   */
  clearStorage: async (page) => {
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  },

  /**
   * Verificar balance en dashboard
   * @param {Page} page - Página de Playwright
   * @param {string} expectedText - Texto esperado en balance
   */
  verifyBalance: async (page, expectedText) => {
    const balanceElement = page.locator('text=Balance');
    await expect(balanceElement).toBeVisible();
  },

  /**
   * Crear presupuesto
   * @param {Page} page - Página de Playwright
   * @param {string} category - Categoría
   * @param {number} amount - Monto del presupuesto
   */
  createBudget: async (page, category, amount) => {
    await page.selectOption('[name="category"]', category);
    await page.fill('[name="amount"]', amount.toString());
    await page.click('button:has-text("Crear Presupuesto")');
    await page.waitForTimeout(500);
  },

  /**
   * Crear meta de ahorro
   * @param {Page} page - Página de Playwright
   * @param {string} name - Nombre de la meta
   * @param {number} targetAmount - Monto objetivo
   * @param {number} deadline - Meses para alcanzar
   * @param {number} monthlyIncome - Ingreso mensual
   */
  createSavingsGoal: async (page, name, targetAmount, deadline, monthlyIncome) => {
    await page.fill('[name="name"]', name);
    await page.fill('[name="targetAmount"]', targetAmount.toString());
    await page.fill('[name="deadline"]', deadline.toString());
    await page.fill('[name="monthlyIncome"]', monthlyIncome.toString());
    await page.click('button:has-text("Crear Meta")');
    await page.waitForTimeout(500);
  },

  /**
   * Agregar gasto rápido (desde Gastos Diarios)
   * @param {Page} page - Página de Playwright
   * @param {number} amount - Monto
   * @param {string} description - Descripción
   * @param {string} category - Categoría
   */
  addDailyExpense: async (page, amount, description, category) => {
    await page.fill('[name="amount"]', amount.toString());
    await page.fill('[name="description"]', description);
    await page.selectOption('[name="category"]', category);
    await page.click('button:has-text("Registrar")');
    await page.waitForTimeout(500);
  },

  /**
   * Tomar screenshot con nombre descriptivo
   * @param {Page} page - Página de Playwright
   * @param {string} name - Nombre del archivo
   */
  takeScreenshot: async (page, name) => {
    await page.screenshot({
      path: `test-results/screenshots/${name}.png`,
      fullPage: true
    });
  },

  /**
   * Verificar que elemento es visible
   * @param {Page} page - Página de Playwright
   * @param {string} selector - Selector del elemento
   */
  verifyElementVisible: async (page, selector) => {
    await expect(page.locator(selector)).toBeVisible();
  },

  /**
   * Verificar que elemento NO es visible
   * @param {Page} page - Página de Playwright
   * @param {string} selector - Selector del elemento
   */
  verifyElementHidden: async (page, selector) => {
    await expect(page.locator(selector)).not.toBeVisible();
  },

  /**
   * Obtener texto de un elemento
   * @param {Page} page - Página de Playwright
   * @param {string} selector - Selector del elemento
   * @returns {Promise<string>} Texto del elemento
   */
  getElementText: async (page, selector) => {
    return await page.locator(selector).textContent();
  },

  /**
   * Esperar a que un elemento esté visible
   * @param {Page} page - Página de Playwright
   * @param {string} selector - Selector del elemento
   * @param {number} timeout - Timeout en ms
   */
  waitForElement: async (page, selector, timeout = 5000) => {
    await page.locator(selector).waitFor({ state: 'visible', timeout });
  },

  /**
   * Cambiar tema (claro/oscuro)
   * @param {Page} page - Página de Playwright
   */
  toggleTheme: async (page) => {
    const themeToggle = page.locator('button[data-testid="theme-toggle"]');
    await themeToggle.click();
    await page.waitForTimeout(300);
  },

  /**
   * Verificar que tema está aplicado
   * @param {Page} page - Página de Playwright
   * @param {string} theme - 'dark' o 'light'
   */
  verifyTheme: async (page, theme) => {
    if (theme === 'dark') {
      const isDark = await page.evaluate(() => 
        document.documentElement.classList.contains('dark')
      );
      expect(isDark).toBe(true);
    }
  },

  /**
   * Exportar datos
   * @param {Page} page - Página de Playwright
   */
  exportData: async (page) => {
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Exportar")');
    const download = await downloadPromise;
    return download;
  },

  /**
   * Obtener LocalStorage JSON
   * @param {Page} page - Página de Playwright
   * @returns {Promise<object>} Datos de LocalStorage
   */
  getStorageData: async (page) => {
    return await page.evaluate(() => {
      const raw = localStorage.getItem('finanzas_data');
      return raw ? JSON.parse(raw) : null;
    });
  },

  /**
   * Configurar viewport
   * @param {Page} page - Página de Playwright
   * @param {string} device - 'desktop' o 'mobile'
   */
  setViewport: async (page, device) => {
    if (device === 'mobile') {
      await page.setViewportSize({ width: 390, height: 844 });
    } else {
      await page.setViewportSize({ width: 1280, height: 720 });
    }
  },

  /**
   * Verificar que transacción aparece en la lista
   * @param {Page} page - Página de Playwright
   * @param {string} description - Descripción de la transacción
   */
  verifyTransactionInList: async (page, description) => {
    await expect(page.locator(`text=${description}`)).toBeVisible();
  },

  /**
   * Eliminar transacción por descripción
   * @param {Page} page - Página de Playwright
   * @param {string} description - Descripción de la transacción
   */
  deleteTransaction: async (page, description) => {
    const row = page.locator(`text=${description}`);
    const deleteBtn = row.locator('..').locator('button:has-text("Eliminar")');
    await deleteBtn.click();
    // Confirmar eliminación si hay modal
    const confirmBtn = page.locator('button:has-text("Confirmar")');
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
    }
    await page.waitForTimeout(500);
  },

  /**
   * Verificar que alerta existe
   * @param {Page} page - Página de Playwright
   * @param {string} alertText - Texto de la alerta
   */
  verifyAlert: async (page, alertText) => {
    await expect(page.locator(`text=${alertText}`)).toBeVisible();
  }

};
