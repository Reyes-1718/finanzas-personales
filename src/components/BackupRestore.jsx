import React, { useRef, useState } from 'react';

const BackupRestore = ({ exportData, importData, clearAllData }) => {
  const fileInputRef = useRef(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [importMessage, setImportMessage] = useState(null);

  const handleExport = () => {
    exportData();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar que sea un archivo JSON
    if (!file.name.endsWith('.json')) {
      setImportMessage({ type: 'error', text: 'Por favor, selecciona un archivo JSON válido' });
      return;
    }

    try {
      const text = await file.text();
      const confirmed = window.confirm(
        '⚠️ ADVERTENCIA: Esto reemplazará TODOS tus datos actuales con los del archivo importado.\n\n' +
        '¿Estás seguro de que deseas continuar?'
      );

      if (confirmed) {
        const result = importData(text);
        
        if (result.success) {
          setImportMessage({ type: 'success', text: '✅ ' + result.message });
          // Limpiar el mensaje después de 5 segundos
          setTimeout(() => setImportMessage(null), 5000);
        } else {
          setImportMessage({ type: 'error', text: '❌ ' + result.message });
        }
      }
    } catch (error) {
      setImportMessage({ 
        type: 'error', 
        text: '❌ Error al leer el archivo: ' + error.message 
      });
    }

    // Limpiar el input
    e.target.value = '';
  };

  const handleClearData = () => {
    const confirmed = window.confirm(
      '⚠️ PELIGRO: Esto eliminará PERMANENTEMENTE todos tus datos.\n\n' +
      'Esta acción NO se puede deshacer.\n\n' +
      '¿Estás absolutamente seguro?'
    );

    if (confirmed) {
      const doubleConfirm = window.confirm(
        '🚨 ÚLTIMA CONFIRMACIÓN:\n\n' +
        'Todos tus datos serán eliminados de forma permanente.\n\n' +
        '¿Proceder con la eliminación?'
      );

      if (doubleConfirm) {
        clearAllData();
        setShowConfirmClear(false);
        setImportMessage({ 
          type: 'success', 
          text: '✅ Todos los datos han sido eliminados' 
        });
        setTimeout(() => setImportMessage(null), 5000);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold dark:text-white mb-4">Respaldo y Restauración</h2>
      
      {importMessage && (
        <div className={`mb-4 p-4 rounded-lg ${
          importMessage.type === 'success' 
            ? 'bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-100' 
            : 'bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100'
        }`}>
          {importMessage.text}
        </div>
      )}

      <div className="space-y-4">
        {/* Exportar datos */}
        <div className="border dark:border-gray-700 rounded-lg p-4 dark:bg-gray-700">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Exportar Datos</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Descarga una copia de seguridad de todos tus datos en formato JSON. 
            Guárdala en un lugar seguro para poder restaurar tu información en el futuro.
          </p>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar Datos
          </button>
        </div>

        {/* Importar datos */}
        <div className="border dark:border-gray-700 rounded-lg p-4 dark:bg-gray-700">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Importar Datos</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Restaura tus datos desde un archivo de respaldo previamente exportado. 
            <span className="font-semibold text-red-600 dark:text-red-400"> Esto reemplazará todos tus datos actuales.</span>
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={handleImportClick}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Importar Datos
          </button>
        </div>

        {/* Eliminar todos los datos */}
        <div className="border border-red-300 dark:border-red-700 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
          <h3 className="font-medium text-red-900 dark:text-red-200 mb-2">Zona de Peligro</h3>
          <p className="text-sm text-red-700 dark:text-red-300 mb-4">
            Elimina permanentemente todos los datos de la aplicación. 
            <span className="font-semibold"> Esta acción no se puede deshacer.</span>
          </p>
          <button
            onClick={handleClearData}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Eliminar Todos los Datos
          </button>
        </div>

        {/* Información */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">ℹ️ Información</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-disc list-inside">
            <li>Los datos se guardan automáticamente en tu navegador (LocalStorage)</li>
            <li>Exporta regularmente copias de seguridad para evitar pérdida de datos</li>
            <li>Los archivos exportados son compatibles solo con esta aplicación</li>
            <li>No compartas tus archivos de respaldo si contienen información sensible</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BackupRestore;
