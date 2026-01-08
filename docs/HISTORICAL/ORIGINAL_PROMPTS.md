# PROMPT: Aplicación de Finanzas Personales - SPA con React y Vite

## Descripción General del Proyecto

Crea una **Single Page Application (SPA) de Finanzas Personales** completa, segura y funcional utilizando React, Vite y Tailwind CSS. La aplicación debe permitir a los usuarios gestionar sus ingresos y gastos de forma segura, con conversión automática de monedas (DOP/USD) y proyecciones de gastos.

---

## Requisitos Funcionales

### 1. Gestión de Transacciones

- **Crear transacciones** con los siguientes campos:
  - Monto (número con soporte para decimales)
  - Tipo de transacción: **Ingreso**, **Gasto Fijo** o **Gasto Variable**
  - Categoría (lista predefinida, con opción de agregar nuevas)
  - Fecha (selector de fecha, por defecto la actual)
  - Moneda: **DOP (Peso Dominicano)** o **USD (Dólar Estadounidense)**
  - Tipo de ingreso (solo para ingresos): **Sueldo** o **Extra**

- **Validaciones necesarias:**
  - El monto debe ser positivo y mayor a 0
  - Todos los campos son obligatorios
  - Las categorías no pueden estar vacías
  - La fecha no puede ser futura

- **Operaciones CRUD completas:**
  - Crear nuevas transacciones
  - Leer/visualizar todas las transacciones registradas
  - Actualizar transacciones existentes
  - Eliminar transacciones

- **Categorías predefinidas (iniciales):**
  - **Ingresos:** Salario, Freelance, Inversiones, Bonos, Propinas, Ventas, Alquiler, Otros Ingresos
  - **Gastos:** Alimentación, Transporte, Vivienda, Servicios, Entretenimiento, Salud, Educación, Ropa, Tecnología, Otros Gastos

### 2. Panel de Control (Dashboard)

- **Estadísticas mensuales:**
  - Total de ingresos del mes (convertido a DOP)
  - Total de gastos fijos del mes (convertido a DOP)
  - Total de gastos variables del mes (convertido a DOP)
  - Balance neto: Ingresos - Gastos Totales

- **Visualizaciones con gráficos:**
  - Gráfico de pastel (Pie Chart) con la distribución de gastos por categoría
  - Gráfico de pastel con la distribución de ingresos por tipo (Sueldo/Extra)

- **Filtros:**
  - Selector de mes y año
  - Botones para navegar al mes anterior/siguiente
  - Rango de años dinámico: mostrar solo 5 años (año actual, 2 años atrás, 2 años adelante)

- **Tabla de transacciones:**
  - Mostrar todas las transacciones del mes seleccionado
  - Columnas: Fecha, Tipo, Categoría, Monto (en moneda original), Moneda
  - Botones para editar y eliminar cada transacción
  - Los montos deben mostrar con formato de miles: RD$ 6,454.34

### 3. Conversión de Monedas

- **Tasa de cambio USD a DOP:**
  - Tasa de cambio por defecto: 1 USD = 63.52 DOP
  - La tasa debe almacenarse en LocalStorage
  - Todos los cálculos internos usan DOP como moneda base

- **Convertir automáticamente:**
  - Cuando se registra un gasto/ingreso en USD, convertirlo a DOP para cálculos
  - Los montos en la tabla de transacciones muestran en su moneda original
  - Los totales y proyecciones siempre muestran en RD$

- **Widget de tasa de cambio:**
  - Permitir al usuario actualizar la tasa manualmente
  - Opción de obtener la tasa automáticamente desde una API
  - API recomendada: exchangerate-api.com (free tier)

### 4. Proyección de Gastos

- **Cálculo de proyección para el próximo mes:**
  - Gastos fijos: Suma de todos los gastos fijos de los últimos 3 meses
  - Gastos variables: Promedio de gastos variables de los últimos 3 meses
  - Proyección total: Gastos fijos + Gastos variables promedio

- **Desglose de gastos fijos:**
  - Mostrar cada categoría de gasto fijo con su monto total
  - Agrupar por moneda original (USD/DOP)
  - Mostrar con formato: "RD$ 6,454.34" y "US$ 100.00"

- **Recomendaciones:**
  - Mostrar un consejo al usuario sobre el ahorro basado en la proyección

### 5. Seguridad y Almacenamiento

- **Encriptación de datos:**
  - Encriptar todos los datos antes de guardar en LocalStorage
  - Usar AES encryption con la librería CryptoJS
  - La clave de encriptación se define en la variable de entorno `VITE_ENCRYPTION_KEY`

- **Persistencia:**
  - Guardar automáticamente los cambios en LocalStorage
  - Cargar datos al iniciar la aplicación
  - Si LocalStorage está vacío, usar datos iniciales

- **Backup y Restauración:**
  - Exportar datos como archivo JSON (con timestamp en el nombre)
  - Importar datos desde un archivo JSON
  - Validar estructura de datos antes de importar
  - Botón para limpiar todos los datos (con confirmación)

### 6. Variables de Entorno

Crear un archivo `.env.local` en la raíz del proyecto con:

```
VITE_ENCRYPTION_KEY=tu-clave-segura-unica-aqui
```

**Nota importante:** Esta clave debe ser única y segura. En producción, mantenerla privada y nunca exponerla en el repositorio (asegurarse de que `.env.local` está en `.gitignore`).

### 7. Interfaz de Usuario (UI/UX)

- **Diseño responsivo:**
  - Adaptar a dispositivos móviles, tablets y escritorio
  - Layout con sidebar y contenido principal

- **Tema visual:**
  - Usar Tailwind CSS para todo el styling
  - Colores según el tipo de transacción:
    - Ingresos: Verde
    - Gastos fijos: Rojo
    - Gastos variables: Naranja
  - Componentes con sombras, bordes redondeados y espaciado consistente

- **Navegación:**
  - Sistema de pestañas (tabs) para navegar entre vistas:
    - Dashboard (estadísticas y gráficos)
    - Transacciones (formulario y tabla)
    - Proyección (gastos proyectados)
    - Backup/Restore (importar/exportar datos)

- **Formateo de números:**
  - Todos los montos deben mostrar con formato de miles
  - Ejemplo: "6,454.34" en lugar de "6454.34"
  - Usar `Intl.NumberFormat` con localidad `es-DO`

### 8. Hooks Personalizados

- **`useFinancesData()`:**
  - Maneja todo el estado de las finanzas
  - Encriptación/Desencriptación de datos
  - CRUD de transacciones
  - Gestión de categorías
  - Cálculos de balance y proyecciones
  - Exportación/Importación de datos

- **`useExchangeRate()`:**
  - Gestiona la tasa de cambio
  - Obtiene la tasa desde localStorage
  - Realiza conversiones USD → DOP
  - Actualiza la tasa desde API o manualmente

### 9. Componentes

- **App.jsx:**
  - Componente principal
  - Gestiona el estado global
  - Renderiza el layout (sidebar + contenido principal)
  - Maneja la navegación entre pestañas

- **Dashboard.jsx:**
  - Muestra estadísticas mensuales
  - Gráficos de pastel con Recharts
  - Tabla de transacciones del mes

- **TransactionForm.jsx:**
  - Formulario para agregar nuevas transacciones
  - Validaciones en tiempo real
  - Selector de moneda (DOP/USD)
  - Selector de tipo de ingreso (Sueldo/Extra)
  - Selector de categoría dinámico según el tipo

- **Projection.jsx:**
  - Muestra la proyección de gastos
  - Desglose por categoría
  - Consejos personalizados

- **ExchangeRateWidget.jsx:**
  - Widget para actualizar la tasa de cambio
  - Botón para obtener tasa automática desde API
  - Entrada manual para editar la tasa

- **BackupRestore.jsx:**
  - Botón para exportar datos como JSON
  - Área para importar archivos JSON
  - Botón para limpiar todos los datos

---

## Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|----------|
| React | 18.2.0 | Framework UI |
| Vite | 7.3.0 | Bundler y dev server |
| Tailwind CSS | 3.4.0 | Estilos y diseño responsivo |
| Recharts | 2.10.3 | Gráficos (pie charts) |
| CryptoJS | 4.2.0 | Encriptación AES |
| gh-pages | 6.1.0 | Deployment en GitHub Pages |

---

## Estructura de Carpetas

