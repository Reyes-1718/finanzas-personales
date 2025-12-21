/**
 * Parsear fecha ISO (YYYY-MM-DD) sin conversión de zona horaria
 * Soluciona el bug donde new Date("2025-12-01") asume UTC y convierte localmente
 * @param {string} dateString - Fecha en formato ISO (YYYY-MM-DD)
 * @returns {Date} - Objeto Date en zona horaria local
 */
export const parseLocalDate = (dateString) => {
  if (!dateString) return new Date();
  
  const [year, month, day] = dateString.split('-').map(Number);
  // month - 1 porque getMonth() es 0-indexed
  return new Date(year, month - 1, day);
};

/**
 * Obtener mes (0-indexed) de una fecha ISO sin problemas de timezone
 * @param {string} dateString - Fecha en formato ISO (YYYY-MM-DD)
 * @returns {number} - Mes (0-11)
 */
export const getMonthFromISODate = (dateString) => {
  const [, month] = dateString.split('-').map(Number);
  return month - 1; // 0-indexed
};

/**
 * Obtener año de una fecha ISO
 * @param {string} dateString - Fecha en formato ISO (YYYY-MM-DD)
 * @returns {number} - Año
 */
export const getYearFromISODate = (dateString) => {
  const [year] = dateString.split('-').map(Number);
  return year;
};

/**
 * Comparar si dos fechas ISO están en el mismo mes/año
 * @param {string} dateString - Fecha en formato ISO (YYYY-MM-DD)
 * @param {number} month - Mes (0-indexed)
 * @param {number} year - Año
 * @returns {boolean}
 */
export const isSameMonthYear = (dateString, month, year) => {
  return getYearFromISODate(dateString) === year && getMonthFromISODate(dateString) === month;
};
