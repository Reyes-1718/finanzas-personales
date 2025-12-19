# 🧪 PROMPT PARA EXPERTO EN PRUEBAS UNITARIAS - FINANZAS PERSONALES

```markdown
# ROL Y CONTEXTO

Eres un **Experto en Testing Automatizado** especializado en aplicaciones React con Playwright. Tu misión es crear una suite completa de pruebas E2E (End-to-End) para una aplicación de finanzas personales construida con React + Vite + Tailwind CSS.

---

# TECNOLOGÍAS DEL PROYECTO

- **Frontend**: React 18.2.0 con Hooks
- **Build Tool**: Vite 7.3.0
- **Framework de Testing**: Playwright ^1.41.0
- **Estilos**: Tailwind CSS 3.4.0
- **Gráficos**: Recharts 2.10.3
- **Seguridad**: CryptoJS 4.2.0 (cifrado AES-256)
- **Persistencia**: LocalStorage (cifrado)

---

# ARQUITECTURA DE LA APLICACIÓN

## Componentes Principales:
1. **Dashboard.jsx** - Resumen financiero mensual
2. **TransactionForm.jsx** - CRUD de transacciones
3. **DailyExpenses.jsx** - Gastos rápidos
4. **SavingsGoals.jsx** - Metas de ahorro
5. **Budgets.jsx** - Presupuestos por categoría
6. **AdvancedStats.jsx** - Estadísticas y gráficos
7. **Calendar.jsx** - Vista calendario de transacciones
8. **Projection.jsx** - Proyección financiera futura
9. **ReportPDF.jsx** - Exportación de reportes
10. **SearchFilter.jsx** - Búsqueda avanzada
11. **Alerts.jsx** - Sistema de alertas
12. **BackupRestore.jsx** - Backup/restore de datos
13. **ExchangeRateWidget.jsx** - Conversión USD/DOP
14. **FloatingNav.jsx** - Navegación móvil (FAB)

## Hooks Personalizados:
1. **useFinancesData** - CRUD transacciones + persistencia cifrada
2. **useSavingsGoals** - Gestión de metas
3. **useBudgets** - Gestión de presupuestos
4. **useAlerts** - Sistema de alertas
5. **useTheme** - Tema claro/oscuro
6. **useExchangeRate** - Tasa de cambio

## Navegación:
- **Desktop**: Sidebar fijo (>768px)
- **Móvil**: FloatingNav con FAB circular (<768px)
- **Viewports de testing**:
  - Desktop: 1280x720
  - Móvil: 390x844 (iPhone 12 Pro)

---

# OBJETIVO DE LAS PRUEBAS

Crear una suite completa de tests E2E con Playwright que cubra:

✅ **Funcionalidad completa** de todos los componentes
✅ **Navegación** en desktop y móvil
✅ **CRUD operations** (Create, Read, Update, Delete)
✅ **Persistencia de datos** en LocalStorage
✅ **Cálculos financieros** (balances, presupuestos, proyecciones)
✅ **Responsive design** (cambios de viewport)
✅ **Formularios** (validaciones, envíos, errores)
✅ **Gráficos** (renderizado de Recharts)
✅ **Exportación/Importación** de datos
✅ **Sistema de alertas**
✅ **Tema claro/oscuro**
✅ **Conversión de moneda**

---

# ESTRUCTURA DE ARCHIVOS DE TESTING

Genera los siguientes archivos en la carpeta `tests/`:

```
tests/
├── app.spec.js                    ✅ YA EXISTE (navegación básica)
├── transactions.spec.js           🆕 Transacciones CRUD
├── daily-expenses.spec.js         🆕 Gastos diarios
├── savings-goals.spec.js          🆕 Metas de ahorro
├── budgets.spec.js                🆕 Presupuestos
├── stats.spec.js                  🆕 Estadísticas y gráficos
├── calendar.spec.js               🆕 Vista calendario
├── projection.spec.js             🆕 Proyecciones futuras
├── reports.spec.js                🆕 Exportación PDF
├── search.spec.js                 🆕 Búsqueda avanzada
├── alerts.spec.js                 🆕 Sistema de alertas
├── backup-restore.spec.js         🆕 Backup/restore
├── exchange-rate.spec.js          🆕 Tasa de cambio
├── theme.spec.js                  🆕 Tema claro/oscuro
├── navigation.spec.js             🆕 Navegación completa
├── persistence.spec.js            🆕 LocalStorage
├── responsive.spec.js             🆕 Diseño responsive
└── integration.spec.js            🆕 Flujos completos end-to-end
```

---

# PLANTILLA PARA CADA ARCHIVO DE TEST

```javascript
import { test, expect } from '@playwright/test';

