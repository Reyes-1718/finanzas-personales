# 📊 DIAGRAMAS DE FLUJO Y ARQUITECTURA

**Diagramas Técnicos del Sistema**  
**Fecha**: 4 de Enero de 2026

---

## 1. FLUJO GENERAL DE DATOS

```
┌────────────────────────────────────────────────────────────────┐
│                    USUARIO FINAL                                │
│         (Navegador Web - React App)                            │
└────────────────────┬───────────────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────────────┐
│                   COMPONENTES REACT                             │
│  Dashboard│Form│Stats│Calendar│Budgets│Goals│Alerts│Search    │
└────────────────────┬───────────────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────────────┐
│                   CUSTOM HOOKS (Lógica)                         │
│  useFinancesData│useBudgets│useTheme│useSavingsGoals│useAlerts │
└────────────────────┬───────────────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────────────┐
│              FUNCIONES DE NEGOCIO (Cálculos)                    │
│  calculateBalance│convertToDOP│getAdvancedStats│searchTransactions
└────────────────────┬───────────────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────────────┐
│           GESTIÓN DE ESTADO (React State)                       │
│          useState │ useEffect │ useCallback                      │
└────────────────────┬───────────────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────────────┐
│        PERSISTENCIA (LocalStorage)                              │
│   Encriptación AES │ localStorage.getItem/setItem               │
└────────────────────┬───────────────────────────────────────────┘
                     │
                     ▼
              DATOS DEL NAVEGADOR
        (5-10 MB máximo por dominio)
```

---

## 2. CICLO DE VIDA - TRANSACCIÓN COMPLETA

```
Usuario abre aplicación
           │
           ▼
    Loading = true
    useFinancesData se inicializa
           │
           ▼
    useEffect carga localStorage
           │
           ├─ Intenta desencriptar
           │  └─ Si falla → usa initialData
           │
           └─ Si éxito → restaura estado
                    │
                    ▼
            Loading = false
            componentes renderean
                    │
                    ▼
        Usuario navega a "Transacciones"
        ve TransactionForm
                    │
                    ▼
        Completa formulario:
        - Monto: "1500"
        - Tipo: "ingreso"
        - Categoría: "Salario"
        - Moneda: "DOP"
        - Fecha: "2024-01-04"
        - Descripción: "Salario enero"
                    │
                    ▼
            Click "Agregar"
                    │
                    ▼
            Validaciones:
            ✓ Monto > 0
            ✓ Categoría no vacía
                    │
                    ▼
            addTransaction(formData)
                    │
                    ▼
            Crear objeto:
            {
              id: "1704355200000",
              amount: "1500",
              type: "ingreso",
              category: "Salario",
              currency: "DOP",
              date: "2024-01-04",
              description: "Salario enero"
            }
                    │
                    ▼
            setData(prev => ({
              ...prev,
              transactions: [...prev.transactions, newTransaction]
            }))
                    │
                    ▼
            useEffect detecta cambio en [data, loading]
                    │
                    ▼
            Encriptar con CryptoJS.AES
                    │
                    ▼
            localStorage.setItem('finanzas_data', encrypted)
                    │
                    ▼
            Re-render Dashboard
                    │
                    ▼
            getTransactionsByMonth(year, month)
            filter transacciones del mes
                    │
                    ▼
            calculateBalance(monthTransactions)
            suma ingresos, resta gastos
                    │
                    ▼
            Mostrar balance actualizado
                    │
                    ▼
            ✓ Operación completada
            Formulario limpiado
            Usuario ve cambios en Dashboard
```

---

## 3. FLUJO DE BÚSQUEDA AVANZADA

```
Usuario navega a "Buscar"
       │
       ▼
   SearchFilter component renderea
   muestra form con criterios:
   - Descripción (text)
   - Categoría (select)
   - Tipo (select)
   - Moneda (select)
   - Método pago (select)
   - Rango montos (min/max)
   - Rango fechas (start/end)
       │
       ▼
   Usuario completa:
   ├─ category: "Alimentación"
   ├─ minAmount: 100
   ├─ maxAmount: 500
   └─ startDate: "2024-01-01"
       │
       ▼
   Click "Buscar"
   handleSearch(criteria) en App.jsx
       │
       ▼
   searchTransactions(criteria) en useFinancesData
       │
       ▼
   Filter transactions:
   Para cada transacción:
     ├─ Si criteria.category especificado
     │  └─ Si t.category ≠ criteria.category → SKIP
     ├─ Si criteria.minAmount especificado
     │  └─ Si parseFloat(t.amount) < minAmount → SKIP
     ├─ Si criteria.maxAmount especificado
     │  └─ Si parseFloat(t.amount) > maxAmount → SKIP
     ├─ Si criteria.startDate especificado
     │  └─ Si t.date < startDate → SKIP
     └─ Si pasa TODO → INCLUIR
       │
       ▼
   setSearchResults(resultados)
   setActiveTab('search')
       │
       ▼
   Renderear tabla de resultados
   "Encontradas: 12 transacciones"
       │
       ▼
   Usuario puede:
   - Ver detalles (fecha, monto, categoría)
   - Eliminar transacción individual
   - Click "Limpiar" para nueva búsqueda
```

