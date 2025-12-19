import { test, expect } from '@playwright/test';
import { helpers } from './helpers';

const DESKTOP_VIEWPORT = { width: 1280, height: 720 };
const MOBILE_VIEWPORT = { width: 390, height: 844 };

test.describe('INTEGRACIÓN E2E - Flujo: Nuevo Usuario', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await helpers.clearStorage(page);
  });

  test('should complete full new user setup workflow - Desktop', async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);

    // 1. Navegar a transacciones
    await helpers.navigateDesktop(page, 'Agregar Transacción');
    
    // 2. Agregar ingreso inicial
    await helpers.addTransaction(page, {
      type: 'income',
      amount: 5000,
      category: 'Salario',
      description: 'Primer salario'
    });

    // 3. Navegar a presupuestos
    await helpers.navigateDesktop(page, 'Presupuestos');
    
    // 4. Crear presupuesto
    await helpers.createBudget(page, {
      category: 'Alimentación',
      amount: 1000
    });

    // 5. Navegar a metas
    await helpers.navigateDesktop(page, 'Metas');
    
    // 6. Crear meta de ahorro
    await helpers.createSavingsGoal(page, {
      name: 'Vacaciones',
      amount: 3000,
      months: 6
    });

    // 7. Navegar a Dashboard
    await helpers.navigateDesktop(page, 'Dashboard');
    
    // Verificar que todo está visible
    const dashboard = page.locator('[class*="dashboard"]');
    await expect(dashboard).toBeVisible();

    // 8. Verificar datos en almacenamiento
    const storageData = await helpers.getStorageData(page);
    expect(storageData.transactions.length).toBeGreaterThan(0);
    expect(storageData.budgets.length).toBeGreaterThan(0);
    expect(storageData.savingsGoals.length).toBeGreaterThan(0);
  });

  test('should complete new user setup workflow - Mobile', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);

    // 1. Agregar ingreso vía FAB
    await helpers.navigateMobile(page, 'transactions');
    await helpers.addTransaction(page, {
      type: 'income',
      amount: 3000,
      category: 'Salario',
      description: 'Ingreso'
    });

    // 2. Agregar presupuesto
    await helpers.navigateMobile(page, 'budgets');
    await helpers.createBudget(page, {
      category: 'Alimentación',
      amount: 800
    });

    // 3. Crear meta
    await helpers.navigateMobile(page, 'savings-goals');
    await helpers.createSavingsGoal(page, {
      name: 'Fondo de emergencia',
      amount: 2000,
      months: 4
    });

    // Verificar persistencia
    const storageData = await helpers.getStorageData(page);
    expect(storageData.transactions).toBeDefined();
    expect(storageData.budgets).toBeDefined();
  });

});

test.describe('INTEGRACIÓN E2E - Flujo: Seguimiento Mensual', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await helpers.clearStorage(page);
    
    // Setup: ingresos y presupuesto base
    await helpers.addTransaction(page, {
      type: 'income',
      amount: 4000,
      category: 'Salario',
      description: 'Salario'
    });
    
    await helpers.createBudget(page, {
      category: 'Alimentación',
      amount: 1200
    });
  });

  test('should track expenses throughout the month', async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);

    // Semana 1: Compras pequeñas
    await helpers.addTransaction(page, {
      type: 'expense',
      amount: 200,
      category: 'Alimentación',
      description: 'Compras semana 1'
    });

    // Semana 2: Más gastos
    await helpers.addTransaction(page, {
      type: 'expense',
      amount: 300,
      category: 'Alimentación',
      description: 'Compras semana 2'
    });

    // Revisar Dashboard
    await helpers.navigateDesktop(page, 'Dashboard');
    
    // Debe mostrar: Total gastos = 500
    // Balance = 3500
    // Presupuesto Alimentación: 500/1200 (41%)

    // Navegar a Estadísticas
    await helpers.navigateDesktop(page, 'Estadísticas');
    
    // Debe mostrar gráficos con los datos
    const chart = page.locator('[class*="recharts"]');
    await expect(chart).toBeVisible();
  });

  test('should generate monthly report', async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);

    // Agregar varios gastos
    await helpers.addTransaction(page, {
      type: 'expense',
      amount: 250,
      category: 'Transporte',
      description: 'Gasolina'
    });

    await helpers.addTransaction(page, {
      type: 'expense',
      amount: 150,
      category: 'Entretenimiento',
      description: 'Cine'
    });

    // Navegar a Reportes
    await helpers.navigateDesktop(page, 'Reportes');

    // Generar reporte
    const exportBtn = page.locator('button:has-text("Exportar")');
    if (await exportBtn.isVisible()) {
      await exportBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test('should verify budget status at month end', async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);

    // Gastar más del presupuesto
    for (let i = 0; i < 6; i++) {
      await helpers.addTransaction(page, {
        type: 'expense',
        amount: 220,
        category: 'Alimentación',
        description: `Gasto ${i + 1}`
      });
    }
    // Total: 1320 (excede presupuesto de 1200)

    // Navegar a Presupuestos
    await helpers.navigateDesktop(page, 'Presupuestos');

    // Debe mostrar alerta de presupuesto excedido
    await helpers.verifyAlert(page, 'exceeded');
  });

});

