# 🚨 Especificación Técnica: Sistema de Fondo de Emergencia

**Versión**: 1.0.0  
**Fecha**: 16 de enero de 2026  
**Estado**: ✅ Implementado y Operativo  
**Stack**: React 19.1.0 + Vite 7.3 + Tailwind CSS 3.4.0

---

## 1. Visión General

El **Sistema de Fondo de Emergencia** es un módulo financiero preventivo que ayuda a los usuarios a construir y mantener un colchón de seguridad basado en sus gastos fijos mensuales. Calcula automáticamente una meta recomendada (3-6 meses de gastos fijos) y proporciona herramientas para gestionar depósitos, retiros y seguimiento del progreso.

### Objetivos Principales:
1. ✅ Calcular meta automáticamente basada en gastos fijos reales
2. ✅ Proporcionar flexibilidad con multiplicador ajustable (3-6 meses)
3. ✅ Registrar depósitos y retiros con multi-moneda (DOP/USD)
4. ✅ Alertar cuando el fondo cae por debajo del umbral seguro
5. ✅ Exportar historial completo para análisis y reportes
6. ✅ Integrar con el sistema de análisis de compras (Purchase Assistant)

---

## 2. Componentes Implementados

### 2.1 Hook: `useEmergencyFund.js`

**Propósito**: Lógica central de gestión del fondo de emergencia

**Estado Persistente** (LocalStorage: `fondoEmergencia`):

```javascript
{
  meta: number,                    // Meta aplicada actualmente
  recommendedMeta: number,         // Meta calculada automáticamente
  manualMeta: number | null,       // Override manual (si existe)
  multiplicador: number,           // 3-6 (meses de cobertura)
  saldoActual: number,            // Balance actual en DOP
  transacciones: Array<Transaction>,
  configuracion: {
    alertas_habilitadas: boolean,
    umbral_alerta: number,        // % de meta (default 50%)
    ultima_actualizacion_meta: string // YYYY-MM-DD
  },
  lastComputation: {
    monthsUsed: number,            // Meses de datos analizados
    monthlyAverage: number,        // Promedio mensual de gastos fijos
    totalFixed: number             // Total de gastos fijos analizados
  }
}
```

**Funciones Exportadas**:

```javascript
// Retorna el estado completo del fondo + funciones
const {
  fund,                           // Estado completo
  deposit,                        // Función de depósito
  withdraw,                       // Función de retiro
  setMultiplier,                  // Ajustar multiplicador (3-6)
  setManualMeta,                  // Override de meta
  progress,                       // Progreso (0-100%)
  shouldAlert,                    // Boolean: ¿debe alertar?
  getRateFromStorage              // Obtener tasa de cambio USD/DOP
} = useEmergencyFund(transactions);
```

#### `computeRecommendedMeta(transactions, multiplier)`

**Algoritmo de Cálculo**:

1. **Filtrar transacciones fijas**: Solo gastos con `tipo_gasto='fijo'` o `type='gasto-fijo'`
2. **Ventana temporal**: Últimos 3 meses desde fecha actual
3. **Agrupación mensual**: Sumar gastos por mes (`YYYY-MM`)
4. **Promedio**: Total de gastos fijos / meses con datos
5. **Meta**: Promedio mensual × Multiplicador (3-6)

**Fórmula**:
```
Meta Recomendada = (Σ Gastos Fijos últimos 3 meses / Meses con datos) × Multiplicador
Meta Aplicada = Meta Manual (si existe) || Meta Recomendada
```

**Casos especiales**:
- Sin gastos fijos registrados → Meta = 0, mostrar banner educativo
- Menos de 3 meses de datos → Usa promedio de meses disponibles (extrapolación)
- Multiplicador fuera de rango → Clamp a [3, 6]

#### `deposit({ monto, moneda, tasaCambio, descripcion, fecha })`

**Propósito**: Registrar aporte al fondo

