/**
 * Configuración de emojis, colores y métodos de pago
 */

export const CATEGORY_CONFIG = {
  // Ingresos
  'Salario': { emoji: '💼', color: '#22c55e', bgColor: 'bg-green-50' },
  'Freelance': { emoji: '💻', color: '#3b82f6', bgColor: 'bg-blue-50' },
  'Inversiones': { emoji: '📈', color: '#f59e0b', bgColor: 'bg-amber-50' },
  'Bonos': { emoji: '🎁', color: '#ec4899', bgColor: 'bg-pink-50' },
  'Propinas': { emoji: '💰', color: '#8b5cf6', bgColor: 'bg-purple-50' },
  'Ventas': { emoji: '🛍️', color: '#14b8a6', bgColor: 'bg-teal-50' },
  'Alquiler': { emoji: '🏠', color: '#06b6d4', bgColor: 'bg-cyan-50' },
  'Otros Ingresos': { emoji: '➕', color: '#6366f1', bgColor: 'bg-indigo-50' },

  // Gastos
  'Alimentación': { emoji: '🍔', color: '#ef4444', bgColor: 'bg-red-50' },
  'Transporte': { emoji: '🚕', color: '#f97316', bgColor: 'bg-orange-50' },
  'Vivienda': { emoji: '🏠', color: '#eab308', bgColor: 'bg-yellow-50' },
  'Servicios': { emoji: '💡', color: '#22c55e', bgColor: 'bg-green-50' },
  'Entretenimiento': { emoji: '🎮', color: '#3b82f6', bgColor: 'bg-blue-50' },
  'Salud': { emoji: '⚕️', color: '#ec4899', bgColor: 'bg-pink-50' },
  'Educación': { emoji: '📚', color: '#8b5cf6', bgColor: 'bg-purple-50' },
  'Ropa': { emoji: '👕', color: '#14b8a6', bgColor: 'bg-teal-50' },
  'Tecnología': { emoji: '📱', color: '#06b6d4', bgColor: 'bg-cyan-50' },
  'Otros Gastos': { emoji: '❌', color: '#6366f1', bgColor: 'bg-indigo-50' }
};

export const PAYMENT_METHODS = [
  { id: 'efectivo', name: 'Efectivo', emoji: '💵', color: '#22c55e' },
  { id: 'tarjeta-debito', name: 'Tarjeta Débito', emoji: '💳', color: '#3b82f6' },
  { id: 'tarjeta-credito', name: 'Tarjeta Crédito', emoji: '💳', color: '#8b5cf6' },
  { id: 'transferencia', name: 'Transferencia', emoji: '💸', color: '#f59e0b' },
  { id: 'billetera-digital', name: 'Billetera Digital', emoji: '📱', color: '#06b6d4' },
  { id: 'cheque', name: 'Cheque', emoji: '📝', color: '#14b8a6' }
];

export const TRANSACTION_TYPES = [
  { id: 'ingreso', name: 'Ingreso', color: '#22c55e', bgColor: 'bg-green-100', textColor: 'text-green-700' },
  { id: 'gasto-fijo', name: 'Gasto Fijo', color: '#ef4444', bgColor: 'bg-red-100', textColor: 'text-red-700' },
  { id: 'gasto-variable', name: 'Gasto Variable', color: '#f97316', bgColor: 'bg-orange-100', textColor: 'text-orange-700' }
];

export const getCategoryConfig = (category) => {
  return CATEGORY_CONFIG[category] || { emoji: '💳', color: '#6b7280', bgColor: 'bg-gray-50' };
};

export const getPaymentMethod = (methodId) => {
  return PAYMENT_METHODS.find(m => m.id === methodId) || PAYMENT_METHODS[0];
};

export const getTransactionType = (typeId) => {
  return TRANSACTION_TYPES.find(t => t.id === typeId) || TRANSACTION_TYPES[0];
};
