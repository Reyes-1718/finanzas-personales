import React, { useMemo } from 'react';

const Calendar = ({ transactions, year, month, getDailyExpenses }) => {
  const dailyExpenses = useMemo(() => getDailyExpenses(year, month), [getDailyExpenses, year, month]);
  
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const getDayExpense = (day) => {
    // Asegurar formato YYYY-MM-DD con precisión UTC
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayData = dailyExpenses.find(d => d.date === dateStr);
    return dayData ? dayData.total : 0;
  };

  const getMaxExpense = () => {
    return Math.max(...dailyExpenses.map(d => d.total), 0);
  };

  const maxExpense = getMaxExpense();
  const getIntensity = (amount) => {
    if (maxExpense === 0) return 0;
    return (amount / maxExpense) * 100;
  };

  // Validar que el mes/año sean válidos
  if (month < 0 || month > 11 || year < 1900 || year > 2100) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-red-600 dark:text-red-400">Mes o año inválido seleccionado</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Calendario de Gastos - {monthNames[month]} {year}
      </h2>

      {/* Encabezado del Calendario */}
      <div className="mb-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day, idx) => (
            <div key={idx} className="text-center font-bold text-gray-700 dark:text-gray-300 text-sm py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Días del Calendario */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            if (!day) {
              return <div key={idx} className="aspect-square" />;
            }

            const expense = getDayExpense(day);
            const intensity = getIntensity(expense);

            return (
              <div
                key={idx}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm border cursor-pointer transition hover:shadow-md ${
                  expense === 0
                    ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                    : 'border-orange-400 dark:border-orange-600'
                }`}
                style={{
                  backgroundColor: expense > 0
                    ? `rgba(249, 115, 22, ${intensity / 100 * 0.6})`
                    : 'inherit',
                  color: expense > 0 && intensity > 50 ? 'white' : 'inherit'
                }}
                title={`${monthNames[month]} ${day}, ${year}: RD$ ${expense.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              >
                <span className="font-bold">{day}</span>
                {expense > 0 && (
                  <span className="text-xs mt-1">
                    RD$ {(expense / 1000).toFixed(0)}k
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Leyenda */}
      <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-sm">
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-medium">Leyenda:</span> Los días con colores más intensos tienen mayores gastos. Puedes seleccionar diferentes meses y años en los dropdowns de arriba.
        </p>
      </div>

      {/* Detalles del Día */}
      {dailyExpenses.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Gastos por Día</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {dailyExpenses.map((day, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {new Date(day.date + 'T00:00:00').toLocaleDateString('es-DO', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  RD$ {day.total.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