**Proceso**:
1. Convertir a DOP si es USD (`monto × tasaCambio`)
2. Validar monto > 0
3. Crear transacción con tipo `'deposito'`
4. Incrementar `saldoActual`
5. Actualizar timestamp de configuración

**Retorno**:
```javascript
{
  success: boolean,
  message: string  // 'Depósito registrado' o error
}
```

#### `withdraw({ monto, moneda, tasaCambio, descripcion, categoria_emergencia, fecha })`

**Propósito**: Registrar uso del fondo

**Proceso**:
1. Convertir a DOP si es USD
2. Validar `saldoActual >= monto` → Error si insuficiente
3. Confirmar con usuario (modal de advertencia)
4. Crear transacción con tipo `'retiro'`
5. Decrementar `saldoActual`
6. Registrar categoría de emergencia (obligatoria)

**Categorías de Emergencia**:
- 🏥 Salud
- 🏠 Vivienda
- 💼 Ingresos
- 📋 Otros

**Retorno**:
```javascript
{
  success: boolean,
  message: string  // 'Retiro registrado' o 'Saldo insuficiente'
}
```

#### `progress` (useMemo)

**Fórmula**:
```javascript
progress = min(100, (saldoActual / meta) × 100)
```

**Casos especiales**:
- Meta = 0 → progress = 0
- Saldo > Meta → progress = 100 (no excede)

#### `shouldAlert` (useMemo)

**Condiciones**:
```javascript
shouldAlert = (
  alertas_habilitadas === true &&
  meta > 0 &&
  saldoActual < (meta × umbral_alerta / 100)
)
```

**Default**: Alerta si saldo < 50% de meta

---

### 2.2 Componente: `EmergencyFundWidget.jsx`

**Propósito**: Vista compacta del fondo en Dashboard

**Props**:
```javascript
{
  meta: number,
  saldoActual: number,
  progress: number,
  shouldAlert: boolean,
  onOpenFund: Function  // Callback para abrir panel completo
}
```

**UI**:
- Tarjeta pequeña con título "Fondo de Emergencia"
- Saldo actual y meta
- Barra de progreso visual (verde/roja según alerta)
- Botón "Ver Fondo" para abrir panel completo
- Mensaje de alerta si `shouldAlert === true`

**Estilos condicionales**:
- `shouldAlert === true` → Fondo rojo (`bg-red-50`), barra roja
- `shouldAlert === false` → Fondo blanco, barra verde

---

### 2.3 Componente: `EmergencyFundPanel.jsx`

**Propósito**: Panel completo de gestión del fondo

**Props**:
```javascript
{
  fund: Object,              // Estado completo del fondo
  progress: number,
  shouldAlert: boolean,
  setMultiplier: Function,
  setManualMeta: Function,
  deposit: Function,
  withdraw: Function,
  getRateFromStorage: Function
}
```

**Secciones UI**:

#### 1. Alerta Global
- Banner rojo si `shouldAlert === true`
- Mensaje: "Tu fondo está por debajo del X% de la meta"

#### 2. Header con Exportación
- Título: "Fondo de Emergencia"
- Subtítulo: Saldo / Meta
- Botones:
  - 📊 Exportar CSV
  - 📁 Exportar JSON
  - 🖨️ PDF del Fondo (ventana de impresión)

#### 3. Barra de Progreso
- Visual con porcentaje
- Color verde (success)

#### 4. Cards de Información (Grid 3 columnas)
- **Meta calculada**: Monto recomendado + contexto ("Basada en gastos fijos últimos 3 meses")
- **Meta aplicada**: Monto actual + multiplicador
- **Saldo disponible**: Balance + fecha de última actualización

#### 5. Controles de Configuración (Grid 2 columnas)

**A. Ajuste de Multiplicador (3-6 meses)**
```html
<input type="range" min="3" max="6" step="1" />
```
Labels dinámicos:
- 3x: "Estabilidad básica"
- 4x: "Protección moderada"
- 5x: "Mayor protección"
- 6x: "Máxima seguridad"

