import { useEffect, useState } from 'react';
import { useFinancesData } from './hooks/useFinancesData';
import { useTheme } from './hooks/useTheme';
import { useSavingsGoals } from './hooks/useSavingsGoals';
import { useBudgets } from './hooks/useBudgets';
import { useAlerts } from './hooks/useAlerts';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import DailyExpenses from './components/DailyExpenses';
import Projection from './components/Projection';
import BackupRestore from './components/BackupRestore';
import ExchangeRateWidget from './components/ExchangeRateWidget';
import SavingsGoals from './components/SavingsGoals';
import Budgets from './components/Budgets';
import AdvancedStats from './components/AdvancedStats';
import SearchFilter from './components/SearchFilter';
import Calendar from './components/Calendar';
import ReportPDF from './components/ReportPDF';
import Alerts from './components/Alerts';
import FloatingNav from './components/FloatingNav';

function App() {
  const {
    data,
    loading,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    addIncomeCategory,
    addExpenseCategory,
    addRecurringTransaction,
    exportData,
    importData,
    clearAllData,
    getTransactionsByMonth,
    calculateBalance,
    calculateProjection,
    searchTransactions,
    getAdvancedStats,
    getDailyExpenses
  } = useFinancesData();

  // Estado para el mes/año seleccionado
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return {
      month: now.getMonth(),
      year: now.getFullYear()
    };
  });

  // Estado para sidebar colapsable
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Tema y hooks adicionales
  const { isDark, toggleTheme } = useTheme();
  const savingsGoals = useSavingsGoals();
  const budgets = useBudgets();
  const alerts = useAlerts();

  // Estado para la pestaña activa
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchResults, setSearchResults] = useState(null);

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

  // Generar array de años (últimos 2 años + año actual + próximos 2 años)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  // Procesar transacciones recurrentes al cargar (si se desea en el futuro)
  useEffect(() => {
    if (!loading) {
      // data.processRecurringTransactions && data.processRecurringTransactions();
    }
  }, [loading]);

  // Detectar cambios de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false); // Cerrar sidebar en móviles
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Llamar una vez al montar
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  const monthlyTransactions = getTransactionsByMonth(selectedDate.year, selectedDate.month);
  const stats = getAdvancedStats(monthlyTransactions);
  const monthlyIncome = (stats && typeof stats.totalIncome === 'number') ? stats.totalIncome : 0;
  const allCategories = [...data.incomeCategories, ...data.expenseCategories];

  const handleSearch = (criteria) => {
    const results = data.searchTransactions ? data.searchTransactions(criteria) : searchTransactions(criteria);
    setSearchResults(results);
    setActiveTab('search');
  };

  const handleClearSearch = () => {
    setSearchResults(null);
  };

  // handleAddTransaction ya definido arriba

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar - Solo visible en Desktop */}
          {!isMobile && (
            <div className="w-64 bg-gray-900 dark:bg-gray-950 text-white p-6 overflow-y-auto h-full z-0">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold whitespace-nowrap">💰 Finanzas</h1>
              <button
                onClick={toggleTheme}
                className="text-yellow-400 hover:text-yellow-500 text-xl"
                title="Cambiar tema"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
            </div>

            {/* Navegación Principal */}
            <nav className="space-y-2 mb-8">
              <NavButton icon="📊" label="Dashboard" isActive={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setSearchResults(null); if (isMobile) setSidebarOpen(false); }} />
              <NavButton icon="💳" label="Transacciones" isActive={activeTab === 'transactions'} onClick={() => { setActiveTab('transactions'); if (isMobile) setSidebarOpen(false); }} />
              <NavButton icon="⚡" label="Gastos Diarios" isActive={activeTab === 'daily'} onClick={() => { setActiveTab('daily'); if (isMobile) setSidebarOpen(false); }} />
              <NavButton icon="📈" label="Proyección" isActive={activeTab === 'projection'} onClick={() => { setActiveTab('projection'); if (isMobile) setSidebarOpen(false); }} />
              <NavButton icon="💚" label="Metas" isActive={activeTab === 'goals'} onClick={() => { setActiveTab('goals'); if (isMobile) setSidebarOpen(false); }} />
              <NavButton icon="📊" label="Presupuestos" isActive={activeTab === 'budgets'} onClick={() => { setActiveTab('budgets'); if (isMobile) setSidebarOpen(false); }} />
              <NavButton icon="📈" label="Estadísticas" isActive={activeTab === 'stats'} onClick={() => { setActiveTab('stats'); if (isMobile) setSidebarOpen(false); }} />
              <NavButton icon="📅" label="Calendario" isActive={activeTab === 'calendar'} onClick={() => { setActiveTab('calendar'); if (isMobile) setSidebarOpen(false); }} />
              <NavButton icon="📋" label="Reportes" isActive={activeTab === 'reports'} onClick={() => { setActiveTab('reports'); if (isMobile) setSidebarOpen(false); }} />
              <NavButton icon="🔔" label="Alertas" isActive={activeTab === 'alerts'} onClick={() => { setActiveTab('alerts'); if (isMobile) setSidebarOpen(false); }} />
              <NavButton icon="🔍" label="Buscar" isActive={activeTab === 'search'} onClick={() => { setActiveTab('search'); if (isMobile) setSidebarOpen(false); }} />
              <NavButton icon="💾" label="Backup" isActive={activeTab === 'backup'} onClick={() => { setActiveTab('backup'); if (isMobile) setSidebarOpen(false); }} />
            </nav>

            {/* Widget de Tasa de Cambio */}
            <ExchangeRateWidget />
            </div>
          )}

          {/* Contenido Principal */}
          <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900">
            <div className="p-4 md:p-8 mt-0">
              {/* Selector de Mes/Año */}
              {!['backup', 'search'].includes(activeTab) && (
                <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <button onClick={handlePrevMonth} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded transition">← Anterior</button>
                    <select value={selectedDate.month} onChange={handleMonthChange} className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded">
                      {months.map((month, idx) => (<option key={idx} value={idx}>{month}</option>))}
                    </select>
                    <select value={selectedDate.year} onChange={handleYearChange} className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded">
                      {years.map(year => (<option key={year} value={year}>{year}</option>))}
                    </select>
                    <button onClick={handleNextMonth} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded transition">Siguiente →</button>
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-300 ml-auto">{months[selectedDate.month]} {selectedDate.year}</span>
                  </div>
                </div>
              )}

              {/* Contenido por Pestaña */}
              {activeTab === 'dashboard' && (
                <Dashboard 
                  transactions={data.transactions} 
                  selectedMonth={selectedDate.month} 
                  selectedYear={selectedDate.year} 
                  calculateBalance={calculateBalance}
                  deleteTransaction={deleteTransaction}
                />
              )}

              {activeTab === 'transactions' && (
                <div className="space-y-6">
                  <TransactionForm
                    onAddTransaction={handleAddTransaction}
                    onAddRecurring={addRecurringTransaction}
                    incomeCategories={data.incomeCategories}
                    expenseCategories={data.expenseCategories}
                    addIncomeCategory={addIncomeCategory}
                    addExpenseCategory={addExpenseCategory}
                  />
                </div>
              )}

              {activeTab === 'daily' && (
                <DailyExpenses
                  onAddTransaction={handleAddTransaction}
                  expenseCategories={data.expenseCategories}
                  addExpenseCategory={addExpenseCategory}
                />
              )}

              {activeTab === 'projection' && (
                <Projection 
                  calculateProjection={calculateProjection} 
                  data={data}
                  deleteTransaction={deleteTransaction}
                />
              )}

              {activeTab === 'goals' && (
                <SavingsGoals
                  goals={savingsGoals.goals}
                  addGoal={savingsGoals.addGoal}
                  updateGoal={savingsGoals.updateGoal}
                  deleteGoal={savingsGoals.deleteGoal}
                  getGoalProgress={savingsGoals.getGoalProgress}
                  calculatePeriodicSavings={savingsGoals.calculatePeriodicSavings}
                  monthlyIncome={monthlyIncome}
                />
              )}

              {activeTab === 'budgets' && (
                <Budgets
                  budgets={budgets.budgets}
                  setBudget={budgets.setBudget}
                  getAllBudgetsForMonth={budgets.getAllBudgetsForMonth}
                  deleteBudget={budgets.deleteBudget}
                  transactions={monthlyTransactions}
                  month={selectedDate.month}
                  year={selectedDate.year}
                  categories={allCategories}
                  monthlyIncome={monthlyIncome}
                  getAutoBudgetAmount={budgets.getAutoBudgetAmount}
                  getSuggestedBudgets={budgets.getSuggestedBudgets}
                  applyAutoBudgets={budgets.applyAutoBudgets}
                />
              )}

              {activeTab === 'stats' && (
                <AdvancedStats stats={stats} transactions={monthlyTransactions} />
              )}

              {activeTab === 'calendar' && (
                <Calendar transactions={monthlyTransactions} year={selectedDate.year} month={selectedDate.month} getDailyExpenses={getDailyExpenses} />
              )}

              {activeTab === 'reports' && (
                <ReportPDF transactions={data.transactions} month={selectedDate.month} year={selectedDate.year} calculateBalance={calculateBalance} calculateProjection={calculateProjection} />
              )}

              {activeTab === 'alerts' && (
                <Alerts alerts={alerts.alerts} dismissAlert={alerts.dismissAlert} settings={alerts.getSettings()} updateSettings={alerts.updateSettings} />
              )}

              {activeTab === 'search' && (
                <div className="space-y-6">
                  <SearchFilter onSearch={handleSearch} categories={allCategories} clearSearch={handleClearSearch} />
                  {searchResults !== null && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Resultados: {searchResults.length} transacciones</h3>
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
                            {searchResults.map(t => (
                              <tr key={t.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-4 py-2 text-gray-900 dark:text-white">{t.date}</td>
                                <td className="px-4 py-2 text-gray-900 dark:text-white">{t.type}</td>
                                <td className="px-4 py-2 text-gray-900 dark:text-white">{t.category}</td>
                                <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{t.description}</td>
                                <td className="px-4 py-2 font-semibold">{t.currency === 'USD' ? 'US$' : 'RD$'} {t.amount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'backup' && (
                <BackupRestore onExport={exportData} onImport={importData} onClear={clearAllData} />
              )}
            </div>
          </div>
        </div>
        {/* Widget Flotante para Móviles */}
        <FloatingNav activeTab={activeTab} onTabChange={setActiveTab} isMobile={isMobile} />
      </div>
    </div>
  );
}

// Componente de Botón de Navegación
const NavButton = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-2 rounded transition ${
      isActive 
        ? 'bg-blue-600 text-white' 
        : 'text-gray-300 hover:bg-gray-800'
    }`}
  >
    {icon} {label}
  </button>
);

export default App;
