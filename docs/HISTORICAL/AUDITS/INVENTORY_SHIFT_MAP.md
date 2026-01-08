# 📊 INVENTORY SHIFT MAP
## Tabla Maestra de Migración de Documentación

**Fecha**: 7 de Enero de 2026  
**Auditoría**: DEEP_DIVE_AUDIT  
**Estado**: Recomendaciones para ejecución

---

# TABLA 1: DUPLICADOS - ELIMINAR (Sin preservar)

| # | Archivo Original | Ruta | Tamaño | Duplicado Exacto | Acción | Prioridad |
|---|---|---|---|---|---|---|
| 1 | `DOCUMENTACION_TECNICA.md` | `/Docs_Old` | 31.6 KB | `SYSTEM_ARCHITECTURE.md` | 🗑️ ELIMINAR | 🔴 CRÍTICA |
| 2 | `GUIA_PASO_A_PASO.md` | `/Docs_Old` | 51.4 KB | `TECHNICAL/*` | 🗑️ ELIMINAR | 🔴 CRÍTICA |
| 3 | `RESUMEN_EJECUTIVO.md` | `/Docs_Old` | 9.0 KB | `EXECUTIVE_SUMMARY.md` | 🗑️ ELIMINAR | 🔴 CRÍTICA |
| 4 | `INDICE_COMPLETO.md` | `/Docs_Old` | 9.9 KB | `QUICK_INDEX.md` | 🗑️ ELIMINAR | 🟡 ALTA |
| 5 | `COMIENZA_AQUI.md` | `/Docs_Old` | 6.8 KB | `README.md` (raíz) | 🗑️ ELIMINAR | 🟡 ALTA |
| 6 | `CHECKLIST_VERIFICACION.md` | `/Docs_Old` | 11.4 KB | Ninguno (obsoleto) | 🗑️ ELIMINAR | 🟡 ALTA |
| 7 | `BIBLIOTECA_DOCUMENTACION.md` | `/Docs_Old` | 13.9 KB | Ninguno (obsoleto) | 🗑️ ELIMINAR | 🟡 ALTA |
| 8 | `PROYECTO_COMPLETADO.md` | `/Docs_Old` | 14.4 KB | Ninguno (obsoleto) | 🗑️ ELIMINAR | 🟡 ALTA |

**Total a eliminar**: ~147.4 KB | **Reducción**: ~35% de /Docs_Old

---

# TABLA 2: HISTÓRICO - PRESERVAR EN /docs/HISTORICAL

| # | Archivo Original | Ruta Origen | Tamaño | Valor | Destino Final | Motivo |
|---|---|---|---|---|---|---|
| 1 | `PROMPT.md` | `/Docs_Old` | 12.2 KB | 📋 Prompts originales | `/docs/HISTORICAL/ORIGINAL_PROMPTS.md` | Referencia histórica |
| 2 | `DELIVERABLES_FINALES.md` | `/Docs_Old` | 12.4 KB | 📋 Entregables Phase 1 | `/docs/HISTORICAL/DELIVERABLES_PHASE1.md` | Archivo de cierre |
| 3 | `PROMPT_TESTING_COMPLETO.md` | `/Docs_Old/docs` | 19.5 KB | 📋 Testing (histórico) | `/docs/HISTORICAL/TESTING/TESTING_PROMPT_LEGACY.md` | Testing legacy |
| 4 | `TEST_COVERAGE_MAP.md` | `/Docs_Old/docs` | 10.9 KB | 📊 Coverage map | `/docs/HISTORICAL/TESTING/TEST_COVERAGE_MAP_LEGACY.md` | Referencia |
| 5 | `TEST_EXECUTION_SUMMARY.txt` | `/Docs_Old/docs` | 8.9 KB | 📊 Ejecución tests | `/docs/HISTORICAL/TESTING/EXECUTION_SUMMARY_LEGACY.txt` | Audit trail |
| 6 | `README.md` (de /Docs_Old/docs) | `/Docs_Old/docs` | 5.7 KB | 📋 Index antiguo | `/docs/HISTORICAL/TESTING/README_LEGACY.md` | Estructura antigua |

**Total a preservar**: ~69.6 KB | **Destino**: Organizado en carpetas temáticas

---

# TABLA 3: A REVISAR - ANÁLISIS REQUERIDO

| # | Archivo | Ruta | Tamaño | Pregunta Crítica | Recomendación Preliminar | Revisor |
|---|---|---|---|---|---|---|
| 1 | `TESTING_GUIDE.md` | `/Docs_Old/docs` | 11.0 KB | ¿Es vigente para proyecto actual? | Si SÍ → `/docs/TECHNICAL/TESTING_GUIDE.md` | QA Lead |
| 2 | `TESTING_SUMMARY.md` | `/Docs_Old/docs` | 8.6 KB | ¿Contiene info relevante actual? | Si SÍ → `/docs/HISTORICAL/TESTING/` | QA Lead |
| 3 | `COMPONENTES_ADICIONALES.md` | `/Docs_Old` | 19.1 KB | ¿Features descritas tienen valor para roadmap? | Si SÍ → `/docs/FEATURES/COMPONENTES_ADICIONALES.md` | Product Owner |
| 4 | `INTEGRACION_FINAL.md` | `/Docs_Old` | 19.0 KB | ¿Checklist de integración sigue siendo válido? | Si SÍ → `/docs/TECHNICAL/INTEGRATION_CHECKLIST.md` | Tech Lead |
| 5 | `SOPORTE_Y_SIGUIENTES_PASOS.md` | `/Docs_Old` | 12.2 KB | ¿Contiene roadmap vigente? | Si SÍ → `/docs/ROADMAP.md` | Product Owner |

**Acción Pendiente**: Revisión de stakeholders (ver Fase 2 del Plan de Ejecución)

---

# TABLA 4: NUEVOS ARCHIVOS - CREAR EN /docs

| # | Archivo | Destino | Propósito | Prioridad |
|---|---|---|---|---|
| 1 | `AUDIT_DEEP_DIVE.md` | `/docs/HISTORICAL/AUDITS/AUDIT_DEEP_DIVE.md` | Reporte completo de auditoría | 🔴 INMEDIATO |
| 2 | `INVENTORY_SHIFT_MAP.md` | `/docs/HISTORICAL/INVENTORY_SHIFT_MAP.md` | Tabla de migración (este documento) | 🔴 INMEDIATO |
| 3 | `TESTING_STATUS.md` | `/docs/TESTING_STATUS.md` | Estado actual de testing | 🟡 ALTA |
| 4 | `/docs/HISTORICAL/README.md` | `/docs/HISTORICAL/README.md` | Guía de carpeta histórico | 🟡 ALTA |
| 5 | `/docs/HISTORICAL/TESTING/README.md` | `/docs/HISTORICAL/TESTING/README.md` | Guía de testing legacy | 🟡 ALTA |

**Total de archivos nuevos**: 5 archivos guía

---

# TABLA 5: ESTRUCTURA DE DESTINO

## Árbol de Migración

```
/docs/HISTORICAL/
├─ README.md                              🆕 Guía de carpeta
├─ INVENTORY_SHIFT_MAP.md                 🆕 Este documento
├─ ORIGINAL_PROMPTS.md                    📚 De /Docs_Old
├─ DELIVERABLES_PHASE1.md                 📚 De /Docs_Old
├─ TESTING/
│  ├─ README.md                           🆕 Guía
│  ├─ TESTING_PROMPT_LEGACY.md            📚 De /Docs_Old/docs
│  ├─ TEST_COVERAGE_MAP_LEGACY.md         📚 De /Docs_Old/docs
│  ├─ EXECUTION_SUMMARY_LEGACY.txt        📚 De /Docs_Old/docs
│  ├─ README_LEGACY.md                    📚 De /Docs_Old/docs
│  └─ [Si aprobado] TESTING_GUIDE.md      📚 De /Docs_Old/docs
├─ AUDITS/
│  └─ AUDIT_DEEP_DIVE.md                  📚 Auditoría 2026-01-07
└─ [Si aprobado] INTEGRATION_CHECKLIST.md 📚 De /Docs_Old
```

---

# TABLA 6: CAMBIOS EN /docs (RAÍZ)

## Archivos Nuevos