**B. Meta Manual (Override)**
```html
<input type="number" placeholder="Ej: 50000" />
<button>Reset</button>
```
Útil si gastos fijos son irregulares o hay circunstancias especiales.

#### 6. Formularios de Transacción (Grid 2 columnas)

**Formulario Depósito**:
- Monto (number)
- Moneda (DOP/USD)
- Tasa de cambio (si USD)
- Descripción (opcional)
- Botón: "Depositar en Fondo" (verde)

**Formulario Retiro**:
- Monto (number)
- Moneda (DOP/USD)
- Tasa de cambio (si USD)
- Categoría emergencia (required, select)
- Descripción (required)
- Advertencia: "⚠️ Este fondo es para situaciones críticas"
- Confirmación: Modal `window.confirm()` antes de ejecutar
- Botón: "Usar Fondo" (rojo, disabled si saldo = 0)

#### 7. Historial de Transacciones
- Tabla con columnas: Fecha | Tipo | Monto DOP | Moneda | Categoría | Descripción
- Colores: Verde (depósito), Rojo (retiro)
- Mensaje si vacío: "Sin movimientos en el fondo"

#### 8. Banner Educativo (Condicional)
- Mostrar si `recommendedMeta === 0`
- Mensaje: "Registra al menos 1 mes de gastos fijos para calcular tu meta"
- Ejemplos: renta, servicios públicos, seguros, educación

---

### 2.4 Integración en `App.jsx`

**Hook principal**:
```javascript
const {
  fund,
  deposit: depositToFund,
  withdraw: withdrawFromFund,
  setMultiplier,
  setManualMeta,
  progress: fundProgress,
  shouldAlert: fundShouldAlert,
  getRateFromStorage
} = useEmergencyFund(finances.transactions);
```

**Widget en Dashboard**:
```jsx
<EmergencyFundWidget
  meta={fund.meta}
  saldoActual={fund.saldoActual}
  progress={fundProgress}
  shouldAlert={fundShouldAlert}
  onOpenFund={() => setShowFundPanel(true)}
/>
```

**Panel Modal/Completo**:
```jsx
{showFundPanel && (
  <EmergencyFundPanel
    fund={fund}
    progress={fundProgress}
    shouldAlert={fundShouldAlert}
    setMultiplier={setMultiplier}
    setManualMeta={setManualMeta}
    deposit={depositToFund}
    withdraw={withdrawFromFund}
    getRateFromStorage={getRateFromStorage}
  />
)}
```

**Alerta Global** (Si fondo bajo):
```jsx
{fundShouldAlert && (
  <div className="bg-red-50 border-red-200 text-red-800 p-4">
    ❗ Tu fondo de emergencia está por debajo del {fund.configuracion.umbral_alerta}%
  </div>
)}
```

---

## 3. Formato de Transacción

### Estructura de Transacción del Fondo

```javascript
{
  id: string,                    // UUID o timestamp
  tipo: 'deposito' | 'retiro',
  montoDOP: number,             // Monto en DOP (2 decimales)
  montoOriginal: number,        // Monto en moneda original
  monedaOriginal: 'DOP' | 'USD',
  tasaCambio: number,           // Tasa aplicada (inmutable)
  fecha: string,                // YYYY-MM-DD
  categoria_emergencia: string | null, // Solo para retiros
  descripcion: string           // Texto libre
}
```

**Ejemplo Depósito**:
```json
{
  "id": "abc123",
  "tipo": "deposito",
  "montoDOP": 5000.00,
  "montoOriginal": 5000.00,
  "monedaOriginal": "DOP",
  "tasaCambio": 63.52,
  "fecha": "2026-01-16",
  "categoria_emergencia": null,
  "descripcion": "Ahorro del bono navideño"
}
```

**Ejemplo Retiro**:
```json
{
  "id": "def456",
  "tipo": "retiro",
  "montoDOP": 3174.08,
  "montoOriginal": 50.00,
  "monedaOriginal": "USD",
  "tasaCambio": 63.48,
  "fecha": "2026-01-15",
  "categoria_emergencia": "Salud",
  "descripcion": "Consulta médica de emergencia"
}
```

