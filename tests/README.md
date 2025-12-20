# 🧪 E2E Testing - Quickstart

Guía rápida para ejecutar la suite E2E con Playwright. Para detalles avanzados usa la guía canónica.

## ⚙️ Requisitos
- **Node.js**: 20.19+ o 22.12+ (requerido por Vite 7.3.0)
- **npm**: 9+ o superior

## 🚀 Comandos básicos
```bash
# Instalar (primera vez)

npx playwright install --with-deps

## 🚨 Troubleshooting
npm run test:e2e


npx playwright test --ui

### Tests flaky
npx playwright show-report
```

## 📚 Documentación canónica
- Guía completa: ../docs/testing/TESTING_GUIDE.md
- Resumen de implementación: ../docs/testing/TESTING_SUMMARY.md
- Mapa de cobertura: ../docs/testing/TEST_COVERAGE_MAP.md

## 🔧 Configuración
- Config global: playwright.config.js
- Helpers reutilizables: tests/helpers.js

## ✅ Notas
- Los tests limpian el estado en `beforeEach`.
- Usa data-testid para selectores robustos cuando sea posible.
```bash
# Aumentar timeout
test.setTimeout(60 * 1000);

# O usar waitFor específico
await page.waitForSelector('[data-testid="element"]');
```

### WebServer no inicia
```bash
# Verificar que dev server funciona
npm run dev -- --host --port 4173
```

### Elementos no encontrados
```bash
# Usar data-testid en lugar de text selectors
page.locator('[data-testid="my-element"]')
```

---

**Última actualización:** Enero 2024
**Versión:** 1.0.0
**Estado:** ✅ En uso

Para más información, ver [TESTING_GUIDE.md](../docs/testing/TESTING_GUIDE.md)
