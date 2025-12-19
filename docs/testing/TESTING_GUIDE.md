# Guía de Pruebas E2E - Finanzas Personales

## 📋 Descripción General

Suite completa de pruebas E2E con **Playwright** para la aplicación **Finanzas Personales**. Se incluyen **17 archivos de test** organizados por prioridad (ALTA, MEDIA, BAJA) con más de **180 casos de prueba** que cubren:

- ✅ Transacciones (CRUD completo)
- ✅ Navegación (Desktop/Móvil)
- ✅ Persistencia de datos (LocalStorage + Encriptación)
- ✅ Presupuestos (Creación, seguimiento, alertas)
- ✅ Metas de ahorro (Viabilidad, progreso)
- ✅ Estadísticas (Gráficos, análisis)
- ✅ Backup/Restauración (Export/Import)
- ✅ Alertas (Notificaciones)
- ✅ Gastos diarios (Entrada rápida)
- ✅ Calendario (Vista mensual)
- ✅ Proyección (Forecasting)
- ✅ Reportes (PDF, CSV, JSON)
- ✅ Búsqueda avanzada
- ✅ Tasas de cambio
- ✅ Tema (Dark/Light mode)
- ✅ Responsivo (Desktop/Tablet/Mobile)
- ✅ Integración E2E (Flujos completos)

---

## 📦 Instalación

### 1. Instalar dependencias

```bash
npm install
npm install -D @playwright/test@latest
```

### 2. Verificar instalación

```bash
npx playwright --version
```

### 3. Instalar navegadores (si no están instalados)

```bash
npx playwright install
```

---

## 🚀 Ejecutar Pruebas

### Ejecutar todos los tests

```bash
npm run test:e2e
```

### Ejecutar tests en modo UI (interactivo)

```bash
npx playwright test --ui
```

### Ejecutar tests con interfaz visual (modo debug)

```bash
npx playwright test --debug
```

### Ejecutar pruebas de un archivo específico

```bash
# Transacciones
npx playwright test tests/transactions.spec.js

# Navegación
npx playwright test tests/navigation.spec.js

# Presupuestos
npx playwright test tests/budgets.spec.js
```

### Ejecutar pruebas con un navegador específico

```bash
# Solo Chromium
npx playwright test --project=chromium

# Solo Firefox
npx playwright test --project=firefox

# Solo Safari
npx playwright test --project=webkit
```

### Ejecutar con verbosidad

```bash
npx playwright test --verbose
```

### Ver resultados HTML

```bash
npx playwright show-report test-results
```

---

## 📂 Estructura de Archivos

```
tests/
├── helpers.js                    # Utilidades reutilizables (25+ funciones)
├── PRIORIDAD ALTA (5 archivos)
│   ├── transactions.spec.js      # 14 tests - CRUD transacciones
│   ├── navigation.spec.js        # 24 tests - Navegación desktop/móvil
│   ├── persistence.spec.js       # 12 tests - LocalStorage + encriptación
│   ├── budgets.spec.js           # 14 tests - Gestión presupuestos
│   └── savings-goals.spec.js     # 13 tests - Metas de ahorro
├── PRIORIDAD MEDIA (4 archivos)
│   ├── stats.spec.js             # 15 tests - Estadísticas y gráficos
│   ├── backup-restore.spec.js    # 13 tests - Export/Import datos
│   ├── alerts.spec.js            # 15 tests - Sistema de alertas
│   └── daily-expenses.spec.js    # 14 tests - Gastos diarios
├── PRIORIDAD BAJA (7 archivos)
│   ├── calendar.spec.js          # 13 tests - Vista calendario
│   ├── projection.spec.js        # 12 tests - Proyecciones futuras
│   ├── reports.spec.js           # 13 tests - Generación reportes
│   ├── search.spec.js            # 16 tests - Búsqueda avanzada
│   ├── exchange-rate.spec.js     # 14 tests - Tasas de cambio
│   ├── theme.spec.js             # 18 tests - Tema oscuro/claro
│   ├── responsive.spec.js        # 18 tests - Pruebas responsivas
│   └── integration.spec.js       # 15 tests - Flujos E2E completos
└── test-results/                 # Reportes de ejecución
```

---

## 🛠️ Configuración (playwright.config.js)

```javascript
{
  testDir: './tests',
  timeout: 30 * 1000,
  retries: 2 (en CI),
  workers: 4 (paralelo),
  projects: [Chromium, Firefox, WebKit],
  webServer: {
    command: 'npm run dev -- --host --port 4173',
    url: 'http://127.0.0.1:4173/'
  }
}
```

---

## 📊 Funciones Helper

El archivo `helpers.js` incluye +25 utilidades reutilizables:

### Navegación
- `navigateDesktop(page, tabName)` - Navegar en desktop
- `navigateMobile(page, tabId)` - Navegar en móvil

### Transacciones
- `addTransaction(page, {type, amount, category, description})`
- `deleteTransaction(page, index)`
- `verifyTransactionInList(page, description)`

### Presupuestos
- `createBudget(page, {category, amount})`
- `editBudget(page, index, newAmount)`

### Metas
- `createSavingsGoal(page, {name, amount, months})`
- `addGoalContribution(page, index, amount)`

### Gastos Diarios
- `addDailyExpense(page, {amount, category, description})`

### Utilidades
- `clearStorage(page)` - Limpiar localStorage
- `getStorageData(page)` - Obtener datos encriptados
- `toggleTheme(page)` - Cambiar tema
- `exportData(page)` - Exportar datos
- `verifyAlert(page, type)` - Verificar alertas

---

## ✅ Casos de Prueba Principales

### PRIORIDAD ALTA (70 tests)

