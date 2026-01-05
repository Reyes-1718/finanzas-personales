# 🎯 PRÓXIMOS PASOS: Fase 2 del Asistente de Salud Financiera

**Documento**: Guía de Continuidad  
**Fecha**: 5 de enero de 2026  
**Para**: Siguiente Developer / Session

---

## 📋 Estado Actual

**Completado** ✅:
- Hook `usePurchaseAssistant.js` (lógica de cálculos)
- Modal `PurchaseAssistantModal.jsx` (3 pasos)
- Detector de hormiga `HormigaPatternDetector.jsx`
- Botón ahorro `SavedAhorroButton.jsx`
- Integración en `App.jsx`
- Documentación técnica completa

**No Iniciado** ❌:
- Gestión de deudas en `useFinancesData.js`
- Saldo arrastrado automático
- Dashboard con dual balance
- Persistencia de alertas mejorada
- Gráficos de impacto (Recharts)
- Transacciones reales en precálculo

---

## 🔧 Fase 2: Extensión de useFinancesData

### Task 2.1: Agregar gestión de deudas

**Archivo a editar**: `src/hooks/useFinancesData.js`

**Nuevos métodos a agregar**:

```javascript
// Agregar al estado inicial:
const [deudas, setDeudas] = useState([]);

// Métodos a implementar:

/**
 * Crea una nueva deuda
 */
const addDeuda = (deudaData) => {
  const newDeuda = {
    id: crypto.randomUUID(),
    productName: deudaData.productName,
    amount: deudaData.amount,
    monthlyPayment: deudaData.monthlyPayment,
    remainingAmount: deudaData.amount,
    months: deudaData.months,
    monthsRemaining: deudaData.months,
    debtType: deudaData.debtType,
    annualRate: deudaData.annualRate,
    createdAt: new Date().toISOString(),
    status: 'active'
  };
  setDeudas(prev => [...prev, newDeuda]);
  return newDeuda;
};

/**
 * Obtiene suma de cuotas activas
 */
const getTotalActivePayments = () => {
  return deudas
    .filter(d => d.status === 'active')
    .reduce((sum, d) => sum + parseFloat(d.monthlyPayment), 0);
};

/**
 * Obtiene deudas activas
 */
const getActiveDeudas = () => {
  return deudas.filter(d => d.status === 'active');
};

/**
 * Completa una deuda (la marca como paid)
 */
const completeDeuda = (deudaId) => {
  setDeudas(prev =>
    prev.map(d =>
      d.id === deudaId ? { ...d, status: 'paid', monthsRemaining: 0 } : d
    )
  );
};

/**
 * Calcula deuda total activa (para patrimonio neto)
 */
const getTotalActiveDeudas = () => {
  return deudas
    .filter(d => d.status === 'active')
    .reduce((sum, d) => sum + parseFloat(d.remainingAmount), 0);
};
```

### Task 2.2: Persistencia de deudas en LocalStorage

**En la sección de encrypting/saving**:

```javascript
// Dentro de useEffect que guarda datos:
const dataToEncrypt = {
  transactions: data.transactions,
  deudas: deudas,  // ← Agregar
  // ... resto de datos
};

// Cuando cargas datos:
if (decryptedData.deudas) {
  setDeudas(decryptedData.deudas);
}
```

---

## 🎯 Fase 2: Saldo Arrastrado Automático

### Task 2.3: Implementar saldo arrastrado

**Archivo a editar**: `src/hooks/useFinancesData.js`

**Lógica a agregar** (en useEffect):

```javascript
useEffect(() => {
  // Detectar cambio de mes al cargar app
  const lastTransactionDate = data.transactions.length > 0
    ? new Date(data.transactions[data.transactions.length - 1].date)
    : null;
  
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Si cambió de mes, crear transacción de saldo arrastrado
  if (lastTransactionDate) {
    const lastMonth = lastTransactionDate.getMonth();
    const lastYear = lastTransactionDate.getFullYear();

    if (lastMonth !== currentMonth || lastYear !== currentYear) {
      // Calcular balance histórico del mes anterior
      const historicalBalance = calculateHistoricalBalance(
        data.transactions,
        lastYear,
        lastMonth
      );

      // Crear transacción de saldo arrastrado
      if (historicalBalance > 0) {
        const carriedOverTransaction = {
          id: crypto.randomUUID(),
          type: 'ingreso',
          category: 'saldo-arrastrado',
          amount: historicalBalance,
          description: `Saldo arrastrado de ${getMonthName(lastMonth)} ${lastYear}`,
          date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`,
          currency: 'DOP',
          paymentMethod: 'system'
        };
        
        addTransaction(carriedOverTransaction);
      }
    }
  }
}, [loading]);