---

## 4. Fórmulas Matemáticas

### 4.1 Cálculo de Meta Recomendada

```
Meta Recomendada = Promedio Mensual Gastos Fijos × Multiplicador

Donde:
  Promedio Mensual = Σ Gastos Fijos (últimos 3 meses) / Meses con datos
  Multiplicador = 3, 4, 5 o 6 (meses de cobertura)
  Gastos Fijos = Transacciones con tipo_gasto='fijo' o type='gasto-fijo'
```

**Ejemplo**:
```
Mes 1 (Nov): RD$ 25,000
Mes 2 (Dic): RD$ 27,000
Mes 3 (Ene): RD$ 26,000

Promedio = (25,000 + 27,000 + 26,000) / 3 = RD$ 26,000
Meta (3x) = RD$ 26,000 × 3 = RD$ 78,000
Meta (6x) = RD$ 26,000 × 6 = RD$ 156,000
```

### 4.2 Progreso del Fondo

```
Progreso (%) = (Saldo Actual / Meta) × 100
Límite superior: 100%
```

**Ejemplo**:
```
Saldo Actual = RD$ 50,000
Meta = RD$ 78,000
Progreso = (50,000 / 78,000) × 100 = 64.10%
```

### 4.3 Alerta de Fondo Bajo

```
Alerta SI:
  - Alertas habilitadas = true
  - Meta > 0
  - Saldo Actual < (Meta × Umbral / 100)

Umbral por defecto = 50%
```

**Ejemplo**:
```
Meta = RD$ 78,000
Umbral = 50%
Límite de alerta = RD$ 78,000 × 0.50 = RD$ 39,000

Si Saldo = RD$ 35,000 → ALERTA ❗
Si Saldo = RD$ 45,000 → OK ✅
```

### 4.4 Conversión Multi-moneda

```
Monto en DOP = Monto Original × Tasa de Cambio (si USD)
Monto en DOP = Monto Original (si DOP)
```

**Ejemplo**:
```
Depósito: USD 100.00
Tasa del día: 63.52
Monto DOP = 100 × 63.52 = RD$ 6,352.00
```

**Nota**: La tasa de cambio es **inmutable por transacción** (no se recalcula con fluctuaciones futuras).

---

## 5. Exportación y Reportes

### 5.1 Exportación CSV

**Formato**:
```csv
fecha,tipo,montoDOP,montoOriginal,monedaOriginal,tasaCambio,categoria,descripcion
2026-01-16,deposito,5000.00,5000.00,DOP,63.52,-,Ahorro bono
2026-01-15,retiro,3174.08,50.00,USD,63.48,Salud,Consulta médica
```

**Nombre archivo**: `fondo_emergencia.csv`

### 5.2 Exportación JSON

**Formato**:
```json
{
  "meta": 78000,
  "saldoActual": 50000,
  "multiplicador": 3,
  "recommendedMeta": 78000,
  "manualMeta": null,
  "lastComputation": {
    "monthsUsed": 3,
    "monthlyAverage": 26000,
    "totalFixed": 78000
  },
  "configuracion": {
    "alertas_habilitadas": true,
    "umbral_alerta": 50,
    "ultima_actualizacion_meta": "2026-01-16"
  },
  "transacciones": [ /* Array de transacciones */ ]
}
```

**Nombre archivo**: `fondo_emergencia.json`

### 5.3 Reporte Imprimible (PDF)

**Contenido** (window.print()):
- Título: "Reporte Fondo de Emergencia"
- Meta actual, Saldo, Progreso
- Meta recomendada con contexto (multiplicador, meses analizados)
- Tabla de transacciones (Fecha, Tipo, Monto DOP, Monto Original, Categoría, Descripción)
- Mensaje si no hay movimientos

**Estilo**: HTML simple con tabla estilizada (`border-collapse`, fuente Arial)