---

## 4. FLUJO DE PRESUPUESTO

```
Usuario navega a "Presupuestos"
         │
         ▼
    Selecciona mes/año
    getAllBudgetsForMonth(month, year)
         │
         ▼
    Renderear presupuestos existentes
    o mostrar vacío
         │
         ▼
         ├─── OPCIÓN A: Manual
         │         │
         │         ▼
         │    Usuario ingresa:
         │    Categoría: "Alimentación"
         │    Monto: "3000"
         │         │
         │         ▼
         │    setBudget("Alimentación", 3000, mes, año)
         │    Crea key: "Alimentación-2024-0"
         │         │
         │         ▼
         │    localStorage persiste
         │
         └─── OPCIÓN B: Automático (40%)
                   │
                   ▼
              User hace click:
              "Aplicar presupuestos automáticos"
                   │
                   ▼
              Calcula: monthlyIncome × 0.40
              ej: 10000 × 0.40 = 4000
                   │
                   ▼
              Divide entre categorías:
              4000 / 10 categorías = 400 cada una
                   │
                   ▼
              applyAutoBudgets(income, categories, month, year)
              Crea presupuesto para cada:
              setBudget("Alimentación", 400, mes, año)
              setBudget("Transporte", 400, mes, año)
              ... (8 más)
                   │
                   ▼
         Dashboard muestra progreso:
         Para cada presupuesto:
           gasto_actual = Σ(transacciones categoría)
           porcentaje = (gasto_actual / presupuesto) × 100
           
           Si porcentaje < 100 → Verde (OK)
           Si porcentaje = 100 → Naranja (Límite)
           Si porcentaje > 100 → Rojo (Excedido)
                   │
                   ▼
         Usuario ve barras de progreso visuales
         Puede editar o eliminar presupuestos
```

---

## 5. FLUJO DE META DE AHORRO

```
Usuario navega a "Metas de Ahorro"
         │
         ▼
    Ve metas existentes o nuevo
    Click "Nueva Meta"
         │
         ▼
    Completa formulario:
    ├─ Nombre: "Vacaciones"
    ├─ Monto objetivo: "5000"
    ├─ Fecha límite: "2024-06-30"
    └─ Ingreso mensual: "10000"
         │
         ▼
    Click "Crear Meta"
    addGoal(goalData)
         │
         ▼
    Calcula automáticamente:
    calculatePeriodicSavings(5000, "2024-06-30", 10000)
         │
         ├─ Hoy = 2024-01-04
         ├─ Deadline = 2024-06-30
         └─ Meses restantes = 6
              │
              ▼
         Ahorro mensual = 5000 / 6 = 833.33
         % Ingreso = (833.33 / 10000) × 100 = 8.33%
         Alcanzable = 8.33% ≤ 100% → SÍ
         │
         ▼
    Agrega a goals con ID generado:
    {
      id: "1704355200002",
      name: "Vacaciones",
      targetAmount: 5000,
      deadline: "2024-06-30",
      createdAt: "2024-01-04",
      savingsCalculation: {
        monthlySavings: 833.33,
        percentageOfIncome: 8.33,
        monthsRemaining: 6,
        isAchievable: true
      }
    }
         │
         ▼
    localStorage persiste
         │
         ▼
    Dashboard SavingsGoals muestra:
    "Vacaciones - Necesitas ahorrar 833.33/mes"
    
    Barra de progreso visual:
    ├─ Objetivo: 5000
    ├─ Ahorrado: 0 (inicialmente)
    └─ Porcentaje: 0%
         │
         ▼
    Cuando usuario agrega transacciones recurrentes
    o manuales de ahorro:
    updateGoal(id, { currentSavings: 2500 })
         │
         ▼
    Dashboard actualiza porcentaje: 50%
    
    Cuando currentSavings ≥ targetAmount:
    updateGoal(id, { achieved: true })
         │
         ▼
    Meta marcada como completada ✓
```

