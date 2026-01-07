````markdown
# 🛠️ TECHNICAL - Guías de Implementación Técnica

Directorio que contiene **HOW-TO guides** detalladas para desarrolladores que implementan features del sistema.

---

## 📖 Estructura

```
TECHNICAL/
├── BIMONEDA_IMPLEMENTATION.md  ← Cómo implementar el sistema bimoneda
└── README.md                   ← Este archivo
```

---

## 📋 Contenidos por Documento

### 💱 [BIMONEDA_IMPLEMENTATION.md](BIMONEDA_IMPLEMENTATION.md)

**¿Qué es?** Una guía paso-a-paso de cómo implementar el sistema de dos monedas en código.

**¿Por qué está aquí?** Porque la **implementación técnica** es diferente de la **decisión de negocio**. Este documento asume que YA ENTIENDES POR QUÉ (lee BUSINESS_RULES para eso) y te enseña CÓMO hacerlo.

**¿Quién debe leerlo?**
- 👨‍💻 Desarrolladores (paso-a-paso de cambios)
- 🧪 QA engineers (casos de prueba)
- 📚 Mantenedores del código (estructura de datos)

**Contenidos clave:**
- Estructura de datos actualizada (campo exchangeRate)
- Cambios en hooks (useFinancesData.js)
- Cambios en componentes (Dashboard, Budgets, ReportPDF, AdvancedStats)
- Visualizaciones en reportes
- Exportación CSV/JSON/HTML
- Validaciones en tiempo de creación y lectura
- Casos de prueba
- Checklist de implementación

**Cross-references:**
→ [¿POR QUÉ? Lee la regla de negocio](../BUSINESS_RULES/BIMONEDA_SYSTEM.md)  
→ [¿DÓNDE? Ver componentes en SYSTEM_ARCHITECTURE.md](../SYSTEM_ARCHITECTURE.md)

---

## 🎯 Propósito de Esta Carpeta

### ✅ Lo Que PERTENECE Aquí
- Guías paso-a-paso de cómo implementar features
- Ejemplos de código (antes/después)
- Validaciones y casos de prueba
- Explicación de estructuras de datos
- Cambios específicos en archivos

### ❌ Lo Que NO Pertenece Aquí
- Decisiones de negocio (van en /BUSINESS_RULES)
- Guías para usuarios (van en /GUIDES)
- Arquitectura general (va en /SYSTEM_ARCHITECTURE.md)
- Código actual (ese vive en /src)

---

## 🔄 Evolución Esperada

**Fase Actual**: BIMONEDA_IMPLEMENTATION.md es la única guía técnica.

**Fase Siguiente**: Se agregarán:
- `BUDGET_SYSTEM_IMPLEMENTATION.md` - Cómo implementar presupuestos
- `ALERTS_IMPLEMENTATION.md` - Cómo implementar alertas
- `SAVINGS_GOALS_IMPLEMENTATION.md` - Cómo implementar metas
- `REPORTING_IMPLEMENTATION.md` - Cómo generar reportes PDF
- `SEARCH_FILTER_IMPLEMENTATION.md` - Cómo implementar búsqueda

---

## 📚 Cómo Usar Esta Carpeta

### Para implementar una nueva feature:
1. Revisa [BUSINESS_RULES/](../BUSINESS_RULES/) para entender QUÉ implementar
2. Revisa el documento TECHNICAL correspondiente para entender CÓMO
3. Sigue paso-a-paso los cambios en código
4. Usa el checklist de implementación
5. Valida con los casos de prueba

### Para mantener código existente:
1. Busca la guía técnica del módulo que tocas
2. Entiende qué cambios DEPENDEN de tu modificación
3. Verifica que validaciones sigan funcionando
4. Actualiza casos de prueba si cambias lógica

### Para debuggear problemas:
1. Lee la sección "Validaciones" del documento técnico
2. Revisa los casos de prueba para ejemplos de comportamiento esperado
3. Comprueba que todos los lugares que llaman a la función usen los parámetros correctos

---

## 🔗 Conexiones Importantes

**Estos documentos COMPLEMENTAN las guías técnicas:**

- [BUSINESS_RULES/](../BUSINESS_RULES/) - POR QUÉ se decide así
- [SYSTEM_ARCHITECTURE.md](../SYSTEM_ARCHITECTURE.md) - DÓNDE viven los componentes
- [API_REFERENCE.md](../API_REFERENCE.md) - QUÉ funciones existen (firma)

**NO dupliques información entre carpetas:**
- TECHNICAL = Ejemplos de código, paso-a-paso
- BUSINESS_RULES = Decisiones y restricciones
- API_REFERENCE = Qué funciones existen (no cómo)

---

## 📊 Mapa de Dependencias

```
BUSINESS_RULES/BIMONEDA_SYSTEM.md
  ↓ (implementar)
TECHNICAL/BIMONEDA_IMPLEMENTATION.md
  ↓ (usar en código)
src/hooks/useFinancesData.js
src/components/Dashboard.jsx
src/components/Budgets.jsx
src/components/ReportPDF.jsx
src/components/AdvancedStats.jsx
```

---

## ✅ Checklist de Mantenimiento

- [ ] Revisar documentos técnicos cuando cambies estructura de datos
- [ ] Actualizar ejemplos de código si cambias funciones
- [ ] Añadir nuevos casos de prueba si agreggas validaciones
- [ ] Verificar links a BUSINESS_RULES siguen válidos
- [ ] Verificar links a src/ siguen siendo relevantes
- [ ] Mantener checklist de implementación actualizado

---

**Última actualización:** 7 de enero de 2026  
**Mantenedor:** Sistema de Documentación Automática

````
