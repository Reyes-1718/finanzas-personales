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
    // Llevar al inicio para que el cambio de tab sea visible en móvil
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Calcular posiciones en círculo
  const getCirclePosition = (index, total) => {
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
    const radius = 135; // mayor radio para dejar espacio a etiquetas largas
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y }; // distancia desde el centro
  };

  return (
    <div className="fixed bottom-0 right-0 p-6 z-40 pointer-events-none">
      {/* Overlay + menú centrado */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 pointer-events-auto"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none">
            <div className="relative w-80 h-80 pointer-events-auto">
              {navItems.map((item, index) => {
                const { x, y } = getCirclePosition(index, navItems.length);
                const isActive = activeTab === item.key;

                return (
                  <button
                    key={item.key}
                    data-testid={`fab-item-${item.key}`}
                    onClick={() => handleNavClick(item.key)}
                    className={`absolute w-16 h-16 rounded-full flex flex-col items-center justify-center text-[11px] leading-tight font-semibold transition-all duration-300 transform hover:scale-110 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400'
                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                    style={{
                      transform: isOpen
                        ? `translate(-50%, -50%) translate(${x}px, ${y}px) scale(1)`
                        : 'translate(-50%, -50%) scale(0)',
                      opacity: isOpen ? 1 : 0,
                      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      left: '50%',
                      top: '50%'
                    }}
                    title={item.label}
                  >
                    <span className="text-xl mb-0.5">{item.icon}</span>
                    <span className="text-[10px] text-center whitespace-normal leading-tight px-1">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Botón principal flotante */}
      <button
        data-testid="fab-button"
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
    </div>
  );
};

export default FloatingNav;
