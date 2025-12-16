import { useState } from 'react';
import { useFinancesData } from './hooks/useFinancesData';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import Projection from './components/Projection';
import BackupRestore from './components/BackupRestore';
import ExchangeRateWidget from './components/ExchangeRateWidget';

function App() {
  const {
    data,
    loading,
    addTransaction,
    addIncomeCategory,
    addExpenseCategory,
    exportData,
    importData,
    clearAllData,
    calculateBalance,
    calculateProjection
  } = useFinancesData();

  // Estado para el mes/año seleccionado
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return {
      month: now.getMonth(),
      year: now.getFullYear()
    };
  });

  // Estado para la pestaña activa
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, transactions, projection, backup

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const handleMonthChange = (e) => {
    setSelectedDate(prev => ({ ...prev, month: parseInt(e.target.value) }));
  };

  const handleYearChange = (e) => {
    setSelectedDate(prev => ({ ...prev, year: parseInt(e.target.value) }));
  };

  const handlePrevMonth = () => {
    setSelectedDate(prev => {
      const newMonth = prev.month - 1;
      if (newMonth < 0) {
        return { month: 11, year: prev.year - 1 };
      }
      return { ...prev, month: newMonth };
    });
  };

  const handleNextMonth = () => {
    setSelectedDate(prev => {
      const newMonth = prev.month + 1;
      if (newMonth > 11) {
        return { month: 0, year: prev.year + 1 };
      }
      return { ...prev, month: newMonth };
    });
  };

  const handleAddTransaction = (transaction) => {
    addTransaction(transaction);
    setActiveTab('dashboard'); // Cambiar a dashboard después de agregar
  };

  // Generar array de años (últimos 5 y próximos 2)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 8 }, (_, i) => currentYear - 5 + i);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">💰 Finanzas Personales</h1>
            
            {/* Selector de fecha */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Mes anterior"
              >
                ←
              </button>
              
              <select
                value={selectedDate.month}
                onChange={handleMonthChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {months.map((month, index) => (
                  <option key={month} value={index}>{month}</option>
                ))}
              </select>
              
              <select
                value={selectedDate.year}
                onChange={handleYearChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Mes siguiente"
              >
                →
              </button>
            </div>
          </div>

          {/* Tabs de navegación */}
          <div className="mt-4 border-b border-gray-200">
            <nav className="-mb-px flex gap-6">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'transactions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ➕ Registrar
              </button>
              <button
                onClick={() => setActiveTab('projection')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'projection'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📈 Proyección
              </button>
              <button
                onClick={() => setActiveTab('backup')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'backup'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                💾 Respaldo
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Contenido principal */}
          <div className="lg:col-span-3">
            {activeTab === 'dashboard' && (
              <Dashboard
                transactions={data.transactions}
                selectedMonth={selectedDate.month}
                selectedYear={selectedDate.year}
                calculateBalance={calculateBalance}
              />
            )}

            {activeTab === 'transactions' && (
              <TransactionForm
                onSubmit={handleAddTransaction}
                incomeCategories={data.incomeCategories}
                expenseCategories={data.expenseCategories}
                onAddIncomeCategory={addIncomeCategory}
                onAddExpenseCategory={addExpenseCategory}
              />
            )}

            {activeTab === 'projection' && (
              <Projection
                calculateProjection={calculateProjection}
                data={data}
              />
            )}

            {activeTab === 'backup' && (
              <BackupRestore
                exportData={exportData}
                importData={importData}
                clearAllData={clearAllData}
              />
            )}
          </div>

          {/* Sidebar con widget de tasa de cambio */}
          <div className="lg:col-span-1">
            <ExchangeRateWidget />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © 2025 Finanzas Personales - Todos los datos se almacenan localmente en tu navegador
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
