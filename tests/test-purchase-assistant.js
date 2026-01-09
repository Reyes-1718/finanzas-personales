import { chromium } from 'playwright';

async function testPurchaseAssistantError() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  try {
    // Navegar a la aplicación local
    await page.goto('http://localhost:5173');

    // Hacer clic en el botón del asistente de compras
    await page.click('button[title="Asistente de Compras"]');

    // Esperar a que el modal se abra (esperar el título)
    await page.waitForSelector('h2:has-text("Asistente de Compras")', { timeout: 5000 });

    // Llenar el formulario con datos que causen error
    await page.fill('input[placeholder="Ej: iPhone 15 Pro"]', 'Producto de Prueba');
    await page.fill('input[placeholder="65000"]', '-1000'); // Monto negativo para causar error

    // Seleccionar categoría (tercer select, índice 2)
    await page.locator('select').nth(2).selectOption('electronica');

    // Seleccionar método de pago (cuarto select, índice 3)
    await page.locator('select').nth(3).selectOption('cuotas');
    await page.locator('select').nth(3).dispatchEvent('change');

    // Esperar que aparezca el select de tipo de deuda
    await page.waitForSelector('select:has(option[value="sin-interes"])', { timeout: 2000 });

    // Seleccionar tipo de deuda con alto interés
    await page.locator('select').nth(4).selectOption('tarjeta-credito');

    // Hacer clic en "Calcular Viabilidad →"
    await page.click('button:has-text("Calcular Viabilidad →")', { force: true });

    // Esperar un poco
    await page.waitForTimeout(2000);

    // Verificar si hay alertas (rojas, naranjas, amarillas)
    const alerts = await page.locator('.bg-red-100, .bg-red-900\\/30, .bg-orange-100, .bg-orange-900\\/30, .bg-yellow-100, .bg-yellow-900\\/30').all();
    if (alerts.length > 0) {
      for (const alert of alerts) {
        const alertText = await alert.textContent();
        console.log('Alerta encontrada:', alertText.trim());
      }
    } else {
      console.log('No se encontraron alertas');
    }

  } catch (error) {
    console.error('Error en la prueba:', error.message);
  } finally {
    await browser.close();
  }
}

testPurchaseAssistantError();