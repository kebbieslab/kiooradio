// Geo-Language Detection System for Kioo Radio
// Privacy-friendly, configurable, and swappable

// Configuration - Editable in Settings
export const LANGUAGE_CONFIG = {
  defaultLanguage: "en",
  cookieName: "lang_pref",
  cookieMaxAge: 31536000, // 1 year
  
  // French-speaking countries (ISO 2-letter codes)
  frenchCountriesISO2: [
    "GN", "CI", "SN", "ML", "NE", "TG", "BJ", "BF", "CD", "CG", 
    "GA", "CM", "CF", "TD", "DJ", "BI", "RW", "FR", "BE", "CH", 
    "CA", "MG", "MR", "KM", "LU", "MC", "GP", "MQ", "GF", "YT", 
    "NC", "VU", "TF"
  ],
  
  // Force certain countries to specific languages (overrides)
  countryOverrides: {
    "LR": "en", // Liberia -> English
    "SL": "en"  // Sierra Leone -> English
  }
};

// Language preferences storage
export class LanguagePreferences {
  static getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  static setCookie(name, value, maxAge = LANGUAGE_CONFIG.cookieMaxAge) {
    document.cookie = `${name}=${value}; SameSite=Lax; Max-Age=${maxAge}; Path=/`;
  }

  static getStoredPreference() {
    // Check cookie first, then localStorage as backup
    const cookiePref = this.getCookie(LANGUAGE_CONFIG.cookieName);
    if (cookiePref) return cookiePref;
    
    try {
      return localStorage.getItem(LANGUAGE_CONFIG.cookieName);
    } catch (e) {
      return null;
    }
  }

  static setPreference(language) {
    // Store in both cookie and localStorage
    this.setCookie(LANGUAGE_CONFIG.cookieName, language);
    try {
      localStorage.setItem(LANGUAGE_CONFIG.cookieName, language);
    } catch (e) {
      // Ignore localStorage errors (private browsing)
    }
  }

  static hasStoredPreference() {
    return !!this.getStoredPreference();
  }
}

// Geo-IP Detection (Swappable Adapters)
export class GeoIPAdapter {
  // Option A: Cloudflare cf-ipcountry (server/edge)
  static async getCountryFromCloudflare() {
    try {
      const response = await fetch('/api/geo-country');
      if (response.ok) {
        const data = await response.json();
        return data.country; // ISO 2-letter code
      }
    } catch (e) {
      console.log('Cloudflare geo detection unavailable');
    }
    return null;
  }

  // Option B: Free public IP API (client-side fallback)
  static async getCountryFromPublicAPI() {
    try {
      // Using ipapi.co (free tier: 1000 requests/day)
      const geoApiUrl = process.env.REACT_APP_GEO_API_URL || 'https://ipapi.co/country/';
      const response = await fetch(geoApiUrl, {
        headers: { 'Accept': 'text/plain' }
      });
      if (response.ok) {
        const country = await response.text();
        return country.trim().toUpperCase();
      }
    } catch (e) {
      console.log('Public IP API unavailable');
    }
    return null;
  }

  // Main detection method (tries adapters in order)
  static async detectCountry() {
    // Try server/edge detection first (preferred for privacy)
    let country = await this.getCountryFromCloudflare();
    
    // Fallback to client-side detection
    if (!country) {
      country = await this.getCountryFromPublicAPI();
    }
    
    return country;
  }
}

// Browser Language Detection
export class BrowserLanguageDetector {
  static getAcceptLanguages() {
    // Get browser languages in preference order
    if (navigator.languages) {
      return [...navigator.languages];
    }
    if (navigator.language) {
      return [navigator.language];
    }
    return [];
  }

  static prefersFrench() {
    const languages = this.getAcceptLanguages();
    
    // Check if any preferred language starts with 'fr'
    return languages.some(lang => 
      lang.toLowerCase().startsWith('fr')
    );
  }
}