---

## 6. Validaciones y Reglas de Negocio

### 6.1 Validaciones de Depósito
- ✅ Monto debe ser > 0
- ✅ Moneda debe ser 'DOP' o 'USD'
- ✅ Si USD, tasa de cambio es obligatoria (> 0)
- ✅ Descripción es opcional

### 6.2 Validaciones de Retiro
- ✅ Monto debe ser > 0
- ✅ Monto debe ser ≤ Saldo Actual (no permite sobregiro)
- ✅ Descripción es obligatoria (requerida para auditoría)
- ✅ Categoría de emergencia es obligatoria
- ✅ Confirmación del usuario (modal de advertencia)

### 6.3 Reglas de Cálculo de Meta
- Meta mínima = 0 (si no hay gastos fijos)
- Multiplicador forzado a rango [3, 6]
- Meta manual override tiene prioridad sobre meta recomendada
- Actualización automática cuando:
  - Cambian las transacciones globales
  - Se ajusta el multiplicador
  - Se establece/elimina meta manual

### 6.4 Reglas de Alertas
- Solo alertar si alertas están habilitadas
- Solo alertar si meta > 0 (evita división por cero)
- Umbral por defecto = 50% (configurable)
- Alerta se muestra en Widget, Panel y Dashboard global

---

## 7. Integración con Purchase Assistant

El Fondo de Emergencia se integra con el sistema de análisis de compras (`usePurchaseAssistant.js`):

**Validación en Purchase Assistant**:
```javascript
// Calcular meses de cobertura DESPUÉS de la compra
const emergencyFundMonthsAfter = averageFixedExpenses > 0 
  ? (currentBalance - purchaseAmount) / averageFixedExpenses 
  : emergencyFundMonths;

// Alertar si cae por debajo de 6 meses
if (emergencyFundMonthsAfter < 6) {
  alerts.push({
    type: 'warning',
    message: `Tu fondo de emergencia bajará a ${emergencyFundMonthsAfter.toFixed(1)} meses`
  });
}
```

**Flujo**:
1. Usuario analiza compra en Purchase Assistant
2. Sistema verifica impacto en fondo de emergencia
3. Si fondo caerá < 6 meses → Alerta amarilla
4. Usuario puede ver estado actual del fondo desde widget
5. Puede aportar al fondo antes de realizar compra

---

## 8. Casos de Uso

### Caso 1: Usuario Nuevo (Sin Gastos Fijos)

**Escenario**: Usuario acaba de instalar la app

**Estado del Fondo**:
```javascript
{
  meta: 0,
  recommendedMeta: 0,
  saldoActual: 0,
  lastComputation: { monthsUsed: 0, monthlyAverage: 0 }
}
```

**UI**:
- Widget muestra "Meta no disponible"
- Panel muestra banner educativo: "Registra al menos 1 mes de gastos fijos"
- Progreso = 0%
- No hay alertas

**Acción**: Usuario debe registrar gastos fijos (renta, servicios, etc.) durante al menos 1 mes.

---

### Caso 2: Usuario con Datos Incompletos (1-2 meses)

**Escenario**: Usuario tiene gastos fijos de 1-2 meses

**Estado del Fondo**:
```javascript
{
  meta: 72000,              // 24,000 × 3
  recommendedMeta: 72000,
  saldoActual: 20000,
  lastComputation: { 
    monthsUsed: 2, 
    monthlyAverage: 24000,
    totalFixed: 48000 
  }
}
```

**UI**:
- Meta visible (calculada con datos disponibles)
- Progreso = 27.78% (20,000 / 72,000)
- Alerta activa (< 50% de meta)
- Banner: "Tu fondo está por debajo del 50%"

**Acción**: Sistema usa promedio de meses disponibles (extrapolación).

---

### Caso 3: Usuario Establecido (3+ meses)

**Escenario**: Usuario con historial completo de gastos

