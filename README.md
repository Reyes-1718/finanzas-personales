# 💰 Finanzas Personales

Aplicación web de gestión de finanzas personales desarrollada con React, Vite y Tailwind CSS. Permite registrar ingresos y gastos, visualizar estadísticas, proyectar gastos futuros y gestionar respaldos de datos.

## ✨ Características

- 📊 **Dashboard Interactivo**: Visualiza tus ingresos, gastos y balance mensual
- 📈 **Gráficos Dinámicos**: Distribución de gastos por categoría con gráficos de pastel
- ➕ **Registro de Transacciones**: Formulario simple para agregar ingresos y gastos (fijos y variables)
- 🔮 **Proyección de Gastos**: Calcula automáticamente el gasto proyectado del próximo mes
- 💾 **Exportar/Importar**: Respaldo completo de datos en formato JSON
- 🎨 **Diseño Responsivo**: Interfaz moderna y adaptable a cualquier dispositivo
- 💿 **Persistencia Local**: Todos los datos se guardan en LocalStorage del navegador

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 16+ y npm instalados
- Cuenta de GitHub
- Git instalado

### 1. Clonar o Descargar el Proyecto

```bash
# Si usas git
git clone https://github.com/tu-usuario/finanzas-personales.git
cd finanzas-personales

# O descarga el ZIP y extráelo
```

### 2. Instalar Dependencias

```bash
npm install
```

Esto instalará:
- React 18.2.0
- Vite 5.0.8
- Tailwind CSS 3.4.0
- Recharts 2.10.3
- gh-pages 6.1.0

### 3. Configurar para GitHub Pages

Abre el archivo `vite.config.js` y modifica la propiedad `base`:

```javascript
export default defineConfig({
  plugins: [react()],
  // IMPORTANTE: Cambia 'finanzas-personales' por el nombre de tu repositorio
  base: '/nombre-de-tu-repositorio/',
})
```

**Ejemplo**: Si tu repositorio se llama `my-finances`, usa:
```javascript
base: '/my-finances/',
```

### 4. Desarrollo Local

Para ejecutar la aplicación en modo desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📦 Despliegue en GitHub Pages

### Paso 1: Crear Repositorio en GitHub

1. Ve a GitHub y crea un nuevo repositorio
2. Nómbralo como prefieras (ej: `finanzas-personales`)
3. No inicialices con README, .gitignore o licencia

### Paso 2: Configurar Git Localmente

```bash
# Inicializar git (si no lo has hecho)
git init

# Agregar todos los archivos
git add .

# Hacer commit inicial
git commit -m "Configuración inicial de la aplicación"

# Conectar con tu repositorio remoto
git remote add origin https://github.com/tu-usuario/nombre-repositorio.git

# Subir a GitHub
git branch -M main
git push -u origin main
```

### Paso 3: Construir el Proyecto

```bash
npm run build
```

Este comando:
- Compila y optimiza la aplicación
- Genera la carpeta `dist` con los archivos estáticos
- Prepara el proyecto para producción

### Paso 4: Desplegar a GitHub Pages

```bash
npm run deploy
```

Este comando:
1. Ejecuta automáticamente `npm run build`
2. Sube el contenido de `dist` a la rama `gh-pages`
3. Configura GitHub Pages automáticamente

### Paso 5: Habilitar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Pages**
4. En **Source**, selecciona la rama `gh-pages` y carpeta `/ (root)`
5. Click en **Save**

Tu aplicación estará disponible en:
```
https://tu-usuario.github.io/nombre-repositorio/
```

## 📝 Estructura del Proyecto

```
finanzas-personales/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx          # Vista principal con estadísticas
│   │   ├── TransactionForm.jsx    # Formulario de registro
│   │   ├── Projection.jsx         # Módulo de proyección
│   │   └── BackupRestore.jsx      # Exportar/Importar datos
│   ├── hooks/
│   │   └── useFinancesData.js     # Hook personalizado para LocalStorage
│   ├── App.jsx                    # Componente principal
│   ├── main.jsx                   # Punto de entrada
│   └── index.css                  # Estilos globales con Tailwind
├── public/
├── index.html
├── vite.config.js                 # Configuración de Vite
├── tailwind.config.js             # Configuración de Tailwind
├── package.json
└── README.md
```

## 🎯 Uso de la Aplicación

### Registrar Transacciones

1. Ve a la pestaña **Registrar**
2. Selecciona el tipo: Ingreso, Gasto Fijo o Gasto Variable
3. Ingresa el monto, descripción, fecha y categoría
4. Click en **Registrar Transacción**

### Ver Dashboard

- El Dashboard muestra automáticamente el mes actual
- Usa los selectores de mes/año para navegar
- Visualiza ingresos, gastos, balance y gráficos

### Proyección de Gastos

La proyección se calcula como:
```
Proyección = Gastos Fijos + Promedio(Gastos Variables últimos 3 meses)
```

### Respaldo de Datos

**Exportar:**
1. Ve a la pestaña **Respaldo**
2. Click en **Exportar Datos**
3. Se descargará un archivo JSON con fecha

**Importar:**
1. Ve a la pestaña **Respaldo**
2. Click en **Importar Datos**
3. Selecciona tu archivo JSON de respaldo
4. Confirma la acción (⚠️ reemplazará todos los datos actuales)

## 🔧 Scripts Disponibles

```bash
npm run dev        # Modo desarrollo
npm run build      # Construir para producción
npm run preview    # Vista previa del build
npm run deploy     # Desplegar a GitHub Pages
```

## 🛠️ Tecnologías Utilizadas

- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **Recharts** - Biblioteca de gráficos
- **LocalStorage API** - Persistencia de datos
- **gh-pages** - Despliegue a GitHub Pages

## 📱 Compatibilidad

- ✅ Chrome, Firefox, Safari, Edge (últimas versiones)
- ✅ Dispositivos móviles y tablets
- ✅ Diseño responsivo

## 🔒 Privacidad

- Todos los datos se almacenan **localmente** en tu navegador
- **No se envía información** a ningún servidor
- Tú tienes el **control completo** de tus datos
- Usa la función de exportar para crear respaldos

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🆘 Solución de Problemas

### La aplicación no carga en GitHub Pages

1. Verifica que `base` en `vite.config.js` coincida con el nombre del repositorio
2. Asegúrate de que GitHub Pages esté configurado en la rama `gh-pages`
3. Espera 1-2 minutos después del deploy para que se actualice

### Los datos no se guardan

1. Verifica que tu navegador permita LocalStorage
2. Revisa la consola del navegador por errores
3. Prueba en modo incógnito para descartar extensiones

### El gráfico no se muestra

1. Asegúrate de tener gastos registrados en el mes seleccionado
2. Verifica que las transacciones tengan categoría asignada

## 📧 Contacto

Si tienes preguntas o sugerencias, abre un issue en GitHub.

---

Hecho con ❤️ usando React y Vite
