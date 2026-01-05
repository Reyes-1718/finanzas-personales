# 🔌 REFERENCIA API - Funciones y Hooks

**Documento de Referencia Rápida**  
**Fecha**: 4 de Enero de 2026

---

## 1. useFinancesData Hook

### Estado Retornado

```javascript
const {
  data,                          // Objeto con transacciones y categorías
  loading,                       // boolean: cargando datos
  ...funciones                   // Ver abajo
} = useFinancesData()
```

---

### 1.1 Funciones de Transacciones

#### addTransaction(transaction)
```javascript
// Parámetros
{
  amount: string,                // "1500.00"
  type: "ingreso" | "gasto-fijo" | "gasto-variable",
  category: string,              // "Salario"
  currency: "DOP" | "USD",
  description?: string,          // Opcional
  date?: "YYYY-MM-DD",          // Defecto: hoy
  incomeType?: "sueldo" | "extra",  // Solo si type="ingreso"
  paymentMethod?: string         // "efectivo", "tarjeta", etc
}

// Retorno: void
// Efecto: Agrega a state y persiste en localStorage
```

**Ejemplo**:
```javascript
addTransaction({
  amount: "5000",
  type: "ingreso",
  incomeType: "sueldo",
  category: "Salario",
  currency: "DOP",
  description: "Salario mensual Enero",
  date: "2024-01-04",
  paymentMethod: "transferencia"
})
```

---

#### deleteTransaction(id)
```javascript
// Parámetros
id: string  // El ID de la transacción

// Retorno: void
// Efecto: Elimina de transacciones y persiste
```

**Ejemplo**:
```javascript
deleteTransaction("1704355200000")
```

---

#### updateTransaction(id, updatedTransaction)
```javascript
// Parámetros
id: string                    // ID de la transacción
updatedTransaction: object    // Campos a actualizar

// Retorno: void
// Efecto: Actualiza transacción existente
```

**Ejemplo**:
```javascript
updateTransaction("1704355200000", {
  amount: "1600.00",
  description: "Salario revisado"
})
```

---

#### getTransactionsByMonth(year, month)
```javascript
// Parámetros
year: number    // 2024
month: number   // 0-11 (0=Enero, 11=Diciembre)

// Retorno: Transaction[]
// Efecto: Ninguno (solo lectura)
```

**Ejemplo**:
```javascript
const januaryTransactions = getTransactionsByMonth(2024, 0)
console.log(januaryTransactions)  // Array de transacciones
```

---

### 1.2 Funciones de Cálculos Financieros

#### calculateBalance(transactions)
```javascript
// Parámetros
transactions: Transaction[]  // Array de transacciones

// Retorno: number
// Fórmula: Σ(ingresos) - Σ(gastos)
// Efecto: Ninguno (solo lectura)
```

**Ejemplo**:
```javascript
const balance = calculateBalance(monthTransactions)
console.log(balance)  // 2500.00 (positivo) o -500.00 (negativo)
```

---

#### calculateProjection()
```javascript
// Parámetros: Ninguno

// Retorno: {
//   fixedExpenses: number,
//   avgVariableExpenses: number,
//   totalProjection: number
// }

// Efecto: Ninguno (solo lectura)
// Nota: Usa últimos 3 meses
```

**Ejemplo**:
```javascript
const { fixedExpenses, avgVariableExpenses, totalProjection } 
  = calculateProjection()

console.log(`Próximo mes: ${totalProjection} RD$`)
// Próximo mes: 3500.00 RD$
```

---

#### getExchangeRate()
```javascript
// Parámetros: Ninguno

// Retorno: number (tasa de cambio USD a DOP)
// Defecto: 63.52
// Origen: localStorage 'exchange_rate_usd_dop'
```

**Ejemplo**:
```javascript
const rate = getExchangeRate()
console.log(rate)  // 63.52
```

---

#### convertToDOP(amount, currency)
```javascript
// Parámetros
amount: string | number    // "1500" o 1500
currency: "DOP" | "USD"    // Moneda original

// Retorno: number (convertido a DOP)
// Efecto: Ninguno (solo lectura)
```

