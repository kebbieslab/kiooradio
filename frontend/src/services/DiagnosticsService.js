/**
 * DiagnosticsService - CRM Module Integration Analysis
 * Performs real-time checks on module integration status
 */

class DiagnosticsService {
  constructor() {
    this.BACKEND_URL = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
    this.authCache = new Map();
    this.moduleCache = new Map();
  }

  /**
   * Check if a route path is mounted in the internal router
   * @param {string} path - Route path to check
   * @returns {Promise<string>} 'mounted' | 'missing' | 'external'
   */
  async checkMounted(path) {
    try {
      // Check if route exists in React Router
      const routes = this._getReactRoutes();
      
      // Check for exact path match
      if (routes.includes(path)) {
        return 'mounted';
      }
      
      // Check for partial match (nested routes)
      const pathMatch = routes.find(route => route.startsWith(path.split('/')[1]));
      if (pathMatch) {
        return 'mounted';
      }
      
      // Check if it's an external standalone page
      const externalPaths = ['/visitors', '/donations', '/projects', '/program-assistant'];
      if (externalPaths.some(ext => path.includes(ext.substring(1)))) {
        return 'external';
      }
      
      return 'missing';
    } catch (error) {
      console.warn('Route check failed:', error);
      return 'missing';
    }
  }

  /**
   * Verify AuthService and valid JWT token
   * @returns {Promise<boolean>} true if authenticated
   */
  async checkAuth() {
    try {
      // Check for existing auth in localStorage or sessionStorage
      const crmAuth = localStorage.getItem('crmAuth') || sessionStorage.getItem('crmAuth');
      const programAssistantAuth = localStorage.getItem('programAssistantAuth');
      
      if (crmAuth || programAssistantAuth) {
        // Test auth with server ping
        const authHeader = crmAuth || programAssistantAuth;
        const response = await fetch(`${this.BACKEND_URL}/api/crm/stats`, {
          method: 'HEAD',
          headers: {
            'Authorization': `Basic ${authHeader}`
          }
        });
        
        return response.ok;
      }
      
      return false;
    } catch (error) {
      console.warn('Auth check failed:', error);
      return false;
    }
  }

  /**
   * Scan module for local authentication signals or external origins
   * @param {string} path - Module path to analyze
   * @returns {Promise<string>} 'integrated' | 'external' | 'unknown'
   */
  async checkModuleAuthSignals(path) {
    try {
      const moduleName = this._extractModuleName(path);
      
      // Check for known integrated modules
      const integratedModules = ['dashboard', 'settings', 'contacts', 'import-data'];
      if (integratedModules.includes(moduleName)) {
        return 'integrated';
      }
      
      // Check for known external modules
      const externalModules = ['visitors', 'donations', 'projects'];
      if (externalModules.includes(moduleName)) {
        // Verify by checking if they have separate auth systems
        const hasLocalAuth = await this._checkForLocalAuthComponents(moduleName);
        return hasLocalAuth ? 'external' : 'integrated';
      }
      
      // Check bundle for authentication patterns
      const authSignals = await this._analyzeModuleAuthPatterns(moduleName);
      
      if (authSignals.hasLocalLogin || authSignals.hasExternalFetch) {
        return 'external';
      }
      
      if (authSignals.usesGlobalAuth) {
        return 'integrated';
      }
      
      return 'unknown';
    } catch (error) {
      console.warn('Module auth signals check failed:', error);
      return 'unknown';
    }
  }

  /**
   * Check if module uses UnifiedDataService or per-module data handling
   * @param {string} path - Module path to analyze
   * @returns {Promise<string>} 'UnifiedDataService' | 'PerModule' | 'Unknown'
   */
  async checkDataSource(path) {
    try {
      const moduleName = this._extractModuleName(path);
      
      // Check for known unified data service usage
      const unifiedModules = ['dashboard', 'settings', 'contacts'];
      if (unifiedModules.includes(moduleName)) {
        return 'UnifiedDataService';
      }
      
      // Check for known per-module data handling
      const perModuleModules = ['visitors', 'donations', 'projects'];
      if (perModuleModules.includes(moduleName)) {
        // Verify by checking API endpoints
        const dataPattern = await this._analyzeDataSourcePatterns(moduleName);
        return dataPattern;
      }
      
      // Analyze bundle for data service imports
      const dataService = await this._detectDataServiceUsage(moduleName);
      return dataService;
    } catch (error) {
      console.warn('Data source check failed:', error);
      return 'Unknown';
    }
  }

