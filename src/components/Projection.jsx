import React from 'react';

const Projection = ({ calculateProjection, data }) => {
  const projection = calculateProjection();
  
  const formatCurrency = (amount) => {
    return `RD$ ${new Intl.NumberFormat('es-DO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)}`;
  };

  // Calcular desglose por categoría para gastos fijos (con moneda original)
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
        if (!categoryMap[t.category]) {
          categoryMap[t.category] = [];
        }
        categoryMap[t.category].push({
          amount: parseFloat(t.amount),
          currency: t.currency || 'DOP'
        });
      });
    
    return Object.entries(categoryMap).map(([category, items]) => {
      // Agrupar por moneda
      const byCurrency = {};
      items.forEach(item => {
        if (!byCurrency[item.currency]) {
          byCurrency[item.currency] = 0;
        }
        byCurrency[item.currency] += item.amount;
      });
      
      return {
        category,
        items: Object.entries(byCurrency).map(([curr, amt]) => ({
          currency: curr,
          amount: amt
        }))
      };
    });
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
              {fixedExpensesByCategory.map(({ category, items }) => (
                <div key={category}>
                  <div className="py-2 px-3 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                  </div>
                  <div className="pl-6 space-y-1">
                    {items.map((item, idx) => (
                      <div key={`${category}-${item.currency}-${idx}`} className="flex justify-between items-center py-1 px-3 text-xs">
                        <span className="text-gray-600">
                          {item.currency === 'USD' ? 'US$' : 'RD$'} {item.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
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