**Ejemplo**:
```javascript
const amountInDOP = convertToDOP(100, "USD")
console.log(amountInDOP)  // 6352.00

const alreadyDOP = convertToDOP(5000, "DOP")
console.log(alreadyDOP)   // 5000.00
```

---

### 1.3 Funciones de Análisis

#### getAdvancedStats(transactions)
```javascript
// Parámetros
transactions: Transaction[]  // Array de transacciones

// Retorno: {
//   averagePerCategory: { [category]: number },
//   largestExpenses: Transaction[],  // Top 5
//   topCategories: Array,            // Top 5
//   dailyAverage: number,
//   transactionCount: number,
//   totalIncome: number,
//   totalExpenses: number,
//   balance: number
// }

// Efecto: Ninguno (solo lectura)
```

**Ejemplo**:
```javascript
const stats = getAdvancedStats(monthTransactions)

console.log(stats.largestExpenses)
// [
//   { id: "...", amount: "1000", category: "Vivienda", ... },
//   { id: "...", amount: "500", category: "Alimentación", ... },
//   ...
// ]

console.log(stats.dailyAverage)  // 150.50

console.log(stats.topCategories)
// [
//   { category: "Vivienda", total: 5000 },
//   { category: "Alimentación", total: 1500 },
//   ...
// ]
```

---

#### getDailyExpenses(year, month)
```javascript
// Parámetros
year: number    // 2024
month: number   // 0-11

// Retorno: Array<{
//   date: "YYYY-MM-DD",
//   total: number,
//   dayOfWeek: string  // "lun", "mar", etc
// }>

// Efecto: Ninguno (solo lectura)
```

**Ejemplo**:
```javascript
const dailyData = getDailyExpenses(2024, 0)

console.log(dailyData)
// [
//   { date: "2024-01-01", total: 250.50, dayOfWeek: "lun" },
//   { date: "2024-01-02", total: 180.00, dayOfWeek: "mar" },
//   ...
// ]
```

---

#### searchTransactions(criteria)
```javascript
// Parámetros
criteria: {
  description?: string,      // Búsqueda parcial (case-insensitive)
  category?: string,         // Exacto
  type?: string,             // Exacto
  currency?: string,         // Exacto
  paymentMethod?: string,    // Exacto
  minAmount?: number,        // Rango
  maxAmount?: number,        // Rango
  startDate?: "YYYY-MM-DD",  // Rango
  endDate?: "YYYY-MM-DD"     // Rango
}

// Retorno: Transaction[]
// Efecto: Ninguno (solo lectura)
// Lógica: AND (todos los criterios deben cumplirse)
```

**Ejemplo**:
```javascript
const results = searchTransactions({
  category: "Alimentación",
  minAmount: 100,
  maxAmount: 500,
  startDate: "2024-01-01",
  endDate: "2024-01-31"
})

console.log(results)
// Array de transacciones que cumplen TODOS los criterios
```

---

### 1.4 Funciones de Categorías

#### addIncomeCategory(category)
```javascript
// Parámetros
category: string  // "Bonificación"

// Retorno: void
// Efecto: Agrega si no existe
// Duplicados: Ignorados automáticamente
```

**Ejemplo**:
```javascript
addIncomeCategory("Comisiones")
```

---

#### addExpenseCategory(category)
```javascript
// Parámetros
category: string  // "Mascotas"

// Retorno: void
// Efecto: Agrega si no existe
```

**Ejemplo**:
```javascript
addExpenseCategory("Mascotas")
```

---

### 1.5 Funciones de Transacciones Recurrentes

