````markdown
# 🛠️ Implementación Bimoneda - Detalles Técnicos

**Tipo:** HOW-TO Guide (Implementación paso a paso)  
**Para:** Desarrolladores implementando bimoneda  
**Relacionado con:** [BIMONEDA_SYSTEM.md](../BUSINESS_RULES/BIMONEDA_SYSTEM.md) (regla de negocio)  
**Última actualización:** 6 de enero de 2026

---

## 📋 Tabla de Contenidos

1. [Estructura de Datos](#estructura-de-datos)
2. [Cambios en Hooks](#cambios-en-hooks)
3. [Cambios en Componentes](#cambios-en-componentes)
4. [Visualizaciones en Reportes](#visualizaciones-en-reportes)
5. [Exportación de Datos](#exportación-de-datos)
6. [Validaciones](#validaciones)

---

## 🏗️ Estructura de Datos

### Transacción Mejorada

Cada transacción ahora incluye `exchangeRate`:

```javascript
// ANTES (sin bimoneda):
{
  id: '1704538800000',
  amount: '100',
  currency: 'DOP',
  type: 'gasto-variable',
  category: 'Tecnología',
  date: '2026-01-05',
  description: 'Compra en Amazon',
  paymentMethod: 'tarjeta-credito'
}

// DESPUÉS (con bimoneda):
{
  id: '1704538800000',
  amount: '100',
  currency: 'USD',                    // Ahora puede ser USD
  exchangeRate: 63.52,                // ← NUEVO: Tasa grabada
  type: 'gasto-variable',
  category: 'Tecnología',
  date: '2026-01-05',
  description: 'Compra en Amazon',
  paymentMethod: 'tarjeta-credito'
}
```

### Almacenamiento en localStorage

```javascript
// En localStorage, encriptado:
localStorage.setItem('expenses_encrypted', CryptoJS.encrypt(
  JSON.stringify([
    {
      id: '1704538800000',
      amount: '100',
      currency: 'USD',
      exchangeRate: 63.52,  // Campo nuevo
      type: 'gasto-variable',
      category: 'Tecnología',
      date: '2026-01-05',
      description: 'Compra en Amazon',
      paymentMethod: 'tarjeta-credito'
    }
  ]),
  'encryption-key'
))
```

---

## 🔄 Cambios en Hooks

### useFinancesData.js

#### Función: addTransaction

```javascript
// ANTES:
const addTransaction = (newTransaction) => {
  const convertedAmount = currency === 'USD' 
    ? parseFloat(amount) * exchangeRate 
    : amount;
  setExpenses([...expenses, {
    id: timestamp,
    amount: convertedAmount,
    currency: 'DOP',  // Siempre guardaba en DOP
    type,
    category,
    date,
    description,
    paymentMethod
  }]);
};

// DESPUÉS:
const addTransaction = (newTransaction) => {
  // Grabar en moneda original + tasa
  setExpenses([...expenses, {
    id: timestamp,
    amount: newTransaction.amount,
    currency: newTransaction.currency,        // USD o DOP
    exchangeRate: newTransaction.currency === 'USD' 
      ? newTransaction.exchangeRate 
      : null,                                  // Solo para USD
    type: newTransaction.type,
    category: newTransaction.category,
    date: newTransaction.date,
    description: newTransaction.description,
    paymentMethod: newTransaction.paymentMethod
  }]);
};
```

#### Función: convertToDOP

```javascript
// ANTES:
const convertToDOP = (amount, currency) => {
  const rate = getExchangeRate();  // Siempre usa tasa global
  if (currency === 'USD') {
    return parseFloat(amount) * rate;
  }
  return parseFloat(amount);
};

// DESPUÉS:
const convertToDOP = (amount, currency, exchangeRate = null) => {
  // Si se pasa tasa de transacción, usar esa (INMUTABLE)
  const rate = exchangeRate !== null ? exchangeRate : getExchangeRate();
  
  if (currency === 'USD') {
    return parseFloat(amount) * rate;
  }
  return parseFloat(amount);
};
```

**Cómo se llama:**
```javascript
// Desde Dashboard.jsx:
const amountInDOP = convertToDOP(
  transaction.amount,
  transaction.currency,
  transaction.exchangeRate  // ← Tasa de la transacción
);
```

#### Función: calculateBalance

```javascript
// DESPUÉS (actualizada para usar tasa de transacción):
const calculateBalance = () => {
  let balance = 0;
  expenses.forEach(expense => {
    const amount = convertToDOP(
      expense.amount,
      expense.currency,
      expense.exchangeRate  // ← Usa tasa de cada transacción
    );
    
    if (expense.type === 'ingreso') {
      balance += amount;
    } else {
      balance -= amount;
    }
  });
  return balance;
};
```

#### Función: getAdvancedStats

```javascript
// DESPUÉS (retorna estadísticas bimoneda):
const getAdvancedStats = () => {
  let totalDOP = 0;
  let totalUSD = 0;
  let topFive = [];

  expenses.forEach(expense => {
    if (expense.currency === 'USD') {
      totalUSD += parseFloat(expense.amount);
      const inDOP = convertToDOP(
        expense.amount,
        'USD',
        expense.exchangeRate
      );
      totalDOP += inDOP;
    } else {
      totalDOP += parseFloat(expense.amount);
    }
  });

  return {
    totalDOP,
    totalUSD,
    topFive: [...],  // Incluye info de ambas monedas
    categories: {...}  // Desglose DOP/USD por categoría
  };
};
```

---

## 🎨 Cambios en Componentes

### Dashboard.jsx

```javascript
// Al mostrar cada transacción:
expenses.map(transaction => (
  <div key={transaction.id}>
    <p>{transaction.description}</p>
    
    {transaction.currency === 'USD' && (
      <p className="text-blue-600">
        US$ {transaction.amount} @ {transaction.exchangeRate}
      </p>
    )}
    
    <p className="font-bold">
      RD$ {convertToDOP(
        transaction.amount,
        transaction.currency,
        transaction.exchangeRate  // ← Tasa de transacción
      )}
    </p>
  </div>
))
```

### Budgets.jsx

```javascript
// Al calcular gasto por categoría:
const getSpentByCategory = (categoryName) => {
  let spent = 0;
  expenses
    .filter(e => e.category === categoryName)
    .forEach(e => {
      const amountDOP = convertToDOP(
        e.amount,
        e.currency,
        e.exchangeRate  // ← Tasa de transacción
      );
      spent += amountDOP;
    });
  return spent;
};
```

---

## 📊 Visualizaciones en Reportes

### ReportPDF.jsx - Tabla de Transacciones del Mes

```javascript
const BimonedaTable = ({ transactions }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Categoría</th>
          <th>Descripción</th>
          <th>Moneda</th>
          <th>Monto Original</th>
          <th>Tasa</th>
          <th>RD$</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(t => (
          <tr key={t.id}>
            <td>{t.date}</td>
            <td>{t.category}</td>
            <td>{t.description}</td>
            <td>{t.currency}</td>
            <td>
              {t.currency === 'USD' 
                ? `US$ ${t.amount}` 
                : `RD$ ${t.amount}`}
            </td>
            <td>{t.exchangeRate || '-'}</td>
            <td>
              RD$ {convertToDOP(
                t.amount,
                t.currency,
                t.exchangeRate
              ).toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

### AdvancedStats.jsx - Top 5 Gastos

```javascript
const TopFiveWithBimoneda = () => {
  const stats = getAdvancedStats();
  
  return (
    <div>
      {stats.topFive.map((item, i) => (
        <div key={i} className="border-b p-4">
          <h4>{item.category}</h4>
          <p className="text-sm">{item.date}</p>
          
          {/* Mostrar en ambas monedas */}
          {item.currency === 'USD' ? (
            <>
              <p className="text-blue-600">
                💵 US$ {item.amount} @ {item.exchangeRate}
              </p>
              <p className="text-green-600">
                💰 RD$ {item.amountInDOP.toFixed(2)}
              </p>
            </>
          ) : (
            <p className="text-green-600">
              💰 RD$ {item.amount}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};
```

### AdvancedStats.jsx - Categorías por Moneda

```javascript
const CategoriesWithBimoneda = () => {
  const stats = getAdvancedStats();
  
  return (
    <div>
      {Object.entries(stats.categories).map(([cat, data]) => (
        <div key={cat} className="mb-6">
          <h4>{cat}</h4>
          
          {/* Total en ambas monedas */}
          {data.usdCount > 0 && (
            <p className="text-blue-600">
              💵 Total USD: ${data.totalUSD.toFixed(2)}
            </p>
          )}
          <p className="text-green-600">
            💰 Total DOP: RD$ {data.totalDOP.toFixed(2)}
          </p>
          
          {/* Desglose */}
          <p className="text-xs text-gray-600">
            USD → RD$: {data.dopFromUsd.toFixed(2)} 
            | DOP directo: RD$ {data.dopDirect.toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  );
};
```

### AdvancedStats.jsx - Promedio por Categoría

```javascript
const AverageWithBimoneda = () => {
  const stats = getAdvancedStats();
  
  return (
    <div>
      {Object.entries(stats.averages).map(([cat, data]) => (
        <div key={cat} className="mb-4">
          <h4>{cat}</h4>
          
          {/* Promedio en ambas monedas */}
          {data.usdCount > 0 && (
            <p className="text-blue-600">
              💵 Promedio USD: ${data.avgUSD.toFixed(2)}
            </p>
          )}
          <p className="text-green-600">
            💰 Promedio DOP: RD$ {data.avgDOP.toFixed(2)}
          </p>
          
          {/* Desglose de transacciones */}
          <p className="text-xs">
            ({data.usdCount} en USD + {data.dopCount} en DOP)
          </p>
        </div>
      ))}
    </div>
  );
};
```

---

## 📤 Exportación de Datos

### Exportar como CSV

```javascript
const exportAsCSV = (transactions) => {
  const headers = 'Fecha,Categoría,Monto Original,Moneda,Tasa,RD$\n';
  
  const rows = transactions.map(t => {
    const dopAmount = convertToDOP(t.amount, t.currency, t.exchangeRate);
    return `${t.date},${t.category},${t.amount},${t.currency},${t.exchangeRate || 'N/A'},${dopAmount.toFixed(2)}`;
  }).join('\n');
  
  return headers + rows;
};

// Usar en botón:
const handleExportCSV = () => {
  const csv = exportAsCSV(expenses);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'bimoneda-transacciones.csv';
  a.click();
};
```

### Exportar como JSON

```javascript
const exportAsJSON = (transactions) => {
  const data = {
    exportDate: new Date().toISOString(),
    totalTransactions: transactions.length,
    transactions: transactions.map(t => ({
      ...t,
      amountInDOP: convertToDOP(t.amount, t.currency, t.exchangeRate),
      conversionRate: t.exchangeRate || getExchangeRate()
    }))
  };
  
  return JSON.stringify(data, null, 2);
};
```

### Exportar como HTML (para PDF)

```javascript
const exportAsHTML = (transactions) => {
  return `
    <table border="1" cellpadding="10">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Categoría</th>
          <th>Monto</th>
          <th>Moneda</th>
          <th>Tasa</th>
          <th>RD$</th>
        </tr>
      </thead>
      <tbody>
        ${transactions.map(t => `
          <tr>
            <td>${t.date}</td>
            <td>${t.category}</td>
            <td>${t.amount}</td>
            <td>${t.currency}</td>
            <td>${t.exchangeRate || '-'}</td>
            <td>${convertToDOP(t.amount, t.currency, t.exchangeRate).toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
};
```

---

## ✅ Validaciones

### En Tiempo de Creación

```javascript
const validateTransaction = (transaction) => {
  // ✅ Si es USD, debe tener tasa
  if (transaction.currency === 'USD' && !transaction.exchangeRate) {
    throw new Error('Transacción USD debe incluir tasa de cambio');
  }
  
  // ✅ Tasa debe ser número válido
  if (transaction.exchangeRate && typeof transaction.exchangeRate !== 'number') {
    throw new Error('Tasa de cambio debe ser un número');
  }
  
  // ✅ Monto debe ser número válido
  if (isNaN(parseFloat(transaction.amount))) {
    throw new Error('Monto debe ser un número válido');
  }
  
  // ✅ Moneda debe ser válida
  if (!['USD', 'DOP'].includes(transaction.currency)) {
    throw new Error('Moneda debe ser USD o DOP');
  }
  
  return true;
};
```

### En Tiempo de Lectura

```javascript
const sanitizeTransaction = (transaction) => {
  // Si no tiene tasa pero es USD, marcar como migrado
  if (transaction.currency === 'USD' && !transaction.exchangeRate) {
    console.warn(`Transacción ${transaction.id} sin tasa grabada (pre-bimoneda)`);
    transaction.exchangeRate = getExchangeRate(); // Usar tasa global como fallback
  }
  
  return transaction;
};
```

---

## 🔗 Integración con Otros Sistemas

### Presupuestos (Budgets.jsx)
✅ Usa `convertToDOP(amount, currency, exchangeRate)` → Funciona con tasa inmutable

### Metas de Ahorro (SavingsGoals.jsx)
✅ Usa `calculateBalance()` → Que usa tasas inmutables

### Proyecciones (Projection.jsx)
✅ Usa `calculateProjection()` → Que usa tasas inmutables

### Alertas (Alerts.jsx)
✅ Usa `getSpentByCategory()` → Que usa tasas inmutables

---

## 🧪 Casos de Prueba

### Caso 1: Nueva transacción USD
```javascript
addTransaction({
  amount: '100',
  currency: 'USD',
  exchangeRate: 63.52,  // Tasa al momento
  category: 'Tecnología',
  date: '2026-01-05'
})

// Validar:
// ✅ Se graba con exchangeRate = 63.52
// ✅ convertToDOP(100, 'USD', 63.52) = 6352.00
// ✅ Si tasa global cambia a 65, sigue mostrando 6352.00
```

### Caso 2: Cambio de tasa global
```javascript
// Transacción antigua:
const old = {amount: '100', currency: 'USD', exchangeRate: 63.52}

// Cambiar tasa global a:
setExchangeRate(65.00)

// Validar:
// ✅ convertToDOP(100, 'USD', 63.52) = 6352.00 (INMUTABLE)
// ✅ Nueva transacción usa 65.00
// ✅ Balance sigue igual (no recalcula antiguas)
```

### Caso 3: Compatibilidad con antiguas
```javascript
// Transacción pre-bimoneda (sin exchangeRate):
const old = {amount: '100', currency: 'USD'}

// Convertir:
// ✅ convertToDOP(100, 'USD', undefined) = 100 * getExchangeRate()
// ✅ Usa tasa global (fallback)
// ✅ Se recomienda migrar después
```

---

## 📝 Checklist de Implementación

- [ ] Estructura de datos: Añadir `exchangeRate` a transacciones
- [ ] useFinancesData.js: Actualizar `convertToDOP()` con parámetro `exchangeRate`
- [ ] useFinancesData.js: Actualizar `addTransaction()` para grabar tasa
- [ ] useFinancesData.js: Actualizar `calculateBalance()` para usar tasa
- [ ] useFinancesData.js: Añadir `getAdvancedStats()` con desglose bimoneda
- [ ] Dashboard.jsx: Mostrar USD y RD$ en transacciones
- [ ] Budgets.jsx: Usar tasa de transacción en `getSpentByCategory()`
- [ ] ReportPDF.jsx: Añadir tabla bimoneda
- [ ] AdvancedStats.jsx: Añadir visualización de Top 5 con bimoneda
- [ ] AdvancedStats.jsx: Añadir categorías por moneda
- [ ] AdvancedStats.jsx: Añadir promedio por moneda
- [ ] Exportar como CSV con tasas
- [ ] Exportar como JSON con conversiones
- [ ] Validación: Transacciones USD siempre tienen tasa
- [ ] Validación: Tasa es inmutable (no cambiar luego)
- [ ] Pruebas: Cambiar tasa global y verificar que antiguas no recalculan

---

**Este documento es referencia técnica.**  
**Para la regla de negocio, ver:** [BIMONEDA_SYSTEM.md](../BUSINESS_RULES/BIMONEDA_SYSTEM.md)

````
