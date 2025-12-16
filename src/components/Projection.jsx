import React from 'react';

const Projection = ({ calculateProjection, data }) => {
  const projection = calculateProjection();
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Calcular desglose por categoría para gastos fijos
  const fixedExpensesByCategory = React.useMemo(() => {
    const now = new Date();
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    
    const categoryMap = {};
    
    data.transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'gasto-fijo' && date >= threeMonthsAgo;
      })
      .forEach(t => {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + parseFloat(t.amount);
      });
    
    return Object.entries(categoryMap).map(([category, amount]) => ({
      category,
      amount
    }));
  }, [data.transactions]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Proyección de Gastos - Próximo Mes</h2>
      
      <div className="space-y-4">
        <div className="border-b pb-4">
          <p className="text-sm text-gray-600 mb-4">
            Esta proyección se basa en tus gastos fijos más el promedio de gastos variables de los últimos 3 meses.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-600 mb-1">Gastos Fijos</h3>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(projection.fixedExpenses)}
              </p>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-600 mb-1">Promedio Variables</h3>
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(projection.avgVariableExpenses)}
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-600 mb-1">Proyección Total</h3>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(projection.totalProjection)}
              </p>
            </div>
          </div>
        </div>

        {/* Desglose de gastos fijos por categoría */}
        {fixedExpensesByCategory.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-3">Desglose de Gastos Fijos</h3>
            <div className="space-y-2">
              {fixedExpensesByCategory.map(({ category, amount }) => (
                <div key={category} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">{category}</span>
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Consejos */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Consejo</h4>
          <p className="text-sm text-blue-800">
            Considera esta proyección al planificar tu presupuesto. Asegúrate de tener suficientes ingresos 
            para cubrir estos gastos y mantener un margen de ahorro.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Projection;