```
finanzas-personales/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── TransactionForm.jsx
│   │   ├── Projection.jsx
│   │   ├── ExchangeRateWidget.jsx
│   │   └── BackupRestore.jsx
│   ├── hooks/
│   │   ├── useFinancesData.js
│   │   └── useExchangeRate.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── .env.local
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
└── README.md
```

---

## Scripts Disponibles

```json
"dev": "vite"                              // Inicia servidor de desarrollo
"build": "vite build"                      // Compila para producción
"preview": "vite preview"                  // Previsualiza la build
"predeploy": "npm run build && npm audit"  // Build + auditoría antes de deploy
"deploy": "gh-pages -d dist"               // Despliega en GitHub Pages
"audit": "npm audit"                       // Auditoría de seguridad
"audit:fix": "npm audit fix"               // Soluciona vulnerabilidades automáticamente
```

---

## Flujo de Datos

### Agregar una Transacción:
1. Usuario llena el formulario en TransactionForm
2. Se validan los datos
3. Se llama a `addTransaction()` del hook
4. El estado se actualiza
5. Los datos se encriptan
6. Se guardan en LocalStorage
7. El Dashboard se actualiza automáticamente

### Convertir Monedas:
1. Cuando se registra una transacción en USD
2. Se obtiene la tasa de `localStorage`
3. Se convierte a DOP para cálculos internos
4. Se almacena el monto original y la moneda
5. Los totales siempre muestran en RD$
6. La tabla muestra el monto original en su moneda

### Calcular Proyección:
1. Se obtienen todas las transacciones de los últimos 3 meses
2. Se filtran gastos fijos y se convierten a DOP
3. Se agrupan gastos variables por mes
4. Se convierte cada mes a DOP
5. Se calcula el promedio de gastos variables
6. Se suma: Gastos Fijos + Promedio Variables

---

## Mejoras Futuras (Roadmap)

### v1.1.0
- [ ] Edición de transacciones desde la tabla
- [ ] Filtros avanzados (por categoría, rango de fechas)
- [ ] Estadísticas anuales

### v1.2.0
- [ ] Integración con banco/cuenta (API de terceros)
- [ ] Presupuestos personalizados por categoría
- [ ] Alertas cuando se excede el presupuesto

### v2.0.0
- [ ] Servidor backend seguro con encriptación end-to-end
- [ ] Base de datos (MongoDB/PostgreSQL)
- [ ] Sincronización en múltiples dispositivos
- [ ] Autenticación de usuarios

---

## Consideraciones Importantes

1. **Encriptación en v1:** La encriptación es local. Para mayor seguridad en producción, se recomienda un backend seguro.

2. **Tasa de cambio:** Se obtiene de exchangerate-api.com (tier gratuito con límite de 1500 requests/mes).

3. **LocalStorage:** Tiene límite de ~5-10MB dependiendo del navegador. Para usuarios con miles de transacciones, se recomienda migrar a IndexedDB.

4. **Validaciones:** Se realizan tanto en el cliente como en el servidor (cuando exista).

5. **Performance:** Los cálculos se memorizan con `React.useMemo` para evitar recálculos innecesarios.

6. **Accesibilidad:** Usar etiquetas semánticas y ARIA attributes donde sea necesario.

---

## Instrucciones de Implementación

1. Clonar o crear un nuevo proyecto con Vite + React
2. Instalar dependencias: `npm install`
3. Crear `.env.local` con `VITE_ENCRYPTION_KEY`
4. Crear la estructura de carpetas según se indica
5. Implementar los hooks `useFinancesData()` y `useExchangeRate()`
6. Crear los componentes React
7. Configurar Tailwind CSS
8. Probar la aplicación en desarrollo: `npm run dev`
9. Compilar para producción: `npm run build`
10. Desplegar en GitHub Pages: `npm run deploy` (después de configurar el repositorio)

---

## Notas Finales

- Asegurarse de que todos los datos se guardan encriptados en LocalStorage
- Los gráficos deben ser interactivos con Recharts
- La aplicación debe ser completamente funcional sin conexión a internet (excepto para actualizar la tasa de cambio)
- Respetar el formato de moneda de la República Dominicana: "RD$ 1,234.56"
- Todos los montos negativos deben mostrarse de forma clara (para gastos)