---

## 6. FLUJO DE PROYECCIÓN

```
Usuario navega a "Proyección"
        │
        ▼
   calculateProjection() ejecuta
        │
        ▼
   Obtiene últimos 3 meses
   desde hoy hacia atrás:
   ├─ Mes 0: Enero 2024
   ├─ Mes 1: Diciembre 2023
   └─ Mes 2: Noviembre 2023
        │
        ▼
   Calcula Gastos Fijos Promedio:
   ├─ Nov: 2000 (servicios, vivienda, etc)
   ├─ Dic: 2100
   ├─ Ene: 2050
   └─ Promedio = (2000+2100+2050)/3 = 2050
        │
        ▼
   Calcula Gastos Variables Promedio:
   ├─ Nov: 1500 (alimentación, entretenimiento)
   ├─ Dic: 1800 (más gastos por navidad)
   ├─ Ene: 1600
   └─ Promedio = (1500+1800+1600)/3 = 1633.33
        │
        ▼
   Total Proyección = 2050 + 1633.33 = 3683.33
        │
        ▼
   Dashboard muestra:
   "Gastos Proyectados para Febrero: 3683.33"
   
   Compara contra presupuesto:
   ├─ Presupuesto: 4000
   ├─ Proyección: 3683.33
   └─ Margen: +316.67 (hay espacio)
        │
        ▼
   Alerta si: Proyección > Presupuesto
   "Cuidado: Gasto proyectado excede presupuesto"
```

---

## 7. FLUJO DE CONVERSIÓN DE MONEDAS

```
Usuario agrega transacción en USD
        │
        ▼
   TransactionForm captura:
   amount: "100"
   currency: "USD"
        │
        ▼
   En Dashboard, convertir para mostrar/calcular:
        │
        ├─── Obtener tasa de cambio
        │           │
        │           ▼
        │    getExchangeRate()
        │           │
        │           ▼
        │    Busca en localStorage 'exchange_rate_usd_dop'
        │           │
        │           ├─ Si existe → usar ese
        │           └─ Si no → defecto 63.52
        │           │
        │           ▼
        │    rate = 63.52
        │
        └─── Convertir monto
                    │
                    ▼
           convertToDOP(100, "USD")
                    │
                    ▼
           Si currency = "USD":
             return 100 * 63.52 = 6352.00
           Si currency = "DOP":
             return 100 (sin cambios)
                    │
                    ▼
           amountInDOP = 6352.00
                    │
                    ▼
           Usar amountInDOP en:
           - calculateBalance()
           - calculateProjection()
           - getAdvancedStats()
           - Pie charts
                    │
                    ▼
           Mostrar en UI:
           "US$ 100.00 = RD$ 6,352.00"
                    │
                    ▼
           Usuario puede actualizar tasa:
           ExchangeRateWidget
           Input: "64.50"
           Guarda en localStorage
                    │
                    ▼
           Próximas conversiones usan 64.50
           100 USD = 6450 DOP
```

---

## 8. FLUJO DE ENCRIPTACIÓN/DESENCRIPTACIÓN

