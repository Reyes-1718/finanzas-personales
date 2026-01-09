import { chromium } from 'playwright';

async function auditPurchaseAssistant() {
  console.log('🔍 Iniciando auditoría del Asistente de Compra...\n');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Capturar logs de consola y errores
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Error en consola:', msg.text());
    }
  });
  page.on('pageerror', error => console.log('💥 Error de página:', error.message));

  try {
    console.log('🌐 Navegando a la aplicación...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });

    console.log('🛍️ Abriendo Asistente de Compra...');
    await page.click('button[title="Asistente de Compras"]');
    await page.waitForSelector('h2:has-text("Asistente de Compras")', { timeout: 10000 });

    console.log('📝 Probando formulario vacío...');
    await page.click('button:has-text("Calcular Viabilidad")');
    // Verificar si muestra error por campos vacíos
    const emptyErrors = await page.locator('.text-red-600, .bg-red-100').count();
    if (emptyErrors > 0) {
      console.log('⚠️  Errores detectados en formulario vacío:', emptyErrors);
    }

    console.log('📝 Llenando formulario con datos válidos...');
    await page.fill('input[placeholder="Ej: iPhone 15 Pro"]', 'Auditoría de Compra');
    await page.fill('input[placeholder="65000"]', '50000');

    // Seleccionar categoría
    const selects = await page.locator('select').all();
    await selects[2].selectOption('electronica'); // Categoría
    await selects[3].selectOption('cuotas'); // Método de pago

    // Esperar select de deuda
    await page.waitForSelector('select:has(option[value="sin-interes"])', { timeout: 5000 });
    const debtSelects = await page.locator('select').all();
    await debtSelects[4].selectOption('sin-interes');

    // Rango de meses
    await page.locator('input[type="range"]').fill('24');

    console.log('🔢 Calculando viabilidad...');
    await page.click('button:has-text("Calcular Viabilidad")', { force: true });

    // Esperar resultados
    await page.waitForTimeout(2000);

    console.log('🔍 Verificando resultados...');
    const alerts = await page.locator('.bg-red-100, .bg-red-900\\/30, .bg-orange-100, .bg-orange-900\\/30, .bg-yellow-100, .bg-yellow-900\\/30').all();
    if (alerts.length > 0) {
      console.log('🚨 Alertas encontradas:');
      for (const alert of alerts) {
        const text = await alert.textContent();
        console.log('  -', text.trim());
      }
    } else {
      console.log('✅ No se encontraron alertas');
    }

    // Verificar navegación a paso 2
    const step2Visible = await page.locator('h2:has-text("Análisis de Viabilidad")').isVisible();
    if (!step2Visible) {
      console.log('❌ Error: No se cambió al paso 2');
    } else {
      console.log('✅ Navegación a paso 2 correcta');
    }

    console.log('📊 Verificando cálculos...');
    const modal = page.locator('.fixed.z-50');
    const monthlyPayment = await modal.locator('text=/RD\\$ [0-9,]+/').first().textContent();
    console.log('💰 Cuota mensual calculada:', monthlyPayment);

    console.log('🔄 Probando navegación entre pasos...');
    // Verificar botones de navegación
    const backButtons = await page.locator('button:has-text("Volver")').count();
    const nextButtons = await page.locator('button:has-text("Ver Opciones")').count();
    console.log(`🔙 Botones "Volver": ${backButtons}, 🔜 Botones "Ver Opciones": ${nextButtons}`);

    console.log('🧪 Probando datos inválidos...');
    // Cerrar el modal clicando el botón X
    await page.click('button:has-text("✕")');
    await page.waitForSelector('h2:has-text("Asistente de Compras")', { state: 'hidden' });

    // Reabrir
    await page.click('button[title="Asistente de Compras"]');
    await page.waitForSelector('h2:has-text("Asistente de Compras")');

    // Llenar con datos inválidos
    await page.fill('input[placeholder="Ej: iPhone 15 Pro"]', 'Test Inválido');
    await page.fill('input[placeholder="65000"]', '-1000'); // Monto negativo
    await selects[2].selectOption('electronica');
    await selects[3].selectOption('efectivo');

    await page.click('button:has-text("Calcular Viabilidad")', { force: true });
    await page.waitForTimeout(2000);

    const invalidAlerts = await page.locator('.bg-red-100, .bg-red-900\\/30').all();
    if (invalidAlerts.length > 0) {
      console.log('🚨 Errores con datos inválidos:');
      for (const alert of invalidAlerts) {
        const text = await alert.textContent();
        console.log('  -', text.trim());
      }
    } else {
      console.log('⚠️  No se detectaron errores con datos inválidos');
    }

    console.log('\n🎯 Auditoría completada');

  } catch (error) {
    console.error('💥 Error en auditoría:', error.message);
  } finally {
    await browser.close();
  }
}

auditPurchaseAssistant();