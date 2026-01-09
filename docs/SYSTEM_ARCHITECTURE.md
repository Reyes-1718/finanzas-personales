# 🏗️ ARQUITECTURA DEL SISTEMA - Finanzas Personales

**Documento Técnico Profesional**  
**Versión:** 1.0.0  
**Fecha:** 4 de Enero de 2026  
**Propósito:** Especificación técnica completa para implementaciones futuras

---

## 📑 Tabla de Contenidos

1. [Visión General del Sistema](#visión-general-del-sistema)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitectura de Capas](#arquitectura-de-capas)
4. [Modelo de Datos](#modelo-de-datos)
5. [Lógica de Negocio Detallada](#lógica-de-negocio-detallada)
6. [Gestión de Estado Global](#gestión-de-estado-global)
7. [Flujos de Datos](#flujos-de-datos)
8. [Hooks Personalizados](#hooks-personalizados)
9. [Componentes Principales](#componentes-principales)
10. [Persistencia y Seguridad](#persistencia-y-seguridad)
11. [Cálculos Financieros](#cálculos-financieros)
12. [Patrones y Prácticas](#patrones-y-prácticas)

---

## 🎯 Visión General del Sistema

### Propósito
Sistema de gestión financiera personal web basado en React que permite a los usuarios:
- Registrar ingresos y gastos
- Visualizar resúmenes y análisis
- Establecer presupuestos y metas
- Generar reportes
- Tomar decisiones financieras informadas

### Público Objetivo
- Usuarios individuales (personas naturales)
- Gestión de finanzas domésticas
- Análisis de patrones de gasto

### Características Clave
- **Multi-moneda**: USD y RD$ (Pesos Dominicanos)
- **Análisis avanzado**: Estadísticas, proyecciones, tendencias
- **Datos cifrados**: Encriptación AES-256 en LocalStorage
- **Interfaz responsiva**: Móvil, tablet, desktop
- **Offline-first**: Funciona sin conexión internet
- **Presupuestos inteligentes**: Cálculo automático basado en ingresos
- **Alertas**: Notificaciones de límites excedidos

---

## 🛠️ Stack Tecnológico

### Frontend Framework
- **React 19.1.0**: Framework UI con hooks modernos
- **Vite 7.3**: Build tool y dev server
- **React DOM 19.1.0**: Rendering a DOM

### Estilos y UI
- **Tailwind CSS 3.4.0**: Framework CSS utility-first
- **PostCSS 8.4.32**: Procesador de CSS con autoprefixer
- **Responsive Design**: Mobile-first approach

### Gráficos y Visualización
- **Recharts 2.10.3**: Librería de gráficos React
  - Pie charts para distribución de gastos
  - Bar charts para análisis
  - Tooltips y leyendas interactivas

### Seguridad y Encriptación
- **CryptoJS 4.2.0**: Encriptación AES-256
- **LocalStorage API**: Almacenamiento local del navegador

### Desarrollo
- **Vite Plugin React**: Soporte para JSX rápido
- **ESLint**: Linting (configurado en eslint.config.js)
- **TypeScript Support**: Tipado opcional

### Deployment
- **gh-pages 6.1.0**: Publicación en GitHub Pages
- **npm scripts**: Automatización de build y deploy

### Testing y QA
- **Playwright 1.40.0**: Testing E2E automatizado
- **Kill-port 2.0.1**: Limpieza de puertos en testing
- **Wait-on 9.0.3**: Espera de servicios en pruebas
- **Bash Scripts**: Automatización de testing workflow

---

## 🏛️ Arquitectura de Capas

```
┌─────────────────────────────────────────────┐
│         PRESENTACIÓN (UI Layer)              │
│  Dashboard │ Forms │ Charts │ Tables │ FAB   │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│      LÓGICA DE NEGOCIO (Logic Layer)         │
│  Custom Hooks │ Cálculos │ Transformaciones  │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│      GESTIÓN DE ESTADO (State Layer)         │
│  useState │ useEffect │ useCallback           │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│    PERSISTENCIA (Data Layer)                 │
│  LocalStorage │ Encriptación AES │ JSON     │
└─────────────────────────────────────────────┘
```

### Capas Detalladas

#### 1. Capa de Presentación
- Componentes React reutilizables
- Gestión de UI state (mobile/desktop, tema, etc)
- Manejo de eventos de usuario
- Renderizado condicional y responsivo

#### 2. Capa de Lógica de Negocio
- Hooks personalizados (`useFinancesData`, `useBudgets`, etc)
- Cálculos financieros (balance, proyecciones)
- Transformación de datos
- Reglas de negocio (presupuestos 40%, alertas, etc)

#### 3. Capa de Estado
- React Hooks API (useState, useEffect)
- Sincronización de estado
- Ciclo de vida de componentes

#### 4. Capa de Persistencia
- LocalStorage como base de datos
- Encriptación AES-256 con CryptoJS
- Serialización/Deserialización JSON

---

## 💾 Modelo de Datos

### 1. Estructura de Transacción
```javascript
{
  id: "1704355200000",                    // Timestamp como ID único
  amount: "1500.00",                       // Monto en string para precisión
  type: "ingreso" | "gasto-fijo" | "gasto-variable",
  category: "Salario" | "Alimentación" | ...,
  currency: "DOP" | "USD",                // Moneda de registro
  description: "Descripción de la transacción",
  date: "2024-01-04",                     // Formato YYYY-MM-DD
  incomeType: "sueldo" | "extra",         // Solo para ingresos
  paymentMethod: "efectivo" | "tarjeta" | "transferencia" | "cheque",
  exchangeRate: 63.52,                    // Tasa de cambio grabada en el momento de creación (si USD)
  isRecurring: false                      // Flag para identificar transacciones recurrentes
}
```

**📌 Nota sobre Moneda y Tasa de Cambio:**  
El campo `currency` indica la moneda de registro, y `exchangeRate` graba la tasa de cambio en el momento de creación para garantizar inmutabilidad histórica. Para entender completamente cómo funciona el sistema bimoneda (DOP/USD), incluyendo la regla de inmutabilidad de tasas, consulta [BUSINESS_RULES/BIMONEDA_SYSTEM.md](../BUSINESS_RULES/BIMONEDA_SYSTEM.md).

### 2. Estructura de Transacción Recurrente
```javascript
{
  id: "1704355200001",
  amount: "500.00",
  type: "gasto-variable",
  category: "Transporte",
  currency: "DOP",
  description: "Transporte semanal",
  frequency: "semanal" | "diaria" | "quincenal" | "mensual" | "anual",
  createdAt: "2024-01-04",
  lastProcessed: "2024-01-04",
  active: true,                           // Permite pausar sin eliminar
  incomeType: "sueldo",                   // Solo para ingresos
  paymentMethod: "efectivo"
}
```

### 3. Estructura de Presupuesto
```javascript
{
  key: "Alimentación-2024-0",              // Clave única: categoria-año-mes
  category: "Alimentación",
  amount: 3000.00,                         // Límite mensual en DOP
  month: 0,                                // 0-11
  year: 2024
}
```

### 4. Estructura de Meta de Ahorro
```javascript
{
  id: "1704355200002",
  name: "Vacaciones",
  targetAmount: 5000.00,                   // Monto objetivo en DOP
  deadline: "2024-06-30",                  // Fecha límite (YYYY-MM-DD)
  category: "Viajes",
  createdAt: "2024-01-04",
  achieved: false,
  monthlyIncome: 10000.00,                 // Ingreso mensual para cálculo
  savingsCalculation: {
    monthlySavings: 833.33,                // Lo que debe ahorrar mensualmente
    percentageOfIncome: 8.33,              // Porcentaje del ingreso
    monthsRemaining: 6,
    isAchievable: true                     // Es posible alcanzar
  }
}
```

### 5. Estructura de Alerta
```javascript
{
  id: "1704355200003",
  type: "warning" | "error" | "info",
  message: "Has excedido el presupuesto de Alimentación",
  timestamp: 1704355200000,
  dismissed: false
}
```

### 6. Estado Global de la Aplicación
```javascript
{
  transactions: [],                        // Array de transacciones
  recurringTransactions: [],               // Array de transacciones recurrentes
  incomeCategories: [                      // Categorías de ingresos
    "Salario", "Freelance", "Inversiones", "Bonos", "Propinas", 
    "Ventas", "Alquiler", "Otros Ingresos"
  ],
  expenseCategories: [                     // Categorías de gastos
    "Alimentación", "Transporte", "Vivienda", "Servicios", 
    "Entretenimiento", "Salud", "Educación", "Ropa", 
    "Tecnología", "Otros Gastos"
  ]
}
```

---

## 💡 Lógica de Negocio Detallada

### 1. Gestión de Transacciones

#### Flujo de Creación de Transacción
```
Usuario submits form
       ↓
Validar campos (monto, categoría)
       ↓
Generar ID único (Date.now())
       ↓
Asignar fecha (actual si no especifica)
       ↓
Guardar en estado React
       ↓
Sincronizar con LocalStorage (encriptado)
       ↓
Notificar UI (cambiar a dashboard)
```

#### Reglas de Validación
- Monto > 0
- Categoría no vacía
- Fecha en formato YYYY-MM-DD
- Tipo debe ser válido
- Descripción opcional pero recomendada

#### Tipos de Transacciones
| Tipo | Uso | Restricción |
|------|-----|-------------|
| `ingreso` | Dinero que entra | Requiere `incomeType` |
| `gasto-fijo` | Gastos recurrentes | Incluidos en proyección |
| `gasto-variable` | Gastos ocasionales | Se promedian 3 meses |

### 2. Sistema de Moneda Dual

#### Tasa de Cambio
- Almacenada en `localStorage` con clave `exchange_rate_usd_dop`
- Valor por defecto: 63.52 DOP por USD
- Actualizable manualmente desde widget

#### Conversión de Monedas
```javascript
convertToDOP(amount, currency) {
  const rate = localStorage.get('exchange_rate_usd_dop') || 63.52
  if (currency === 'USD') {
    return parseFloat(amount) * rate
  }
  return parseFloat(amount)  // Si ya es DOP
}
```

#### Almacenamiento de Moneda
- Cada transacción registra su moneda original
- Los cálculos siempre convierten a DOP
- Los reportes muestran en ambas monedas

### 3. Cálculo de Balance

#### Balance Mensual
```javascript
balance = Σ(ingresos) - Σ(gastos-fijos) - Σ(gastos-variables)

Para transacciones de mes seleccionado:
1. Filtrar transacciones por mes/año
2. Convertir cada monto a DOP
3. Sumar ingresos
4. Restar gastos (ambos tipos)
5. Retornar diferencia
```

#### Balance Acumulado
- Suma de balances de todos los meses
- Indica patrimonio histórico acumulado

### 4. Presupuestos (Regla 40/40/20)

#### Distribución Recomendada
- **40% Necesidades**: Vivienda, servicios, alimentación
- **40% Deseos**: Entretenimiento, ropa, tecnología
- **20% Ahorros**: Metas de ahorro, fondo de emergencia

#### Presupuesto Automático
```javascript
getAutoBudgetAmount(monthlyIncome) {
  return monthlyIncome * 0.40  // 40% del ingreso mensual
}

getSuggestedBudgets(monthlyIncome, expenseCategories) {
  const totalBudget = monthlyIncome * 0.40
  const perCategory = totalBudget / expenseCategories.length
  return Array de presupuestos distribuidos equitativamente
}
```

#### Seguimiento de Presupuesto
```javascript
Gasto real vs Presupuesto:
- Si gasto < presupuesto → Verde (OK)
- Si gasto = presupuesto → Naranja (Límite)
- Si gasto > presupuesto → Rojo (Excedido)

Porcentaje utilizado = (gasto / presupuesto) * 100%
```

### 5. Metas de Ahorro

#### Cálculo de Ahorro Periódico
```javascript
calculatePeriodicSavings(targetAmount, deadline, monthlyIncome) {
  const monthsRemaining = diferencia de meses entre hoy y deadline
  const monthlySavings = targetAmount / monthsRemaining
  const percentageOfIncome = (monthlySavings / monthlyIncome) * 100
  
  return {
    monthlySavings,           // Cantidad a ahorrar mensualmente
    percentageOfIncome,       // % del ingreso que representa
    monthsRemaining,          // Meses hasta la fecha límite
    isAchievable: percentageOfIncome <= 100
  }
}
```

#### Validación de Viabilidad
- Alcanzable: Si el % del ingreso ≤ 100%
- No alcanzable: Si requiere más del 100% del ingreso
- Información visual para usuario

### 6. Proyección de Gastos

#### Lógica de Proyección
```javascript
calculateProjection() {
  // Período: últimos 3 meses
  recentTransactions = obtener últimas 3 meses
  
  // Gastos fijos
  fixedExpenses = Σ(gasto-fijo) / 3 = promedio mensual fijo
  
  // Gastos variables
  variableExpensesByMonth = agrupar por mes
  avgVariableExpenses = promedio de variables por mes
  
  // Total proyectado
  totalProjection = fixedExpenses + avgVariableExpenses
  
  return { fixedExpenses, avgVariableExpenses, totalProjection }
}
```

#### Interpretación
- Se usa para planificación del próximo mes
- Compara gasto proyectado vs presupuesto
- Ayuda a detectar tendencias de gasto

### 7. Transacciones Recurrentes

#### Frecuencias Soportadas
- `diaria`: Se procesa cada 24 horas
- `semanal`: Se procesa cada 7 días
- `quincenal`: Se procesa cada 15 días
- `mensual`: Se procesa cada mes (mismo día)
- `anual`: Se procesa cada año

#### Procesamiento
```javascript
processRecurringTransactions() {
  Para cada transacción recurrente activa:
    1. Obtener fecha de último procesamiento
    2. Calcular próxima fecha según frecuencia
    3. Si hoy >= próxima fecha:
       a. Crear transacción ordinaria
       b. Actualizar lastProcessed
       c. Marcar como procesada
    4. Retornar número de procesadas
}
```

#### Activación/Pausación
- Las transacciones recurrentes pueden pausarse sin eliminar
- Flag `active` controla si se procesan
- Útil para cambios temporales (ej: suscripción pausada)

### 8. Sistema de Búsqueda Avanzada

#### Criterios Disponibles
```javascript
{
  description: "texto",           // Búsqueda parcial
  category: "Alimentación",       // Filtro exacto
  type: "gasto-variable",         // Filtro por tipo
  currency: "USD",                // Filtro por moneda
  paymentMethod: "tarjeta",       // Filtro por método
  minAmount: 100,                 // Rango mínimo
  maxAmount: 1000,                // Rango máximo
  startDate: "2024-01-01",        // Rango de fechas
  endDate: "2024-01-31"
}
```

#### Lógica de Búsqueda
```javascript
searchTransactions(criteria) {
  return transactions.filter(t => {
    Verificar TODOS los criterios especificados:
    - Si criterio NO cumple → excluir
    - Si todos cumplen → incluir
  })
}
```

---

## 🎛️ Gestión de Estado Global

### Hook Principal: `useFinancesData`

#### Estado Manejado
```javascript
{
  data: {
    transactions: [],
    recurringTransactions: [],
    incomeCategories: [],
    expenseCategories: []
  },
  loading: true  // Inicial mientras se cargan datos
}
```

#### Ciclo de Vida
```
Montaje
  ↓
Cargar datos de localStorage (desencriptar)
  ↓
Establecer loading = false
  ↓
En cada cambio de data: sincronizar con localStorage
  ↓
Desmontaje
  ↓
Limpiar listeners
```

#### Validación de Datos al Cargar
```javascript
Intenta desencriptar datos del localStorage
Si desencriptación falla → Usa estado inicial
Si no existen datos → Usa estado inicial
Preserva categorías predeterminadas
Mantiene estructura de datos válida
```

### Otros Hooks Especializados

#### `useTheme`
- Gestiona tema oscuro/claro
- Persiste preferencia en localStorage
- Aplica clase `dark` al DOM

#### `useBudgets`
- Almacena presupuestos mensuales
- Clave única: `${categoria}-${year}-${month}`
- Permite get/set/delete de presupuestos

#### `useSavingsGoals`
- Almacena metas de ahorro
- Calcula ahorro periódico requerido
- Marca metas alcanzadas/no alcanzadas

#### `useAlerts`
- Gestiona notificaciones del sistema
- Alertas automáticas de presupuestos excedidos
- Permite descartar alertas individuales

---

## 🔄 Flujos de Datos

### Flujo 1: Agregar Transacción

```
Usuario llena formulario en TransactionForm
              ↓
Click en "Agregar"
              ↓
handleAddTransaction (App.jsx)
              ↓
addTransaction (useFinancesData)
              ↓
Crear objeto transacción con ID
              ↓
setData([...transactions, nueva])
              ↓
useEffect sínc → encriptar y guardar en localStorage
              ↓
Re-render Dashboard con nueva transacción
              ↓
Usuario ve cambios actualizados
```

### Flujo 2: Cambiar Mes/Año

```
Usuario selecciona mes/año en selector
              ↓
handleMonthChange / handleYearChange (App.jsx)
              ↓
setSelectedDate({ month, year })
              ↓
useEffect en Dashboard detecta cambio
              ↓
monthTransactions = getTransactionsByMonth(year, month)
              ↓
balance = calculateBalance(monthTransactions)
              ↓
Re-render con nuevos datos del mes
              ↓
Gráficos y tabla se actualizan
```

### Flujo 3: Buscar Transacciones

```
Usuario completa criterios en SearchFilter
              ↓
Click en "Buscar"
              ↓
handleSearch (App.jsx)
              ↓
searchTransactions(criteria) (useFinancesData)
              ↓
Filtrar contra todos los criteria
              ↓
setSearchResults(resultados)
              ↓
setActiveTab('search')
              ↓
Mostrar tabla de resultados
```

### Flujo 4: Sincronizar Datos

```
Cambio en data (cualquier operación)
              ↓
setData dispara
              ↓
useEffect detecta [data, loading]
              ↓
Si !loading:
  - Encriptar data con CryptoJS
  - Guardar en localStorage bajo STORAGE_KEY
              ↓
En siguiente acceso a app:
  - Recuperar y desencriptar
  - Restaurar estado completo
```

---

## 🎣 Hooks Personalizados

### 1. `useFinancesData.js` - Hook Principal

**Propósito**: Gestión centralizada de datos financieros con persistencia

**Funciones Exportadas**:

#### Gestión de Transacciones
| Función | Parámetros | Retorno | Descripción |
|---------|-----------|--------|-------------|
| `addTransaction` | `transaction` | void | Agrega nueva transacción |
| `deleteTransaction` | `id` | void | Elimina transacción |
| `updateTransaction` | `id, updatedTransaction` | void | Actualiza transacción |
| `getTransactionsByMonth` | `year, month` | `Transaction[]` | Filtra por periodo |

#### Gestión de Categorías
| Función | Parámetros | Retorno | Descripción |
|---------|-----------|--------|-------------|
| `addIncomeCategory` | `category` | void | Agrega categoría de ingreso |
| `addExpenseCategory` | `category` | void | Agrega categoría de gasto |

#### Transacciones Recurrentes
| Función | Parámetros | Retorno | Descripción |
|---------|-----------|--------|-------------|
| `addRecurringTransaction` | `recurringData` | void | Crea transacción recurrente |
| `updateRecurringTransaction` | `id, updatedData` | void | Actualiza recurrente |
| `deleteRecurringTransaction` | `id` | void | Elimina recurrente |
| `processRecurringTransactions` | none | `processedIds` | Procesa las debidas |

#### Cálculos Financieros
| Función | Parámetros | Retorno | Descripción |
|---------|-----------|--------|-------------|
| `calculateBalance` | `transactions` | `number` | Ingresos - Gastos |
| `calculateProjection` | none | `object` | Proyección para próx mes |
| `getExchangeRate` | none | `number` | Lee tasa de cambio |
| `convertToDOP` | `amount, currency` | `number` | Convierte a DOP |

#### Análisis y Estadísticas
| Función | Parámetros | Retorno | Descripción |
|---------|-----------|--------|-------------|
| `getAdvancedStats` | `transactions` | `object` | Estadísticas detalladas |
| `getDailyExpenses` | `year, month` | `array` | Gastos agrupados por día |
| `searchTransactions` | `criteria` | `Transaction[]` | Búsqueda multi-criterio |

#### Importar/Exportar
| Función | Parámetros | Retorno | Descripción |
|---------|-----------|--------|-------------|
| `exportData` | none | void | Descarga JSON de datos |
| `importData` | `jsonData` | `object` | Importa datos de archivo |
| `clearAllData` | none | void | Reset completo (BE CAREFUL) |

---

### 2. `useBudgets.js` - Gestión de Presupuestos

**Propósito**: Control de presupuestos mensuales por categoría

**Funciones**:

```javascript
// Getter
getBudget(category, month, year) → number

// Setter
setBudget(category, amount, month, year) → void

// Listar
getAllBudgetsForMonth(month, year) → Budget[]

// Eliminar
deleteBudget(category, month, year) → void

// Cálculos inteligentes
getAutoBudgetAmount(monthlyIncome) → number
getSuggestedBudgets(monthlyIncome, categories) → SuggestedBudget[]
applyAutoBudgets(monthlyIncome, categories, month, year) → void
```

**Almacenamiento**: LocalStorage bajo clave `monthly_budgets`

---

### 3. `useSavingsGoals.js` - Metas de Ahorro

**Propósito**: Gestión de objetivos de ahorro con cálculo de viabilidad

**Funciones**:

```javascript
// Crear
addGoal(goal) → Goal

// Actualizar
updateGoal(id, updatedGoal) → void

// Eliminar
deleteGoal(id) → void

// Obtener
getGoalProgress(id) → object

// Cálculos
calculatePeriodicSavings(target, deadline, income) → SavingsCalc
```

**Almacenamiento**: LocalStorage bajo clave `savings_goals`

---

### 4. `useTheme.js` - Gestor de Tema

**Propósito**: Control de tema oscuro/claro

**Funciones**:

```javascript
// Estado
isDark: boolean

// Control
toggleTheme() → void
setDarkMode(value) → void
```

---

### 5. `useAlerts.js` - Sistema de Alertas

**Propósito**: Notificaciones del sistema

**Funciones**:

```javascript
// Gestión
addAlert(type, message) → void
dismissAlert(id) → void

// Configuración
getSettings() → object
updateSettings(settings) → void
```

---

## 🎨 Componentes Principales

### 1. App.jsx - Componente Raíz

**Responsabilidades**:
- Orquestación global de la aplicación
- Gestión de pestaña activa
- Navegación entre secciones
- Detección de cambios de tamaño (responsive)
- Integración de todos los hooks

**Props Pasados a Componentes**:
```jsx
// Dashboard
<Dashboard 
  transactions={transactions}
  selectedMonth={month}
  selectedYear={year}
  calculateBalance={calculateBalance}
  deleteTransaction={deleteTransaction}
/>

// TransactionForm
<TransactionForm
  onAddTransaction={handleAddTransaction}
  onAddRecurring={addRecurringTransaction}
  incomeCategories={incomeCategories}
  expenseCategories={expenseCategories}
  addIncomeCategory={addIncomeCategory}
  addExpenseCategory={addExpenseCategory}
/>
```

**Estructura de Navegación**:
```
Sidebar (Desktop)
├── Dashboard
├── Transacciones
├── Gastos Diarios
├── Proyección
├── Metas
├── Presupuestos
├── Estadísticas
├── Calendario
├── Reportes
├── Alertas
├── Buscar
└── Backup

FloatingNav (Móvil)
└── Mismo orden en FAB circular
```

---

### 2. Dashboard.jsx - Panel Principal

**Responsabilidades**:
- Mostrar resumen mensual
- Gráfico de distribución de gastos (Pie chart)
- Tabla de transacciones con ordenamiento
- Cálculos de ingresos/gastos/balance

**Funcionalidades**:
- Ordenamiento por: Fecha, Monto, Categoría
- Dirección: Ascendente/Descendente
- Eliminar transacciones con confirmación
- Responsive: Tabla scrolleable en móvil

**Propiedades Computadas**:
```javascript
monthTransactions     // Transacciones del mes
totalIncome          // Suma de ingresos
totalExpenses        // Suma de gastos
balance              // Diferencia
expensesByCategory   // Datos para gráfico Pie
```

---

### 3. TransactionForm.jsx - Formulario de Transacciones

**Responsabilidades**:
- Captura de transacciones completas
- Validación de campos
- Soporte para transacciones recurrentes
- Gestión de categorías dinámicas

**Campos**:
```javascript
- Monto (validado, 2 decimales)
- Descripción (opcional)
- Fecha (predeterminada a hoy)
- Categoría (dropdown dinámico)
- Tipo (ingreso/gasto-fijo/gasto-variable)
- Tipo de Ingreso (sueldo/extra, si es ingreso)
- Moneda (DOP/USD)
- Método de Pago (efectivo/tarjeta/transferencia/cheque)
- ¿Transacción Recurrente? (checkbox)
- Frecuencia (si es recurrente)
```

---

### 4. DailyExpenses.jsx - Entrada Rápida de Gastos

**Responsabilidades**:
- Formulario simplificado para gastos diarios
- Optimizado para móvil (keyboard numérico)
- Entrada rápida sin validaciones complejas

**Diferencias vs TransactionForm**:
- Sin campo de descripción larga
- Sin opción de moneda (siempre DOP)
- Sin transacciones recurrentes
- Enfoque en velocidad de entrada

---

### 5. Otros Componentes

#### Calendar.jsx
- Visualización de gastos diarios en formato calendárico
- Colores según intensidad de gasto
- Clic en día para ver detalles

#### Budgets.jsx
- Visualización de presupuestos mensuales
- Barra de progreso por categoría
- Aplicar presupuestos automáticos (40%)
- Editar/eliminar presupuestos

#### SavingsGoals.jsx
- Crear nuevas metas
- Visualizar progreso
- Cálculo automático de ahorro requerido
- Marcar como alcanzadas

#### AdvancedStats.jsx
- Top 5 gastos
- Promedio por categoría
- Promedio diario
- Gráficos de tendencias

#### SearchFilter.jsx
- Formulario de búsqueda multi-criterio
- Filtros avanzados
- Resultados en tabla

#### ReportPDF.jsx
- Generación de reportes PDF
- Resumen mensual
- Tablas de transacciones

#### BackupRestore.jsx
- Exportar datos a JSON
- Importar datos de archivo
- Reset de todos los datos

#### ExchangeRateWidget.jsx
- Visualizar tasa actual
- Actualizar manualmente
- Guardada en localStorage

#### FloatingNav.jsx (FAB)
- Menú flotante para móviles
- Botones circulares
- Acceso a todas las pestañas

#### Alerts.jsx
- Visualizar alertas del sistema
- Descartar individualmente
- Configurar umbral de presupuesto

---

## 🔐 Persistencia y Seguridad

### Estrategia de Almacenamiento

#### LocalStorage
- **Clave Principal**: `finanzas_data`
  - Contiene: transacciones, categorías, metas
  - Encriptación: AES-256 con CryptoJS
  - Sincronización: Automática cada cambio

- **Clave de Tema**: `theme_preference`
  - Contenido: `"light" | "dark"`
  - Sin encriptación (no sensible)

- **Clave de Tasa de Cambio**: `exchange_rate_usd_dop`
  - Contenido: número (ej: 63.52)
  - Sin encriptación

- **Clave de Presupuestos**: `monthly_budgets`
  - Contenido: Array JSON de presupuestos
  - Sin encriptación

- **Clave de Metas**: `savings_goals`
  - Contenido: Array JSON de metas
  - Sin encriptación

- **Clave de Alertas**: `alert_settings`
  - Contenido: Configuración de alertas
  - Sin encriptación

### Encriptación de Datos

#### Método: AES-256 (CryptoJS)
```javascript
encryptData(data) {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    ENCRYPTION_KEY
  ).toString()
}

decryptData(cipherText) {
  const bytes = CryptoJS.AES.decrypt(cipherText, ENCRYPTION_KEY)
  const decrypted = bytes.toString(CryptoJS.enc.Utf8)
  return JSON.parse(decrypted)
}
```

#### Clave de Encriptación
- Variable: `VITE_ENCRYPTION_KEY` en `.env.local`
- Fallback: `'cambia-esta-clave-en-.env'` (inseguro)
- **IMPORTANTE**: Cambiar en producción

### Flujo de Sincronización

```
useEffect([data, loading])
  ↓
Si !loading:
  - Validar integridad de datos
  - Serializar a JSON
  - Encriptar con CryptoJS
  - Guardar en localStorage
  ↓
Si localStorage.setItem falla:
  - Log error en consola
  - NO afecta UI (optimista)
  ↓
Al cargar app:
  - Recuperar cipherText
  - Desencriptar
  - Parsear JSON
  - Restaurar estado
```

### Recuperación de Fallos

#### Si Desencriptación Falla
```javascript
try {
  decrypted = decryptData(storedData)
} catch(error) {
  console.error('Error al desencriptar')
  decrypted = null  // Usa estado inicial
}
```

#### Si localStorage Lleno
```javascript
try {
  localStorage.setItem(STORAGE_KEY, encrypted)
} catch(error) {
  console.error('LocalStorage lleno o no disponible')
  // UI sigue funcionando (hasta que se cierre pestaña)
}
```

### Limitaciones de LocalStorage
- **Capacidad**: ~5-10 MB por dominio
- **Sincrónico**: Puede bloquear si datos muy grandes
- **No encriptado nativamente**: Requiere CryptoJS
- **Scope**: Solo cliente (no se sincroniza entre pestañas automáticamente)

---

## 📐 Cálculos Financieros

### 1. Balance (Fórmula Principal)

```
Balance = Σ(Ingresos) - Σ(Gastos)

Donde:
- Σ(Ingresos) = suma de todas las transacciones con type='ingreso'
- Σ(Gastos) = suma de (gasto-fijo + gasto-variable)

Conversión a DOP (si es necesario):
Para cada transacción:
  Si currency = 'USD':
    monto_dop = monto * tasa_cambio
  Sino:
    monto_dop = monto

Resultado: número real (puede ser positivo/negativo)
```

### 2. Proyección de Gastos

```
Para los últimos 3 meses:

1. Gastos Fijos Promedio:
   fixedAvg = Σ(gasto-fijo de 3 meses) / 3
   
2. Gastos Variables Promedio:
   varAvg = Σ(gasto-variable de 3 meses) / 3
   
3. Proyección Total:
   projection = fixedAvg + varAvg

Interpretación:
- Comparar contra presupuesto del próximo mes
- Si projection > presupuesto → alertar
- Si projection < presupuesto → hay margen
```

### 3. Presupuesto Inteligente (Regla 40%)

```
Income = Σ(Ingresos del mes)

Auto-Budget = Income * 0.40  (40% para gastos)

Distribución por categoría:
Per-Category-Budget = Auto-Budget / cantidad_categorías

Ejemplo:
- Ingreso: RD$ 10,000
- Auto-Budget: RD$ 4,000
- Si 10 categorías: RD$ 400 por categoría
```

### 4. Meta de Ahorro

```
Dado:
- targetAmount (monto objetivo)
- deadline (fecha límite)
- monthlyIncome (ingreso mensual)

Cálculo:
months_remaining = meses entre hoy y deadline
monthly_savings = targetAmount / months_remaining
percentage = (monthly_savings / monthlyIncome) * 100

Validación:
isAchievable = percentage <= 100%

Ejemplo:
- Target: RD$ 6,000
- Deadline: 30/06/2024
- Ingreso: RD$ 10,000/mes
- Meses restantes: 6
- Monthly savings: RD$ 1,000
- Percentage: 10% (ES ALCANZABLE)
```

### 5. Estadísticas Avanzadas

#### Top 5 Gastos
```javascript
// Ordena por monto descendente y toma primeros 5
expenses
  .map(t => ({ ...t, amount_dop: convertToDOP(amount, currency) }))
  .sort((a, b) => b.amount_dop - a.amount_dop)
  .slice(0, 5)
```

#### Promedio por Categoría
```javascript
categoryMap = {}

Para cada gasto:
  category = t.category
  amount_dop = convertToDOP(t.amount, t.currency)
  categoryMap[category] += amount_dop

averagePerCategory = {}
Para cada categoría:
  count = cantidad de transacciones
  average = categoryMap[category] / count
```

#### Promedio Diario
```javascript
totalExpenses = suma de todos los gastos
uniqueDates = cantidad de fechas distintas
dailyAverage = totalExpenses / uniqueDates
```

---

## 🎨 Patrones y Prácticas

### 1. Patrones de React

#### Custom Hooks Pattern
```javascript
// Crear lógica reutilizable
export const useFinancesData = () => {
  const [data, setData] = useState(...)
  useEffect(() => { /* sincronizar */ }, [])
  
  const addTransaction = (t) => { /* ... */ }
  const calculateBalance = (t) => { /* ... */ }
  
  return { data, addTransaction, calculateBalance, ... }
}

// Usar en múltiples componentes
const MyComponent = () => {
  const { data, addTransaction } = useFinancesData()
}
```

#### Props Drilling
```javascript
// App.jsx pasa props a múltiples niveles
<Dashboard 
  transactions={transactions}
  calculateBalance={calculateBalance}
/>
```

#### Memoization
```javascript
// Evitar re-renders innecesarios
const monthTransactions = useMemo(() => {
  return transactions.filter(...)
}, [transactions, selectedMonth, selectedYear])

// Callbacks estables
const handleSort = useCallback((column) => {
  setSortBy(column)
}, [])
```

### 2. Gestión de Estado

#### Estado Local
```javascript
// En componentes que solo lo necesitan localmente
const [sortBy, setSortBy] = useState('date')
const [isMobile, setIsMobile] = useState(false)
```

#### Estado Global
```javascript
// Compartido entre múltiples componentes
const { data, addTransaction } = useFinancesData()
```

#### Sincronización con localStorage
```javascript
// Automática cada cambio de estado
useEffect(() => {
  if (!loading) {
    localStorage.setItem(STORAGE_KEY, encryptData(data))
  }
}, [data, loading])
```

### 3. Validación de Datos

#### En Captura
```javascript
// TransactionForm valida antes de submit
if (!formData.amount || parseFloat(formData.amount) <= 0) {
  alert('Monto inválido')
  return
}
if (!formData.category) {
  alert('Categoría requerida')
  return
}
```

#### En Cálculos
```javascript
// Convertir a número antes de operar
const amount = parseFloat(transaction.amount)
const rate = parseFloat(localStorage.getItem('exchange_rate')) || 63.52
```

#### Estructura de Datos
```javascript
// Validar al cargar desde localStorage
if (!parsed.transactions || !Array.isArray(parsed.transactions)) {
  throw new Error('Estructura inválida')
}
```

### 4. Performance

#### Lazy Loading (No implementado actualmente)
- Los componentes se cargan todos en App.jsx
- Oportunidad: usar React.lazy() para rutas pesadas

#### Virtualization (No implementado)
- Tablas grandes podrían usar virtualization
- Actual: Todas las transacciones se renderizan

#### Memoization
```javascript
// Componentes que son puros (no cambian)
const NavButton = React.memo(({ icon, label, isActive, onClick }) => (
  <button>...</button>
))
```

### 5. Responsive Design

#### Mobile-First Approach
```javascript
// Usar clases Tailwind
<div className="grid grid-cols-1 md:grid-cols-3">
  {/* 1 columna móvil, 3 columnas desktop */}
</div>

// Detectar tamaño
const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth < 768)
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])
```

#### Navegación Adaptativa
```javascript
// Sidebar oculto en móvil
{!isMobile && <Sidebar />}

// FAB (Floating Action Button) solo en móvil
{isMobile && <FloatingNav />}
```

### 6. Internacionalización (i18n)

#### Formato de Moneda
```javascript
const formatCurrency = (amount, currency = 'DOP') => {
  const symbol = currency === 'USD' ? 'US$' : 'RD$'
  return `${symbol} ${new Intl.NumberFormat('es-DO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)}`
}
```

#### Formato de Fecha
```javascript
// Locale es-DO (Español - República Dominicana)
new Date().toLocaleDateString('es-DO')
// "4/1/2024" (DD/MM/YYYY)
```

### 7. Manejo de Errores

#### Try-Catch en Encriptación
```javascript
try {
  return CryptoJS.AES.encrypt(...).toString()
} catch (error) {
  console.error('Error al encriptar:', error)
  return null
}
```

#### Recuperación Silenciosa
```javascript
try {
  const stored = localStorage.getItem(STORAGE_KEY)
  const decrypted = decryptData(stored)
  setData(decrypted || initialData)
} catch (error) {
  console.error('Error al cargar datos:', error)
  // Seguir con initialData (degradado graceful)
}
```

#### Confirmaciones Destructivas
```javascript
if (window.confirm('¿Estás seguro de que deseas eliminar?')) {
  deleteTransaction(id)
}
```

---

## 🚀 Flujos de Uso Típicos

### Caso 1: Usuario Nuevo
```
1. Accede a la app
2. App.jsx detecta localStorage vacío
3. Se carga estado inicial
4. Ve Dashboard vacío
5. Navega a "Transacciones"
6. Completa formulario y agrega primer ingreso
7. Ve el balance actualizado en Dashboard
```

### Caso 2: Análisis Mensual
```
1. Usuario va a Dashboard
2. Selecciona mes/año (por defecto mes actual)
3. Ve:
   - Ingresos y gastos totales
   - Balance
   - Gráfico de distribución
   - Tabla de transacciones
4. Puede ordenar tabla por: fecha, monto, categoría
5. Puede eliminar transacciones incorrectas
```

### Caso 3: Configurar Presupuesto
```
1. Usuario va a "Presupuestos"
2. Selecciona el mes
3. Opción A: Ingresar presupuestos manuales
   - Completa montos por categoría
4. Opción B: Usar presupuesto automático
   - Click en "Aplicar presupuestos automáticos (40%)"
   - Se distribuye 40% del ingreso equitativamente
5. Ver progreso en barra verde/naranja/roja
```

### Caso 4: Crear Meta de Ahorro
```
1. Usuario va a "Metas"
2. Click en "Nueva Meta"
3. Ingresa:
   - Nombre (ej: "Vacaciones")
   - Monto objetivo (RD$ 5000)
   - Fecha límite (30/06/2024)
4. Sistema calcula automáticamente:
   - Ahorro mensual requerido: RD$ 833.33
   - % del ingreso: 8.33%
   - ¿Es alcanzable?: SÍ
5. Ve progreso visual hacia la meta
```

### Caso 5: Exportar y Restaurar Datos
```
1. Usuario va a "Backup"
2. Click en "Descargar Datos"
   - Se descarga archivo JSON encriptado
   - Lo guarda como respaldo
3. Más tarde, si reinstala app o cambia dispositivo:
   - Va a "Backup"
   - Click en "Importar Datos"
   - Selecciona archivo JSON descargado
   - App se restaura completamente
```

### Caso 6: Buscar Transacciones
```
1. Usuario va a "Buscar"
2. Completa criterios (ej: "Alimentación" + rango "100-500")
3. Click en "Buscar"
4. Ve tabla con solo transacciones que cumplen
5. Puede eliminar desde resultados
6. Click en "Limpiar" vuelve a mostrar vacío
```

---

## 📝 Resumen Ejecutivo

### Fortalezas del Sistema
✅ Datos persistentes y encriptados  
✅ Interfaz responsiva (móvil/desktop)  
✅ Cálculos precisos con conversión de monedas  
✅ Presupuestos inteligentes (40%)  
✅ Análisis avanzados y estadísticas  
✅ Búsqueda multi-criterio  
✅ Sistema de alertas  
✅ Exportación/importación de datos  

### Oportunidades de Mejora
🔧 Agregar categorías personalizadas con colores  
🔧 Sincronización entre pestañas (via localStorage events)  
🔧 Modo offline con service workers  
🔧 Análisis predictivo con ML  
🔧 Integración bancaria (API)  
🔧 Multi-usuario con backend  
🔧 Gráficos más avanzados (histogramas, tendencias)  
🔧 Integración con Google Calendar  

### Escalabilidad
- Actual: ~50 transacciones mensuales = 5-10 MB max
- Límite LocalStorage: 5-10 MB
- Para escalar: Migrar a IndexedDB o backend
- Base de datos recomendada: Firebase, MongoDB, PostgreSQL

---

## 📞 Contacto y Soporte

Este documento está diseñado para ser **completo, profesional y listo para entregar a otra IA o desarrollador** para continuidad y mejora del sistema.

**Documento preparado**: 4 de Enero de 2026  
**Versión del Sistema**: 1.0.0  
**Stack**: React 19 + Vite 7.3 + Tailwind CSS  

---

**FIN DEL DOCUMENTO**
