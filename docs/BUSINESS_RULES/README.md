````markdown
# 📚 BUSINESS_RULES - Reglas de Negocio del Sistema

Directorio que contiene la **Fuente Única de Verdad (SSOT)** para todas las decisiones y reglas de negocio que rigen la aplicación de finanzas personales.

---

## 📖 Estructura

```
BUSINESS_RULES/
├── BIMONEDA_SYSTEM.md       ← Sistema DOP/USD y tasas de cambio
└── README.md                ← Este archivo
```

---

## 📋 Contenidos por Documento

### 💱 [BIMONEDA_SYSTEM.md](BIMONEDA_SYSTEM.md)

**¿Qué es?** La especificación completa del sistema de manejo de dos monedas (DOP y USD).

**¿Por qué está aquí?** Porque la **inmutabilidad de tasas de cambio** es una decisión de negocio fundamental, no un detalle técnico.

**¿Quién debe leerlo?**
- 👤 Product Owner (entiende qué decidimos y por qué)
- 👨‍💻 Desarrolladores (entiende qué implementar)
- 📊 Usuarios avanzados (entiende cómo funciona el sistema)

**Contenidos clave:**
- Problema original (tasas retroactivas)
- Solución (tasa grabada por transacción)
- Cómo funciona técnicamente
- Impacto en cálculos
- Validaciones y reglas derivadas

**Cross-references:**
→ [Ver implementación técnica](../TECHNICAL/BIMONEDA_IMPLEMENTATION.md)  
→ [Ver modelo de datos completo](../SYSTEM_ARCHITECTURE.md)

---

## 🎯 Propósito de Esta Carpeta

### ✅ Lo Que PERTENECE Aquí
- Decisiones de negocio que afectan múltiples componentes
- Reglas que NO deben cambiar sin stakeholder approval
- Explicaciones del POR QUÉ (no el CÓMO)
- Restricciones de negocio y validaciones

### ❌ Lo Que NO Pertenece Aquí
- Código (ese va en /src)
- Guías paso-a-paso de usuario (van en /GUIDES)
- Detalles técnicos de implementación (van en /TECHNICAL)
- Historiales de cambios (van en /HISTORICAL)

---

## 🔄 Evolución Esperada

**Fase Actual**: BIMONEDA_SYSTEM.md es la única regla de negocio documentada.

**Fase Siguiente**: Se agregarán:
- `BUDGET_RULES.md` - Lógica de presupuestos y alertas
- `SAVINGS_GOALS_RULES.md` - Reglas de metas de ahorro
- `SECURITY_RULES.md` - Políticas de encriptación y datos
- `REPORTING_RULES.md` - Estándares de reportes PDF

---

## 📌 Cómo Usar Esta Carpeta

### Para entender una decisión de negocio:
1. Busca en el documento relevante de esta carpeta
2. Lee la sección "PROBLEMA" para ver qué se intentaba resolver
3. Lee la sección "SOLUCIÓN" para entender la decisión
4. Sigue los links a implementación técnica si necesitas código

### Para proponer cambios:
1. Abre un issue indicando qué regla quieres cambiar
2. Explica por qué la regla actual no funciona
3. Sugiere una regla alternativa
4. Actualiza este documento con la nueva decisión

### Para implementar:
1. Lee la regla de negocio completa
2. Sigue al documento TECHNICAL correspondiente
3. Implementa respetando TODAS las restricciones mencionadas
4. Valida en todos los caminos mencionados en la regla

---

## 🔗 Conexiones Importantes

**Estos documentos REFERENCIAN las reglas de negocio:**

- [SYSTEM_ARCHITECTURE.md](../SYSTEM_ARCHITECTURE.md) - Cómo se implementan las reglas
- [API_REFERENCE.md](../API_REFERENCE.md) - Funciones que soportan las reglas
- [TECHNICAL/](../TECHNICAL/) - Guías de implementación paso a paso

**NO dupliques información entre carpetas:**
- BUSINESS_RULES = POR QUÉ (decisión)
- TECHNICAL = CÓMO (implementación)
- SYSTEM_ARCHITECTURE = DÓNDE (componentes)

---

## ✅ Checklist de Mantenimiento

- [ ] Revisar este README cada 3 meses
- [ ] Añadir nuevas reglas de negocio según se descubran
- [ ] Actualizar links si se reorganiza TECHNICAL o SYSTEM_ARCHITECTURE
- [ ] Validar que ninguna regla contradice otra
- [ ] Asegurarse de que cada regla tenga al menos una guía TECHNICAL asociada

---

**Última actualización:** 7 de enero de 2026  
**Mantenedor:** Sistema de Documentación Automática

````
