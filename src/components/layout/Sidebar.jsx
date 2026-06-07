import ExchangeRateWidget from '../ExchangeRateWidget';
import { NAV_ITEMS, PURCHASE_ASSISTANT_NAV } from '../../constants/navigation';

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

const Sidebar = ({ activeTab, onTabChange, onOpenPurchaseModal, isDark, toggleTheme }) => (
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

    <nav className="space-y-2 mb-8">
      {NAV_ITEMS.map(({ icon, label, key }) => (
        <NavButton
          key={key}
          icon={icon}
          label={label}
          isActive={activeTab === key}
          onClick={() => onTabChange(key)}
        />
      ))}
      <NavButton
        icon={PURCHASE_ASSISTANT_NAV.icon}
        label={PURCHASE_ASSISTANT_NAV.label}
        isActive={false}
        onClick={onOpenPurchaseModal}
      />
    </nav>

    <ExchangeRateWidget />
  </div>
);

export default Sidebar;