```
┌─────────────────────────────────────────────────────────┐
│                 DATOS EN MEMORIA                         │
│ {                                                         │
│   transactions: [{id, amount, ...}],                     │
│   recurringTransactions: [...],                          │
│   incomeCategories: [...],                               │
│   expenseCategories: [...]                               │
│ }                                                         │
└──────────────┬──────────────────────────────────────────┘
               │
               ▼ (Usar datos)
       Componentes React renderean
               │
               │ (Cambio detectado)
               ▼
       useEffect([data, loading])
               │
               ▼
       JSON.stringify(data)
       │
       ▼ "{"transactions":[...],"expenseCategories":[...]}"
       │
       ▼ (Encriptar)
       CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY)
       │
       ▼ "U2FsdGVkX1/vl...e2VkY2U=" (base64 encriptado)
       │
       ▼ (Guardar)
       localStorage.setItem('finanzas_data', cipherText)
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│          DATOS EN LOCALSTORAGE (Encriptado)             │
│ Clave: 'finanzas_data'                                  │
│ Valor: "U2FsdGVkX1/vl...e2VkY2U="                      │
└─────────────────────────────────────────────────────────┘
       │
       │ (App se cierra/abre)
       ▼
┌─────────────────────────────────────────────────────────┐
│                  APP SE INICIA                           │
│ useFinancesData() hook monta                            │
│ loading = true                                           │
└──────────────┬──────────────────────────────────────────┘
               │
               ▼
       useEffect carga localStorage
               │
               ▼
       localStorage.getItem('finanzas_data')
       │
       ▼ "U2FsdGVkX1/vl...e2VkY2U="
       │
       ▼ (Desencriptar)
       CryptoJS.AES.decrypt(cipherText, ENCRYPTION_KEY)
       │
               ├─ Si clave incorrecta → Error
               │  catch block → decrypted = null
               │  usa initialData
               │
               └─ Si clave correcta → OK
               │
               ▼
       bytes.toString(CryptoJS.enc.Utf8)
       │
       ▼ "{"transactions":[...],"expenseCategories":[...]}"
       │
       ▼ (Parsear)
       JSON.parse(jsonString)
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│              DATOS RESTAURADOS EN MEMORIA                │
│ {                                                         │
│   transactions: [{id, amount, ...}],                     │
│   recurringTransactions: [...],                          │
│   incomeCategories: [...],                               │
│   expenseCategories: [...]                               │
│ }                                                         │
│                                                           │
│ setData(decrypted)                                       │
│ loading = false                                          │
│ Componentes renderean con datos restaurados              │
└─────────────────────────────────────────────────────────┘
```

---

## 9. ESTRUCTURA DE COMPONENTES

```
┌─────────────────────────────────────────────────────────┐
│                    App.jsx (Raíz)                        │
│  - Orquestación global                                   │
│  - Gestión de hooks principales                          │
│  - Estado: selectedDate, activeTab, isMobile             │
└──────────────┬──────────────────────────────────────────┘
               │
      ┌────────┴────────┐
      │                 │
      ▼                 ▼
 ┌─────────┐       ┌──────────┐
 │ Sidebar │       │ Contenido│
 │ Desktop │       │ Principal│
 └─────────┘       └────┬─────┘
                        │
      ┌─────────────────┼─────────────────┐
      │                 │                 │
      ▼                 ▼                 ▼
  Dashboard      TransactionForm    DailyExpenses
  (3 columnas)   (formulario)        (entrada rápida)
                   │                 │
                   └─ Valida         └─ DOP only
                   └─ Categorías    └─ Móvil optimizado
                   └─ Recurrencia
      │
      ├─ Pie Chart
      │  (gastos por categoría)
      │
      └─ Tabla
         (transacciones mes)
         ├─ Sorteable
         ├─ Deleteable
         └─ Responsive

      │
      ├─ Projection
      │  ├─ Gastos fijos promedio
      │  ├─ Gastos variables promedio
      │  └─ Proyección total
      │
      ├─ SavingsGoals
      │  ├─ Crear meta
      │  ├─ Calcular ahorro requerido
      │  └─ Ver progreso
      │
      ├─ Budgets
      │  ├─ Establecer presupuesto
      │  ├─ Automático (40%)
      │  └─ Barra de progreso
      │
      ├─ AdvancedStats
      │  ├─ Top 5 gastos
      │  ├─ Promedio por categoría
      │  └─ Promedio diario
      │
      ├─ Calendar
      │  ├─ Vista mensual
      │  ├─ Colores por intensidad
      │  └─ Clic para detalles
      │
      ├─ SearchFilter
      │  ├─ Criterios avanzados
      │  └─ Tabla de resultados
      │
      ├─ ReportPDF
      │  ├─ Generar PDF
      │  └─ Descargar
      │
      ├─ BackupRestore
      │  ├─ Exportar JSON
      │  ├─ Importar JSON
      │  └─ Reset (BE CAREFUL)
      │
      ├─ Alerts
      │  ├─ Mostrar alertas
      │  └─ Descartar
      │
      └─ ExchangeRateWidget
         ├─ Mostrar tasa actual
         └─ Actualizar manualmente

      │
      └─ FloatingNav (Móvil)
         └─ FAB circular con navegación
```

---

## 10. MÁQUINA DE ESTADOS - TRANSACCIÓN

