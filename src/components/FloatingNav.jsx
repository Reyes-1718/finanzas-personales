import React, { useState } from 'react';

const FloatingNav = ({ activeTab, onTabChange, isMobile }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isMobile) return null;

  const navItems = [
    { icon: '📊', label: 'Dashboard', key: 'dashboard' },
    { icon: '💳', label: 'Transacciones', key: 'transactions' },
    { icon: '⚡', label: 'Gastos Diarios', key: 'daily' },
    { icon: '📈', label: 'Proyección', key: 'projection' },
    { icon: '💚', label: 'Metas', key: 'goals' },
    { icon: '📊', label: 'Presupuestos', key: 'budgets' },
    { icon: '📈', label: 'Estadísticas', key: 'stats' },
    { icon: '📅', label: 'Calendario', key: 'calendar' },
    { icon: '📋', label: 'Reportes', key: 'reports' },
    { icon: '🔔', label: 'Alertas', key: 'alerts' },
    { icon: '🔍', label: 'Buscar', key: 'search' },
    { icon: '💾', label: 'Backup', key: 'backup' },
  ];

  const handleNavClick = (key) => {
    onTabChange(key);
    setIsOpen(false);
  };

  // Calcular posiciones en círculo
  const getCirclePosition = (index, total) => {
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
    const radius = 100;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  return (
    <div className="fixed bottom-0 right-0 p-6 z-40 pointer-events-none">
      {/* Opciones circulares */}
      {isOpen && (
        <div className="absolute bottom-24 right-6 w-96 h-96 pointer-events-auto">
          {navItems.map((item, index) => {
            const { x, y } = getCirclePosition(index, navItems.length);
            const isActive = activeTab === item.key;

            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`absolute w-14 h-14 rounded-full flex flex-col items-center justify-center text-xs font-semibold transition-all duration-300 transform hover:scale-110 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
                style={{
                  transform: isOpen
                    ? `translate(${x}px, ${y}px) scale(1)`
                    : 'translate(0, 0) scale(0)',
                  opacity: isOpen ? 1 : 0,
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                title={item.label}
              >
                <span className="text-xl mb-1">{item.icon}</span>
                <span className="text-xs">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Botón principal flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 pointer-events-auto z-50 ${
          isOpen ? 'ring-4 ring-blue-400' : ''
        }`}
      >
        <span
          className={`text-2xl transition-transform duration-300 ${
            isOpen ? 'rotate-45' : 'rotate-0'
          }`}
        >
          {isOpen ? '✕' : '☰'}
        </span>
      </button>

      {/* Overlay para cerrar */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsOpen(false)}
          style={{ pointerEvents: 'auto' }}
        />
      )}
    </div>
  );
};

export default FloatingNav;