/**
 * Helper: calcula balance histórico acumulado hasta un mes
 */
const calculateHistoricalBalance = (transactions, year, month) => {
  return transactions
    .filter(t => {
      const tDate = new Date(t.date);
      return tDate.getFullYear() < year ||
        (tDate.getFullYear() === year && tDate.getMonth() <= month);
    })
    .reduce((sum, t) => {
      const amount = parseFloat(t.amount);
      return sum + (t.type === 'ingreso' ? amount : -amount);
    }, 0);
};
```

---

## 📊 Fase 2: Dashboard Dual Balance

### Task 2.4: Agregar cards de dual balance

**Archivo a editar**: `src/components/Dashboard.jsx`

**Ubicación**: Arriba del gráfico de gastos, reemplazar o agregar al lado del balance actual:

```jsx
{/* DUAL BALANCE CARDS */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
  {/* Card 1: Balance del Mes Actual */}
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-blue-600">
    <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">
      BALANCE DEL MES ACTUAL
    </p>
    <p className="text-3xl font-bold text-gray-900 dark:text-white">
      RD$ {monthlyBalance.toLocaleString('es-DO', { maximumFractionDigits: 2 })}
    </p>
    <p className="text-xs text-gray-500 mt-2">
      {months[selectedDate.month]} {selectedDate.year}
    </p>
  </div>

  {/* Card 2: Balance Histórico Total (Patrimonio) */}
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-green-600">
    <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">
      PATRIMONIO TOTAL (Histórico)
    </p>
    <p className="text-3xl font-bold text-gray-900 dark:text-white">
      RD$ {patrimonioTotal.toLocaleString('es-DO', { maximumFractionDigits: 2 })}
    </p>
    <p className="text-xs text-gray-500 mt-2">
      Desde {getFirstTransactionDate(data.transactions)}
    </p>
  </div>
</div>

{/* SEMÁFORO DE DISPONIBILIDAD (GMM) */}
<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
  <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-4">
    💰 DISPONIBLE PARA GASTOS LIBRES ESTE MES
  </p>
  
  {/* Barra de progreso */}
  <div className="mb-2 flex justify-between text-sm">
    <span className="text-gray-700 dark:text-gray-300">
      RD$ {currentMonthSpent.toLocaleString('es-DO', { maximumFractionDigits: 2 })}
    </span>
    <span className="font-bold text-gray-900 dark:text-white">
      RD$ {gmmTotal.toLocaleString('es-DO', { maximumFractionDigits: 2 })}
    </span>
  </div>
  
  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
    <div
      className={`h-full transition-all ${
        percentageSpent < 70
          ? 'bg-green-500'
          : percentageSpent < 90
          ? 'bg-yellow-500'
          : 'bg-red-500'
      }`}
      style={{ width: `${Math.min(percentageSpent, 100)}%` }}
    />
  </div>
  
  {percentageSpent >= 100 && (
    <p className="text-red-600 dark:text-red-400 text-sm mt-2 font-semibold">
      ⚠️ Agotaste tu presupuesto libre. Cualquier gasto extra afectará tus ahorros.
    </p>
  )}
</div>
```

**Helper functions a agregar**:

```javascript
const patrimonioTotal = calculateHistoricalBalance(
  data.transactions,
  selectedDate.year,
  selectedDate.month
);

const gmmTotal = calculateMaxMonthlySpending(
  monthlyIncome,
  carriedBalance,
  fixedExpenses,
  sacredGoalPayments
);

const currentMonthSpent = data.transactions
  .filter(t => {
    const tDate = new Date(t.date);
    return tDate.getMonth() === selectedDate.month &&
           tDate.getFullYear() === selectedDate.year &&
           t.type === 'gasto-variable';
  })
  .reduce((sum, t) => sum + parseFloat(t.amount), 0);

const percentageSpent = (currentMonthSpent / gmmTotal) * 100;
```

---

## 🔔 Fase 2: Sistema de Alertas Persistentes

### Task 2.5: Extender useAlerts.js

**Archivo a editar**: `src/hooks/useAlerts.js`

**Agregar estructura**:

```javascript
// Agregar a estado inicial:
const [decisionAlerts, setDecisionAlerts] = useState([]);

/**
 * Crea alerta de decisión financiera (desde precálculo)
 */
const addDecisionAlert = (alertData) => {
  const alert = {
    id: crypto.randomUUID(),
    type: alertData.type,        // 'critical', 'danger', 'warning'
    message: alertData.message,
    code: alertData.code,
    context: alertData.context,  // "Compra iPhone", "Deuda Ratio", etc.
    timestamp: new Date().toISOString(),
    read: false,
    decision: null                // 'ignored', 'accepted', null
  };
  
  setDecisionAlerts(prev => [...prev, alert]);
  persistAlerts([...decisionAlerts, alert]);
  return alert;
};

/**
 * Marca alerta como leída
 */
const markAlertAsRead = (alertId) => {
  const updated = decisionAlerts.map(a =>
    a.id === alertId ? { ...a, read: true } : a
  );
  setDecisionAlerts(updated);
  persistAlerts(updated);
};

/**
 * Obtiene alertas no leídas
 */
const getUnreadAlerts = () => {
  return decisionAlerts.filter(a => !a.read);
};

/**
 * Persiste alertas en localStorage
 */
const persistAlerts = (alerts) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(alerts),
      import.meta.env.VITE_ENCRYPTION_KEY
    ).toString();
    localStorage.setItem('finanzas_decision_alerts', encrypted);
  } catch (err) {
    console.error('Error persisting alerts:', err);
  }
};
```

---

## 📈 Fase 2: Gráficos de Impacto

### Task 2.6: Crear componente ImpactDashboard

**Nuevo archivo**: `src/components/ImpactDashboard.jsx`

**Estructura básica**:

```jsx
import React from 'react';
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, 
         Tooltip, Legend, XAxis, YAxis } from 'recharts';