#### addRecurringTransaction(recurringData)
```javascript
// Parámetros
{
  amount: string,                    // "500"
  type: "ingreso" | "gasto-variable" | "gasto-fijo",
  category: string,                  // "Transporte"
  currency: "DOP" | "USD",
  description: string,               // "Transporte semanal"
  frequency: "diaria" | "semanal" | "quincenal" | "mensual" | "anual",
  incomeType?: "sueldo" | "extra",   // Si type="ingreso"
  paymentMethod?: string             // "efectivo"
}

// Retorno: void
// Efecto: Crea transacción recurrente con ID y createdAt
```

**Ejemplo**:
```javascript
addRecurringTransaction({
  amount: "500",
  type: "gasto-variable",
  category: "Transporte",
  currency: "DOP",
  description: "Gasolina semanal",
  frequency: "semanal",
  paymentMethod: "tarjeta"
})
```

---

#### updateRecurringTransaction(id, updatedData)
```javascript
// Parámetros
id: string             // ID de la transacción recurrente
updatedData: object    // Campos a actualizar (incluye 'active')

// Retorno: void
```

**Ejemplo**:
```javascript
// Pausar una recurrente
updateRecurringTransaction("1704355200001", { active: false })

// Reanudar
updateRecurringTransaction("1704355200001", { active: true })
```

---

#### deleteRecurringTransaction(id)
```javascript
// Parámetros
id: string  // ID de la transacción recurrente

// Retorno: void
// Efecto: Elimina la recurrencia (no afecta creadas)
```

---

#### processRecurringTransactions()
```javascript
// Parámetros: Ninguno

// Retorno: Set de IDs procesados
// Efecto: Crea transacciones ordinarias si vencidas
// Nota: Debe llamarse diariamente (actualmente desactivado)
```

**Ejemplo**:
```javascript
const processed = processRecurringTransactions()
console.log(processed.size)  // 3 transacciones procesadas
```

---

### 1.6 Funciones de Persistencia

#### exportData()
```javascript
// Parámetros: Ninguno

// Retorno: void (descarga archivo)
// Efecto: Abre descarga de JSON con datos
// Nombre archivo: finanzas_backup_YYYY-MM-DD.json
```

**Ejemplo**:
```javascript
// Usuario hace click en botón
exportData()  // Descarga archivo automáticamente
```

---

#### importData(jsonData)
```javascript
// Parámetros
jsonData: string | object  // JSON string o objeto parseado

// Retorno: {
//   success: boolean,
//   message: string
// }

// Efecto: Si válido, restaura estado completo
```

**Ejemplo**:
```javascript
const fileContent = JSON.parse(fileInput.value)
const result = importData(fileContent)

if (result.success) {
  alert("Datos importados exitosamente")
} else {
  alert("Error: " + result.message)
}
```

---

#### clearAllData()
```javascript
// Parámetros: Ninguno

// Retorno: void
// Efecto: RESET COMPLETO (BE CAREFUL)
// Acción: Borra todo y limpia localStorage
```

**Ejemplo**:
```javascript
// Debe tener confirmación previa
if (window.confirm("¿Eliminar TODOS los datos?")) {
  clearAllData()
}
```

---

## 2. useBudgets Hook

```javascript
const {
  budgets,                    // Array de presupuestos
  setBudget,
  getBudget,
  getAllBudgetsForMonth,
  deleteBudget,
  getAutoBudgetAmount,
  getSuggestedBudgets,
  applyAutoBudgets
} = useBudgets()
```

---

### setBudget(category, amount, month, year)
```javascript
// Parámetros
category: string   // "Alimentación"
amount: number     // 3000.00
month: number      // 0-11
year: number       // 2024

// Retorno: void
// Efecto: Crea o actualiza presupuesto
// Clave única: "${category}-${year}-${month}"
```

---

### getBudget(category, month, year)
```javascript
// Retorno: number | null
// Si no existe: null

const budget = getBudget("Alimentación", 0, 2024)
console.log(budget)  // 3000.00
```

---

### getAllBudgetsForMonth(month, year)
```javascript
// Retorno: Budget[]

const monthBudgets = getAllBudgetsForMonth(0, 2024)
// [
//   { key: "Alimentación-2024-0", category: "Alimentación", amount: 3000, ... },
//   { key: "Transporte-2024-0", category: "Transporte", amount: 500, ... },
//   ...
// ]
```

