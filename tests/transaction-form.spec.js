import { test, expect } from '@playwright/test';

test.describe('Verificar selección de categoría en Transacciones', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    // Navegar a Transacciones - ajustar selector según UI (ej. tab o FAB)
    await page.click('text=Transacciones'); // O '[data-testid="tab-transacciones"]' si existe
  });

  test('Gasto Fijo: Se registra sin error (categoría se setea automáticamente)', async ({ page }) => {
    // Selecciona tipo "Gasto Fijo" (esto debería setear category a expenseCategories[0])
    await page.selectOption('select[name="type"]', 'gasto-fijo');
    
    // Verifica que category se haya seteado (debería ser 'Alimentación' o similar)
    const categorySelect = page.locator('select[name="category"]');
    const categoryValue = await categorySelect.inputValue();
    console.log('Categoría después de seleccionar Gasto Fijo:', categoryValue);
    expect(categoryValue).not.toBe(''); // Debería tener valor
    
    // Ingresa datos
    await page.fill('input[name="amount"]', '1000');
    await page.fill('textarea[name="description"]', 'Test gasto fijo');
    
    // Maneja alert de éxito o verifica que no haya error
    let alertShown = false;
    page.on('dialog', async dialog => {
      alertShown = true;
      console.log('Alert en Gasto Fijo:', dialog.message());
      await dialog.accept();
    });
    
    // Envía formulario
    await page.click('button[type="submit"]');
    
    // Espera un poco para alert
    await page.waitForTimeout(500);
    expect(alertShown).toBe(false); // No debería haber alert de error
  });

  test('Gasto Variable inicial: No muestra error (categoría se setea por defecto)', async ({ page }) => {
    // Tipo ya es 'gasto-variable' por defecto, category debería estar seteada inicialmente
    const categorySelect = page.locator('select[name="category"]');
    const initialValue = await categorySelect.inputValue();
    console.log('Valor inicial de categoría en Gasto Variable:', initialValue);
    expect(initialValue).toBe('Alimentación'); // Ahora se setea por defecto
    
    // Ingresa datos
    await page.fill('input[name="amount"]', '1000');
    await page.fill('textarea[name="description"]', 'Test gasto variable');
    
    // Maneja alert (no debería haber error)
    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      console.log('Alert en Gasto Variable:', alertMessage);
      await dialog.accept();
    });
    
    // Envía formulario
    await page.click('button[type="submit"]');
    
    // Espera
    await page.waitForTimeout(500);
    expect(alertMessage).not.toContain('selecciona'); // No error
  });

  test('Gasto Variable: Funciona al seleccionar categoría manualmente', async ({ page }) => {
    // Ingresa datos
    await page.fill('input[name="amount"]', '1000');
    await page.fill('textarea[name="description"]', 'Test manual');
    
    // Selecciona otra categoría primero (ej. si hay más de una), luego "Alimentación"
    const categorySelect = page.locator('select[name="category"]');
    const options = await categorySelect.locator('option').allTextContents();
    console.log('Opciones de categoría:', options);
    
    if (options.length > 1) {
      // Selecciona la segunda opción
      await categorySelect.selectOption({ index: 1 });
      // Luego selecciona la primera ("Alimentación")
      await categorySelect.selectOption({ index: 0 });
    } else {
      // Si solo hay una, selecciónala directamente
      await categorySelect.selectOption({ index: 0 });
    }
    
    // Verifica valor
    const finalValue = await categorySelect.inputValue();
    console.log('Valor final de categoría:', finalValue);
    expect(finalValue).not.toBe('');
    
    // Envía formulario
    let successAlert = '';
    page.on('dialog', async dialog => {
      successAlert = dialog.message();
      await dialog.accept();
    });
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);
    expect(successAlert).not.toContain('selecciona'); // No error
  });
});