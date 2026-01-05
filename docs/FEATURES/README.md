# 🔧 FEATURES - Documentación de Funcionalidades Específicas

Esta carpeta organiza la documentación de **features específicas** de la aplicación.

## Estructura

```
FEATURES/
├── purchase-assistant/
│   ├── README.md      (Guía de esta feature)
│   └── SPEC.md        (Especificación técnica completa)
├── [siguiente-feature]/
│   ├── README.md
│   └── SPEC.md
└── ...
```

## ¿Por qué esta organización?

- **Escalabilidad**: Cada nueva feature tiene su propia carpeta
- **Claridad**: Documentación de feature separada de documentación de sistema
- **Mantenibilidad**: Fácil encontrar la documentación de una feature específica
- **Separación de responsabilidades**: Core docs vs Feature-specific docs

## ✅ Features Disponibles

### 📲 Purchase Assistant (Asistente de Compras)
- **Propósito**: Precálculo de viabilidad de compras
- **Docs**: [purchase-assistant/README.md](purchase-assistant/README.md)
- **Spec**: [purchase-assistant/SPEC.md](purchase-assistant/SPEC.md)
- **Estado**: ✅ Fase 1 Completada

---

## 📖 Cómo Documentar una Nueva Feature

Cuando agregues una nueva feature, sigue este patrón:

1. Crea carpeta: `/docs/FEATURES/{feature-name}/`
2. Crea archivo: `README.md` (guía de la feature)
3. Crea archivo: `SPEC.md` (especificación técnica)
4. Opcionalmente: `IMPLEMENTATION.md` (guía de implementación)

### Estructura Recomendada para README.md

```markdown
# 🚀 [Nombre Feature]

**Carpeta de documentación**: Feature [Fase X]  
**Fecha**: [Fecha]  
**Estado**: [✅ Completado / ⏳ En progreso / 🔄 En revisión]

---

## 📍 ¿Qué es esto?

[Explicación corta de qué hace la feature]

---

## 📄 Archivos Aquí

### `SPEC.md`
[Descripción de qué contiene SPEC.md]

---

## 🔗 Archivos del Código

```
src/
├── [estructura relevante]
```

---

## 📚 Documentación Relacionada

[Enlaces a docs relevantes]

---

## 🎯 Próximos Pasos

[Qué sigue con esta feature]

---

**Última actualización**: [Fecha]
```

---

## 🔄 Cómo Referenciar Desde README.md

En el README.md raíz, agrega referencias a features:

```markdown
### 📚 Tabla de Consulta Rápida

| Si necesitas... | Archivo |
|---|---|
| Información de feature (Asistente) | FEATURES/purchase-assistant/Spec.md |
| Información de feature (Mi Feature) | FEATURES/mi-feature/Spec.md |
```

---

**Última actualización**: 5 de enero de 2026
