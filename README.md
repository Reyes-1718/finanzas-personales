# 💰 Finanzas Personales

> **Aplicación web profesional de gestión de finanzas personales**  
> Gestiona tus ingresos y gastos con control de presupuestos, metas de ahorro, estadísticas avanzadas y soporte multi-moneda (DOP/USD) con tasas de cambio inmutables.

![Versión](https://img.shields.io/badge/versión-1.2.0-blue)
![Estado](https://img.shields.io/badge/estado-activo-brightgreen)
![Licencia](https://img.shields.io/badge/licencia-MIT-green)
![Stack](https://img.shields.io/badge/stack-React%2019%20%7C%20Vite%207%20%7C%20Tailwind-0ea5e9)

---

## 📋 Tabla de Contenidos

- [✨ Características Principales](#características-principales)
- [🛠️ Stack Tecnológico](#stack-tecnológico)
- [📚 Documentación Técnica](#documentación-técnica)
- [🚀 Inicio Rápido](#inicio-rápido)
- [📦 Instalación Completa](#instalación-completa)
- [🌐 Despliegue en GitHub Pages](#despliegue-en-github-pages)
- [📱 Guía de Uso](#guía-de-uso)
- [🧪 Testing y Calidad](#testing-y-calidad)
- [🐛 Solución de Problemas](#solución-de-problemas)
- [🔒 Seguridad y Privacidad](#seguridad-y-privacidad)

---

## ✨ Características Principales

### 💼 Gestión Financiera Completa
- **📊 Dashboard Interactivo**: Resumen mensual en tiempo real (ingresos, gastos, balance)
- **💳 Transacciones**: Registro de ingresos y gastos (fijos y variables) con categorización
- **⚡ Gastos Diarios**: Entrada rápida sin formularios complejos (móvil-friendly)
- **📈 Proyección**: Predicción automática de gastos para el próximo mes
- **💱 Multi-moneda**: Soporte USD/DOP con tasa de cambio **inmutable por transacción**

### 📊 Análisis y Control
- **📊 Presupuestos Mensuales**: Define límites por categoría con visualización de progreso
- **🎯 Metas de Ahorro**: Establece objetivos con cálculo inteligente de ahorro periódico
- **📈 Estadísticas Avanzadas**: Análisis detallado (promedio, top gastos, tendencias)
- **📅 Calendario**: Visualiza gastos diarios del mes en formato calendárico
- **🔍 Búsqueda Avanzada**: Filtra transacciones por múltiples criterios
- **🔔 Sistema de Alertas**: Notificaciones cuando excedes límites de gasto

### 📋 Reportes y Exportación
- **📋 Reportes PDF**: Exporta estados financieros profesionales
- **💾 Backup/Restore**: Exporta e importa datos en JSON (cifrados con AES-256)
- **🔐 Cifrado Local**: Todos los datos guardados de forma segura

### 🎨 Experiencia de Usuario
- **📱 Navegación móvil**: Sidebar oculto + menú flotante circular (FAB) con todas las pestañas
- **🌓 Tema Oscuro**: Modo oscuro/claro con toggle dinámico
- **⚡ Rendimiento**: Interfaz rápida con Vite + React 19
- **📱 Responsivo**: Adaptable a cualquier dispositivo

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|----------|
| **React** | 19.1.0 | Interfaz de usuario con hooks |
| **Vite** | 7.3.0 | Build tool y dev server (⚡ ultrarrápido) |
| **Tailwind CSS** | 3.4.0 | Estilos y diseño responsivo |
| **Recharts** | 2.10.3 | Gráficos interactivos |
| **CryptoJS** | 4.2.0 | Cifrado AES-256 para datos |
| **Playwright** | 1.40.0 | Testing E2E automatizado |
| **gh-pages** | 6.1.0 | Despliegue a GitHub Pages |

**Enfoque**: Single Page Application (SPA) con almacenamiento local (LocalStorage), testing automatizado con Playwright, y documentación completa siguiendo estándares Diátaxis.

---

## 📚 Documentación Técnica

### 🎯 Por Caso de Uso

| Si eres... | Empieza por... | Tiempo |
|---|---|---|
| **👨‍💻 Desarrollador nuevo** | [QUICK_INDEX.md](./docs/QUICK_INDEX.md) + perfil | 15 min |
| **🏗️ Necesitas arquitectura** | [SYSTEM_ARCHITECTURE.md](./docs/SYSTEM_ARCHITECTURE.md) | 45 min |
| **🔨 Vas a agregar feature** | [TECHNICAL/](./docs/TECHNICAL/) | 20-30 min |
| **🧪 Vas a hacer testing** | [TESTING_STATUS.md](./docs/TESTING_STATUS.md) + [TECHNICAL/TESTING_IMPLEMENTATION.md](./docs/TECHNICAL/TESTING_IMPLEMENTATION.md) | 20 min |
| **👨‍💼 Eres stakeholder** | [EXECUTIVE_SUMMARY.md](./docs/EXECUTIVE_SUMMARY.md) | 15 min |
| **🔍 Necesitas una función** | [API_REFERENCE.md](./docs/API_REFERENCE.md) + Ctrl+F | 2-5 min |
| **📊 Revisor/auditor** | [AUDIT_DEEP_DIVE.md](./docs/AUDIT_DEEP_DIVE.md) | 30 min |

### 📖 Documentos Principales

| Documento | Propósito | Tipo Diátaxis |
|---|---|---|
| [SYSTEM_ARCHITECTURE.md](./docs/SYSTEM_ARCHITECTURE.md) | Especificación técnica completa (1,461 líneas) | REFERENCIA |
| [EXECUTIVE_SUMMARY.md](./docs/EXECUTIVE_SUMMARY.md) | Resumen ejecutivo para stakeholders | EXPLICACIÓN |
| [API_REFERENCE.md](./docs/API_REFERENCE.md) | Referencia de funciones y hooks | REFERENCIA |
| [FLOW_DIAGRAMS.md](./docs/FLOW_DIAGRAMS.md) | Diagramas y flujos de datos | REFERENCIA |
| [BUSINESS_RULES/BIMONEDA_SYSTEM.md](./docs/BUSINESS_RULES/BIMONEDA_SYSTEM.md) | Reglas del sistema bimoneda (DOP/USD) | EXPLICACIÓN |
| [TECHNICAL/BIMONEDA_IMPLEMENTATION.md](./docs/TECHNICAL/BIMONEDA_IMPLEMENTATION.md) | Cómo implementar bimoneda (paso-a-paso) | INSTRUCCIONES |
| [TECHNICAL/TESTING_IMPLEMENTATION.md](./docs/TECHNICAL/TESTING_IMPLEMENTATION.md) | Guía completa de testing automatizado | INSTRUCCIONES |
| [FEATURES/](./docs/FEATURES/) | Documentación de features específicas | TUTORIAL |
| [QUICK_INDEX.md](./docs/QUICK_INDEX.md) | Navegador de documentación por rol | TUTORIAL |
| [TESTING_STATUS.md](./docs/TESTING_STATUS.md) | Estado de testing y CI | REFERENCIA |
| [AUDIT_DEEP_DIVE.md](./docs/HISTORICAL/AUDITS/AUDIT_DEEP_DIVE.md) | Análisis exhaustivo código vs docs | REFERENCIA |
| [IMPLEMENTATION_SUMMARY.md](./docs/IMPLEMENTATION_SUMMARY.md) | Resumen de implementación del proyecto | REFERENCIA |

### 📂 Estructura de /docs

```
docs/
├── BUSINESS_RULES/          # Explicación de decisiones (Diátaxis: EXPLICACIÓN)
│   └── BIMONEDA_SYSTEM.md   # Single Source of Truth: Sistema de bimoneda
├── TECHNICAL/               # Guías de implementación (Diátaxis: INSTRUCCIONES)
│   ├── BIMONEDA_IMPLEMENTATION.md    # Cómo implementar bimoneda
│   ├── TESTING_IMPLEMENTATION.md     # Guía completa de testing
│   └── README.md                     # Índice de guías técnicas
├── FEATURES/                # Documentación de features (Diátaxis: TUTORIAL)
│   └── purchase-assistant/  # Documentación específica del asistente
├── HISTORICAL/              # Archivos históricos y auditoría (Diátaxis: ARCHIVO)
│   ├── AUDITS/             # Reportes de auditoría consolidados
│   ├── TESTING/            # Historial de testing
│   ├── REORGANIZATION_SUMMARY.md     # Resumen de reorganización
│   ├── BIMONEDA_REPORT_STATS_ORIGINAL.md
│   ├── DELIVERABLES_PHASE1.md
│   ├── DELIVERY_SUMMARY.md
│   ├── EXCHANGE_RATE_IMMUTABLE_ORIGINAL.md
│   ├── ORIGINAL_PROMPTS.md
│   ├── PHASE_2_ROADMAP.md
│   └── README.md           # Índice de archivos históricos
└── [Archivos raíz]         # Referencias rápidas (Diátaxis: REFERENCIA)
    ├── SYSTEM_ARCHITECTURE.md        # Arquitectura completa del sistema
    ├── EXECUTIVE_SUMMARY.md          # Resumen ejecutivo
    ├── API_REFERENCE.md              # Referencia de funciones
    ├── FLOW_DIAGRAMS.md              # Diagramas y flujos
    ├── TESTING_STATUS.md             # Estado actual de testing
    ├── IMPLEMENTATION_SUMMARY.md     # Resumen de implementación
    └── QUICK_INDEX.md               # Navegador por rol
```

---

## 🚀 Inicio Rápido

### Opción 1: Desarrollo Local (5 minutos)

```bash
# 1. Ir al directorio del proyecto
cd "c:\Users\Reyes\Documents\data\Finanzas"

# 2. Instalar dependencias
npm install

# 3. Ejecutar servidor de desarrollo
npm run dev
```

✅ La app estará en: **http://localhost:5173/**

### Opción 2: Vista Previa de Producción

```bash
# Construir para producción
npm run build

# Vista previa local
npm run preview
```

---

## 📦 Instalación Completa

### Paso 1: Clonar o Descargar

```bash
# Si usas git
git clone https://github.com/tu-usuario/finanzas-personales.git
cd finanzas-personales

# O descarga el ZIP y extrae
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

### Paso 3: Configurar Variables de Entorno

Crea `.env.local` en la raíz del proyecto:

```env
VITE_ENCRYPTION_KEY="mi-clave-super-segura-12345"
```

⚠️ **Importante**: No subas esta clave a Git. Úsalo localmente.

### Paso 4: Ejecutar en Desarrollo

```bash
npm run dev
```

Abre http://localhost:5173/ en tu navegador.

---

## 🌐 Despliegue en GitHub Pages

### Requisitos Previos
- Cuenta de GitHub
- Git instalado
- Repositorio creado

### Paso 1: Sincronizar con GitHub

```bash
# Inicializar git (si es nuevo proyecto)
git init

# Agregar todos los archivos
git add .

# Commit inicial
git commit -m "Configuración inicial de Finanzas Personales"

# Conectar con tu repositorio (reemplaza con tu URL)
git remote add origin https://github.com/tu-usuario/nombre-repositorio.git

# Subir a GitHub
git branch -M main
git push -u origin main
```

### Paso 2: Desplegar

```bash
# Construye automáticamente y deploya a gh-pages
npm run deploy
```

### Paso 3: Habilitar GitHub Pages

1. Ve a tu repositorio → **Settings**
2. Menú lateral → **Pages**
3. **Source**: Rama `gh-pages` / carpeta `/ (root)`
4. **Save**

Tu app estará en: `https://tu-usuario.github.io/nombre-repositorio/`

---

## 📱 Guía de Uso

### 🏠 Dashboard
Panel central con resumen mensual: ingresos, gastos, balance y gráfico de distribución.

### 💳 Transacciones
Registro completo de ingresos/gastos con categorización, fechas y descripción.

### ⚡ Gastos Diarios
Entrada rápida sin formularios complejos. Perfecto para móvil.

### 🎯 Metas de Ahorro
Crea objetivos con cálculo automático de ahorro periódico según tu ingreso mensual.

### 📊 Presupuestos
Define límites por categoría. Presupuestos inteligentes: distribuye 40% del ingreso automáticamente.

### 📈 Estadísticas
Análisis profundo: promedio por categoría, top gastos, gasto diario, balance mensual.

### 📅 Calendario
Visualiza tus gastos en formato calendárico mes a mes.

### 💱 Multi-moneda (DOP/USD)
Cada transacción en USD guarda su tasa de cambio (inmutable). **¿Por qué?** Lee [BUSINESS_RULES/BIMONEDA_SYSTEM.md](./docs/BUSINESS_RULES/BIMONEDA_SYSTEM.md).

### 📋 Reportes
Exporta estado financiero a PDF profesional o JSON cifrado.

---

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo local con hot reload
npm run build        # Build de producción
npm run preview      # Preview del build
npm run deploy       # Deploy a GitHub Pages
npm run audit        # Auditoría de seguridad npm
npm run audit:fix    # Intento de fix automático

# 🧪 Testing automatizado
npm test             # Ejecuta auditoría completa del Asistente de Compras
npm run test:empty   # Valida formularios vacíos
npm run test:menu    # Testing del menú principal
```

---

## 🧪 Testing y Calidad

### Ejecutar Pruebas Automatizadas

```bash
# Auditoría completa del Asistente de Compras
npm test

# Pruebas individuales
npm run test:empty   # Validación de formularios
npm run test:menu    # Testing del menú principal
```

### ⚠️ Importante: Entorno de Ejecución para Scripts
- **`run-test.sh`**: Este archivo es un script de shell que **solo puede ser ejecutado con una terminal que pueda emular un entorno Unix**. 
  - **Windows PowerShell** está orientado a objetos y no puede ejecutar comandos de Unix directamente.
  - **Recomendación**: Usa **Git Bash** para ejecutar `run-test.sh`.
  - Los demás archivos de test (`.js`) pueden ejecutarse con **Windows Terminal** o cualquier terminal compatible con Node.js.

### ¿Qué se prueba automáticamente?

- ✅ **Asistente de Compras**: Funcionalidad completa, cálculos, validaciones
- ✅ **Formularios**: Manejo de errores en campos vacíos
- ✅ **Navegación**: Componentes principales y menú
- ✅ **Rendimiento**: Tiempos de carga y respuesta

### Requisitos para Testing

- Entorno de desarrollo (`NODE_ENV=development`)
- Puerto 5173 libre
- ~45 segundos de ejecución

---

## 🐛 Solución de Problemas

### ❌ "La app no carga en localhost"
```bash
# Verifica que el puerto 5173 no esté en uso
npm run dev -- --port 3000
```

### ❌ "Los datos no se guardan"
- ✅ Verifica que LocalStorage esté habilitado
- ✅ Prueba en modo incógnito (sin extensiones)
- ✅ Revisa la consola: `F12 → Console`
- ✅ Borra cache: `Ctrl+Shift+Supr`

### ❌ "Error al desplegar a GitHub Pages"
1. Verifica `vite.config.js` tenga `base` correcto
2. Asegúrate que Settings → Pages esté configurado
3. Espera 2-3 minutos para que se propague
4. Intenta con navegador incógnito

### ❌ "El gráfico no se muestra"
- Registra gastos con categoría
- Selecciona un mes que tenga datos

### ❌ "Presupuestos no se guardan"
- Verifica que tengas ingreso mensual registrado
- Crea primero una transacción de ingreso

---

## 🔒 Seguridad y Privacidad

### ✅ Protección de Datos
- **Datos locales**: Se guardan únicamente en tu navegador
- **Cifrado AES-256**: Encriptación en LocalStorage
- **Sin servidor**: No se envía información a servidores externos
- **Control total**: Tú eres dueño de tus datos

### ⚠️ Limitaciones
- Seguridad suficiente para uso personal
- No 100% seguro para datos muy sensibles
- La clave se expone en el bundle (necesario para apps cliente)

### 🔄 Respaldos
- Exporta tus datos regularmente
- Guarda archivos JSON en lugar seguro
- Prueba importar de vez en cuando

---

## 📊 Flujo Recomendado (Primer Día)

1. **Setup (5 min)**: Registra ingreso mensual en Dashboard
2. **Configuración (10 min)**: Crea presupuestos automáticos + metas + alertas
3. **Uso diario (2 min)**: Usa "⚡ Gastos Diarios" para entradas rápidas
4. **Revisión semanal (5 min)**: Revisa Dashboard y Estadísticas
5. **Respaldo mensual (2 min)**: Exporta datos a JSON

---

## 🤝 Contribuciones

¡Bienvenidas las contribuciones! Para cambios importantes:

1. Fork el proyecto
2. Crea rama: `git checkout -b feature/mi-feature`
3. Commit: `git commit -m "Agrega mi feature"`
4. Push: `git push origin feature/mi-feature`
5. Abre Pull Request

---

## 📄 Licencia

MIT - Libre para usar, modificar y distribuir.

---

## 📞 Soporte

¿Problemas o sugerencias?
- Revisa [Solución de Problemas](#solución-de-problemas)
- Abre un Issue en GitHub
- Contacta al desarrollador

---

**Última actualización**: 10 de enero de 2026  
**Versión**: 1.2.0  
**Estado**: ✅ Producción + Auditoría SSOT Completada

Hecho con ❤️