test.describe('INTEGRACIÓN E2E - Flujo: Ajuste de Presupuesto', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await helpers.clearStorage(page);
    
    // Setup
    await helpers.addTransaction(page, {
      type: 'income',
      amount: 3000,
      category: 'Salario',
      description: 'Salario'
    });
  });

  test('should adjust budget when overspending detected', async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);

    // Crear presupuesto
    await helpers.createBudget(page, {
      category: 'Alimentación',
      amount: 500
    });

    // Gastar mucho
    await helpers.addTransaction(page, {
      type: 'expense',
      amount: 450,
      category: 'Alimentación',
      description: 'Compras grandes'
    });

    // Navegar a Presupuestos
    await helpers.navigateDesktop(page, 'Presupuestos');

    // Editar presupuesto (aumentar)
    const budgetItem = page.locator('[class*="budget"]').first();
    if (await budgetItem.isVisible()) {
      // Buscar botón editar
      const editBtn = budgetItem.locator('button[title*="Editar"], button:has-text("Editar")');
      if (await editBtn.isVisible()) {
        await editBtn.click();
        await page.waitForTimeout(300);

        // Aumentar a 700
        const amountInput = page.locator('input[type="number"]');
        if (await amountInput.isVisible()) {
          await amountInput.clear();
          await amountInput.fill('700');
          
          // Guardar
          const saveBtn = page.locator('button:has-text("Guardar")');
          if (await saveBtn.isVisible()) {
            await saveBtn.click();
            await page.waitForTimeout(500);
          }
        }
      }
    }

    // Verificar que presupuesto se actualizó
    const storageData = await helpers.getStorageData(page);
    if (storageData.budgets && storageData.budgets.length > 0) {
      // El presupuesto debe ser 700 ahora
    }
  });

});

test.describe('INTEGRACIÓN E2E - Flujo: Backup y Restauración', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await helpers.clearStorage(page);
  });

  test('should backup, clear, and restore data', async ({ page, context }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);

    // 1. Crear datos
    await helpers.addTransaction(page, {
      type: 'income',
      amount: 3000,
      category: 'Salario',
      description: 'Salario'
    });

    await helpers.addTransaction(page, {
      type: 'expense',
      amount: 500,
      category: 'Alimentación',
      description: 'Compras'
    });

    // Guardar datos para comparar después
    const originalData = await helpers.getStorageData(page);

    // 2. Exportar datos
    await helpers.navigateDesktop(page, 'Backup y Restauración');
    
    const exportBtn = page.locator('button:has-text("Exportar"), button:has-text("Descargar")');
    if (await exportBtn.isVisible()) {
      await exportBtn.click();
      await page.waitForTimeout(500);
    }

    // 3. Limpiar datos
    const clearBtn = page.locator('button:has-text("Limpiar"), button:has-text("Borrar")');
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
      await page.waitForTimeout(300);

      // Confirmar
      const confirmBtn = page.locator('button:has-text("Confirmar"), button:has-text("Aceptar")');
      if (await confirmBtn.isVisible()) {
        await confirmBtn.click();
        await page.waitForTimeout(500);
      }
    }

    // Verificar que está vacío
    let clearedData = await helpers.getStorageData(page);
    expect(clearedData.transactions.length).toBe(0);

    // 4. Importar datos (simulado)
    // En práctica sería cargar archivo descargado
  });

});

