/**
 * Renderiza el contenido correspondiente al tab activo.
 * Extrae el switch de tabs que antes vivía inline en App.jsx.
 */
import Dashboard from './Dashboard';
import TransactionForm from './TransactionForm';
import DailyExpenses from './DailyExpenses';
import Projection from './Projection';
import SavingsGoals from './SavingsGoals';
import Budgets from './Budgets';
import EmergencyFundPanel from './EmergencyFundPanel';
import AdvancedStats from './AdvancedStats';
import Calendar from './Calendar';
import ReportPDF from './ReportPDF';
import Alerts from './Alerts';
import SearchFilter from './SearchFilter';
import SearchResults from './SearchResults';
import BackupRestore from './BackupRestore';

const TabContent = ({
  activeTab,
  // datos
  data,
  monthlyTransactions,
  selectedMonth,
  selectedYear,
  monthlyIncome,
  allCategories,
  stats,
  // handlers de transacciones
  handleAddTransaction,
  deleteTransaction,
  calculateBalance,
  calculateProjection,
  getDailyExpenses,
  // savings goals
  savingsGoals,
  // budgets
  budgets,
  // emergency fund
  fund,
  progress,
  shouldAlert,
  setMultiplier,
  setManualMeta,
  deposit,
  withdraw,
  getRateFromStorage,
  // alerts
  alerts,
  // search
  searchResults,
  handleSearch,
  handleClearSearch,
  // backup
  exportData,
  importData,
  clearAllData,
}) => {
  switch (activeTab) {
    case 'dashboard':
      return (
        <Dashboard
          transactions={data.transactions}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          calculateBalance={calculateBalance}
          deleteTransaction={deleteTransaction}
        />
      );

    case 'transactions':
      return (
        <div className="space-y-6">
          <TransactionForm
            onAddTransaction={handleAddTransaction}
            onAddRecurring={data.addRecurringTransaction}
            incomeCategories={data.incomeCategories}
            expenseCategories={data.expenseCategories}
            addIncomeCategory={data.addIncomeCategory}
            addExpenseCategory={data.addExpenseCategory}
          />
        </div>
      );

    case 'daily':
      return (
        <DailyExpenses
          onAddTransaction={handleAddTransaction}
          expenseCategories={data.expenseCategories}
          addExpenseCategory={data.addExpenseCategory}
        />
      );

    case 'projection':
      return (
        <Projection
          calculateProjection={calculateProjection}
          data={data}
          deleteTransaction={deleteTransaction}
        />
      );

    case 'goals':
      return (
        <SavingsGoals
          goals={savingsGoals.goals}
          addGoal={savingsGoals.addGoal}
          updateGoal={savingsGoals.updateGoal}
          deleteGoal={savingsGoals.deleteGoal}
          getGoalProgress={savingsGoals.getGoalProgress}
          calculatePeriodicSavings={savingsGoals.calculatePeriodicSavings}
          monthlyIncome={monthlyIncome}
        />
      );

    case 'budgets':
      return (
        <Budgets
          budgets={budgets.budgets}
          setBudget={budgets.setBudget}
          getAllBudgetsForMonth={budgets.getAllBudgetsForMonth}
          deleteBudget={budgets.deleteBudget}
          transactions={monthlyTransactions}
          month={selectedMonth}
          year={selectedYear}
          categories={allCategories}
          monthlyIncome={monthlyIncome}
          getAutoBudgetAmount={budgets.getAutoBudgetAmount}
          getSuggestedBudgets={budgets.getSuggestedBudgets}
          applyAutoBudgets={budgets.applyAutoBudgets}
        />
      );

    case 'emergency':
      return (
        <EmergencyFundPanel
          fund={fund}
          progress={progress}
          shouldAlert={shouldAlert}
          setMultiplier={setMultiplier}
          setManualMeta={setManualMeta}
          deposit={deposit}
          withdraw={withdraw}
          getRateFromStorage={getRateFromStorage}
        />
      );

    case 'stats':
      return <AdvancedStats stats={stats} transactions={monthlyTransactions} />;

    case 'calendar':
      return (
        <Calendar
          transactions={monthlyTransactions}
          year={selectedYear}
          month={selectedMonth}
          getDailyExpenses={getDailyExpenses}
        />
      );

    case 'reports':
      return (
        <ReportPDF
          transactions={data.transactions}
          month={selectedMonth}
          year={selectedYear}
          calculateBalance={calculateBalance}
          calculateProjection={calculateProjection}
        />
      );

    case 'alerts':
      return (
        <Alerts
          alerts={alerts.alerts}
          dismissAlert={alerts.dismissAlert}
          settings={alerts.getSettings()}
          updateSettings={alerts.updateSettings}
        />
      );

    case 'search':
      return (
        <div className="space-y-6">
          <SearchFilter
            onSearch={handleSearch}
            categories={allCategories}
            clearSearch={handleClearSearch}
          />
          <SearchResults results={searchResults} />
        </div>
      );

    case 'backup':
      return (
        <BackupRestore
          onExport={exportData}
          onImport={importData}
          onClear={clearAllData}
        />
      );

    default:
      return null;
  }
};

export default TabContent;