**Estado del Fondo**:
```javascript
{
  meta: 156000,             // 26,000 × 6
  recommendedMeta: 156000,
  saldoActual: 95000,
  multiplicador: 6,
  lastComputation: { 
    monthsUsed: 3, 
    monthlyAverage: 26000,
    totalFixed: 78000 
  }
}
```

**UI**:
- Meta precisa (26,000/mes × 6 meses)
- Progreso = 60.90%
- Alerta activa (< 100%, pero puede ajustar umbral)
- Sugerencia: "Aporta RD$ 61,000 más para completar meta"

---

### Caso 4: Emergencia Real (Retiro del Fondo)

**Escenario**: Usuario necesita pagar consulta médica urgente

**Proceso**:
1. Usuario abre EmergencyFundPanel
2. Va a formulario "Usar Fondo"
3. Ingresa:
   - Monto: USD 50.00
   - Moneda: USD
   - Tasa: 63.48
   - Categoría: Salud
   - Descripción: "Consulta médica de emergencia"
4. Hace clic en "Usar Fondo"
5. Modal de confirmación: "⚠️ Esto reducirá tu fondo. ¿Estás seguro?"
6. Confirma → Retiro registrado
7. Saldo actualizado: RD$ 95,000 - RD$ 3,174.08 = RD$ 91,825.92
8. Transacción aparece en historial

**Resultado**:
- Progreso baja a 58.86%
- Alerta sigue activa
- Categoría "Salud" registrada para análisis futuro

---

### Caso 5: Ajuste de Multiplicador

**Escenario**: Usuario quiere aumentar seguridad de 3x a 6x

**Proceso**:
1. Usuario abre EmergencyFundPanel
2. Desliza control de multiplicador de 3 a 6
3. Sistema recalcula automáticamente:
   - Meta anterior: RD$ 78,000 (26,000 × 3)
   - Meta nueva: RD$ 156,000 (26,000 × 6)
4. Progreso actualizado: 50,000 / 156,000 = 32.05%
5. Alerta se activa (< 50%)

**UI**:
- Label cambia: "3x: Estabilidad básica" → "6x: Máxima seguridad"
- Cards actualizadas con nueva meta
- Barra de progreso se ajusta visualmente

---

### Caso 6: Meta Manual (Override)

**Escenario**: Usuario freelancer con ingresos irregulares

**Problema**: Gastos fijos varían mucho mes a mes, meta calculada no refleja realidad.

**Solución**:
1. Usuario abre EmergencyFundPanel
2. Va a "Ajuste manual de meta"
3. Ingresa: 120,000 (basado en análisis personal)
4. Hace clic fuera del input → Meta se actualiza
5. Sistema aplica meta manual en lugar de recomendada

**Estado**:
```javascript
{
  meta: 120000,             // Meta manual
  recommendedMeta: 78000,   // Se mantiene para referencia
  manualMeta: 120000,       // Override activo
  saldoActual: 50000
}
```

**UI**:
- Card "Meta aplicada" muestra: RD$ 120,000 (manual)
- Card "Meta calculada" muestra: RD$ 78,000 (referencia)
- Botón "Reset" disponible para volver a meta automática

**Reset**: Click en "Reset" → `manualMeta = null`, meta vuelve a recomendada.

---

## 9. Testing Manual

### Test 1: Cálculo de Meta con Datos Completos
```
1. Registrar gastos fijos en últimos 3 meses:
   - Nov: RD$ 25,000
   - Dic: RD$ 27,000
   - Ene: RD$ 26,000
2. Abrir EmergencyFundPanel
3. Verificar:
   ✓ Meta calculada = RD$ 78,000 (26,000 × 3)
   ✓ Meses analizados = 3
   ✓ Promedio mensual = RD$ 26,000
```

### Test 2: Depósito en DOP
```
1. Abrir formulario "Aportar Ahora"
2. Ingresar:
   - Monto: 5000
   - Moneda: DOP
   - Descripción: "Ahorro del bono"
3. Click "Depositar en Fondo"
4. Verificar:
   ✓ Mensaje: "Depósito registrado"
   ✓ Saldo incrementa en RD$ 5,000
   ✓ Transacción aparece en historial
```

