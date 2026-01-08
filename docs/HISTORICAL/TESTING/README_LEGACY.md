# 🧪 E2E Testing - Finanzas Personales

Suite completa de pruebas end-to-end usando **Playwright** para garantizar la calidad de la aplicación Finanzas Personales.

## 📊 Estadísticas Rápidas

- **17 archivos de test** organizados por prioridad
- **180+ casos de prueba** cobriendo todas las features
- **3 navegadores** (Chrome, Firefox, Safari)
- **5 tamaños de pantalla** (Desktop, Tablet, Mobile)
- **25+ funciones helper** reutilizables

## 🚀 Inicio Rápido

### Ejecutar todos los tests
```bash
npm run test:e2e
```

### Ver en interfaz visual
```bash
npx playwright test --ui
```

### Ver último reporte
```bash
npx playwright show-report
```

## 📂 Estructura de Tests

### PRIORIDAD ALTA (70 tests) - Core Features
- `transactions.spec.js` - CRUD de transacciones
- `navigation.spec.js` - Navegación desktop/móvil  
- `persistence.spec.js` - Almacenamiento encriptado
- `budgets.spec.js` - Gestión de presupuestos
- `savings-goals.spec.js` - Metas de ahorro

### PRIORIDAD MEDIA (56 tests) - Important Features
- `stats.spec.js` - Gráficos y análisis
- `backup-restore.spec.js` - Export/Import
- `alerts.spec.js` - Sistema de alertas
- `daily-expenses.spec.js` - Gastos rápidos

### PRIORIDAD BAJA (54+ tests) - Additional Features
- `calendar.spec.js` - Vista calendario
- `projection.spec.js` - Proyecciones
- `reports.spec.js` - Generación de reportes
- `search.spec.js` - Búsqueda avanzada
- `exchange-rate.spec.js` - Tasas de cambio
- `theme.spec.js` - Tema oscuro/claro
- `responsive.spec.js` - Pruebas responsivas
- `integration.spec.js` - Flujos E2E completos

## 🛠️ Configuración

Los tests están preconfigurados en `playwright.config.js`:
- Timeout: 30 segundos por test
- Retries: 2 en CI, 0 localmente
- Browsers: Chromium, Firefox, WebKit
- Reports: HTML + JUnit XML
- Video/Screenshots: En fallos

## 📚 Helpers Disponibles

```javascript
// Navegación
navigateDesktop(page, 'Transacciones')
navigateMobile(page, 'transactions')

// Transacciones
addTransaction(page, { type, amount, category, description })
deleteTransaction(page, index)
verifyTransactionInList(page, description)

// Presupuestos
createBudget(page, { category, amount })

// Metas
createSavingsGoal(page, { name, amount, months })

// Utilidades
clearStorage(page)
getStorageData(page)
toggleTheme(page)
exportData(page)
verifyAlert(page, type)
```

Ver `tests/helpers.js` para la documentación completa.

## 💡 Ejemplos

### Test Básico
```javascript
test('should add transaction', async ({ page }) => {
  await page.goto('/');
  await helpers.navigateDesktop(page, 'Transacciones');
  
  await helpers.addTransaction(page, {
    type: 'expense',
    amount: 100,
    category: 'Alimentación',
    description: 'Compras'
  });

  await helpers.verifyTransactionInList(page, 'Compras');
});
```

### Test con Setup
```javascript
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await helpers.clearStorage(page);
  await page.setViewportSize({ width: 1280, height: 720 });
});

test('should display dashboard', async ({ page }) => {
  await helpers.navigateDesktop(page, 'Dashboard');
  await expect(page.locator('text=Resumen')).toBeVisible();
});
```

## 🔍 Debugging

### Modo Debug
```bash
npx playwright test --debug
```

### Modo UI (Recomendado)
```bash
npx playwright test --ui
```

### Ejecutar test específico
```bash
npx playwright test tests/transactions.spec.js
```

### Ejecutar test por patrón
```bash
npx playwright test -g "should add transaction"
```

## 📊 Reportes

Después de ejecutar los tests:

```bash
# Ver reporte HTML
npx playwright show-report test-results

# Ver reporte JUnit (para CI)
cat test-results/junit.xml
```

## 🌐 Viewports Probados

| Dispositivo | Tamaño | Descripción |
|------------|--------|------------|
| Desktop Grande | 1920x1080 | Monitores grandes |
| Desktop | 1280x720 | Laptop estándar |
| Tablet | 768x1024 | iPad |
| Mobile | 390x844 | iPhone 12/13 |
| Mobile Pequeño | 320x568 | iPhone SE |

## ✅ Checklist Pre-Deploy

- [ ] Ejecutar: `npm run test:e2e`
- [ ] Todos los tests pasan ✅
- [ ] No hay warnings en consola
- [ ] Reportes generados sin errores

## 🔗 Enlaces Útiles

- [Playwright Docs](https://playwright.dev)
- [Test Writing Tips](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [TESTING_GUIDE.md](../TESTING_GUIDE.md) - Guía completa

## 📝 Notas

- Los tests usan `beforeEach` para limpiar storage
- Se simulan datos reales para validar funcionalidad
- Se prueban casos exitosos y errores
- Se valida persistencia de datos
- Se prueban todos los tamaños de pantalla

## 🎯 Cobertura

**180+ tests** cubren:
- ✅ Todas las features principales
- ✅ Desktop, tablet y mobile
- ✅ Casos exitosos y errores
- ✅ Persistencia de datos
- ✅ Flujos de usuario E2E
- ✅ Validaciones de formularios
- ✅ Encriptación LocalStorage

## 🚨 Troubleshooting

### Tests flaky
```bash
# Aumentar timeout
test.setTimeout(60 * 1000);

# O usar waitFor específico
await page.waitForSelector('[data-testid="element"]');
```

### WebServer no inicia
```bash
# Verificar que dev server funciona
npm run dev -- --host --port 4173
```

### Elementos no encontrados
```bash
# Usar data-testid en lugar de text selectors
page.locator('[data-testid="my-element"]')
```

---

**Última actualización:** Enero 2024
**Versión:** 1.0.0
**Estado:** ✅ En uso

Para más información, ver [TESTING_GUIDE.md](../TESTING_GUIDE.md)