---

### deleteBudget(category, month, year)
```javascript
// Parámetros
category: string   // "Alimentación"
month: number      // 0
year: number       // 2024

// Retorno: void
```

---

### getAutoBudgetAmount(monthlyIncome)
```javascript
// Parámetros
monthlyIncome: number  // 10000.00

// Retorno: number (40% del ingreso)

const autoBudget = getAutoBudgetAmount(10000)
console.log(autoBudget)  // 4000.00
```

---

### getSuggestedBudgets(monthlyIncome, expenseCategories)
```javascript
// Parámetros
monthlyIncome: number       // 10000.00
expenseCategories: string[] // ["Alimentación", "Transporte", ...]

// Retorno: Array<{
//   category: string,
//   suggestedAmount: number,
//   percentage: number
// }>

const suggested = getSuggestedBudgets(10000, 
  ["Alimentación", "Transporte", "Entretenimiento"])
// [
//   { category: "Alimentación", suggestedAmount: 1333.33, percentage: 13.33 },
//   { category: "Transporte", suggestedAmount: 1333.33, percentage: 13.33 },
//   { category: "Entretenimiento", suggestedAmount: 1333.33, percentage: 13.33 }
// ]
```

---

### applyAutoBudgets(monthlyIncome, expenseCategories, month, year)
```javascript
// Parámetros
monthlyIncome: number
expenseCategories: string[]
month: number
year: number

// Retorno: void
// Efecto: Establece todos los presupuestos automáticamente

applyAutoBudgets(10000, 
  ["Alimentación", "Transporte"], 0, 2024)
// Crea presupuestos del 40% distribuido
```

---

## 3. useSavingsGoals Hook

```javascript
const {
  goals,                          // Array de metas
  addGoal,
  updateGoal,
  deleteGoal,
  getGoalProgress,
  calculatePeriodicSavings
} = useSavingsGoals()
```

---

### addGoal(goal)
```javascript
// Parámetros
{
  name: string,                    // "Vacaciones"
  targetAmount: number,            // 5000.00
  deadline: "YYYY-MM-DD",          // "2024-06-30"
  category?: string,               // "Viajes"
  monthlyIncome?: number           // Para cálculo automático
}

// Retorno: Goal (con ID generado, savingsCalculation, etc)
// Efecto: Agrega a goals

const newGoal = addGoal({
  name: "Vacaciones",
  targetAmount: 5000,
  deadline: "2024-06-30",
  category: "Viajes",
  monthlyIncome: 10000
})
```

---

### updateGoal(id, updatedGoal)
```javascript
// Parámetros
id: string       // ID de la meta
updatedGoal: object  // Campos a actualizar

// Retorno: void
// Efecto: Recalcula savingsCalculation si cambió deadline/amount

updateGoal("meta-1", { 
  targetAmount: 6000,  // Aumentó el objetivo
  // Recalcula automáticamente
})
```

---

### deleteGoal(id)
```javascript
// Parámetros
id: string  // ID de la meta

// Retorno: void
```

---

### calculatePeriodicSavings(targetAmount, deadline, monthlyIncome)
```javascript
// Parámetros
targetAmount: number           // 5000.00
deadline: "YYYY-MM-DD"         // "2024-06-30"
monthlyIncome: number          // 10000.00

// Retorno: {
//   monthlySavings: number,
//   percentageOfIncome: number,
//   monthsRemaining: number,
//   isAchievable: boolean
// }

const calc = calculatePeriodicSavings(5000, "2024-06-30", 10000)
// {
//   monthlySavings: 833.33,
//   percentageOfIncome: 8.33,
//   monthsRemaining: 6,
//   isAchievable: true
// }
```

---

## 4. useTheme Hook

```javascript
const { isDark, toggleTheme } = useTheme()
```

---