```
                    ┌──────────┐
                    │  VACÍO   │ (inicial)
                    └────┬─────┘
                         │
                         │ Usuario abre formulario
                         ▼
                    ┌──────────┐
                    │ EDICIÓN  │
                    │ Ingresa  │
                    │ datos    │
                    └────┬─────┘
                         │
                    ├────┴────┐
                    │          │
            Error Val     OK
                    │          │
                    ▼          ▼
                INVALIDO    ┌──────────┐
                (loop)      │VALIDADO  │
                            │ Listo    │
                            │ para     │
                            │ guardar  │
                            └────┬─────┘
                                 │
                                 │ Usuario click "Agregar"
                                 ▼
                            ┌──────────┐
                            │ GUARDANDO│
                            │ (async)  │
                            └────┬─────┘
                                 │
                       ┌─────────┴──────────┐
                       │                    │
                  Error Save            OK
                       │                    │
                       ▼                    ▼
                  FALLO             ┌──────────┐
                  (retry)           │ GUARDADA │
                                    │ ✓ Éxito  │
                                    └────┬─────┘
                                         │
                                         │ Sincronizar localStorage
                                         ▼
                                    ┌──────────┐
                                    │ PERSISTIDA
                                    │ En storage│
                                    └────┬─────┘
                                         │
                                         │ Re-render Dashboard
                                         ▼
                                    ┌──────────┐
                                    │ VISIBLE  │
                                    │ En tabla │
                                    └──────────┘
```

---

## 11. PROCESO DE SINCRONIZACIÓN

```
┌─────────────────────────────────────────────────────────┐
│              USUARIO HACE CAMBIO                         │
│  addTransaction / updateTransaction / deleteTransaction │
└──────────────┬──────────────────────────────────────────┘
               │
               ▼
        setData() dispatch
               │
               ▼
        React actualiza state
               │
               ▼
        Componentes con data se re-renderizan
               │
               ▼
        useEffect([data, loading]) se ejecuta
               │
               ▼
        if (!loading) {
          try {
            encrypted = encryptData(data)
            localStorage.setItem(STORAGE_KEY, encrypted)
          } catch (error) {
            console.error('Error al guardar')
            // UI sigue funcionando
          }
        }
               │
               ▼
        localStorage actualizado
               │
        ┌──────┴──────────────┐
        │                     │
        ▼                     ▼
    OK               Fallo (lleno/permisos)
        │                     │
        ▼                     ▼
   ✓ Dato          ⚠️ Error en consola
   persistido       pero UI sigue
                    (datos en memoria)
                         │
                         │ Cerrar pestaña
                         ▼
                    ⚠️ Datos se pierden
```

---

## 12. ÁRBOL DE DEPENDENCIAS

```
App.jsx
├── useFinancesData
│   ├── useState (data, loading)
│   ├── useEffect (cargar localStorage)
│   ├── useEffect (sincronizar localStorage)
│   ├── Funciones (addTransaction, etc)
│   └── CryptoJS.AES (encriptación)
│
├── useTheme
│   ├── useState (isDark)
│   └── localStorage (theme_preference)
│
├── useSavingsGoals
│   ├── useState (goals)
│   ├── localStorage (savings_goals)
│   └── Función calculatePeriodicSavings
│
├── useBudgets
│   ├── useState (budgets)
│   └── localStorage (monthly_budgets)
│
├── useAlerts
│   ├── useState (alerts)
│   └── localStorage (alert_settings)
│
└── Componentes
    ├── Dashboard
    │   ├── useState (sortBy, sortOrder, isMobile)
    │   ├── useMemo (monthTransactions, balance)
    │   ├── useCallback (convertToDOP)
    │   ├── useEffect (resize listener)
    │   └── Recharts (PieChart)
    │
    ├── TransactionForm
    │   ├── useState (formData, isRecurring)
    │   ├── Validación de monto
    │   ├── Gestión de categorías dinámicas
    │   └── PAYMENT_METHODS config
    │
    ├── SavingsGoals
    │   ├── calculatePeriodicSavings (Hook)
    │   └── Validación de viabilidad
    │
    ├── Budgets
    │   ├── getAutoBudgetAmount
    │   ├── getSuggestedBudgets
    │   └── applyAutoBudgets
    │
    ├── Calendar
    │   ├── getDailyExpenses
    │   └── Colores por intensidad
    │
    ├── AdvancedStats
    │   └── getAdvancedStats
    │
    ├── SearchFilter
    │   └── searchTransactions
    │
    ├── ReportPDF
    │   └── jsPDF (external)
    │
    ├── BackupRestore
    │   ├── exportData
    │   └── importData
    │
    └── ExchangeRateWidget
        └── localStorage (exchange_rate)
```