// Main Language Detection Logic
export class LanguageDetector {
  static async detectLanguage(urlLangOverride = null) {
    // 1. URL override (highest priority)
    if (urlLangOverride && ['en', 'fr'].includes(urlLangOverride)) {
      console.log(`Language set via URL: ${urlLangOverride}`);
      return urlLangOverride;
    }

    // 2. Stored preference (user has chosen before)
    const stored = LanguagePreferences.getStoredPreference();
    if (stored && ['en', 'fr'].includes(stored)) {
      console.log(`Language from stored preference: ${stored}`);
      return stored;
    }

    // 3. First-time detection
    console.log('Detecting language for first-time visitor...');

    // 3a. Check Accept-Language header
    if (BrowserLanguageDetector.prefersFrench()) {
      console.log('Language detected from browser: French');
      return 'fr';
    }

    // 3b. Geo-IP detection
    try {
      const country = await GeoIPAdapter.detectCountry();
      if (country) {
        console.log(`Country detected: ${country}`);
        
        // Check country overrides first
        if (LANGUAGE_CONFIG.countryOverrides[country]) {
          const overrideLang = LANGUAGE_CONFIG.countryOverrides[country];
          console.log(`Country override applied: ${country} -> ${overrideLang}`);
          return overrideLang;
        }

        // Check if country is in French list
        if (LANGUAGE_CONFIG.frenchCountriesISO2.includes(country)) {
          console.log(`French-speaking country detected: ${country}`);
          return 'fr';
        }
      }
    } catch (e) {
      console.log('Geo detection failed, using default');
    }

    // 4. Fallback default
    console.log(`Using default language: ${LANGUAGE_CONFIG.defaultLanguage}`);
    return LANGUAGE_CONFIG.defaultLanguage;
  }

  static async initializeLanguage() {
    // Check URL for lang parameter
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    
    // Detect appropriate language
    const detectedLang = await this.detectLanguage(urlLang);
    
    // Store the preference
    LanguagePreferences.setPreference(detectedLang);
    
    return detectedLang;
  }

  static isFirstTimeVisitor() {
    return !LanguagePreferences.hasStoredPreference();
  }
}

// URL Management
export class LocalizedRouter {
  static getCurrentLanguage() {
    const path = window.location.pathname;
    if (path.startsWith('/fr')) return 'fr';
    return 'en';
  }

  static getLocalizedPath(path, language) {
    // Remove existing language prefix
    let cleanPath = path.replace(/^\/fr/, '').replace(/^\/en/, '');
    if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;

    // Add new language prefix (except for English default)
    if (language === 'fr') {
      return `/fr${cleanPath}`;
    }
    return cleanPath;
  }

  static redirectToLanguage(language, options = { soft: true }) {
    const currentPath = window.location.pathname + window.location.search;
    const newPath = this.getLocalizedPath(currentPath, language);
    
    if (options.soft) {
      // Soft redirect using history API (no page reload)
      window.history.replaceState({}, '', newPath);
    } else {
      // Hard redirect (full page reload)
      window.location.href = newPath;
    }
  }
}

// Translation Management
export class TranslationManager {
  static translations = {};
  static currentLanguage = 'en';

  static async loadTranslation(language) {
    if (this.translations[language]) return this.translations[language];

    try {
      const response = await fetch(`/i18n/${language}.json`);
      const translation = await response.json();
      this.translations[language] = translation;
      return translation;
    } catch (e) {
      console.error(`Failed to load translation for ${language}:`, e);
      return null;
    }
  }

  static async setLanguage(language) {
    const translation = await this.loadTranslation(language);
    if (translation) {
      this.currentLanguage = language;
      return translation;
    }
    return null;
  }

  static t(key, params = {}) {
    const translation = this.translations[this.currentLanguage];
    if (!translation) return key;

    const keys = key.split('.');
    let value = translation;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    // Replace parameters
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      return value.replace(/\{(\w+)\}/g, (match, param) => {
        return params[param] || match;
      });
    }

    return value || key;
  }
}

// First-Visit Language Banner
export class LanguageBanner {
  static BANNER_DISMISSED_KEY = 'lang_banner_dismissed';
  static BANNER_DISMISSED_DURATION = 31536000000; // 1 year in ms

  static shouldShowBanner() {
    try {
      const dismissed = localStorage.getItem(this.BANNER_DISMISSED_KEY);
      if (dismissed) {
        const dismissedTime = parseInt(dismissed, 10);
        const now = Date.now();
        return (now - dismissedTime) > this.BANNER_DISMISSED_DURATION;
      }
      return true; // Never dismissed before
    } catch (e) {
      return false; // Don't show if localStorage unavailable
    }
  }

  static dismissBanner() {
    try {
      localStorage.setItem(this.BANNER_DISMISSED_KEY, Date.now().toString());
    } catch (e) {
      // Ignore localStorage errors
    }
  }

  static createBanner(language, onKeep, onSwitch) {
    const banner = document.createElement('div');
    banner.className = 'language-banner';
    banner.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #10B981;
      color: white;
      padding: 12px;
      text-align: center;
      z-index: 9999;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;

    const text = language === 'fr' 
      ? "Nous avons réglé la langue sur le français selon votre région."
      : "We set your language to English based on your region.";
    
    const keepText = language === 'fr' ? "Garder le français" : "Keep English";
    const switchText = language === 'fr' ? "Passer à l'anglais" : "Switch to French";

    banner.innerHTML = `
      <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: center; gap: 20px;">
        <span>${text}</span>
        <div style="display: flex; gap: 10px;">
          <button id="lang-keep" style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 8px 16px; border-radius: 6px; cursor: pointer;">${keepText}</button>
          <button id="lang-switch" style="background: white; color: #10B981; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">${switchText}</button>
          <button id="lang-close" style="background: none; border: none; color: white; cursor: pointer; font-size: 18px;">×</button>
        </div>
      </div>
    `;

    // Event listeners
    banner.querySelector('#lang-keep').onclick = () => {
      onKeep();
      banner.remove();
      this.dismissBanner();
    };

    banner.querySelector('#lang-switch').onclick = () => {
      onSwitch();
      banner.remove();
      this.dismissBanner();
    };

    banner.querySelector('#lang-close').onclick = () => {
      banner.remove();
      this.dismissBanner();
    };

    document.body.insertBefore(banner, document.body.firstChild);
    return banner;
  }
}

// Main initialization function
export async function initializeGeoLanguageSystem() {
  console.log('Initializing Geo-Language System...');

  // Check if this is a first-time visitor
  const isFirstTime = LanguageDetector.isFirstTimeVisitor();
  console.log(`First-time visitor: ${isFirstTime}`);

  // Initialize language detection
  const detectedLanguage = await LanguageDetector.initializeLanguage();
  console.log(`Detected language: ${detectedLanguage}`);

  // Load and set translations
  await TranslationManager.setLanguage(detectedLanguage);

  // Handle URL routing
  const currentLang = LocalizedRouter.getCurrentLanguage();
  if (currentLang !== detectedLanguage) {
    // Soft redirect to correct language URL
    LocalizedRouter.redirectToLanguage(detectedLanguage, { soft: true });
  }

  // Show first-time banner if appropriate
  if (isFirstTime && LanguageBanner.shouldShowBanner()) {
    setTimeout(() => {
      LanguageBanner.createBanner(
        detectedLanguage,
        () => {
          // Keep current language
          LanguagePreferences.setPreference(detectedLanguage);
        },
        () => {
          // Switch language
          const newLang = detectedLanguage === 'en' ? 'fr' : 'en';
          LanguagePreferences.setPreference(newLang);
          TranslationManager.setLanguage(newLang);
          LocalizedRouter.redirectToLanguage(newLang, { soft: false });
        }
      );
    }, 1000); // Show banner after 1 second
  }

  return detectedLanguage;
}