const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

const MonthSelector = ({ month, year, onChange }) => {
  const handlePrev = () => {
    if (month === 0) onChange(11, year - 1);
    else onChange(month - 1, year);
  };

  const handleNext = () => {
    if (month === 11) onChange(0, year + 1);
    else onChange(month + 1, year);
  };

  return (
    <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={handlePrev}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded transition"
        >
          ← Anterior
        </button>

        <select
          value={month}
          onChange={(e) => onChange(parseInt(e.target.value), year)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded"
        >
          {MONTHS.map((name, idx) => (
            <option key={idx} value={idx}>{name}</option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => onChange(month, parseInt(e.target.value))}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded"
        >
          {YEARS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <button
          onClick={handleNext}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded transition"
        >
          Siguiente →
        </button>

        <span className="text-lg font-semibold text-gray-700 dark:text-gray-300 ml-auto">
          {MONTHS[month]} {year}
        </span>
      </div>
    </div>
  );
};

export default MonthSelector;
