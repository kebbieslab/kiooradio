import { useState, useEffect, createContext, useContext } from 'react';
import { 
  TranslationManager, 
  LanguagePreferences, 
  LocalizedRouter,
  initializeGeoLanguageSystem 
} from '../utils/geoLanguage';

// Create translation context
const TranslationContext = createContext({
  language: 'en',
  t: (key, params) => key,
  setLanguage: () => {},
  isLoading: true
});

// Translation Provider Component
export function TranslationProvider({ children }) {
  const [language, setLanguageState] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
  const [translations, setTranslations] = useState({});

  // Initialize the geo-language system
  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        // Initialize geo-language detection
        const detectedLang = await initializeGeoLanguageSystem();
        
        if (!mounted) return;

        setLanguageState(detectedLang);
        setTranslations(TranslationManager.translations[detectedLang] || {});
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize language system:', error);
        if (mounted) {
          setLanguageState('en');
          setIsLoading(false);
        }
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, []);

  // Handle language changes
  const setLanguage = async (newLanguage) => {
    if (newLanguage === language) return;

    try {
      // Load translation
      await TranslationManager.setLanguage(newLanguage);
      
      // Update state
      setLanguageState(newLanguage);
      setTranslations(TranslationManager.translations[newLanguage] || {});
      
      // Store preference
      LanguagePreferences.setPreference(newLanguage);
      
      // Update URL
      LocalizedRouter.redirectToLanguage(newLanguage, { soft: true });
      
      // Trigger page refresh for complete language switch
      window.location.reload();
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  // Translation function
  const t = (key, params = {}) => {
    return TranslationManager.t(key, params);
  };

  // Format numbers according to locale
  const formatNumber = (number, options = {}) => {
    const locale = language === 'fr' ? 'fr-FR' : 'en-US';
    return new Intl.NumberFormat(locale, options).format(number);
  };

  // Format dates according to locale  
  const formatDate = (date, options = {}) => {
    const locale = language === 'fr' ? 'fr-FR' : 'en-US';
    return new Intl.DateTimeFormat(locale, options).format(new Date(date));
  };

  const contextValue = {
    language,
    setLanguage,
    t,
    formatNumber,
    formatDate,
    isLoading,
    translations
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
}

// Hook to use translation context
export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
}

// Component for translated text
export function T({ k, params = {}, children, fallback }) {
  const { t } = useTranslation();
  
  if (children && typeof children === 'function') {
    return children(t(k, params));
  }
  
  const translated = t(k, params);
  
  // If translation is the same as key and fallback provided, use fallback
  if (translated === k && fallback) {
    return fallback;
  }
  
  return translated;
}

// Higher-order component for translated components
export function withTranslation(Component) {
  return function TranslatedComponent(props) {
    const translation = useTranslation();
    return <Component {...props} {...translation} />;
  };
}

// Hook for manual language detection (useful for SSR)
export function useLanguageDetection() {
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const [isDetecting, setIsDetecting] = useState(true);

  useEffect(() => {
    async function detect() {
      try {
        const lang = await initializeGeoLanguageSystem();
        setDetectedLanguage(lang);
      } catch (error) {
        console.error('Language detection failed:', error);
        setDetectedLanguage('en');
      } finally {
        setIsDetecting(false);
      }
    }

    detect();
  }, []);

  return {
    detectedLanguage,
    isDetecting
  };
}