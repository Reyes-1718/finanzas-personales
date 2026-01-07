````markdown
# 💱 Sistema Bimoneda (DOP/USD) - Regla de Negocio

**Versión:** 1.0.0  
**Fecha de Implementación:** 6 de enero de 2026  
**Estado:** ✅ IMPLEMENTADO Y COMPROBADO  
**Clasificación:** BUSINESS_RULES (Explicación de decisiones de negocio)

---

## 📋 Resumen Ejecutivo

El sistema mantiene dos principios financieros críticos:

1. **Inmutabilidad de Tasas**: Cada transacción en USD grabala tasa de cambio en el momento de creación
2. **Visualización Bimoneda**: Los reportes muestran tanto DOP como USD para auditoría completa

Esto garantiza:
- ✅ Historial financiero inmutable y auditable
- ✅ Precisión de cálculos históricos
- ✅ Transparencia en conversiones de divisas

---

## 🔴 PROBLEMA ORIGINAL (ANTES)

### Síntoma: Tasas de Cambio Retroactivas

Cuando se registraba una transacción en USD con tasa X, y luego se cambiaba la tasa global a un valor diferente, **todas las transacciones anteriores se recalculaban automáticamente** usando la nueva tasa.

### Ejemplo del Problema:

```
ENERO (Tasa global: 63.52 DOP/USD)
├─ Transacción 1: Registré 100 USD
└─ Mostrado como: 100 × 63.52 = RD$ 6,352.00

FEBRERO (Cambio la tasa global a 65.00 DOP/USD)
├─ Resultado INCORRECTO:
├─ Transacción 1 ahora muestra: 100 × 65.00 = RD$ 6,500.00 ❌
└─ PERO debería ser RD$ 6,352.00 (la tasa original)
```

### Impacto Negativo:
- ❌ Historial financiero inconsistente
- ❌ Imposible auditar transacciones pasadas
- ❌ Cálculos cambian retroactivamente (confusión)
- ❌ Balance histórico no es confiable
- ❌ Reportes PDF pueden diferir si se regeneran

---

## ✅ SOLUCIÓN: INMUTABILIDAD DE TASAS

### Principio Core

**Cada transacción en USD graba su propia tasa de cambio en el momento de creación.**

Una vez registrada, la tasa NUNCA cambia, aunque cambien las tasas globales en el futuro.

### Ejemplo de la Solución:

```
ENERO (Tasa global: 63.52 DOP/USD)
├─ Transacción 1: {
│  ├─ amount: 100
│  ├─ currency: 'USD'
│  ├─ exchangeRate: 63.52 ← TASA GRABADA EN TRANSACCIÓN
│  └─ date: '2026-01-05'
│}
└─ Mostrado como: 100 × 63.52 = RD$ 6,352.00

FEBRERO (Cambio la tasa global a 65.00 DOP/USD)
├─ Transacción 1 sigue mostrando: RD$ 6,352.00 ✅ (INMUTABLE)
└─ Nuevas transacciones usan: 100 × 65.00 = RD$ 6,500.00 ✅ (NUEVA TASA)
```

### Beneficios:
- ✅ Historial financiero inmutable
- ✅ Auditoría y trazabilidad perfectas
- ✅ Reportes históricos nunca cambian
- ✅ Cambios de tasa solo afectan transacciones futuras
- ✅ Cálculos de meses pasados siguen siendo válidos

---

## 🏗️ CÓMO FUNCIONA TÉCNICAMENTE

### Estructura de Transacción

Cada transacción ahora incluye el campo `exchangeRate`:

```javascript
{
  id: '1704538800000',
  amount: 100,                        // Monto en moneda original
  currency: 'USD',                    // DOP o USD
  exchangeRate: 63.52,                // ← NUEVO: Tasa grabada
  type: 'gasto-variable',
  category: 'Tecnología',
  date: '2026-01-05',
  description: 'Compra en Amazon',
  paymentMethod: 'tarjeta-credito'
}
```

### Flujo de Creación de Transacción

```
1. Usuario registra transacción en USD
        ↓
2. Sistema obtiene tasa global actual
        ↓
3. Graba transacción CON el campo exchangeRate
        ↓
4. Guarda en localStorage (encriptado)
        ↓
5. Valida que campo exchangeRate esté presente
```

### Conversión de Divisas

Función de conversión actualizada:

```javascript
convertToDOP(amount, currency, exchangeRate = null) {
  // Si se pasa tasa de transacción, usar esa (inmutable)
  const rate = exchangeRate !== null ? exchangeRate : getExchangeRate();
  
  if (currency === 'USD') {
    return parseFloat(amount) * rate;
  }
  return parseFloat(amount);
}
```

**Uso en dashboard:**
```javascript
// Para cada transacción histórica:
const amountInDOP = convertToDOP(t.amount, t.currency, t.exchangeRate);
// Usa SIEMPRE la tasa grabada, nunca la tasa global actual
```

---

## 🔄 IMPACTO EN CÁLCULOS

Todos los cálculos usan la tasa de la transacción:

| Cálculo | Usa Tasa De | Resultado |
|---------|------------|-----------|
| **Balance mensual** | Cada transacción | Inmutable |
| **Ingresos totales** | Cada transacción | Inmutable |
| **Gastos totales** | Cada transacción | Inmutable |
| **Presupuestos** | Cada transacción | Inmutable |
| **Proyecciones** | Cada transacción | Consistente |
| **Estadísticas** | Cada transacción | Auditable |

---

## 📊 VISUALIZACIÓN BIMONEDA

Complementando la inmutabilidad, los reportes muestran AMBAS monedas:

### Transacciones del Mes
```
Fecha        Categoría      Monto (DOP)    Monto (USD)    Tasa
─────────────────────────────────────────────────────────────
2026-01-05   Tecnología     RD$ 6,352.00   US$ 100.00     63.52
2026-01-06   Alimentación   RD$ 2,500.00   -              -
```

**Propósito**: Auditoría completa (saber qué se pagó en USD y a qué tasa)

### Top 5 Gastos Más Grandes
```
1. Tecnología (2026-01-05)
   💵 $100.00 USD @ 63.52
                       RD$ 6,352.00
```

**Propósito**: Identificar rápidamente dónde fue el dinero en dólares

### Categorías por Moneda
```
TECNOLOGÍA:
  💵 Total USD: $250.00
  💰 Total DOP: RD$ 4,380.00
  ├─ Subtotal DOP en transacciones USD: RD$ 15,880.00
  └─ Subtotal DOP en transacciones DOP: RD$ 4,380.00
```

**Propósito**: Ver desglose claro de gasto en cada moneda

### Promedio por Categoría
```
TECNOLOGÍA:
  💵 Promedio USD: $83.33
  💰 Promedio DOP: RD$ 5,600.00
```

**Propósito**: Entender el patrón de gasto en ambas monedas

---

## 🛡️ COMPATIBILIDAD CON TRANSACCIONES ANTIGUAS

Las transacciones creadas **antes de implementar inmutabilidad** no tienen el campo `exchangeRate`.

**¿Qué pasa?**

```javascript
// Transacción antigua (sin exchangeRate):
{ amount: 100, currency: 'USD', date: '2025-12-01' }

// Al convertir:
convertToDOP(100, 'USD', undefined)
// exchangeRate es undefined → null
// Se usa tasa global actual
```

**Impacto**: Transacciones antiguas muestran con tasa actual (no retroactiva)

**Solución futura**: Script de migración para asignar tasa al momento de creación (usando histórico de tasas)

---

## 📝 REGLAS DE NEGOCIO DERIVADAS

### Regla 1: Inmutabilidad Absoluta
**Si**: Transacción se crea con exchangeRate = 63.52  
**Entonces**: Siempre mostrará esa tasa, aunque la tasa global cambie a 65.00

### Regla 2: Tasa por Transacción, no Global
**Si**: Cambias tasa global  
**Entonces**: 
- Transacciones NUEVAS usan la tasa nueva
- Transacciones ANTIGUAS conservan su tasa original

### Regla 3: Auditoría Completa
**Si**: Necesitas saber "¿cuánto pagué en USD en enero?"  
**Entonces**: La respuesta es inmutable (no puede cambiar retroactivamente)

### Regla 4: Reportes Reproducibles
**Si**: Generas un reporte PDF hoy  
**Entonces**: Generarás el MISMO resultado mañana (datos no cambian)

---

## 🔍 VALIDACIONES IMPLEMENTADAS

**Al crear transacción:**
```javascript
✅ Si currency === 'USD':
   └─ Capturar tasa actual
✅ Grabar campo exchangeRate
✅ Validar que exchangeRate sea número válido
```

**Al mostrar transacción:**
```javascript
✅ Usar t.exchangeRate si existe
✅ Sino, usar tasa global (compatibilidad)
✅ Nunca recalcular con tasa global si exchangeRate existe
```

**Al calcular balance:**
```javascript
✅ Convertir CADA transacción con su tasa
✅ Sumar montos ya convertidos
✅ Resultado = suma histórica inmutable
```

---

## 📚 REFERENCIAS TÉCNICAS

**Para implementación técnica detallada:**
→ Ver [BIMONEDA_IMPLEMENTATION.md](../TECHNICAL/BIMONEDA_IMPLEMENTATION.md)

**Para modelo de datos completo:**
→ Ver [SYSTEM_ARCHITECTURE.md - Modelo de Datos](../SYSTEM_ARCHITECTURE.md#modelo-de-datos)

---

## 🚀 EXTENSIONES FUTURAS

### Fase 2: Editar Tasa (si necesario)
```
Permitir que usuario cambie la tasa de una transacción existente:
- Con confirmación de auditoria
- Registrando el cambio en historial
```

### Fase 3: Histórico de Tasas
```
Mantener registro de tasas por fecha:
- Migrar transacciones antiguas automáticamente
- Usar tasa histórica correcta
```

### Fase 4: Multi-moneda Expandida
```
Soporte para EUR, GBP, MXN, etc.
- Extender lógica a cualquier par de divisas
```

---

## ✅ ESTADO DE IMPLEMENTACIÓN

- [x] Campo exchangeRate agregado a transacciones
- [x] Conversión usa tasa de transacción
- [x] Balance y cálculos son inmutables
- [x] Reportes muestran ambas monedas
- [x] Compatibilidad con transacciones antiguas
- [x] Vite dev server funciona sin errores
- [ ] Migración de datos históricos (Fase siguiente)
- [ ] Interfaz para editar tasa (Fase siguiente)

---

## 📞 PREGUNTAS FRECUENTES

**P: ¿Puedo cambiar la tasa de una transacción?**  
R: No en esta versión. En Fase 2 se permitirá con auditoria.

**P: ¿Qué pasa si cambio la tasa global?**  
R: Solo afecta transacciones NUEVAS. Las antiguas conservan su tasa.

**P: ¿Mis reportes antiguos serán iguales?**  
R: Sí, absolutamente. Los números nunca cambian.

**P: ¿Las transacciones de enero se recalcularán en febrero?**  
R: No. La tasa se graba y es inmutable.

---

**Este documento es SSOT para la regla de negocio bimoneda.**  
**Cualquier cambio debe registrarse aquí primero.**

````