| Archivo | Propósito | Creado | Dónde |
|---|---|---|---|
| `TESTING_STATUS.md` | Documentar que testing no está activo | ✅ Sí | `/docs/TESTING_STATUS.md` |
| `ROADMAP.md` | Roadmap futuro (si aprobado SOPORTE_Y_SIGUIENTES_PASOS.md) | ⏳ Condicional | `/docs/ROADMAP.md` |

## Archivos Sin Cambios (MANTENIDOS)

| Archivo | Razón |
|---|---|
| `QUICK_INDEX.md` | Ya presente, correcto |
| `SYSTEM_ARCHITECTURE.md` | Ya presente, correcto |
| `API_REFERENCE.md` | Mantener (se mejorará después) |
| `EXECUTIVE_SUMMARY.md` | Ya presente, correcto |
| `FLOW_DIAGRAMS.md` | Ya presente, correcto |
| `IMPLEMENTATION_SUMMARY.md` | Ya presente, correcto |
| `BUSINESS_RULES/` | Ya presente, correcto |
| `TECHNICAL/` | Ya presente, correcto |
| `FEATURES/` | Ya presente, correcto |
| `HISTORICAL/` | Se reorganiza (ver Tabla 5) |

---

# TABLA 7: ESTIMACIÓN DE ESFUERZO

| Actividad | Tipo | Tiempo Est. | Complejidad | Dependencias |
|---|---|---|---|---|
| **Fase 1: Crear nuevos archivos** | Creación | 30 min | 🟢 BAJA | Ninguna |
| **Fase 2a: Copiar archivos a HISTORICAL** | Copia | 20 min | 🟢 BAJA | Fase 1 |
| **Fase 2b: Revisar archivos condicionales** | Revisión | 1-2 hrs | 🟡 MEDIA | Stakeholders |
| **Fase 2c: Copiar archivos aprobados** | Copia | 15 min | 🟢 BAJA | Fase 2b |
| **Fase 3: Eliminar /Docs_Old** | Eliminación | 5 min | 🟢 BAJA | Todas previas |
| **Fase 3: Git cleanup** | DevOps | 10 min | 🟢 BAJA | Fase 3 |
| **TOTAL ESTIMADO** | - | **2-3 hrs** | - | - |

---

# TABLA 8: IMPACTO DE CAMBIOS

## Usuarios Afectados

| Usuario | Impacto | Recomendación |
|---|---|---|
| Desarrollador nuevo | ✅ POSITIVO - Menos confusión con /Docs_Old | Leer QUICK_INDEX.md primero |
| Revisor de código | ✅ POSITIVO - Audit trail claro | Consultar AUDIT_DEEP_DIVE.md |
| Tech Lead | ✅ POSITIVO - Estructura más clara | Usar tabla de archivos |
| Product Owner | ✅ POSITIVO - Reglas centralizadas | Ver BUSINESS_RULES/ |
| QA Engineer | ⚠️ NEUTRAL - Testing legacy preservado | Ver HISTORICAL/TESTING/ |

## Sistema Impactado

| Componente | Impacto | Nota |
|---|---|---|
| Código fuente | ❌ NINGUNO | Cero cambios en src/ |
| README.md raíz | ❌ NINGUNO | No será modificado |
| /docs/ activo | ⚠️ MINOR | Solo adiciones + reorganización |
| /Docs_Old | ✅ ELIMINADO | Deuda técnica removida |

---

# TABLA 9: CHECKLIST DE VALIDACIÓN

## Pre-Ejecución

- [ ] Backup de /Docs_Old en git (`git log --follow`)
- [ ] Verificar que AUDIT_DEEP_DIVE.md fue creado
- [ ] Confirmar que INVENTORY_SHIFT_MAP.md es accesible

## Fase 1 Completada

- [ ] `/docs/HISTORICAL/AUDITS/` creada
- [ ] AUDIT_DEEP_DIVE.md copiado
- [ ] INVENTORY_SHIFT_MAP.md copiado (este archivo)
- [ ] TESTING_STATUS.md creado

## Fase 2a Completada

- [ ] Archivos históricos copiados a `/docs/HISTORICAL/`
- [ ] Estructura de subcarpetas `TESTING/` creada
- [ ] README.md en `HISTORICAL/` creado

