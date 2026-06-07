/**
 * Tabla de resultados de búsqueda de transacciones.
 * Antes estaba inline dentro de App.jsx.
 */
const SearchResults = ({ results }) => {
  if (results === null) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Resultados: {results.length} transacciones
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700">
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Fecha</th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Tipo</th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Categoría</th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Descripción</th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Monto</th>
            </tr>
          </thead>
          <tbody>
            {results.map((t) => (
              <tr key={t.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-2 text-gray-900 dark:text-white">{t.date}</td>
                <td className="px-4 py-2 text-gray-900 dark:text-white">{t.type}</td>
                <td className="px-4 py-2 text-gray-900 dark:text-white">{t.category}</td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{t.description}</td>
                <td className="px-4 py-2 font-semibold">
                  {t.currency === 'USD' ? 'US$' : 'RD$'} {t.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SearchResults;
