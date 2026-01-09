# 🎯 Índice Rápido de Documentación

**Última actualización**: Enero 9, 2026  
**Estado**: ✅ Documentación de testing integrada

---

## 🚀 Atajos por Caso de Uso

### 👨‍💻 Soy Desarrollador Nuevo - ¿Qué hago primero?

1. **En 15 minutos** (Orientación):
   - Lee [README.md](../README.md) sección "📚 Documentación Técnica" (este archivo)
   - Selecciona tu perfil en la tabla de usuarios

2. **En 45 minutos** (Entender la arquitectura):
   - Lee [EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md)
   - Consulta secciones relevantes de [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md)

3. **Según necesites implementar** (Step-by-step):
   - [TECHNICAL/](./TECHNICAL/) - Guías HOW-TO específicas
   - [API_REFERENCE.md](./API_REFERENCE.md) - Firma de funciones

---

### 💰 Necesito Entender el Sistema Bimoneda (DOP/USD)

| Quiero entender... | Leo... | Tiempo | Contenido |
|---|---|---|---|
| **POR QUÉ** existe este sistema | [BUSINESS_RULES/BIMONEDA_SYSTEM.md](./BUSINESS_RULES/BIMONEDA_SYSTEM.md) | 15 min | Problema, solución, reglas |
| **CÓMO** implementarlo | [TECHNICAL/BIMONEDA_IMPLEMENTATION.md](./TECHNICAL/BIMONEDA_IMPLEMENTATION.md) | 20 min | Paso-a-paso, código, validaciones |
| **DÓNDE** vive en el código | [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md#4-modelo-de-datos) | 10 min | Estructura de datos, componentes |
| **QUÉ** funciones necesito | [API_REFERENCE.md](./API_REFERENCE.md) | 5 min | Búsqueda de función/hook |

---

### 🧪 Necesito Testing y QA

| Quiero... | Leo... | Tiempo | Contenido |
|---|---|---|---|
| **SABER** qué se prueba actualmente | [TESTING_STATUS.md](./TESTING_STATUS.md) | 10 min | Estado actual, cobertura, scripts |
| **APRENDER** a escribir pruebas | [TECHNICAL/TESTING_IMPLEMENTATION.md](./TECHNICAL/TESTING_IMPLEMENTATION.md) | 25 min | Guía completa de testing, plantillas |
| **EJECUTAR** pruebas existentes | [README.md](../README.md#testing-y-calidad) | 5 min | Comandos npm test |
| **DEBUG** fallos de testing | [TECHNICAL/TESTING_IMPLEMENTATION.md](./TECHNICAL/TESTING_IMPLEMENTATION.md#debugging-y-troubleshooting) | 15 min | Solución de problemas comunes |

---

### 🎨 Voy a Agregar una Feature Nueva

**Checklist:**

1. ✅ ¿Necesitas crear una **regla de negocio** nueva?
   - Crea: `BUSINESS_RULES/[FEATURE_NAME].md`
   - Plantilla en: [BUSINESS_RULES/README.md](./BUSINESS_RULES/README.md)

2. ✅ ¿Necesitas crear una **guía de implementación**?
   - Crea: `TECHNICAL/[FEATURE_NAME]_IMPLEMENTATION.md`
   - Plantilla en: [TECHNICAL/README.md](./TECHNICAL/README.md)

3. ✅ ¿Necesitas documentar un **feature específico**?
   - Crea: `FEATURES/[feature_name]/`
   - Plantilla en: [FEATURES/README.md](./FEATURES/README.md)

4. ✅ Actualiza referencias cruzadas en:
   - [README.md](../README.md) tabla de consulta
   - Archivo padre en BUSINESS_RULES o TECHNICAL

---

### 🔍 Buscar Información Específica

**¿Qué necesito?** → **¿Dónde busco?**

| Necesito... | Busco en... | Comando |
|---|---|---|
| Una función/hook específica | [API_REFERENCE.md](./API_REFERENCE.md) | `Ctrl+F` en archivo |
| Especificación técnica completa | [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) | `Ctrl+F` en archivo |
| Diagramas de flujo | [FLOW_DIAGRAMS.md](./FLOW_DIAGRAMS.md) | Ver secciones |
| Regla de negocio | [BUSINESS_RULES/](./BUSINESS_RULES/) | Buscar por tema |
| Cómo implementar algo | [TECHNICAL/](./TECHNICAL/) | Buscar por feature |
| Feature específica (Ej: Asistente) | [FEATURES/](./FEATURES/) | Por carpeta |
| Resumen ejecutivo | [EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md) | Para stakeholders |
| Documentación histórica | [HISTORICAL/](./HISTORICAL/) | Archivos antiguos |

---

## 📚 Documentos Principales (Orden de Lectura Recomendado)

```
BEGINNER PATH (Nuevo en el proyecto)
├─ README.md (Índice general + setup)
├─ EXECUTIVE_SUMMARY.md (¿Qué es este proyecto?)
├─ SYSTEM_ARCHITECTURE.md (¿Cómo está construido?)
└─ [TECHNICAL docs específicos según necesites]

ADVANCED PATH (Modificar arquitectura)
├─ SYSTEM_ARCHITECTURE.md (Especificación actual)
├─ FLOW_DIAGRAMS.md (Flujos visuales)
├─ [BUSINESS_RULES según cambio de negocio]
└─ [TECHNICAL según cambio de implementación]

FEATURE PATH (Agregar feature nueva)
├─ BUSINESS_RULES/[tema].md (¿Qué reglas aplican?)
├─ TECHNICAL/[tema]_IMPLEMENTATION.md (¿Cómo implementar?)
├─ FEATURES/[nombre]/ (Documentación específica)
└─ SYSTEM_ARCHITECTURE.md (Integración con existente)
```

---

## 🗂️ Mapa Completo de Documentación

```
📁 docs/
│
├─ 🎯 ÍNDICES Y GUÍAS
│  ├─ README.md (raíz)           ← EMPIEZA AQUÍ
│  ├─ Este archivo               ← Quick index
│  └─ EXECUTIVE_SUMMARY.md       ← Resumen ejecutivo
│
├─ 📖 ESPECIFICACIONES (REFERENCE - Diátaxis)
│  ├─ SYSTEM_ARCHITECTURE.md     ← Especificación técnica completa
│  ├─ API_REFERENCE.md           ← Firma de funciones/hooks
│  ├─ FLOW_DIAGRAMS.md           ← Diagramas y flujos
│  └─ IMPLEMENTATION_SUMMARY.md  ← Resumen de implementación
│
├─ 💡 REGLAS DE NEGOCIO (EXPLANATION - Diátaxis)
│  ├─ BUSINESS_RULES/
│  │  ├─ BIMONEDA_SYSTEM.md      ← SSOT para sistema bimoneda
│  │  └─ README.md               ← Guía de carpeta
│  └─ [Próximas reglas aquí]
│
├─ 🛠️ GUÍAS TÉCNICAS (HOW-TO - Diátaxis)
│  ├─ TECHNICAL/
│  │  ├─ BIMONEDA_IMPLEMENTATION.md  ← Paso-a-paso bimoneda
│  │  └─ README.md                   ← Guía de carpeta
│  └─ [Próximas guías aquí]
│
├─ ✨ FEATURES ESPECÍFICAS
│  ├─ FEATURES/
│  │  ├─ purchase-assistant/
│  │  │  ├─ SPEC.md     ← Especificación del Asistente
│  │  │  └─ README.md   ← Guía de carpeta
│  │  └─ [Próximos features aquí]
│  └─
├─ 📜 HISTÓRICO Y AUDITORÍA
│  ├─ HISTORICAL/
│  │  ├─ *.md            ← Documentación histórica
│  │  ├─ *_ORIGINAL.md   ← Backups para auditoría
│  │  └─ README.md       ← Guía de carpeta
│  └─
└─ 📋 CAMBIOS Y AUDITORÍA
   └─ REORGANIZATION_SUMMARY.md  ← Resumen de refactor (Enero 2026)
```

---

## 🔗 Ciclo de Lectura Recomendado

### Para un Cambio en Bimoneda:

```
1. ¿Qué debe cambiar?
   → BUSINESS_RULES/BIMONEDA_SYSTEM.md (entender regla actual)

2. ¿Cómo implementarlo?
   → TECHNICAL/BIMONEDA_IMPLEMENTATION.md (guía de pasos)

3. ¿Dónde vive el código?
   → SYSTEM_ARCHITECTURE.md (ubicar componentes)

4. ¿Qué funciones afectan?
   → API_REFERENCE.md (verificar firmas)

5. ¿Hay validaciones?
   → TECHNICAL/BIMONEDA_IMPLEMENTATION.md (sección Validaciones)

6. ¿Cómo se impacta en reportes?
   → TECHNICAL/BIMONEDA_IMPLEMENTATION.md (sección Exportación)

7. ✅ Listo para implementar
```

---

## 🎯 Tabla de Acceso Rápido

| Tipo de Usuario | Empieza por | Luego consulta |
|---|---|---|
| **Desarrollador Nuevo** | README.md | EXECUTIVE_SUMMARY.md → SYSTEM_ARCHITECTURE.md |
| **Arquitecto/Tech Lead** | SYSTEM_ARCHITECTURE.md | FLOW_DIAGRAMS.md + BUSINESS_RULES/ |
| **Product Manager** | EXECUTIVE_SUMMARY.md | BUSINESS_RULES/ |
| **QA Engineer** | TECHNICAL/ | FLOW_DIAGRAMS.md + casos de prueba |
| **Stakeholder/Ejecutivo** | EXECUTIVE_SUMMARY.md | README.md sección "Características" |
| **Mantenedor a LP** | REORGANIZATION_SUMMARY.md | Toda la estructura |

---

## ⚡ Búsquedas Rápidas

### "¿Cómo registro un gasto en [moneda]?"
→ [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md#4-modelo-de-datos) + [TECHNICAL/BIMONEDA_IMPLEMENTATION.md](./TECHNICAL/BIMONEDA_IMPLEMENTATION.md)

### "¿Qué campos tiene una transacción?"
→ [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md#4-modelo-de-datos)

### "¿Cómo calculan los presupuestos?"
→ [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md#11-cálculos-financieros)

### "¿Qué hooks existen para finanzas?"
→ [API_REFERENCE.md](./API_REFERENCE.md) + [SYSTEM_ARCHITECTURE.md#8-custom-hooks](./SYSTEM_ARCHITECTURE.md#8-custom-hooks)

### "¿Por qué se graba la tasa de cambio?"
→ [BUSINESS_RULES/BIMONEDA_SYSTEM.md](./BUSINESS_RULES/BIMONEDA_SYSTEM.md)

### "¿Cómo se exporta a PDF?"
→ [TECHNICAL/BIMONEDA_IMPLEMENTATION.md](./TECHNICAL/BIMONEDA_IMPLEMENTATION.md#exportación-en-reportes)

---

## 📞 No Encuentras lo que Buscas?

1. **Revisa este índice** - Busca tu caso de uso arriba
2. **Usa la tabla de README.md** - Link a documentos por tema
3. **Busca con Ctrl+F** - En SYSTEM_ARCHITECTURE.md o API_REFERENCE.md
4. **Revisa FLOW_DIAGRAMS.md** - Para ver flujos visuales
5. **Consulta BUSINESS_RULES/** - Para entender decisiones
6. **Consulta TECHNICAL/** - Para ver implementación

---

## ✅ Checklist: "¿Estoy en el documento correcto?"

Después de seguir los links arriba, verifica:

- ✅ ¿El documento habla del tema que busco?
- ✅ ¿El contenido es reciente (revisa fecha de actualización)?
- ✅ ¿Hay cross-references a otros documentos relevantes?
- ✅ ¿Los ejemplos de código son claros?
- ✅ Si no, prueba otro documento en el mapa anterior

---

## 🚀 Próximas Adiciones Sugeridas

- [ ] `BUSINESS_RULES/PRESUPUESTOS_SISTEMA.md` - Reglas de presupuestos
- [ ] `TECHNICAL/ALERTAS_IMPLEMENTATION.md` - Cómo implementar alertas
- [ ] `FEATURES/metas-ahorro/` - Documentación de metas
- [ ] Índice de búsqueda interactivo (Docusaurus/Sphinx)

---

**Última revisión**: Enero 7, 2026  
**Próxima revisión sugerida**: Enero 2027 (o cuando se agreguen features)
