#!/bin/bash

# Verificar que solo se ejecute en entorno de desarrollo
if [ "$NODE_ENV" != "development" ]; then
  echo "❌ Las pruebas solo están disponibles en entorno de desarrollo (NODE_ENV=development)"
  exit 1
fi

# 1. Limpiar puertos antes de empezar por si acaso
npx kill-port 5173

# 2. Iniciar dev server
npm run dev &
DEV_PID=$!

# 3. Esperar de verdad a que el puerto esté activo (máximo 30s)
npx wait-on http://localhost:5173 -t 30000

# 4. Ejecutar la auditoría
node ./tests/test-audit-purchase-assistant.js
TEST_EXIT_CODE=$?

# 5. Limpieza total
echo "Cerrando servidor..."
kill $DEV_PID
npx kill-port 5173

exit $TEST_EXIT_CODE