export default function ImpactDashboard({
  currentBalance,
  monthlyIncome,
  savingsCapacity,
  purchaseAmount,
  monthlyPayment,
  debtRatio,
  emergencyFundMonths,
  darkMode
}) {
  // Generar datos de proyección
  const projectionData = generateProjectionData(
    currentBalance,
    savingsCapacity,
    monthlyPayment,
    purchaseAmount,
    12 // 12 meses de proyección
  );

  // Generar datos de gauges
  const debtRatioPercent = (debtRatio / 30) * 100; // 0-100%
  const emergencyFundPercent = (emergencyFundMonths / 6) * 100;

  return (
    <div className="space-y-6">
      {/* ROW 1: Gauges */}
      <div className="grid grid-cols-2 gap-4">
        {/* Gauge 1: Debt Ratio */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Ratio de Endeudamiento
          </p>
          <div className="relative w-32 h-32 mx-auto">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Gauge background */}
              <circle cx="50" cy="50" r="45" fill="none" 
                      stroke="#e5e7eb" strokeWidth="8" />
              {/* Gauge fill */}
              <circle cx="50" cy="50" r="45" fill="none"
                      stroke={debtRatio > 30 ? '#ef4444' : '#10b981'}
                      strokeWidth="8"
                      strokeDasharray={`${debtRatioPercent * 2.83} 283`}
                      strokeLinecap="round" />
              {/* Pointer */}
              <line x1="50" y1="50" x2="50" y2="10" 
                    stroke="#374151" strokeWidth="2" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {debtRatio.toFixed(0)}%
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-4">
            Límite: 30%
          </p>
        </div>

        {/* Gauge 2: Emergency Fund */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Fondo Emergencia
          </p>
          <div className="relative w-32 h-32 mx-auto">
            {/* Similar gauge para emergencia */}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-4">
            Objetivo: 6 meses
          </p>
        </div>
      </div>

      {/* ROW 2: Projection Chart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          📊 Proyección de Balance (12 meses)
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={projectionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSinCompra" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorConCompra" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="sinCompra" stroke="#3b82f6" 
                  fillOpacity={1} fill="url(#colorSinCompra)" 
                  name="Sin compra" />
            <Area type="monotone" dataKey="conCompra" stroke="#ef4444" 
                  fillOpacity={1} fill="url(#colorConCompra)" 
                  name="Con compra" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/**
 * Genera datos de proyección para 12 meses
 */
function generateProjectionData(currentBalance, savingsCapacity, monthlyPayment, purchaseAmount, months) {
  const data = [];
  let balanceSinCompra = currentBalance;
  let balanceConCompra = currentBalance - purchaseAmount;

  for (let i = 1; i <= months; i++) {
    balanceSinCompra += savingsCapacity;
    balanceConCompra += (savingsCapacity - monthlyPayment);

    data.push({
      mes: `M${i}`,
      sinCompra: Math.round(balanceSinCompra),
      conCompra: Math.round(balanceConCompra)
    });
  }

  return data;
}
```

---

## 🎯 Fase 2: Crear Transacción Real en Modal

### Task 2.7: Completar flujo de registro de compra

**Editar**: `src/components/PurchaseAssistantModal.jsx`

**En función handleConfirmPurchase**:

```javascript
const handleConfirmPurchase = async () => {
  if (result) {
    try {
      // 1. Crear transacción de compra
      const purchaseTransaction = {
        type: 'gasto-variable', // o 'gasto-fijo' si es recurrente
        category: formData.category,
        amount: formData.amount,
        description: formData.productName,
        date: new Date().toISOString().split('T')[0],
        currency: 'DOP',
        paymentMethod: formData.paymentMethod
      };

      // 2. Si es a cuotas, crear deuda
      if (formData.paymentMethod === 'cuotas') {
        const deuda = {
          productName: formData.productName,
          amount: parseFloat(formData.amount),
          monthlyPayment: parseFloat(result.monthlyPayment),
          months: parseInt(formData.months),
          debtType: formData.debtType,
          annualRate: result.annualRate
        };
        
        onAddDeuda(deuda); // Pasar a App.jsx para useFinancesData
      }

      // 3. Registrar transacción
      onAddTransaction(purchaseTransaction);

      // 4. Crear alerta de decisión
      const alertsToCreate = result.alerts.map(alert => ({
        message: alert.message,
        code: alert.code,
        type: alert.type,
        context: `Compra de ${formData.productName}`
      }));
      
      onAddAlerts(alertsToCreate);

      // 5. Mostrar confirmación
      alert(`✅ Compra registrada: ${formData.productName} por RD$ ${formData.amount}`);

      // 6. Cerrar modal
      handleClose();
    } catch (error) {
      console.error('Error registering purchase:', error);
      alert('Error al registrar la compra. Intenta de nuevo.');
    }
  }
};
```

---

## ✅ Checklist de Fase 2

- [ ] Extender `useFinancesData` con deudas
- [ ] Implementar saldo arrastrado automático
- [ ] Agregar dual balance cards en Dashboard
- [ ] Crear "Semáforo de Disponibilidad" (GMM)
- [ ] Extender `useAlerts` con alertas de decisión
- [ ] Crear `ImpactDashboard` con gráficos
- [ ] Integrar componente `ImpactDashboard` en modal (Paso 2)
- [ ] Crear transacciones reales en precálculo
- [ ] Crear deudas reales en precálculo
- [ ] Persistir alertas de decisión
- [ ] Testing completo de flujo end-to-end
- [ ] Documentación actualizada

---

## 📅 Estimación de Tiempo

| Task | Horas | Complejidad |
|---|---|---|
| 2.1-2.2: Deudas en useFinancesData | 4-5 h | Media |
| 2.3: Saldo arrastrado | 3-4 h | Baja |
| 2.4: Dashboard dual balance | 4-5 h | Media |
| 2.5: Alertas persistentes | 3-4 h | Baja |
| 2.6: ImpactDashboard (Recharts) | 5-6 h | Alta |
| 2.7: Transacciones reales | 4-5 h | Media |
| Testing y QA | 8-10 h | Media |
| **TOTAL** | **31-39 h** | |

---

## 🚀 Recomendaciones

1. **Hacer los tasks en orden** (2.1 → 2.2 → ... → 2.7)
2. **Test cada task** antes de pasar al siguiente
3. **Mantener `npm run dev` corriendo** para verificar cambios en tiempo real
4. **Guardar cambios en git** después de cada task completada
5. **Revisar la documentación** en FINANCIAL_HEALTH_ASSISTANT_SPEC.md si tienes dudas

---

**Documento creado**: 5 de enero de 2026  
**Estado**: Listo para Fase 2  
**Contacto**: Para preguntas, revisar IMPLEMENTATION_SUMMARY.md
