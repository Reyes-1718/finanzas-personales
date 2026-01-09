import { chromium } from 'playwright';

async function testPurchaseAssistantEmptyForm() {
  console.log('🔍 Probando formulario vacío del Asistente de Compra...\n');

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

    console.log('📝 Verificando estado inicial del formulario...');

    // Verificar campos vacíos
    const productNameValue = await page.inputValue('input[placeholder="Ej: iPhone 15 Pro"]');
    const amountValue = await page.inputValue('input[placeholder="65000"]');

    console.log(`📝 Nombre del producto: "${productNameValue}"`);
    console.log(`💰 Monto: "${amountValue}"`);

    if (!productNameValue.trim()) {
      console.log('⚠️ Campo "Nombre del producto" está vacío');
    }
    if (!amountValue) {
      console.log('⚠️ Campo "Monto" está vacío');
    }

    console.log('🚀 Intentando calcular con formulario vacío...');

    // Escuchar por alertas
    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      console.log(`🔔 Alerta capturada: "${alertMessage}"`);
      await dialog.accept();
    });

    // Hacer clic en calcular
    await page.click('button:has-text("Calcular Viabilidad")', { force: true });

    // Esperar un poco para que se procese
    await page.waitForTimeout(1000);

    console.log('🔍 Verificando resultado...');

    if (alertMessage) {
      console.log('✅ Se mostró alerta por formulario vacío');
      console.log(`📢 Mensaje: "${alertMessage}"`);

      // Verificar si el mensaje coincide con la validación esperada
      if (alertMessage.includes('completa') || alertMessage.includes('requerido')) {
        console.log('✅ Validación funciona correctamente');
      } else {
        console.log('❌ Mensaje de validación inesperado');
      }
    } else {
      console.log('⚠️ No se mostró alerta, verificando mensajes de error en UI...');

      // Buscar mensajes de error en el DOM
      const errorElements = await page.locator('.text-red-500, .border-red-500').all();
      console.log(`🔍 Encontrados ${errorElements.length} elementos de error`);

      for (let i = 0; i < errorElements.length; i++) {
        const text = await errorElements[i].textContent();
        console.log(`❌ Error ${i + 1}: "${text.trim()}"`);
      }

      if (errorElements.length > 0) {
        console.log('✅ Se muestran errores de validación en la UI');
      } else {
        console.log('❌ No se encontraron errores de validación');
      }
    }

    // Verificar si cambió de paso (no debería)
    const step2Visible = await page.locator('h2:has-text("Análisis de Viabilidad")').isVisible();
    if (step2Visible) {
      console.log('❌ Error: Se cambió al paso 2 a pesar del formulario vacío');
    } else {
      console.log('✅ Correcto: No se cambió de paso con formulario vacío');
    }

    console.log('\n🎯 Test de formulario vacío completado');

  } catch (error) {
    console.error('💥 Error en test:', error.message);
  } finally {
    await browser.close();
  }
}

testPurchaseAssistantEmptyForm();