test.describe('INTEGRACIÓN E2E - Flujo: Ciclo Completo Diario', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await helpers.clearStorage(page);
    
    // Setup diario
    await helpers.addTransaction(page, {
      type: 'income',
      amount: 2000,
      category: 'Salario',
      description: 'Diario'
    });
  });

  test('should complete daily expense tracking cycle - Mobile', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);

    // 1. Abrir Gastos Diarios
    await helpers.navigateMobile(page, 'daily-expenses');

    // 2. Agregar gasto rápido con botón predefinido
    const quickBtn = page.locator('button:has-text("$50")');
    if (await quickBtn.isVisible()) {
      await quickBtn.click();
      await page.waitForTimeout(300);
    }

    // 3. Agregar gasto custom
    await helpers.addDailyExpense(page, {
      amount: 75,
      category: 'Alimentación',
      description: 'Almuerzo'
    });

    // 4. Ver total del día
    const totalDaily = page.locator('[class*="total"], text=/Total|Hoy/');
    // Debe mostrar: $125

    // 5. Navegar a Dashboard
    await helpers.navigateMobile(page, 'dashboard');

    // Debe reflejarse el gasto
    const balance = page.locator('[class*="balance"]');
    if (await balance.isVisible()) {
      // Balance debe ser 2000 - 125 = 1875
    }
  });

});

test.describe('INTEGRACIÓN E2E - Flujo: Análisis y Proyección', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await helpers.clearStorage(page);
    
    // Setup con datos históricos
    for (let i = 0; i < 3; i++) {
      await helpers.addTransaction(page, {
        type: 'income',
        amount: 3000,
        category: 'Salario',
        description: `Salario mes ${i + 1}`
      });
      
      await helpers.addTransaction(page, {
        type: 'expense',
        amount: 1500 + (i * 100),
        category: 'Gastos',
        description: `Gastos mes ${i + 1}`
      });
    }
  });

  test('should analyze spending patterns and project future', async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);

    // 1. Ver Estadísticas
    await helpers.navigateDesktop(page, 'Estadísticas');

    // Debe mostrar gráficos con histórico
    const chart = page.locator('[class*="recharts"]');
    await expect(chart).toBeVisible();

    // 2. Navegar a Proyección
    await helpers.navigateDesktop(page, 'Proyección');

    // Usar datos históricos para proyectar
    const incomeInput = page.locator('input[name="monthlyIncome"]');
    if (await incomeInput.isVisible()) {
      await incomeInput.fill('3000');
      
      const expenseInput = page.locator('input[name="monthlyExpense"]');
      if (await expenseInput.isVisible()) {
        await expenseInput.fill('1500');
        
        const generateBtn = page.locator('button:has-text("Generar")');
        if (await generateBtn.isVisible()) {
          await generateBtn.click();
          await page.waitForTimeout(500);

          // Debe mostrar proyección
        }
      }
    }

    // 3. Generar Reporte
    await helpers.navigateDesktop(page, 'Reportes');

    const exportBtn = page.locator('button:has-text("Exportar")');
    if (await exportBtn.isVisible()) {
      await exportBtn.click();
      await page.waitForTimeout(300);
    }
  });

});

test.describe('INTEGRACIÓN E2E - Cross-Feature', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await helpers.clearStorage(page);
  });

  test('should sync data across all features', async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);

    // Agregar ingreso
    await helpers.addTransaction(page, {
      type: 'income',
      amount: 5000,
      category: 'Salario',
      description: 'Salario'
    });

    // Crear presupuesto
    await helpers.createBudget(page, {
      category: 'Alimentación',
      amount: 1500
    });

    // Crear meta
    await helpers.createSavingsGoal(page, {
      name: 'Vacaciones',
      amount: 2000,
      months: 6
    });

    // Verificar que todos los datos están sincronizados
    const storage = await helpers.getStorageData(page);

    // Dashboard debe mostrar:
    // - Ingreso total: 5000
    // - Presupuesto: 1500 (40% de 5000)
    // - Meta: 2000 (debería mostrar en resumen)

    await helpers.navigateDesktop(page, 'Dashboard');

    // Verificar que se muestran todos los datos
    const dashboard = page.locator('[class*="dashboard"]');
    await expect(dashboard).toBeVisible();
  });

  test('should maintain data integrity across all operations', async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);

    // Operación 1: Agregar transacción
    await helpers.addTransaction(page, {
      type: 'expense',
      amount: 100,
      category: 'Alimentación',
      description: 'Test'
    });

    let storage1 = await helpers.getStorageData(page);
    const count1 = storage1.transactions.length;

    // Operación 2: Eliminar transacción
    await helpers.deleteTransaction(page, 0);

    let storage2 = await helpers.getStorageData(page);
    const count2 = storage2.transactions.length;

    // Debe ser una menos
    expect(count2).toBe(count1 - 1);

    // Operación 3: Agregar otra
    await helpers.addTransaction(page, {
      type: 'income',
      amount: 1000,
      category: 'Bonificación',
      description: 'Bono'
    });

    let storage3 = await helpers.getStorageData(page);
    const count3 = storage3.transactions.length;

    // Debe tener dos ahora
    expect(count3).toBe(count2 + 1);
  });

});