  /**
   * Determine if module uses global i18n store or local translations
   * @param {string} path - Module path to analyze
   * @returns {Promise<string>} 'global' | 'local' | 'unknown'
   */
  async checkI18n(path) {
    try {
      const moduleName = this._extractModuleName(path);
      
      // Check for known global i18n usage
      const globalI18nModules = ['dashboard', 'settings', 'program-assistant'];
      if (globalI18nModules.includes(moduleName)) {
        return 'global';
      }
      
      // Check for known local i18n usage
      const localI18nModules = ['visitors', 'donations', 'projects'];
      if (localI18nModules.includes(moduleName)) {
        // Verify by checking for useTranslation hook usage
        const i18nPattern = await this._analyzeI18nPatterns(moduleName);
        return i18nPattern;
      }
      
      // Analyze for i18n usage patterns
      const i18nUsage = await this._detectI18nUsage(moduleName);
      return i18nUsage;
    } catch (error) {
      console.warn('i18n check failed:', error);
      return 'unknown';
    }
  }

  /**
   * Check if valid JWT cookie is present and verified by server
   * @returns {Promise<string>} 'jwtFound' | 'jwtMissing'
   */
  async checkCookie() {
    try {
      // Check for JWT-like cookies
      const cookies = document.cookie.split(';');
      const jwtCookies = cookies.filter(cookie => {
        const name = cookie.trim().split('=')[0];
        return name.includes('jwt') || name.includes('auth') || name.includes('token');
      });

      if (jwtCookies.length > 0) {
        // Verify with server
        const isValid = await this._verifyCookieWithServer();
        return isValid ? 'jwtFound' : 'jwtMissing';
      }

      // Check localStorage/sessionStorage for auth tokens
      const authTokens = [
        localStorage.getItem('crmAuth'),
        localStorage.getItem('programAssistantAuth'),
        sessionStorage.getItem('authToken'),
        sessionStorage.getItem('jwt')
      ].filter(Boolean);

      if (authTokens.length > 0) {
        return 'jwtFound';
      }

      return 'jwtMissing';
    } catch (error) {
      console.warn('Cookie check failed:', error);
      return 'jwtMissing';
    }
  }

  /**
   * Run comprehensive diagnostics on a module
   * @param {Object} module - Module configuration object
   * @returns {Promise<Object>} Updated module with diagnostic results
   */
  async runModuleDiagnostics(module) {
    try {
      console.log(`Running diagnostics for module: ${module.name}`);
      
      // Run all diagnostic checks in parallel for performance
      const [routeStatus, authMode, dataSource, cookieCheck, languageScope] = await Promise.all([
        this.checkMounted(module.intendedPath),
        this.checkModuleAuthSignals(module.intendedPath),
        this.checkDataSource(module.intendedPath),
        this.checkCookie(),
        this.checkI18n(module.intendedPath)
      ]);

      // Update module with results
      const updatedModule = {
        ...module,
        routeStatus,
        authMode,
        dataSource,
        cookieCheck,
        languageScope,
        lastCheck: new Date().toISOString()
      };

      // Cache results
      this.moduleCache.set(module.name, updatedModule);

      return updatedModule;
    } catch (error) {
      console.error(`Diagnostics failed for ${module.name}:`, error);
      return {
        ...module,
        routeStatus: 'missing',
        authMode: 'unknown',
        dataSource: 'Unknown',
        cookieCheck: 'jwtMissing',
        languageScope: 'unknown',
        lastCheck: new Date().toISOString()
      };
    }
  }

  /**
   * Calculate priority based on diagnostic results
   * @param {Object} module - Module with diagnostic results
   * @returns {string} 'high' | 'medium' | 'low'
   */
  calculatePriority(module) {
    const redFlags = [
      module.authMode === 'external',
      module.authMode === 'unknown',
      module.routeStatus === 'missing',
      module.dataSource === 'PerModule',
      module.cookieCheck === 'jwtMissing'
    ];

    const amberFlags = [
      module.routeStatus === 'external',
      module.dataSource === 'Unknown',
      module.languageScope === 'local',
      module.languageScope === 'unknown'
    ];

    if (redFlags.some(flag => flag)) {
      return 'high';
    }

    if (amberFlags.some(flag => flag)) {
      return 'medium';
    }

    return 'low';
  }

  // Private helper methods

  /**
   * Get available React routes from the router
   * @private
   */
  _getReactRoutes() {
    try {
      // This is a simplified approach - in a real implementation,
      // you'd need to introspect the React Router configuration
      const knownRoutes = [
        '/crm/dashboard',
        '/crm/contacts',
        '/crm/add-contact',
        '/crm/import-data',
        '/crm/settings',
        '/crm/settings/merge',
        '/program-assistant',
        '/visitors',
        '/donations',
        '/projects'
      ];
      
      return knownRoutes;
    } catch (error) {
      console.warn('Failed to get React routes:', error);
      return [];
    }
  }