### Test 3: Depósito en USD
```
1. Abrir formulario "Aportar Ahora"
2. Ingresar:
   - Monto: 100
   - Moneda: USD
   - Tasa: 63.52
   - Descripción: "Dólares ahorrados"
3. Click "Depositar en Fondo"
4. Verificar:
   ✓ Saldo incrementa en RD$ 6,352.00 (100 × 63.52)
   ✓ Historial muestra "USD 100" y "RD$ 6,352.00"
```

### Test 4: Retiro con Confirmación
```
1. Abrir formulario "Usar Fondo"
2. Ingresar:
   - Monto: 50
   - Moneda: USD
   - Tasa: 63.48
   - Categoría: Salud
   - Descripción: "Consulta médica"
3. Click "Usar Fondo"
4. Verificar:
   ✓ Modal de confirmación aparece
   ✓ Si acepta → Saldo disminuye en RD$ 3,174.08
   ✓ Transacción con tipo "retiro" y categoría "Salud"
```

### Test 5: Retiro con Saldo Insuficiente
```
1. Configurar saldo actual = RD$ 2,000
2. Intentar retirar RD$ 5,000
3. Verificar:
   ✓ Mensaje de error: "Saldo insuficiente en el Fondo de Emergencia"
   ✓ Saldo no cambia
   ✓ No se crea transacción
```

### Test 6: Ajuste de Multiplicador
```
1. Multiplicador inicial = 3
2. Deslizar a 6
3. Verificar:
   ✓ Meta duplica (78,000 → 156,000)
   ✓ Progreso se ajusta
   ✓ Label cambia a "Máxima seguridad"
   ✓ LocalStorage actualiza
```

### Test 7: Meta Manual
```
1. Ingresar meta manual: 120000
2. Verificar:
   ✓ Meta aplicada = RD$ 120,000
   ✓ Meta calculada sigue mostrando recomendada (78,000)
3. Click "Reset"
4. Verificar:
   ✓ Meta vuelve a RD$ 78,000
   ✓ manualMeta = null
```

### Test 8: Alerta de Fondo Bajo
```
1. Configurar:
   - Meta = RD$ 78,000
   - Saldo = RD$ 35,000 (< 50%)
2. Verificar:
   ✓ Widget tiene fondo rojo
   ✓ Barra de progreso roja
   ✓ Banner: "Tu fondo está por debajo del 50%"
3. Depositar RD$ 10,000
4. Verificar:
   ✓ Alerta desaparece si saldo >= 50%
```

### Test 9: Exportación CSV
```
1. Registrar 3 transacciones (2 depósitos, 1 retiro)
2. Click "📊 Exportar CSV"
3. Verificar:
   ✓ Archivo descargado: fondo_emergencia.csv
   ✓ Header correcto
   ✓ 3 filas de datos
   ✓ Formato: fecha,tipo,montoDOP,...
```

### Test 10: Exportación JSON
```
1. Click "📁 Exportar JSON"
2. Verificar:
   ✓ Archivo descargado: fondo_emergencia.json
   ✓ Estructura completa del fondo
   ✓ JSON válido (parseable)
```

### Test 11: Reporte Imprimible
```
1. Click "🖨️ PDF del Fondo"
2. Verificar:
   ✓ Ventana de impresión se abre
   ✓ Título "Reporte Fondo de Emergencia"
   ✓ Tabla con todas las transacciones
   ✓ Información de meta y saldo
```

### Test 12: Banner Educativo (Sin Gastos)
```
1. Eliminar todos los gastos fijos
2. Abrir EmergencyFundPanel
3. Verificar:
   ✓ Banner amarillo aparece
   ✓ Mensaje: "Registra al menos 1 mes de gastos fijos"
   ✓ Ejemplos: renta, servicios, seguros
```

---

## 10. Compatibilidad

