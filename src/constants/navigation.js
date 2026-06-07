/**
 * Definición centralizada de los ítems de navegación.
 * Usada tanto por el Sidebar desktop como por el FloatingNav móvil.
 */
export const NAV_ITEMS = [
  { icon: '📊', label: 'Dashboard',       key: 'dashboard' },
  { icon: '💳', label: 'Transacciones',   key: 'transactions' },
  { icon: '⚡', label: 'Gastos Diarios',  key: 'daily' },
  { icon: '📈', label: 'Proyección',      key: 'projection' },
  { icon: '💚', label: 'Metas',           key: 'goals' },
  { icon: '📊', label: 'Presupuestos',    key: 'budgets' },
  { icon: '🛟', label: 'Fondo Emergencia',key: 'emergency' },
  { icon: '📈', label: 'Estadísticas',    key: 'stats' },
  { icon: '📅', label: 'Calendario',      key: 'calendar' },
  { icon: '📋', label: 'Reportes',        key: 'reports' },
  { icon: '🔔', label: 'Alertas',         key: 'alerts' },
  { icon: '🔍', label: 'Buscar',          key: 'search' },
  { icon: '💾', label: 'Backup',          key: 'backup' },
];

/** Ítem especial que abre un modal en vez de cambiar de tab */
export const PURCHASE_ASSISTANT_NAV = {
  icon: '🛍️',
  label: 'Compra Segura',
  key: 'purchase-assistant'
};