**transactions.spec.js** - Gestión de transacciones
- [ ] Agregar ingreso/gasto/fijo
- [ ] Editar transacción
- [ ] Eliminar transacción
- [ ] Validar campos requeridos
- [ ] Filtrar por fecha
- [ ] Verificar persistencia

**navigation.spec.js** - Navegación completa
- [ ] Sidebar en desktop
- [ ] FAB en móvil
- [ ] Todos los 12 tabs
- [ ] Resaltado de tab activo
- [ ] Navegación responsiva

**persistence.spec.js** - Persistencia encriptada
- [ ] Encriptación AES-256
- [ ] Recuperación tras reload
- [ ] Manejo de corrupción
- [ ] Sincronización multi-tab

**budgets.spec.js** - Presupuestos
- [ ] Crear presupuesto
- [ ] Barra de progreso
- [ ] Alertas de exceso
- [ ] Editar/eliminar
- [ ] Presupuesto automático 40%

**savings-goals.spec.js** - Metas
- [ ] Crear meta de ahorro
- [ ] Indicador de viabilidad
- [ ] Cálculo de ahorro mensual
- [ ] Progreso 0-100%
- [ ] Alertas de cumplimiento

### PRIORIDAD MEDIA (56 tests)

**stats.spec.js** - Estadísticas
- [ ] Gráficos (pie, bar, line)
- [ ] Tarjetas de resumen
- [ ] Top gastos
- [ ] Promedios por categoría
- [ ] Selector de mes

**backup-restore.spec.js** - Backup
- [ ] Exportar JSON
- [ ] Naming con timestamp
- [ ] Importar archivo
- [ ] Limpiar todo
- [ ] Validación JSON

**alerts.spec.js** - Alertas
- [ ] Mostrar alertas
- [ ] Marcar como leído
- [ ] Descartar
- [ ] Filtrar por tipo
- [ ] Ordenar por fecha

**daily-expenses.spec.js** - Gastos rápidos
- [ ] Botones predefinidos
- [ ] Gasto custom
- [ ] Total del día
- [ ] Persistencia
- [ ] Interfaz táctil

### PRIORIDAD BAJA (54+ tests)

- **calendar.spec.js** - Calendario mensual
- **projection.spec.js** - Proyecciones
- **reports.spec.js** - PDF/CSV/JSON
- **search.spec.js** - Búsqueda avanzada
- **exchange-rate.spec.js** - Tasas cambio
- **theme.spec.js** - Dark/Light mode
- **responsive.spec.js** - Desktop/Tablet/Mobile
- **integration.spec.js** - Flujos E2E

---

## 🔍 Viewport Configurados

```javascript
// Desktop estándar
{ width: 1280, height: 720 }

// Desktop grande
{ width: 1920, height: 1080 }

// Tablet
{ width: 768, height: 1024 }

// Móvil
{ width: 390, height: 844 }

// Móvil pequeño
{ width: 320, height: 568 }
```

---

## 📝 Ejemplo de Test Personalizado

```javascript
import { test, expect } from '@playwright/test';
import { helpers } from './helpers';

const DESKTOP_VIEWPORT = { width: 1280, height: 720 };

test.describe('Mi Feature', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await helpers.clearStorage(page);
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('should do something', async ({ page }) => {
    // Navegar
    await helpers.navigateDesktop(page, 'Dashboard');
    
    // Agregar datos
    await helpers.addTransaction(page, {
      type: 'expense',
      amount: 100,
      category: 'Test',
      description: 'Test transaction'
    });

    // Verificar
    await helpers.verifyTransactionInList(page, 'Test transaction');
    
    // Aserción
    const element = page.locator('text=Test transaction');
    await expect(element).toBeVisible();
  });

});
```

---

## 🐛 Debugging

### Modo Debug Interactivo

```bash
npx playwright test --debug
```

### Con Inspector de Elementos

```bash
npx playwright test --debug --headed
```

### Generar traces para análisis

```bash
npx playwright test --trace on
npx playwright show-trace test-results/<trace>
```

---

## 📊 Reportes

Los reportes se generan automáticamente después de cada ejecución:

```bash
# Ver reporte HTML
npx playwright show-report test-results

# Reporte JUnit (para CI/CD)
cat test-results/junit.xml
```

---

## 🔄 CI/CD Integration

Para integrar con GitHub Actions (ci.yml):

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: test-results/
```

---

## 💡 Tips y Mejores Prácticas

1. **Usar helpers** - Centraliza acciones comunes
2. **beforeEach cleanup** - Resetea estado antes de cada test
3. **Waits explícitos** - Evita flakiness con `waitForTimeout`
4. **Data-testid** - Usa atributos para selectores confiables
5. **Viewports diversos** - Prueba desktop, tablet y móvil
6. **Descriptive names** - Nombres de test claros y específicos
7. **Arrange-Act-Assert** - Estructura clara en cada test

---

## 📚 Documentación Oficial

- [Playwright Docs](https://playwright.dev)
- [API Reference](https://playwright.dev/docs/api/class-page)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)

---

## 🆘 Troubleshooting

### Tests no encuentran elementos

```bash
# Usa selector más específico o data-testid
page.locator('[data-testid="my-element"]')
```

### WebServer no inicia

```bash
# Verifica que npm run dev funciona
npm run dev -- --host --port 4173
```

### Timeouts durante tests

```bash
# Aumenta timeout en config o test específico
test.setTimeout(60 * 1000); // 60s
```

### Pantallas vacías en móvil

```bash
# Verifica que FAB está visible y clickeable
await page.locator('[data-testid="fab-button"]').click();
```

---

**Última actualización:** Enero 2024
**Total Tests:** 180+
**Archivos:** 18 (helpers + 17 specs)
**Cobertura:** Desktop, Tablet, Mobile