### 10.1 Navegadores
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+

### 10.2 Dispositivos
- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1023px)
- ✅ Móvil (320px - 767px)

### 10.3 Dark Mode
- ✅ Widget adapta colores
- ✅ Panel con estilos dark/light
- ✅ Inputs con contraste adecuado
- ✅ Tablas legibles en ambos modos

---

## 11. Seguridad y Privacidad

### 11.1 Almacenamiento
- ✅ LocalStorage: `fondoEmergencia` (texto plano, no sensible)
- ✅ Backup/Restore cifrado con AES-256 (existente en app)
- ✅ No se envían datos a servidores externos

### 11.2 Validaciones
- ✅ Montos validados (> 0, < 10,000,000)
- ✅ Prevención de sobregiro (retiro > saldo)
- ✅ Confirmación obligatoria para retiros
- ✅ Categoría de emergencia requerida para auditoría

### 11.3 Integridad
- ✅ Tasas de cambio inmutables por transacción
- ✅ IDs únicos (UUID o timestamp)
- ✅ Historial completo sin borrado

---

## 12. Próximas Mejoras (Roadmap)

### Fase 2
- [ ] Gráficos de tendencia del fondo (LineChart)
- [ ] Proyección de tiempo para alcanzar meta
- [ ] Notificaciones push cuando se alcanza meta
- [ ] Comparativa con benchmarks (promedio usuarios)
- [ ] Sugerencias automáticas de aporte mensual

### Fase 3
- [ ] Integración con metas de ahorro (destinar % a fondo)
- [ ] Análisis de categorías de emergencia (reportes)
- [ ] Configuración de múltiples umbrales de alerta
- [ ] Exportación a Excel con gráficos
- [ ] API para compartir con asesores financieros

---

## 13. Métricas de Éxito

| Métrica | Baseline | Meta 3 meses |
|---|---|---|
| % usuarios con fondo > 0 | 0% | 60% |
| Saldo promedio del fondo | RD$ 0 | RD$ 50,000 |
| % usuarios con meta completa (100%) | 0% | 25% |
| Retiros de emergencia/mes | 0 | 2-3 (esperado) |
| Tasa de uso del multiplicador 6x | 0% | 40% |

---

## 14. Documentación Relacionada

- [IMPLEMENTATION_SUMMARY.md](../../IMPLEMENTATION_SUMMARY.md) - Resumen de implementación general
- [SYSTEM_ARCHITECTURE.md](../../SYSTEM_ARCHITECTURE.md) - Arquitectura del sistema
- [purchase-assistant/SPEC.md](../purchase-assistant/SPEC.md) - Integración con análisis de compras

---

## 15. Contacto y Soporte

**Código Principal**:
- Hook: [src/hooks/useEmergencyFund.js](../../../src/hooks/useEmergencyFund.js)
- Widget: [src/components/EmergencyFundWidget.jsx](../../../src/components/EmergencyFundWidget.jsx)
- Panel: [src/components/EmergencyFundPanel.jsx](../../../src/components/EmergencyFundPanel.jsx)

**Preguntas Frecuentes**:

1. **¿Por qué mi meta es 0?**
   → Necesitas registrar al menos 1 mes de gastos fijos.

2. **¿Cómo cambio el umbral de alerta?**
   → Actualmente fijo en 50%. Configuración manual vendrá en Fase 2.

3. **¿Puedo tener meta negativa?**
   → No, el sistema clamp a 0 si no hay gastos.

4. **¿Los retiros afectan el balance general?**
   → No, el fondo es independiente. Son transacciones internas del fondo.

5. **¿Puedo usar el fondo para ahorros normales?**
   → No recomendado. El fondo es exclusivo para emergencias. Usa "Metas de Ahorro" para otros objetivos.

---

**Implementación completada**: 16 de enero de 2026  
**Desarrollador**: AI Assistant (GitHub Copilot)  
**Versión**: 1.0.0  
**Estado**: ✅ Operativo y Documentado