const DESKTOP_VIEWPORT = { width: 1280, height: 720 };
const MOBILE_VIEWPORT = { width: 390, height: 844 };

// Helper: Limpiar LocalStorage antes de cada test
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test.describe('[NOMBRE DEL COMPONENTE] - Desktop', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT);
  });

  test('[ACCIÓN ESPECÍFICA]', async ({ page }) => {
    // 1. ARRANGE (preparar)
    // 2. ACT (ejecutar acción)
    // 3. ASSERT (verificar resultado)
  });

});

test.describe('[NOMBRE DEL COMPONENTE] - Móvil', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
  });

  test('[ACCIÓN ESPECÍFICA en móvil]', async ({ page }) => {
    // Tests específicos de móvil (FAB, gestos, etc.)
  });

});
```

---

# CASOS DE PRUEBA REQUERIDOS

## 1. TRANSACCIONES (transactions.spec.js)

### Desktop:
- ✅ Navegar a "Transacciones" desde sidebar
- ✅ Formulario de transacción visible con todos los campos
- ✅ Agregar ingreso (monto positivo)
  - Verificar que aparece en lista
  - Verificar que balance se actualiza
- ✅ Agregar gasto (monto negativo)
  - Verificar que aparece en lista
  - Verificar que balance se actualiza
- ✅ Validar campos obligatorios (descripción, monto, categoría)
- ✅ Editar una transacción existente
- ✅ Eliminar una transacción
  - Confirmar modal de eliminación
  - Verificar que desaparece de la lista
- ✅ Cambiar tipo (Ingreso ↔ Gasto)
- ✅ Seleccionar categoría personalizada
- ✅ Filtrar por fecha
- ✅ Filtrar por categoría
- ✅ Ordenar por monto/fecha

### Móvil:
- ✅ Abrir formulario desde FAB → Transacciones
- ✅ Formulario responsive (campos apilados)
- ✅ Agregar transacción desde móvil
- ✅ Editar transacción desde móvil

---

## 2. GASTOS DIARIOS (daily-expenses.spec.js)

### Desktop:
- ✅ Navegar a "Gastos Diarios"
- ✅ Ver botones de gastos predefinidos
- ✅ Click en "Café" → agregar gasto rápido
  - Verificar que se agrega con monto predefinido
- ✅ Agregar gasto personalizado
- ✅ Ver lista de gastos del día actual
- ✅ Eliminar gasto del día

### Móvil:
- ✅ Acceder desde FAB
- ✅ Botones táctiles grandes (optimizado touch)
- ✅ Agregar gasto rápido en móvil

---

## 3. METAS DE AHORRO (savings-goals.spec.js)

### Desktop:
- ✅ Navegar a "Metas de Ahorro"
- ✅ Crear nueva meta:
  - Nombre de meta
  - Monto objetivo
  - Fecha límite
  - Verificar que se crea con progreso 0%
- ✅ Agregar aporte a una meta
  - Verificar que barra de progreso se actualiza
  - Verificar que porcentaje cambia
- ✅ Editar meta existente
- ✅ Eliminar meta
- ✅ Meta completada (100%):
  - Verificar alerta de "Meta completada"
  - Verificar indicador visual
- ✅ Calcular ahorro periódico necesario
  - Verificar sugerencia mensual/semanal

### Móvil:
- ✅ Crear meta desde móvil
- ✅ Agregar aporte desde móvil
- ✅ Visualizar progreso en tarjetas responsive

---

## 4. PRESUPUESTOS (budgets.spec.js)

### Desktop:
- ✅ Navegar a "Presupuestos"
- ✅ Crear presupuesto para categoría:
  - Seleccionar categoría
  - Definir monto mensual
  - Verificar que se crea
- ✅ Ver progreso de presupuesto (gastado vs. límite)
- ✅ Aplicar presupuesto automático (40% del ingreso)
  - Click en "Aplicar Automático"
  - Verificar distribución proporcional
- ✅ Alerta de presupuesto excedido:
  - Agregar gasto que supere presupuesto
  - Verificar alerta roja
- ✅ Editar presupuesto existente
- ✅ Eliminar presupuesto

### Móvil:
- ✅ Crear presupuesto desde móvil
- ✅ Ver progreso en tarjetas responsive
- ✅ Aplicar automático desde móvil

---

## 5. ESTADÍSTICAS (stats.spec.js)

### Desktop:
- ✅ Navegar a "Estadísticas Avanzadas"
- ✅ Verificar que gráficos se renderizan:
  - Gráfico de pastel (gastos por categoría)
  - Gráfico de barras (ingresos vs gastos mensual)
  - Gráfico de líneas (evolución temporal)
- ✅ Verificar leyendas de gráficos
- ✅ Interacción con gráficos:
  - Hover muestra tooltips
  - Click en leyenda oculta/muestra serie
- ✅ Cambiar rango de fechas
- ✅ Filtrar por categoría

### Móvil:
- ✅ Gráficos responsive
- ✅ Touch en gráficos muestra datos
- ✅ Scroll horizontal si es necesario

---

## 6. CALENDARIO (calendar.spec.js)

### Desktop:
- ✅ Navegar a "Calendario"
- ✅ Ver mes actual con transacciones
- ✅ Click en día con transacciones:
  - Verificar modal con detalles
- ✅ Navegar a mes anterior/siguiente
- ✅ Indicadores visuales:
  - Días con ingresos (verde)
  - Días con gastos (rojo)
  - Días mixtos (amarillo)

### Móvil:
- ✅ Calendario responsive
- ✅ Swipe para cambiar mes
- ✅ Modal adaptado a móvil

---

## 7. PROYECCIÓN (projection.spec.js)

### Desktop:
- ✅ Navegar a "Proyección Futura"
- ✅ Definir parámetros:
  - Ingreso mensual esperado
  - Gasto mensual esperado
  - Meses a proyectar
- ✅ Generar proyección
- ✅ Ver gráfico de proyección
- ✅ Ver tabla de datos proyectados
- ✅ Escenarios (optimista, normal, pesimista)

### Móvil:
- ✅ Formulario responsive
- ✅ Gráfico adaptado a móvil

---

## 8. REPORTES PDF (reports.spec.js)

### Desktop:
- ✅ Navegar a "Reportes"
- ✅ Seleccionar rango de fechas
- ✅ Click en "Generar PDF":
  - Verificar que se descarga archivo
  - Verificar nombre de archivo
- ✅ Generar reporte mensual
- ✅ Generar reporte anual

### Móvil:
- ✅ Generar PDF desde móvil
- ✅ Verificar descarga en móvil

---

## 9. BÚSQUEDA AVANZADA (search.spec.js)

### Desktop:
- ✅ Navegar a "Búsqueda Avanzada"
- ✅ Buscar por descripción (texto libre)
- ✅ Filtrar por rango de montos
- ✅ Filtrar por categoría
- ✅ Filtrar por tipo (Ingreso/Gasto)
- ✅ Filtrar por rango de fechas
- ✅ Combinar múltiples filtros
- ✅ Limpiar filtros
- ✅ Ver resultados en tabla
- ✅ Exportar resultados

### Móvil:
- ✅ Filtros en acordeón
- ✅ Búsqueda responsive

---

## 10. ALERTAS (alerts.spec.js)

### Desktop:
- ✅ Navegar a "Alertas"
- ✅ Ver alertas activas
- ✅ Crear alerta de presupuesto:
  - Definir umbral
  - Verificar que se activa al superar
- ✅ Crear alerta de meta:
  - Notificación al completar
- ✅ Marcar alerta como leída
- ✅ Eliminar alerta
- ✅ Alerta de gasto inusual (spike detection)

### Móvil:
- ✅ Ver alertas en móvil
- ✅ Notificaciones toast

---

## 11. BACKUP/RESTORE (backup-restore.spec.js)

### Desktop:
- ✅ Navegar a "Backup y Restauración"
- ✅ Exportar datos:
  - Click en "Exportar"
  - Verificar descarga JSON
  - Verificar estructura del archivo
- ✅ Importar datos:
  - Subir archivo JSON válido
  - Verificar que datos se cargan
- ✅ Importar datos inválidos:
  - Verificar mensaje de error
- ✅ Limpiar todos los datos:
  - Confirmar modal
  - Verificar que LocalStorage se limpia

### Móvil:
- ✅ Exportar desde móvil
- ✅ Importar desde móvil

---

## 12. TASA DE CAMBIO (exchange-rate.spec.js)

### Desktop:
- ✅ Verificar widget visible en sidebar
- ✅ Mostrar tasa actual USD/DOP
- ✅ Actualizar tasa manualmente
- ✅ Convertir montos en transacciones
- ✅ Ver histórico de tasas

### Móvil:
- ✅ Widget visible en header móvil
- ✅ Actualizar tasa desde móvil

---

## 13. TEMA CLARO/OSCURO (theme.spec.js)

### Desktop:
- ✅ Toggle tema desde botón
- ✅ Verificar que clase `dark` se aplica a `<html>`
- ✅ Verificar cambio de colores en componentes
- ✅ Persistencia de tema:
  - Cambiar tema
  - Recargar página
  - Verificar que se mantiene

### Móvil:
- ✅ Toggle desde móvil
- ✅ Cambio visual en todos los componentes

---

## 14. NAVEGACIÓN COMPLETA (navigation.spec.js)

### Desktop:
- ✅ Click en cada ítem del sidebar
- ✅ Verificar que tab activa cambia
- ✅ Verificar que contenido cambia
- ✅ Verificar highlight de tab activa
- ✅ Navegación secuencial por todas las secciones

### Móvil:
- ✅ Abrir FAB
- ✅ Navegar a cada sección desde FAB
- ✅ Verificar que FAB se cierra
- ✅ Verificar scroll to top al cambiar tab

---

## 15. PERSISTENCIA (persistence.spec.js)

### Tests de LocalStorage:
- ✅ Agregar transacción:
  - Verificar que se guarda en LocalStorage
  - Verificar que está cifrado (no legible)
- ✅ Recargar página:
  - Verificar que datos persisten
- ✅ Agregar múltiples transacciones:
  - Verificar que todas se guardan
- ✅ Editar transacción:
  - Verificar actualización en LocalStorage
- ✅ Eliminar transacción:
  - Verificar eliminación en LocalStorage

---

## 16. RESPONSIVE (responsive.spec.js)

### Cambios de viewport:
- ✅ Desktop → Móvil:
  - Verificar que sidebar desaparece
  - Verificar que FAB aparece
- ✅ Móvil → Desktop:
  - Verificar que FAB desaparece
  - Verificar que sidebar aparece
- ✅ Tablet (768px):
  - Verificar comportamiento en punto de quiebre
- ✅ Desktop grande (1920px):
  - Verificar que layout se adapta

---

## 17. INTEGRACIÓN E2E (integration.spec.js)

### Flujos completos usuario real:

**Flujo 1: Nuevo usuario**
```javascript
test('Flujo completo: nuevo usuario configura finanzas', async ({ page }) => {
  // 1. Agregar ingreso mensual
  // 2. Crear presupuestos automáticos
  // 3. Crear meta de ahorro
  // 4. Agregar gasto
  // 5. Ver dashboard actualizado
  // 6. Verificar alertas
});
```

**Flujo 2: Seguimiento mensual**
```javascript
test('Flujo completo: seguimiento de mes', async ({ page }) => {
  // 1. Ver dashboard inicio de mes
  // 2. Agregar gastos diarios varios días
  // 3. Revisar progreso de presupuesto
  // 4. Aportar a meta de ahorro
  // 5. Ver estadísticas de gastos
  // 6. Generar reporte mensual
});
```

**Flujo 3: Ajuste de presupuesto**
```javascript
test('Flujo completo: exceder presupuesto y ajustar', async ({ page }) => {
  // 1. Crear presupuesto limitado
  // 2. Agregar gastos que excedan
  // 3. Verificar alerta de exceso
  // 4. Ajustar presupuesto
  // 5. Verificar que alerta desaparece
});
```

**Flujo 4: Backup y migración**
```javascript
test('Flujo completo: exportar e importar datos', async ({ page }) => {
  // 1. Agregar varias transacciones
  // 2. Exportar datos
  // 3. Limpiar datos
  // 4. Importar archivo exportado
  // 5. Verificar que todo volvió
});
```

---

# HELPERS Y UTILIDADES

Crea un archivo `tests/helpers.js` con funciones reutilizables:

```javascript
// Helpers para tests
export const helpers = {
  
  // Navegar en desktop
  navigateDesktop: async (page, tabName) => {
    await page.click(`text=${tabName}`);
    await page.waitForTimeout(300);
  },
  
  // Navegar en móvil con FAB
  navigateMobile: async (page, tabId) => {
    const fab = page.getByTestId('fab-button');
    await fab.click();
    await page.getByTestId(`fab-item-${tabId}`).click();
    await page.waitForTimeout(300);
  },
  
  // Agregar transacción
  addTransaction: async (page, type, amount, description, category) => {
    await page.fill('[name="description"]', description);
    await page.fill('[name="amount"]', amount.toString());
    await page.selectOption('[name="type"]', type);
    await page.selectOption('[name="category"]', category);
    await page.click('button:has-text("Agregar")');
    await page.waitForTimeout(500);
  },
  
  // Limpiar LocalStorage
  clearStorage: async (page) => {
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  },
  
  // Verificar texto en dashboard
  verifyBalance: async (page, expectedBalance) => {
    const balance = await page.locator('[data-testid="balance"]').textContent();
    expect(balance).toContain(expectedBalance);
  },
  
  // Screenshot con nombre descriptivo
  takeScreenshot: async (page, name) => {
    await page.screenshot({ 
      path: `test-results/screenshots/${name}.png`,
      fullPage: true 
    });
  }
  
};
```

---

# CRITERIOS DE ÉXITO

✅ **Cobertura**: Mínimo 90% de funcionalidades cubiertas
✅ **Estabilidad**: 0% de tests flaky (intermitentes)
✅ **Velocidad**: Suite completa ejecuta en < 10 minutos
✅ **Mantenibilidad**: Código DRY (helpers reutilizables)
✅ **Documentación**: Cada test con comentarios claros
✅ **CI/CD**: Todos los tests pasan en GitHub Actions

---

# CONFIGURACIÓN PLAYWRIGHT RECOMENDADA

```javascript
// playwright.config.js
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 30000, // 30 segundos por test
  
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
  },

  projects: [
    {
      name: 'Desktop Chrome',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      },
    },
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        viewport: { width: 390, height: 844 }
      },
    },
  ],
});
```

---

# COMANDO DE EJECUCIÓN

```bash
# Todos los tests
npx playwright test