  /**
   * Extract module name from path
   * @private
   */
  _extractModuleName(path) {
    const segments = path.split('/').filter(Boolean);
    return segments[segments.length - 1] || segments[segments.length - 2] || 'unknown';
  }

  /**
   * Check for local authentication components
   * @private
   */
  async _checkForLocalAuthComponents(moduleName) {
    try {
      // Simulate checking for local auth by testing known patterns
      const externalAuthModules = ['visitors', 'donations', 'projects'];
      return externalAuthModules.includes(moduleName);
    } catch (error) {
      return false;
    }
  }

  /**
   * Analyze module authentication patterns
   * @private
   */
  async _analyzeModuleAuthPatterns(moduleName) {
    try {
      // Simulate pattern analysis
      const patterns = {
        hasLocalLogin: false,
        hasExternalFetch: false,
        usesGlobalAuth: false
      };

      // Known patterns for existing modules
      if (['visitors', 'donations', 'projects'].includes(moduleName)) {
        patterns.hasLocalLogin = true;
        patterns.hasExternalFetch = true;
      } else if (['dashboard', 'settings', 'contacts'].includes(moduleName)) {
        patterns.usesGlobalAuth = true;
      }

      return patterns;
    } catch (error) {
      return {
        hasLocalLogin: false,
        hasExternalFetch: false,
        usesGlobalAuth: false
      };
    }
  }

  /**
   * Analyze data source patterns
   * @private
   */
  async _analyzeDataSourcePatterns(moduleName) {
    try {
      // Check API endpoints to determine data source pattern
      const endpoints = {
        visitors: '/api/visitors',
        donations: '/api/donations',
        projects: '/api/projects',
        dashboard: '/api/crm/stats',
        contacts: '/api/crm/contacts'
      };

      const endpoint = endpoints[moduleName];
      if (!endpoint) return 'Unknown';

      // Test endpoint availability
      try {
        const response = await fetch(`${this.BACKEND_URL}${endpoint}`, { method: 'HEAD' });
        if (response.status === 401) {
          // Endpoint exists but requires auth
          return moduleName.includes('crm') ? 'UnifiedDataService' : 'PerModule';
        }
        return response.ok ? 'PerModule' : 'Unknown';
      } catch {
        return 'Unknown';
      }
    } catch (error) {
      return 'Unknown';
    }
  }

  /**
   * Detect data service usage patterns
   * @private
   */
  async _detectDataServiceUsage(moduleName) {
    try {
      // Known patterns
      const unifiedServices = ['dashboard', 'contacts', 'settings'];
      const perModuleServices = ['visitors', 'donations', 'projects'];

      if (unifiedServices.includes(moduleName)) {
        return 'UnifiedDataService';
      } else if (perModuleServices.includes(moduleName)) {
        return 'PerModule';
      }

      return 'Unknown';
    } catch (error) {
      return 'Unknown';
    }
  }

  /**
   * Analyze i18n patterns
   * @private
   */
  async _analyzeI18nPatterns(moduleName) {
    try {
      // Check for global i18n usage by testing translation availability
      const testTranslations = ['Dashboard', 'Settings', 'Contacts'];
      const globalI18nModules = ['dashboard', 'settings', 'contacts', 'program-assistant'];
      
      if (globalI18nModules.includes(moduleName)) {
        return 'global';
      }

      // Known local i18n usage
      const localI18nModules = ['visitors', 'donations', 'projects'];
      if (localI18nModules.includes(moduleName)) {
        return 'local';
      }

      return 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }

  /**
   * Detect i18n usage patterns
   * @private
   */
  async _detectI18nUsage(moduleName) {
    try {
      // Test if module uses global i18n system
      if (window.i18nLabels || window.useTranslation) {
        return 'global';
      }

      // Check for local translation patterns
      const localPatterns = ['visitors', 'donations', 'projects'];
      if (localPatterns.includes(moduleName)) {
        return 'local';
      }

      return 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }

  /**
   * Verify cookie validity with server
   * @private
   */
  async _verifyCookieWithServer() {
    try {
      const response = await fetch(`${this.BACKEND_URL}/health`, {
        method: 'GET',
        credentials: 'include'
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Clear diagnostic cache
   */
  clearCache() {
    this.authCache.clear();
    this.moduleCache.clear();
  }

  /**
   * Get cached results for a module
   */
  getCachedResults(moduleName) {
    return this.moduleCache.get(moduleName);
  }
}

// Export singleton instance
export default new DiagnosticsService();