---

## 13. CICLO DE VIDA COMPLETO

```
STARTUP
│
├─ Navegador carga App.jsx
├─ React renderea estructura base (loading spinner)
│
└─ useFinancesData hook monta
   │
   └─ useEffect(() => {
      try {
        const stored = localStorage.getItem('finanzas_data')
        const decrypted = decryptData(stored)
        setData(decrypted || initialData)
      } catch {
        // usar initialData
      }
    }, [])  // Se ejecuta una sola vez al montar
   │
   └─ Intenta desencriptar datos
      ├─ Si éxito → restaurar estado completo
      └─ Si error → usar initialData
   │
   └─ Establece loading = false
   │
   └─ useEffect([data, loading]) se ejecuta
      (segundo efecto, persiste cambios)

RUNTIME
│
├─ Usuario interactúa (agrega transacción)
│  │
│  └─ Component llama addTransaction(data)
│     │
│     └─ setData() dispatch
│        │
│        └─ Re-render componentes afectados
│           │
│           └─ useEffect([data, loading]) se ejecuta
│              │
│              └─ Encriptar y guardar en localStorage
│
├─ Usuario cambia mes
│  │
│  └─ setSelectedDate() dispatch
│     │
│     └─ Dashboard se re-renderea
│        │
│        └─ getTransactionsByMonth() filtra
│           │
│           └─ calculateBalance() calcula
│              │
│              └─ Mostrar nuevos datos

CLEANUP
│
├─ Usuario cierra pestaña/navegador
│  │
│  └─ useEffect() cleanup functions se ejecutan
│     │
│     └─ Limpiar event listeners (resize, etc)

SIGUIENTE SESIÓN
│
├─ Usuario abre app nuevamente
│  │
│  └─ App.jsx monta nuevamente
│     │
│     └─ useFinancesData obtiene datos de localStorage
│        │
│        └─ Restaura estado completo
│           │
│           └─ Usuario ve datos persistidos ✓
```

---

## 14. FLUJO DE VALIDACIÓN

```
TransactionForm.handleSubmit(event)
    │
    ├─ event.preventDefault()
    │
    ├─ VALIDAR MONTO
    │  └─ if (!formData.amount || parseFloat(amount) <= 0)
    │     └─ alert("Monto inválido")
    │     └─ return (BLOQUEAR)
    │
    ├─ VALIDAR CATEGORÍA
    │  └─ if (!formData.category)
    │     └─ alert("Categoría requerida")
    │     └─ return (BLOQUEAR)
    │
    ├─ AGREGAR CATEGORÍA SI NUEVA
    │  └─ if (newCategory && category === newCategory)
    │     └─ addIncomeCategory(newCategory)
    │        o
    │        addExpenseCategory(newCategory)
    │
    ├─ AGREGAR TRANSACCIÓN
    │  └─ onAddTransaction(formData)
    │     └─ addTransaction en hook
    │        └─ setData + localStorage + render
    │
    ├─ SI RECURRENTE
    │  └─ onAddRecurring({ ...formData, frequency })
    │     └─ addRecurringTransaction en hook
    │        └─ Guardar en array separado
    │
    └─ LIMPIAR FORMULARIO
       └─ setFormData(initialValues)
       └─ setIsRecurring(false)
       └─ setActiveTab('dashboard')

VALIDACIONES ADICIONALES EN OTROS PUNTOS:

SearchFilter.handleSearch()
    ├─ No requiere validación (criterios opcionales)
    └─ Todos los criterios son AND

deleteTransaction()
    ├─ window.confirm("¿Estás seguro?")
    └─ Solo si usuario confirma → eliminar

importData()
    ├─ JSON.parse() en try-catch
    ├─ Validar structure.transactions es Array
    ├─ Si falla → { success: false, message: error }
    └─ Si éxito → restaurar estado completo

SavingsGoals.addGoal()
    ├─ Validar targetAmount > 0
    ├─ Validar deadline es fecha válida
    ├─ Validar monthlyIncome > 0 (si usado)
    └─ Si todo OK → calculatePeriodicSavings() automático
       └─ Validar isAchievable (% ≤ 100%)
```

---

**Fin de Diagramas**  
**Fecha**: 4 de Enero de 2026  
**Documentación Completa del Sistema**
