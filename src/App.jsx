import { useState } from 'react';
import { useFinancesData } from './hooks/useFinancesData';
import { useTheme } from './hooks/useTheme';
import { useSavingsGoals } from './hooks/useSavingsGoals';
import { useBudgets } from './hooks/useBudgets';
import { useAlerts } from './hooks/useAlerts';
import { useEmergencyFund } from './hooks/useEmergencyFund';
import { useIsMobile } from './hooks/useMediaQuery';
import Sidebar from './components/layout/Sidebar';
import MonthSelector from './components/layout/MonthSelector';
import TabContent from './components/TabContent';
import EmergencyFundWidget from './components/EmergencyFundWidget';
import FloatingNav from './components/FloatingNav';
import PurchaseAssistantModal from './components/PurchaseAssistantModal';

/** Tabs que no necesitan el selector de mes/año */
const TABS_WITHOUT_MONTH_SELECTOR = ['backup', 'search', 'emergency'];

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

  const { isDark, toggleTheme } = useTheme();
  const savingsGoals = useSavingsGoals();
  const budgets = useBudgets();
  const alerts = useAlerts();
  const isMobile = useIsMobile();

  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return { month: now.getMonth(), year: now.getFullYear() };
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchResults, setSearchResults] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const emergencyFund = useEmergencyFund(data.transactions);
  const { fund, deposit, withdraw, setMultiplier, setManualMeta, progress, shouldAlert, getRateFromStorage } = emergencyFund;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  const monthlyTransactions = getTransactionsByMonth(selectedDate.year, selectedDate.month);
  const stats = getAdvancedStats(monthlyTransactions);
  const monthlyIncome = stats?.totalIncome ?? 0;
  const allCategories = [...data.incomeCategories, ...data.expenseCategories];

  const handleAddTransaction = (transaction) => {
    addTransaction(transaction);
    setActiveTab('dashboard');
  };

  const handleSearch = (criteria) => {
    setSearchResults(searchTransactions(criteria));
    setActiveTab('search');
  };

  const handleClearSearch = () => setSearchResults(null);

  const handleMonthChange = (month, year) => setSelectedDate({ month, year });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab !== 'search') setSearchResults(null);
  };

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar — solo desktop */}
          {!isMobile && (
            <Sidebar
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onOpenPurchaseModal={() => setShowPurchaseModal(true)}
              isDark={isDark}
              toggleTheme={toggleTheme}
            />
          )}

          {/* Contenido principal */}
          <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900">
            <div className="p-4 md:p-8">
              {/* Alerta de fondo de emergencia */}
              {shouldAlert && (
                <div className="mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-lg p-4">
                  ❗ Tu fondo de emergencia está por debajo del {fund.configuracion.umbral_alerta}% de la meta. Refuerza tu seguridad financiera.
                </div>
              )}

              {/* Widget de fondo de emergencia en dashboard */}
              {activeTab === 'dashboard' && (
                <EmergencyFundWidget
                  meta={fund.meta}
                  saldoActual={fund.saldoActual}
                  progress={progress}
                  shouldAlert={shouldAlert}
                  onOpenFund={() => setActiveTab('emergency')}
                />
              )}

              {/* Selector de mes/año */}
              {!TABS_WITHOUT_MONTH_SELECTOR.includes(activeTab) && (
                <MonthSelector
                  month={selectedDate.month}
                  year={selectedDate.year}
                  onChange={handleMonthChange}
                />
              )}

              {/* Contenido del tab activo */}
              <TabContent
                activeTab={activeTab}
                data={{ ...data, addRecurringTransaction, addIncomeCategory, addExpenseCategory }}
                monthlyTransactions={monthlyTransactions}
                selectedMonth={selectedDate.month}
                selectedYear={selectedDate.year}
                monthlyIncome={monthlyIncome}
                allCategories={allCategories}
                stats={stats}
                handleAddTransaction={handleAddTransaction}
                deleteTransaction={deleteTransaction}
                calculateBalance={calculateBalance}
                calculateProjection={calculateProjection}
                getDailyExpenses={getDailyExpenses}
                savingsGoals={savingsGoals}
                budgets={budgets}
                fund={fund}
                progress={progress}
                shouldAlert={shouldAlert}
                setMultiplier={setMultiplier}
                setManualMeta={setManualMeta}
                deposit={deposit}
                withdraw={withdraw}
                getRateFromStorage={getRateFromStorage}
                alerts={alerts}
                searchResults={searchResults}
                handleSearch={handleSearch}
                handleClearSearch={handleClearSearch}
                exportData={exportData}
                importData={importData}
                clearAllData={clearAllData}
              />
            </div>
          </div>
        </div>

        {/* Modal Asistente de Compras */}
        <PurchaseAssistantModal
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          transactions={data.transactions}
          savingsGoals={savingsGoals.goals}
          monthlyIncome={monthlyIncome}
          currentBalance={calculateBalance(data.transactions)}
          darkMode={isDark}
        />

        {/* Botón flotante asistente (móvil) */}
        {isMobile && (
          <button
            onClick={() => setShowPurchaseModal(true)}
            className="fixed bottom-24 right-6 z-39 w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg flex items-center justify-center transition transform hover:scale-110 active:scale-95"
            title="Asistente de Compras"
          >
            🛍️
          </button>
        )}

        {/* Navegación flotante móvil */}
        <FloatingNav activeTab={activeTab} onTabChange={handleTabChange} isMobile={isMobile} />
      </div>
    </div>
  );
}

export default App;
