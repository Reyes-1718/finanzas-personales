# 💰 Finanzas Personales

> **Aplicación web profesional de gestión de finanzas personales**  
> Gestiona tus ingresos y gastos con control de presupuestos, metas de ahorro, estadísticas avanzadas y más.

![Versión](https://img.shields.io/badge/versión-1.0.0-blue)
![Estado](https://img.shields.io/badge/estado-activo-brightgreen)
![Licencia](https://img.shields.io/badge/licencia-MIT-green)

---

## 📋 Tabla de Contenidos

- [✨ Características Principales](#características-principales)
- [🛠️ Stack Tecnológico](#stack-tecnológico)
- [🚀 Inicio Rápido](#inicio-rápido)
- [📦 Instalación Completa](#instalación-completa)
- [🌐 Despliegue en GitHub Pages](#despliegue-en-github-pages)
- [🧪 Pruebas Automatizadas (desactivadas)](#pruebas-automatizadas)
- [📱 Guía de Uso](#guía-de-uso)
- [🆕 Características Nuevas](#características-nuevas-última-sesión)
- [🐛 Solución de Problemas](#solución-de-problemas)

---

## ✨ Características Principales

### 💼 Gestión Completa de Finanzas
- **📊 Dashboard Interactivo**: Visualiza resumen mensual (ingresos, gastos, balance)
- **💳 Transacciones**: Registro de ingresos y gastos (fijos y variables)
- **⚡ Gastos Diarios**: Entrada rápida de gastos cotidianos sin formularios complejos
- **📈 Proyección**: Predicción automática de gastos para el próximo mes
- **💱 Multi-moneda**: Soporte USD/RD$ con tasa de cambio actualizable

### 📊 Análisis y Control
- **📊 Presupuestos Mensuales**: Define presupuestos por categoría con visualización de progreso
- **🎯 Metas de Ahorro**: Establece objetivos con cálculo inteligente de ahorro periódico
- **📈 Estadísticas Avanzadas**: Análisis detallado (promedio por categoría, top gastos, etc.)
- **📅 Calendario**: Visualiza gastos diarios del mes en formato calendárico
- **🔍 Búsqueda Avanzada**: Filtra transacciones por múltiples criterios
- **🔔 Sistema de Alertas**: Notificaciones cuando excedes límites de gasto

### 📋 Reportes y Exportación
- **📋 Reportes PDF**: Exporta estados financieros profesionales
- **💾 Backup/Restore**: Exporta e importa datos en JSON (cifrados)
- **🔐 Cifrado Local**: Todos los datos guardados con encriptación AES en LocalStorage

### 🎨 Experiencia de Usuario
- **🎨 Diseño Responsivo**: Interfaz adaptable a cualquier dispositivo (móvil, tablet, desktop)
- **📱 Navegación móvil**: Sidebar oculto en móvil + menú flotante circular (FAB) con todas las pestañas
- **🌓 Tema Oscuro**: Modo oscuro completo con toggle dinámico
- **⚡ Rendimiento**: Interfaz rápida y optimizada con Vite
- **🔄 Actualizaciones en Tiempo Real**: Cambios inmediatos sin recargar página

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|----------|
| **React** | 18.2.0 | Interfaz de usuario con hooks |
| **Vite** | 7.3.0 | Build tool y dev server |
| **Tailwind CSS** | 3.4.0 | Estilos y diseño responsivo |
| **Recharts** | 2.10.3 | Gráficos interactivos |
| **CryptoJS** | 4.2.0 | Cifrado AES para datos |
| **gh-pages** | 6.1.0 | Despliegue a GitHub Pages |

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

# Vista previa
npm run preview
```

---

## 📦 Instalación Completa

### Paso 1: Clonar o Descargar

```bash
# Si usas git
git clone https://github.com/tu-usuario/finanzas-personales.git
cd finanzas-personales

# O descarga el ZIP, extrae y entra en la carpeta
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

⚠️ **Importante**: No compartas ni subas esta clave a Git.

### Paso 4: Configurar para GitHub Pages (Opcional)

Abre `vite.config.js` y modifica la propiedad `base`:

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/nombre-de-tu-repositorio/', // ← Cambia aquí
})
```

**Ejemplo**: Si tu repositorio es `my-finances`, usa:
```javascript
base: '/my-finances/',
```

### Paso 5: Ejecutar en Desarrollo

```bash
npm run dev
```

Abre http://localhost:5173/ en tu navegador.

---

## 🌐 Despliegue en GitHub Pages

### Requisitos Previos

- Cuenta de GitHub
- Git instalado
- Repositorio creado en GitHub

### Paso 1: Sincronizar con GitHub

```bash
# Inicializar git (si es nuevo proyecto)
git init

# Agregar todos los archivos
git add .

# Commit inicial
git commit -m "Configuración inicial de la aplicación"

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

1. Ve a tu repositorio en GitHub → **Settings**
2. Menú lateral → **Pages**
3. **Source**: Rama `gh-pages` / carpeta `/ (root)`
4. **Save**

Tu app estará en: `https://tu-usuario.github.io/nombre-repositorio/`

---

## 🧪 Pruebas Automatizadas

Actualmente no hay suite de pruebas automatizadas ni flujos de CI ejecutándose. Se eliminaron los tests de Playwright, la configuración asociada y los workflows de GitHub Actions, por lo que no se dispara ninguna ejecución de tests al instalar o desplegar.

- No existen scripts de npm para pruebas ni configuración de Playwright en el repositorio.
- No hay carpetas `tests/` ni reportes `test-results/` presentes.
- Si en el futuro necesitas reactivar las pruebas, instala `@playwright/test`, crea un nuevo `playwright.config.js`, restaura la carpeta de especificaciones y añade los workflows que necesites.

---

## 📱 Guía de Uso

### 📱 Navegación en móvil (FAB - Floating Action Button)

**¿Cómo funciona?**
- En móvil el sidebar no se muestra; usa el botón flotante (☰) en la esquina inferior derecha
- Toca ☰ para abrir el menú circular con todas las pestañas
- Al elegir una opción, el menú se cierra y te lleva al tab; la vista hace scroll al inicio para ver el contenido
- En desktop el sidebar sigue visible y el FAB no aparece

**Visualización del FAB en móvil:**

```
┌─────────────────────────────┐
│                             │
│   Tu Contenido Financiero   │
│                             │
│                             │
│                             │
│                             │
│                             │
│  📊 💚 📅 🔔           ┌───────────────┐
│  📈 📋 🔍 ⚡      →   │   Dashboard   │
│         [☰]               │ Transacciones │
│                           │  Gastos Diarios│
│                           │   Proyección   │
│                           │    Metas       │
│                           │ Presupuestos   │
│                           │ Estadísticas   │
│                           │   Calendario   │
│                           └───────────────┘
```

- **Botón cerrado**: (☰) en esquina inferior derecha
- **Botón abierto**: (✕) y muestra círculo con 12 opciones centradas
- **Seleccionar**: Toca opción → menú se cierra → navega al tab → scroll al inicio

### 🏠 Dashboard - Panel Principal

**¿Qué ves?**
- Resumen del mes actual
- Total de ingresos, gastos y balance
- Gráfico de distribución de gastos por categoría
- Opciones para cambiar mes y año

**¿Qué puedes hacer?**
- Seleccionar mes/año con navegadores
- Ver progreso de presupuestos
- Acceder rápidamente a otras funciones

### 💳 Transacciones - Registro Completo

**¿Cómo registrar?**
1. Selecciona tipo: Ingreso, Gasto Fijo o Gasto Variable
2. Ingresa monto, descripción, categoría y fecha
3. Click en "Registrar Transacción"

**Tipos de transacciones:**
- **Ingreso**: Dinero que entra (salario, bonificación, etc.)
- **Gasto Fijo**: Gasto recurrente (renta, servicios, etc.)
- **Gasto Variable**: Gasto ocasional (compras, comida, etc.)

### ⚡ Gastos Diarios - Entrada Rápida

**¿Para qué?**
Registra gastos cotidianos sin llenar formularios complejos.

**¿Cómo?**
1. Haz click en "⚡ Gastos Diarios"
2. Ingresa: Monto, Descripción, Categoría
3. Click en "Registrar"

**Ejemplo**: Helado por RD$ 150 → Se registra automáticamente como "gasto-variable"

### 🎯 Metas - Ahorro Inteligente

**Nueva funcionalidad**: Cálculo automático de ahorro periódico

**¿Cómo crear una meta?**
1. Ingresa nombre: "Vacaciones en verano"
2. Monto objetivo: RD$ 60,000
3. Fecha límite: 12 meses
4. **Ingreso mensual**: Tu ingreso promedio

**¿Qué te mostrará?**
```
💰 Necesitas ahorrar: RD$ 5,000/mes
   ✅ 25% de tu ingreso (ES POSIBLE)
```

Si requiere > 100% de ingreso, mostrará ⚠️ advertencia.

### 📊 Presupuestos - Control de Gastos

**¿Cómo funciona?**
- Define límite de gasto por categoría
- La app muestra progreso vs. gasto real
- ✅ Verde: Dentro del presupuesto
- 🔴 Rojo: Excediste el presupuesto

**Nueva funcionalidad**: Presupuesto automático (40%)
- Click en "Aplicar Automático"
- Se distribuye 40% de tu ingreso entre todas las categorías
- Confirmación antes de aplicar

**Ejemplo**: Ingreso RD$ 20,000 → 40% = RD$ 8,000 distribuidos

### 📈 Estadísticas - Análisis Detallado

**¿Qué información tienes?**
- Gasto promedio por categoría
- Top 5 gastos más grandes
- Top 5 categorías más costosas
- Gasto promedio diario
- Balance mensual (ingresos - gastos)

### 📅 Calendario - Gastos por Día

**¿Para qué?**
Visualiza tus gastos de forma calendárica.

**¿Cómo?**
- Cada día muestra el total de gastos
- Selecciona un mes/año arriba
- Hover para ver detalles

### 📋 Reportes - Exportar Estado Financiero

**¿Qué exportas?**
- Estado completo en PDF profesional
- Tabla de transacciones en CSV/JSON
- Resumen mensual

### 🔍 Búsqueda - Encontrar Transacciones

**¿Cómo buscar?**
- Por fecha, categoría, monto, descripción
- Resultados en tabla interactiva

### 🔔 Alertas - Notificaciones

**¿Cómo configurar?**
1. Ve a "Alertas"
2. Activa/desactiva tipos de alertas
3. Los cambios se guardan automáticamente

**Tipos de alertas:**
- Exceso de presupuesto
- Gastos por encima de promedio
- Metas completadas

### 💾 Backup - Guardar y Restaurar

**Exportar datos** (crear respaldo):
1. Click en "Exportar Datos"
2. Se descargará `finanzas-backup-FECHA.json`
3. Guarda en lugar seguro

**Importar datos** (restaurar respaldo):
1. Click en "Importar Datos"
2. Selecciona tu archivo JSON
3. Confirma ⚠️ (reemplazará todos los datos)

---

## 🆕 Características Nuevas (Última Sesión)

### 1. Navegación móvil con menú flotante
- Sidebar oculto en móviles; todo se navega con un menú flotante circular (FAB)
- Botón ☰ en esquina inferior derecha abre el menú; al elegir opción se cierra solo
- Ítems ampliados y centrados, con etiquetas completas y scroll-to-top para ver el contenido
- En desktop se mantiene el sidebar tradicional

### 2. Gastos Diarios Rápidos
- Formulario simplificado sin campos innecesarios
- Registro instantáneo de gastos cotidianos
- Tab "⚡ Gastos Diarios" en navegación principal

### 3. Metas Inteligentes
- **Nuevo**: Campo "Ingreso Mensual" en formulario
- **Nuevo**: Cálculo automático de ahorro periódico necesario
- Indicador visual: ✅ Posible / ⚠️ Difícil (rojo si > 100% ingreso)
- Sugerencia automática de meta (10% ingreso anual)

### 4. Presupuestos Automáticos
- **Nuevo**: Botón "Aplicar Automático" en Presupuestos
- Distribuye 40% del ingreso entre todas las categorías
- Confirmación antes de aplicar
- Información clara del cálculo

### 5. Correcciones en Estadísticas
- Ingresos y gastos separados correctamente
- Cálculos de promedio solo en gastos
- Balance neto incluido (ingresos - gastos)
- Cards informativos con colores adecuados

### 6. Precisión de Fechas
- Soporte para años futuros (2023-2100)
- Formato YYYY-MM-DD consistente
- UTC para evitar desfases de zona horaria
- Validación automática de fechas

### 7. Formato Profesional en Reportes
- Moneda formateada: "RD$ 1,234.56"
- Miles separadores en todos lados
- Tablas profesionales
- Exportación a CSV y JSON

---

## 📂 Estructura del Proyecto

```
finanzas-personales/
├── src/
│   ├── components/              # Componentes React
│   │   ├── Dashboard.jsx        # Panel principal
│   │   ├── TransactionForm.jsx  # Formulario de transacciones
│   │   ├── DailyExpenses.jsx    # Gastos rápidos
│   │   ├── SavingsGoals.jsx     # Metas de ahorro
│   │   ├── Budgets.jsx          # Presupuestos
│   │   ├── AdvancedStats.jsx    # Estadísticas
│   │   ├── Calendar.jsx         # Calendario
│   │   ├── Projection.jsx       # Proyección de gastos
│   │   ├── ReportPDF.jsx        # Reportes
│   │   ├── Alerts.jsx           # Sistema de alertas
│   │   ├── SearchFilter.jsx     # Búsqueda
│   │   ├── ExchangeRateWidget.jsx # Tasa de cambio
│   │   ├── BackupRestore.jsx    # Respaldos
│   │   └── ...
│   ├── hooks/                   # Custom Hooks
│   │   ├── useFinancesData.js   # Datos y transacciones
│   │   ├── useSavingsGoals.js   # Lógica de metas
│   │   ├── useBudgets.js        # Lógica de presupuestos
│   │   ├── useAlerts.js         # Sistema de alertas
│   │   ├── useTheme.js          # Tema oscuro/claro
│   │   └── useExchangeRate.js   # Tasa de cambio
│   ├── config/
│   │   └── categoryConfig.js    # Categorías disponibles
│   ├── assets/                  # Imágenes y SVGs
│   ├── App.jsx                  # Componente principal
│   ├── main.jsx                 # Punto de entrada
│   └── index.css                # Estilos globales
├── public/                      # Archivos públicos
├── dist/                        # Build de producción (generado)
├── index.html                   # HTML principal
├── vite.config.js               # Configuración Vite
├── tailwind.config.js           # Configuración Tailwind
├── postcss.config.js            # Configuración PostCSS
├── package.json                 # Dependencias
└── README.md                    # Este archivo
```

---

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo local (hot reload)
npm run build        # Build de producción
npm run preview      # Preview del build producción
npm run predeploy    # Build + auditoría npm
npm run deploy       # Deploy a GitHub Pages
npm run audit        # Auditoría de seguridad
npm run audit:fix    # Intento de fix automático
```

Nota: no hay scripts de pruebas activos. Para reinstalar Playwright agrega `@playwright/test`, crea un `playwright.config.js`, añade la carpeta de especificaciones y (opcional) restaura workflows de CI.

---

## 🐛 Solución de Problemas

### ❌ "La app no carga en localhost"

**Solución:**
```bash
# Verifica que el puerto 5173 no esté en uso
# O usa:
npm run dev -- --port 3000
```

### ❌ "Los datos no se guardan"

**Causas y soluciones:**
- ✅ Verifica que LocalStorage no esté deshabilitado
- ✅ Prueba en modo incógnito (sin extensiones)
- ✅ Revisa la consola del navegador: `F12 → Console`
- ✅ Borra cache: `Ctrl+Shift+Supr`

### ❌ "Error al hacer deploy a GitHub Pages"

**Soluciones:**
1. Verifica que `vite.config.js` tenga `base` correcto
2. Asegúrate de que `gh-pages` esté en Settings → Pages
3. Espera 2-3 minutos para que se propague
4. Intenta con navegador incógnito

### ❌ "El gráfico no se muestra"

**Causas:**
- No hay gastos en el mes seleccionado
- Las transacciones no tienen categoría

**Solución:**
- Registra gastos con categoría
- Selecciona un mes que tenga datos

### ❌ "Presupuestos no se guardan"

**Solución:**
- Verifica que tengas ingreso mensual registrado
- Intenta crear primero una transacción de ingreso

---

## 🔒 Seguridad y Privacidad

### ✅ Protección de Datos
- Todos los datos se guardan **localmente** en tu navegador
- **Cifrado AES** en LocalStorage (clave en variables de entorno)
- **No se envía información** a ningún servidor
- **Tú tienes control total** sobre tus datos

### ⚠️ Límites de Seguridad
- Seguridad suficiente para uso personal
- No es 100% seguro para datos extremadamente sensibles
- La clave se expone en el bundle (necesario para app cliente)

### 🔄 Respaldos Regulares
- Exporta tus datos regularmente
- Guarda los archivos JSON en lugar seguro
- Prueba importar de vez en cuando

---

## 📊 Flujo de Uso Recomendado (Primer Día)

1. **Setup (5 min)**
   - Registra tu ingreso mensual en Dashboard
   - Crea 2-3 categorías de gasto si lo necesitas

2. **Configuración (10 min)**
   - Ve a Presupuestos → Aplicar Automático
   - Crea 1-2 metas de ahorro
   - Configura alertas básicas

3. **Uso Diario (2 min/día)**
   - Usa "⚡ Gastos Diarios" para entradas rápidas
   - O "💳 Transacciones" para entradas detalladas

4. **Revisión Semanal (5 min)**
   - Revisa Dashboard
   - Chequea progreso vs. presupuestos
   - Analiza Estadísticas

5. **Respaldo Mensual (2 min)**
   - Exporta datos a JSON
   - Guarda en Dropbox/Google Drive/USB

---

## 🤝 Contribuciones

¡Tus contribuciones son bienvenidas! Para cambios importantes:

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/mi-feature`
3. Commit cambios: `git commit -m "Agrega mi feature"`
4. Push: `git push origin feature/mi-feature`
5. Abre un Pull Request

---

## 📄 Licencia

MIT - Libre para usar, modificar y distribuir.

---

## 📞 Soporte

¿Problemas o sugerencias?
- Revisa la sección [Solución de Problemas](#solución-de-problemas)
- Abre un Issue en GitHub
- Contacta al desarrollador

---

**Última actualización**: 18 de diciembre de 2025  
**Versión**: 1.0.0  
**Estado**: ✅ Producción



## � Nota sobre Seguridad Actual

- ✅ LocalStorage + cifrado AES (protege contra acceso casual)
- ⚠️ La clave de cifrado se expone en el bundle (ya que es un app cliente)
- ✅ Suficiente para uso personal; no es 100% seguro para datos muy sensibles

## 🚀 Mejoras Futuras (Roadmap)

### v1.1.0 (Próxima)
- [ ] Migración a Firebase/Supabase para autenticación y backend
- [ ] Cifrado servidor-side (clave oculta en backend, no en cliente)
- [ ] Sincronización multi-dispositivo
- [ ] Autenticación con Google/GitHub

### v1.2.0
- [ ] Categorías personalizables con colores
- [ ] Filtros avanzados en transacciones
- [ ] Reportes mensuales en PDF
- [ ] Notificaciones de alertas de gasto

### v2.0.0
- [ ] App móvil nativa (React Native)
- [ ] Soporte offline-first con IndexedDB
- [ ] Integración con APIs bancarias
- [ ] Análisis predictivo de gastos con IA

## �📧 Contacto

Si tienes preguntas o sugerencias, abre un issue en GitHub.

---
## 📚 Documentación Técnica Completa

Esta carpeta contiene documentación profesional para desarrolladores, arquitectos y mantenedores a largo plazo.

### 🎯 Selecciona según tu necesidad:

#### 👨‍💻 **¿Eres Desarrollador Nuevo?**
1. Lee [EXECUTIVE_SUMMARY.md](docs/EXECUTIVE_SUMMARY.md) (15 min) → Entiendes qué hace todo
2. Consulta [API_REFERENCE.md](docs/API_REFERENCE.md) → Sabes qué funciones usar
3. Lee [SYSTEM_ARCHITECTURE.md](docs/SYSTEM_ARCHITECTURE.md) cuando necesites profundidad

#### 👨‍🔬 **¿Necesitas Hacer Cambios Arquitectónicos?**
1. [SYSTEM_ARCHITECTURE.md](docs/SYSTEM_ARCHITECTURE.md) (45 min) → Especificación completa
2. [FLOW_DIAGRAMS.md](docs/FLOW_DIAGRAMS.md) → Visualiza los flujos
3. [API_REFERENCE.md](docs/API_REFERENCE.md) → Valida interfaces públicas

#### 🏗️ **¿Vas a Agregar una Feature Nueva?**
1. Consulta [EXECUTIVE_SUMMARY.md](docs/EXECUTIVE_SUMMARY.md) sección 13 → "Guía rápida"
2. [SYSTEM_ARCHITECTURE.md](docs/SYSTEM_ARCHITECTURE.md) sección 5.14 → "Agregar nueva funcionalidad"
3. [API_REFERENCE.md](docs/API_REFERENCE.md) → Usa hooks existentes

#### 🎨 **¿Eres Diseñador o PM?**
1. [EXECUTIVE_SUMMARY.md](docs/EXECUTIVE_SUMMARY.md) → Resumen ejecutivo

#### 👨‍💼 **¿Necesitas Presentar a Stakeholders?**
1. [EXECUTIVE_SUMMARY.md](docs/EXECUTIVE_SUMMARY.md) → Documento listo para ejecutivos
2. [README.md](#características-principales) (este archivo) → Resumen visual de features

### 📚 Tabla de Consulta Rápida

| Si necesitas... | Archivo | Sección | Tiempo |
|---|---|---|---|
| Entender qué es el sistema | EXECUTIVE_SUMMARY | Todo | 15 min |
| Especificación técnica completa | SYSTEM_ARCHITECTURE | Todo | 45 min |
| Una función específica | API_REFERENCE | Buscar nombre | 2 min |
| Ver flujos/diagramas | FLOW_DIAGRAMS | Relevante | 10 min |
| Información de feature (Asistente) | FEATURES/purchase-assistant | Spec.md | 20 min |
| Stack y dependencias | SYSTEM_ARCHITECTURE | Sección 2 | 5 min |
| Cálculos financieros | SYSTEM_ARCHITECTURE | Sección 11 | 15 min |
| Modelo de datos | SYSTEM_ARCHITECTURE | Sección 4 | 10 min |
| Hooks personalizados | SYSTEM_ARCHITECTURE | Sección 8 | 20 min |
| Componentes React | SYSTEM_ARCHITECTURE | Sección 9 | 25 min |
| Seguridad/Encriptación | SYSTEM_ARCHITECTURE | Sección 10 | 10 min |
| Checklist de producción | EXECUTIVE_SUMMARY | Sección 14 | 5 min |

---

## 📖 Documentos Disponibles en `/docs`

- **SYSTEM_ARCHITECTURE.md** ⭐ — Especificación técnica completa (10,000+ palabras)
- **EXECUTIVE_SUMMARY.md** — Resumen ejecutivo (4,000+ palabras)
- **API_REFERENCE.md** — Referencia de funciones y hooks
- **FLOW_DIAGRAMS.md** — Diagramas y flujos de datos
- **FEATURES/** — Documentación de features específicas
  - `purchase-assistant/SPEC.md` — Asistente de Salud Financiera (Fase 1)
- **HISTORICAL/** — Archivos de referencia/deprecados
  - Documentación de sesiones anteriores (consultar si es necesario)

---
Hecho con ❤️ usando React y Vite