### toggleTheme()
```javascript
// Parámetros: Ninguno
// Retorno: void
// Efecto: Alterna entre oscuro/claro y persiste

toggleTheme()
// Si isDark era true → ahora false
// Si isDark era false → ahora true
// Guarda en localStorage 'theme_preference'
```

---

## 5. useAlerts Hook

```javascript
const {
  alerts,              // Array de alertas
  addAlert,
  dismissAlert,
  getSettings,
  updateSettings
} = useAlerts()
```

---

### addAlert(type, message)
```javascript
// Parámetros
type: "warning" | "error" | "info",
message: string  // "Has excedido presupuesto"

// Retorno: void
// Efecto: Agrega alerta con timestamp

addAlert("warning", "Has gastado más del presupuesto de Alimentación")
```

---

### dismissAlert(id)
```javascript
// Parámetros
id: string  // ID de la alerta

// Retorno: void
// Efecto: Marca como dismissed (no elimina)
```

---

## 6. Constantes Globales

### Categorías de Ingresos (Predeterminadas)
```javascript
[
  "Salario",
  "Freelance", 
  "Inversiones",
  "Bonos",
  "Propinas",
  "Ventas",
  "Alquiler",
  "Otros Ingresos"
]
```

---

### Categorías de Gastos (Predeterminadas)
```javascript
[
  "Alimentación",
  "Transporte",
  "Vivienda",
  "Servicios",
  "Entretenimiento",
  "Salud",
  "Educación",
  "Ropa",
  "Tecnología",
  "Otros Gastos"
]
```

---

### Métodos de Pago
```javascript
// De config/categoryConfig.js
[
  "efectivo",
  "tarjeta",
  "transferencia",
  "cheque"
]
```

---

## 7. Tipos de Datos

### Transaction
```typescript
interface Transaction {
  id: string;                    // Timestamp como ID
  amount: string;                // "1500.00"
  type: "ingreso" | "gasto-fijo" | "gasto-variable";
  category: string;
  currency: "DOP" | "USD";
  description: string;
  date: string;                  // "YYYY-MM-DD"
  incomeType?: "sueldo" | "extra";
  paymentMethod?: string;
}
```

---

### Budget
```typescript
interface Budget {
  key: string;                   // "Alimentación-2024-0"
  category: string;
  amount: number;
  month: number;                 // 0-11
  year: number;
}
```

---

### SavingsGoal
```typescript
interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  deadline: string;              // "YYYY-MM-DD"
  category?: string;
  createdAt: string;
  achieved: boolean;
  monthlyIncome?: number;
  savingsCalculation?: {
    monthlySavings: number;
    percentageOfIncome: number;
    monthsRemaining: number;
    isAchievable: boolean;
  };
}
```

---

## 8. Formato de Fechas

Todas las fechas se usan en formato **ISO 8601**:

```javascript
// Correcto
"2024-01-04"   // YYYY-MM-DD

// Incorrecto
"01/04/2024"   // Evitar formato local
"January 4"    // Evitar nombres

// Obtener fecha de hoy
new Date().toISOString().split('T')[0]  // "2024-01-04"
```

---

## 9. Formato de Montos

Todos los montos se almacenan como **strings** para precisión:

```javascript
// Correcto
amount: "1500.00"
amount: "1500.50"
amount: "1500"

// Operaciones
parseFloat("1500.00") + parseFloat("500")  // 2000
(2000).toFixed(2)                          // "2000.00"
```

---

## 10. Mensajes de Error Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| "Estructura de datos inválida" | importData sin array transactions | Verificar formato JSON |
| "Error al encriptar datos" | ENCRYPTION_KEY inválida | Cambiar en .env.local |
| "Error al desencriptar datos" | Datos corruptos o clave incorrecta | Limpiar localStorage |
| "Monto debe ser > 0" | Validación de formulario | Ingresar número positivo |
| "Categoría requerida" | Campo vacío | Seleccionar categoría |

---

**Fin de Referencia API**  
**Versión**: 1.0.0  
**Última actualización**: 4 de Enero de 2026