# Solo desktop
npx playwright test --project="Desktop Chrome"

# Solo móvil
npx playwright test --project="Mobile Chrome"

# Archivo específico
npx playwright test tests/transactions.spec.js

# Modo UI interactivo
npx playwright test --ui

# Con video y trace siempre
npx playwright test --trace on --video on

# En paralelo (más rápido)
npx playwright test --workers=4
```

---

# ENTREGABLES

1. **17 archivos de test** completos (uno por componente/funcionalidad)
2. **Archivo helpers.js** con utilidades reutilizables
3. **Configuración actualizada** de `playwright.config.js`
4. **Documentación** de cada test (comentarios en código)
5. **README de testing** con instrucciones de ejecución
6. **Reporte** de cobertura inicial

---

# PRIORIDADES

**ALTA (hacer primero):**
- ✅ transactions.spec.js
- ✅ navigation.spec.js
- ✅ persistence.spec.js
- ✅ budgets.spec.js
- ✅ savings-goals.spec.js

**MEDIA:**
- ✅ stats.spec.js
- ✅ backup-restore.spec.js
- ✅ alerts.spec.js
- ✅ daily-expenses.spec.js

**BAJA (pero importante):**
- ✅ calendar.spec.js
- ✅ projection.spec.js
- ✅ reports.spec.js
- ✅ search.spec.js
- ✅ exchange-rate.spec.js
- ✅ theme.spec.js

---

# EJECUTA ESTA TAREA

Por favor, genera todos los archivos de testing solicitados siguiendo esta estructura y criterios. Comienza con los de prioridad ALTA y asegúrate de que cada test sea:

1. **Descriptivo**: Nombre claro de lo que prueba
2. **Independiente**: No depende de otros tests
3. **Repetible**: Da el mismo resultado siempre
4. **Rápido**: Ejecuta en < 10 segundos
5. **Completo**: Cubre casos positivos y negativos

¿Comenzamos con los 5 archivos de prioridad ALTA?
```

---
