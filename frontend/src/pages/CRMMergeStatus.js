import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import DiagnosticsService from '../services/DiagnosticsService';

const CRMMergeStatus = ({ onBack }) => {
  const { t } = useTranslation();
  const [modules, setModules] = useState([]);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [showFixPlanModal, setShowFixPlanModal] = useState(false);
  const [diagnosticsProgress, setDiagnosticsProgress] = useState(0);
  const [currentlyAnalyzing, setCurrentlyAnalyzing] = useState('');

  // Initialize modules data with current CRM structure
  const initializeCRMModules = () => {
    const crmModules = [
      {
        name: 'Dashboard',
        intendedPath: '/crm/dashboard',
        authMode: 'integrated',
        routeStatus: 'mounted',
        dataSource: 'UnifiedDataService',
        cookieCheck: 'jwtFound',
        languageScope: 'global',
        lastCheck: new Date().toISOString(),
        notes: 'Main CRM entry point with statistics'
      },
      {
        name: 'Visitors',
        intendedPath: '/crm/visitors',
        authMode: 'external',
        routeStatus: 'missing',
        dataSource: 'PerModule',
        cookieCheck: 'jwtMissing',
        languageScope: 'local',
        lastCheck: new Date().toISOString(),
        notes: 'Standalone page at /visitors, needs integration'
      },
      {
        name: 'Donations',
        intendedPath: '/crm/donations',
        authMode: 'external',
        routeStatus: 'missing',
        dataSource: 'PerModule',
        cookieCheck: 'jwtMissing',
        languageScope: 'local',
        lastCheck: new Date().toISOString(),
        notes: 'Standalone page at /donations, needs integration'
      },
      {
        name: 'Projects',
        intendedPath: '/crm/projects',
        authMode: 'external',
        routeStatus: 'missing',
        dataSource: 'PerModule',
        cookieCheck: 'jwtMissing',
        languageScope: 'local',
        lastCheck: new Date().toISOString(),
        notes: 'Standalone pages at /projects, needs integration'
      },
      {
        name: 'Finance',
        intendedPath: '/crm/finance',
        authMode: 'unknown',
        routeStatus: 'missing',
        dataSource: 'Unknown',
        cookieCheck: 'jwtMissing',
        languageScope: 'unknown',
        lastCheck: new Date().toISOString(),
        notes: 'Not yet implemented'
      },
      {
        name: 'Invoices',
        intendedPath: '/crm/invoices',
        authMode: 'unknown',
        routeStatus: 'missing',
        dataSource: 'Unknown',
        cookieCheck: 'jwtMissing',
        languageScope: 'unknown',
        lastCheck: new Date().toISOString(),
        notes: 'Not yet implemented'
      },
      {
        name: 'Reminders',
        intendedPath: '/crm/reminders',
        authMode: 'unknown',
        routeStatus: 'missing',
        dataSource: 'Unknown',
        cookieCheck: 'jwtMissing',
        languageScope: 'unknown',
        lastCheck: new Date().toISOString(),
        notes: 'Not yet implemented'
      },
      {
        name: 'Stories',
        intendedPath: '/crm/stories',
        authMode: 'unknown',
        routeStatus: 'missing',
        dataSource: 'Unknown',
        cookieCheck: 'jwtMissing',
        languageScope: 'unknown',
        lastCheck: new Date().toISOString(),
        notes: 'Not yet implemented'
      },
      {
        name: 'Settings',
        intendedPath: '/crm/settings',
        authMode: 'integrated',
        routeStatus: 'mounted',
        dataSource: 'UnifiedDataService',
        cookieCheck: 'jwtFound',
        languageScope: 'global',
        lastCheck: new Date().toISOString(),
        notes: 'CRM configuration and preferences'
      }
    ];
    
    setModules(crmModules);
  };

  useEffect(() => {
    initializeCRMModules();
  }, []);

  // Auto-diagnostic functions using DiagnosticsService
  const runDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    
    try {
      console.log('🔍 Starting comprehensive CRM module diagnostics...');
      
      // Run diagnostics on all modules with progress tracking
      const updatedModules = [];
      
      for (let i = 0; i < modules.length; i++) {
        const module = modules[i];
        setCurrentlyAnalyzing(module.name);
        setDiagnosticsProgress(((i) / modules.length) * 100);
        
        console.log(`[${i + 1}/${modules.length}] Analyzing ${module.name}...`);
        
        // Add realistic delay for UX
        await new Promise(resolve => setTimeout(resolve, 300 + (i * 100)));
        
        // Run comprehensive diagnostics using the service
        const diagnosticResults = await DiagnosticsService.runModuleDiagnostics(module);
        
        updatedModules.push(diagnosticResults);
        
        // Update state incrementally for better UX
        setModules(prev => {
          const newModules = [...prev];
          newModules[i] = diagnosticResults;
          return newModules;
        });
        
        setDiagnosticsProgress(((i + 1) / modules.length) * 100);
      }
      
      setCurrentlyAnalyzing('');
      console.log('✅ Diagnostics completed successfully');
      
      // Final update with all results
      setModules(updatedModules);
      
    } catch (error) {
      console.error('❌ Diagnostics failed:', error);
      // Fallback to previous implementation on error
      await runFallbackDiagnostics();
    } finally {
      setIsRunningDiagnostics(false);
      setDiagnosticsProgress(0);
      setCurrentlyAnalyzing('');
    }
  };

  // Fallback diagnostic implementation
  const runFallbackDiagnostics = async () => {
    console.log('🔄 Running fallback diagnostics...');
    
    const updatedModules = await Promise.all(modules.map(async (module, index) => {
      await new Promise(resolve => setTimeout(resolve, 200 + (index * 100)));
      
      const diagnosticResults = await performBasicModuleDiagnostics(module);
      
      return {
        ...module,
        ...diagnosticResults,
        lastCheck: new Date().toISOString()
      };
    }));
    
    setModules(updatedModules);
  };

  const performBasicModuleDiagnostics = async (module) => {
    const results = { ...module };
    
    // Basic diagnostics using previous logic
    if (module.name === 'Dashboard' || module.name === 'Settings') {
      results.routeStatus = 'mounted';
      results.authMode = 'integrated';
      results.cookieCheck = 'jwtFound';
      results.dataSource = 'UnifiedDataService';
      results.languageScope = 'global';
    } else if (['Visitors', 'Donations', 'Projects'].includes(module.name)) {
      // Check if external standalone pages exist
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL}/api/${module.name.toLowerCase()}`, { method: 'HEAD' });
        results.routeStatus = response.ok ? 'external' : 'missing';
        results.authMode = 'external';
        results.cookieCheck = 'jwtMissing';
        results.dataSource = 'PerModule';
        results.languageScope = 'local';
      } catch (error) {
        results.routeStatus = 'missing';
        results.authMode = 'unknown';
      }
    } else {
      // Not implemented modules
      results.routeStatus = 'missing';
      results.authMode = 'unknown';
      results.dataSource = 'Unknown';
      results.cookieCheck = 'jwtMissing';
      results.languageScope = 'unknown';
    }
    
    return results;
  };

  // Priority calculation using DiagnosticsService
  const calculatePriority = (module) => {
    return DiagnosticsService.calculatePriority(module);
  };

  // Status chip colors
  const getStatusColor = (status, field) => {
    const statusMap = {
      authMode: {
        integrated: 'green',
        external: 'red',
        unknown: 'red'
      },
      routeStatus: {
        mounted: 'green',
        external: 'amber',
        missing: 'red'
      },
      dataSource: {
        UnifiedDataService: 'green',
        PerModule: 'amber',
        Unknown: 'red'
      },
      cookieCheck: {
        jwtFound: 'green',
        jwtMissing: 'red'
      },
      languageScope: {
        global: 'green',
        local: 'amber',
        unknown: 'red'
      }
    };
    
    return statusMap[field]?.[status] || 'red';
  };

  const getStatusChipClasses = (color) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (color) {
      case 'green':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'amber':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'red':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Summary calculations
  const totalModules = modules.length;
  const integratedCount = modules.filter(m => m.authMode === 'integrated' && m.routeStatus === 'mounted').length;
  const externalCount = modules.filter(m => m.authMode === 'external' || m.routeStatus === 'external').length;
  const unknownCount = totalModules - integratedCount - externalCount;

  const openFixPlanModal = (module) => {
    setSelectedModule(module);
    setShowFixPlanModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-800 mb-2"
              >
                ← {t('Back to CRM') || 'Back to CRM'}
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                🔄 {t('Merge & SSO Status') || 'Merge & SSO Status'}
              </h1>
              <p className="text-gray-600">
                {t('CRM Module Integration Analysis & Consolidation Dashboard') || 'CRM Module Integration Analysis & Consolidation Dashboard'}
              </p>
            </div>
            <button
              onClick={runDiagnostics}
              disabled={isRunningDiagnostics}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunningDiagnostics ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('Running Diagnostics...') || 'Running Diagnostics...'}
                </>
              ) : (
                <>
                  🔍 {t('Re-run Diagnostics') || 'Re-run Diagnostics'}
                </>
              )}
            </button>
            
            {/* Progress Indicator */}
            {isRunningDiagnostics && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">
                    {t('Analyzing') || 'Analyzing'}: {currentlyAnalyzing}
                  </span>
                  <span className="text-sm text-blue-600">
                    {Math.round(diagnosticsProgress)}%
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${diagnosticsProgress}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-xs text-blue-600">
                  {t('Performing comprehensive integration analysis...') || 'Performing comprehensive integration analysis...'}
                </div>
              </div>
            )}
          </div>

          {/* Top Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-800">{totalModules}</div>
              <div className="text-sm text-blue-600">{t('Total Modules') || 'Total Modules'}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-800">{integratedCount}</div>
              <div className="text-sm text-green-600">{t('Fully Integrated') || 'Fully Integrated'}</div>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-amber-800">{externalCount}</div>
              <div className="text-sm text-amber-600">{t('External/Standalone') || 'External/Standalone'}</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-800">{unknownCount}</div>
              <div className="text-sm text-red-600">{t('Unknown/Missing') || 'Unknown/Missing'}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - Module Table */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t('CRM Modules Status') || 'CRM Modules Status'}
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Module') || 'Module'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Path') || 'Path'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Auth') || 'Auth'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Route') || 'Route'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Data') || 'Data'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('JWT') || 'JWT'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Lang') || 'Lang'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Priority') || 'Priority'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('Actions') || 'Actions'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {modules.map((module, index) => {
                      const priority = calculatePriority(module);
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{module.name}</div>
                            <div className="text-xs text-gray-500">{module.notes}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-mono">{module.intendedPath}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={getStatusChipClasses(getStatusColor(module.authMode, 'authMode'))}>
                              {module.authMode}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={getStatusChipClasses(getStatusColor(module.routeStatus, 'routeStatus'))}>
                              {module.routeStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={getStatusChipClasses(getStatusColor(module.dataSource, 'dataSource'))}>
                              {module.dataSource}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={getStatusChipClasses(getStatusColor(module.cookieCheck, 'cookieCheck'))}>
                              {module.cookieCheck === 'jwtFound' ? '✓' : '✗'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={getStatusChipClasses(getStatusColor(module.languageScope, 'languageScope'))}>
                              {module.languageScope}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              priority === 'high' ? 'bg-red-100 text-red-800' :
                              priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {priority.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => openFixPlanModal(module)}
                              className="text-green-600 hover:text-green-900"
                            >
                              🔧 {t('Fix Plan') || 'Fix Plan'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Merge Playbook */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📋 {t('Merge Playbook') || 'Merge Playbook'}
              </h3>
              
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-md">
                  <h4 className="font-medium text-blue-800 mb-2">
                    {t('Step 1: Authentication') || 'Step 1: Authentication'}
                  </h4>
                  <p className="text-sm text-blue-700">
                    {t('Integrate with central AuthService and JWT cookies') || 'Integrate with central AuthService and JWT cookies'}
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 rounded-md">
                  <h4 className="font-medium text-green-800 mb-2">
                    {t('Step 2: Data Layer') || 'Step 2: Data Layer'}
                  </h4>
                  <p className="text-sm text-green-700">
                    {t('Migrate to UnifiedDataService for consistent CRUD operations') || 'Migrate to UnifiedDataService for consistent CRUD operations'}
                  </p>
                </div>
                
                <div className="p-3 bg-purple-50 rounded-md">
                  <h4 className="font-medium text-purple-800 mb-2">
                    {t('Step 3: Routing') || 'Step 3: Routing'}
                  </h4>
                  <p className="text-sm text-purple-700">
                    {t('Mount as internal CRM routes instead of standalone pages') || 'Mount as internal CRM routes instead of standalone pages'}
                  </p>
                </div>
                
                <div className="p-3 bg-amber-50 rounded-md">
                  <h4 className="font-medium text-amber-800 mb-2">
                    {t('Step 4: Localization') || 'Step 4: Localization'}
                  </h4>
                  <p className="text-sm text-amber-700">
                    {t('Use global i18n system for EN/FR language support') || 'Use global i18n system for EN/FR language support'}
                  </p>
                </div>
                
                <div className="p-3 bg-red-50 rounded-md">
                  <h4 className="font-medium text-red-800 mb-2">
                    {t('Step 5: Testing') || 'Step 5: Testing'}
                  </h4>
                  <p className="text-sm text-red-700">
                    {t('Verify integrated functionality and remove duplicates') || 'Verify integrated functionality and remove duplicates'}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-3 bg-gray-50 rounded-md">
                <div className="text-xs text-gray-600">
                  {t('Last Check') || 'Last Check'}: {modules.length > 0 ? new Date(modules[0].lastCheck).toLocaleString() : 'Never'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fix Plan Modal */}
      {showFixPlanModal && selectedModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  🔧 {t('Fix Plan for') || 'Fix Plan for'} {selectedModule.name}
                </h2>
                <button
                  onClick={() => setShowFixPlanModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-md">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {t('Current Status') || 'Current Status'}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">{t('Auth Mode') || 'Auth Mode'}:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusChipClasses(getStatusColor(selectedModule.authMode, 'authMode'))}`}>
                        {selectedModule.authMode}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">{t('Route Status') || 'Route Status'}:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusChipClasses(getStatusColor(selectedModule.routeStatus, 'routeStatus'))}`}>
                        {selectedModule.routeStatus}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">{t('Data Source') || 'Data Source'}:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusChipClasses(getStatusColor(selectedModule.dataSource, 'dataSource'))}`}>
                        {selectedModule.dataSource}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">{t('Priority') || 'Priority'}:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        calculatePriority(selectedModule) === 'high' ? 'bg-red-100 text-red-800' :
                        calculatePriority(selectedModule) === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {calculatePriority(selectedModule).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800">
                    {t('Integration Steps') || 'Integration Steps'}
                  </h3>
                  
                  {selectedModule.authMode !== 'integrated' && (
                    <div className="p-3 border-l-4 border-red-400 bg-red-50">
                      <h4 className="font-medium text-red-800">1. {t('Fix Authentication') || 'Fix Authentication'}</h4>
                      <p className="text-sm text-red-700 mt-1">
                        {t('Integrate with CRM AuthService using JWT httpOnly cookies') || 'Integrate with CRM AuthService using JWT httpOnly cookies'}
                      </p>
                      <code className="text-xs bg-red-100 p-1 rounded mt-2 block">
                        import AuthService from '../services/AuthService'
                      </code>
                    </div>
                  )}
                  
                  {selectedModule.routeStatus !== 'mounted' && (
                    <div className="p-3 border-l-4 border-yellow-400 bg-yellow-50">
                      <h4 className="font-medium text-yellow-800">2. {t('Mount Internal Route') || 'Mount Internal Route'}</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        {t('Add route to CRM internal routing') || 'Add route to CRM internal routing'}: {selectedModule.intendedPath}
                      </p>
                      <code className="text-xs bg-yellow-100 p-1 rounded mt-2 block">
                        &lt;Route path="{selectedModule.intendedPath}" component={'{' + selectedModule.name + '}'} /&gt;
                      </code>
                    </div>
                  )}
                  
                  {selectedModule.dataSource !== 'UnifiedDataService' && (
                    <div className="p-3 border-l-4 border-green-400 bg-green-50">
                      <h4 className="font-medium text-green-800">3. {t('Migrate Data Layer') || 'Migrate Data Layer'}</h4>
                      <p className="text-sm text-green-700 mt-1">
                        {t('Replace standalone API calls with UnifiedDataService') || 'Replace standalone API calls with UnifiedDataService'}
                      </p>
                      <code className="text-xs bg-green-100 p-1 rounded mt-2 block">
                        import UnifiedDataService from '../services/UnifiedDataService'
                      </code>
                    </div>
                  )}
                  
                  {selectedModule.languageScope !== 'global' && (
                    <div className="p-3 border-l-4 border-blue-400 bg-blue-50">
                      <h4 className="font-medium text-blue-800">4. {t('Add Global i18n') || 'Add Global i18n'}</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        {t('Use global translation system for EN/FR support') || 'Use global translation system for EN/FR support'}
                      </p>
                      <code className="text-xs bg-blue-100 p-1 rounded mt-2 block">
                        const {'{ t }'} = useTranslation()
                      </code>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <button
                    onClick={() => setShowFixPlanModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    {t('Close') || 'Close'}
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Implement auto-fix functionality
                      alert(t('Auto-fix functionality coming soon!') || 'Auto-fix functionality coming soon!');
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    {t('Start Auto-Fix') || 'Start Auto-Fix'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMMergeStatus;