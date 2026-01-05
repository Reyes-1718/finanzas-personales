# 🛍️ Asistente de Salud Financiera Preventiva

**Carpeta de documentación**: Feature Fase 1  
**Fecha**: 5 de enero de 2026  
**Estado**: ✅ Completado e integrado

---

## 📍 ¿Qué es esto?

Esta carpeta contiene toda la documentación relacionada con el **Asistente de Salud Financiera Preventiva**, una feature implementada en Fase 1 de la aplicación.

El asistente ayuda a los usuarios a tomar decisiones de compra informadas mediante un precálculo de viabilidad financiera, evitando sobreendeudamiento.

---

## 📄 Archivos Aquí

### `SPEC.md` 
**Especificación técnica completa**

Contiene:
- Visión general del asistente
- Componentes implementados (Hook, Modal, Detector)
- Tasas de interés dominicanas
- Fórmulas matemáticas (Amortización Francesa)
- Flujos de datos (Mermaid diagrams)
- Integración con App.jsx
- Patrones de gastos hormiga
- Sistema de alertas
- Casos de uso reales
- Métricas y KPIs
- Seguridad y privacidad
- Troubleshooting
- Roadmap de Fases

**Cuándo leer**: Necesitas entender técnicamente cómo funciona el asistente.

---

## 🔗 Archivos del Código

Los archivos de código están en `src/`:

```
src/
├── hooks/
│   └── usePurchaseAssistant.js          (Lógica de cálculos)
├── components/
│   ├── PurchaseAssistantModal.jsx       (Interfaz del asistente)
│   ├── HormigaPatternDetector.jsx       (Detección de gastos)
│   └── SavedAhorroButton.jsx            (Botón de ahorro)
└── App.jsx                              (Integración)
```

---

## 📚 Documentación Relacionada

Para entender la feature en contexto:

1. **[EXECUTIVE_SUMMARY.md](../../EXECUTIVE_SUMMARY.md)** — Resumen ejecutivo del sistema completo
2. **[API_REFERENCE.md](../../API_REFERENCE.md)** — Referencia de funciones disponibles
3. **[SYSTEM_ARCHITECTURE.md](../../SYSTEM_ARCHITECTURE.md)** — Arquitectura completa del proyecto

---

## 🎯 Próximos Pasos

Para continuar con **Fase 2**, consulta:

- [PHASE_2_ROADMAP.md](../../HISTORICAL/PHASE_2_ROADMAP.md) — 7 tasks claros con código ejemplo

---

## 💡 Nota

Esta carpeta es parte de la estructura **FEATURES/** que permite organizar la documentación de features específicas sin contaminar `/docs` raíz.

Si agregas más features, sigue este patrón:

```
/docs/FEATURES/
├── purchase-assistant/
│   └── SPEC.md
├── otra-feature/
│   └── SPEC.md
└── ...
```

---

**Última actualización**: 5 de enero de 2026