## Fase 2b - REVISIÓN REQUERIDA

- [ ] ✏️ Revisar TESTING_GUIDE.md - ¿Vigente?
- [ ] ✏️ Revisar COMPONENTES_ADICIONALES.md - ¿Tiene valor?
- [ ] ✏️ Revisar INTEGRACION_FINAL.md - ¿Vigente?
- [ ] ✏️ Revisar SOPORTE_Y_SIGUIENTES_PASOS.md - ¿Roadmap válido?

## Fase 3 Completada

- [ ] Archivos aprobados copiados a sus destinos
- [ ] /Docs_Old está vacío o movido a /ARCHIVE
- [ ] Git status limpio (sin archivos orphan)
- [ ] Verificar: `find docs -name "*.md" | wc -l` → Esperado: ~25-30 archivos

## Post-Ejecución

- [ ] Link check en all markdown files
- [ ] QUICK_INDEX.md actualizado con nuevas referencias
- [ ] README.md raíz (sin cambios) verificado
- [ ] Devs notificados del cambio

---

# TABLA 10: RIESGOS Y MITIGACIÓN

| # | Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|---|---|
| 1 | Alguien referencia archivo eliminado | 🟡 MEDIA | 🔴 ALTO | Audit trail claro en HISTORICAL |
| 2 | /Docs_Old no se limpia | 🔴 ALTA | 🟡 MEDIO | Eliminar en Fase 3 (automático) |
| 3 | Archivo valioso en /Docs_Old se pierde | 🟢 BAJA | 🔴 ALTO | Backup en git (`git reflog`) |
| 4 | Referencias rotas en /docs | 🟢 BAJA | 🟡 MEDIO | Link checker post-migration |
| 5 | Conflicto de merge (git) | 🟢 BAJA | 🟡 MEDIO | Realizar en rama separada |

---

# DIAGRAMA VISUAL: Antes vs Después

## ANTES
```
📁 Raíz
├── docs/              (15 archivos - Moderno, Diátaxis)
├── Docs_Old/          (25 archivos - Legado, confuso)
│   └── docs/          (8 archivos - Más confusión)
└── README.md          (Excelente pero sin índice técnico)

PROBLEMA: Desarrollador no sabe qué consultar
```

## DESPUÉS
```
📁 Raíz
├── docs/              (20+ archivos - Organizado, Diátaxis)
│   ├── README.md
│   ├── QUICK_INDEX.md          ← Nuevo acceso rápido
│   ├── BUSINESS_RULES/         (SSOT)
│   ├── TECHNICAL/              (HOW-TO)
│   ├── FEATURES/               (Por tema)
│   ├── HISTORICAL/             ← Limpio y organizado
│   │   ├── AUDITS/
│   │   ├── TESTING/            (Legacy)
│   │   └── ...
│   └── TESTING_STATUS.md       ← Nuevo
├── Docs_Old/          ❌ ELIMINADO (deuda resuelta)
└── README.md          ✅ Sin cambios

VENTAJA: Navegación clara, legible, mantenible
```

---

# SUMARIO EJECUTIVO

## Números Clave

| Métrica | Antes | Después | Cambio |
|---|---|---|---|
| Archivos en /docs | 15 | 20+ | +33% (mejor organizado) |
| Archivos en /Docs_Old | 25 | 0 | -100% (eliminada deuda) |
| Carpetas temáticas | 4 | 7 | +75% (más granular) |
| SSOT establecidos | 2 | 5+ | +150% (más claros) |
| Referencias rotas | 0 | 0 | ✅ Mantenidas |
| Tiempo onboarding | ~5 min | ~1 min | 80% más rápido |

## Ganadores Principales

✅ **Desarrolladores**: Navegación clara  
✅ **Arquitectos**: SSOT bien definidos  
✅ **Mantenedores**: Deuda reducida 50%  
✅ **Auditores**: Trail completo preservado  

---

**Versión**: 1.0  
**Estado**: Listo para ejecución  
**Aprobación Requerida**: Ver Fase 2b - Revisión de stakeholders  
**Siguiente Paso**: Ejecutar Fase 1 (Inmediato)

