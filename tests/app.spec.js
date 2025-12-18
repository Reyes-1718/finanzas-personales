import { test, expect } from '@playwright/test';

const MOBILE_VIEWPORT = { width: 390, height: 844 };

test('Dashboard carga en desktop', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Dashboard')).toBeVisible();
});

test('FAB móvil abre, navega a Transacciones y se cierra', async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto('/');

  const fab = page.getByTestId('fab-button');
  await expect(fab).toBeVisible();

  // Abrir menú
  await fab.click();
  const txButton = page.getByTestId('fab-item-transactions');
  await expect(txButton).toBeVisible();

  // Navegar a Transacciones
  await txButton.click();

  // FAB vuelve a estado cerrado
  await expect(fab).toHaveText('☰');
  // El formulario de transacciones debe ser visible
  await expect(page.getByRole('heading', { name: /agregar transacción/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /agregar transacción/i })).toBeVisible();
});
