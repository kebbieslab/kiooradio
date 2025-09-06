// Comprehensive i18n system for Kioo Radio
// Language labels dictionary with English and French translations

import React, { useState, useEffect } from 'react';

export const labels = {
  en: {
    // Header Navigation
    navHome: "Home",
    navAbout: "About", 
    navPrograms: "Programs",
    navChurches: "Partner Churches",
    navImpact: "Impact",
    navDonate: "Donate",
    listen: "Listen Live",
    
    // Hero Section
    heroTitle: "Reaching Hearts across the Makona River Region",
    heroSubtitle: "Our signal covers over 150 miles, bringing Faith and Hope to the Kissi, Mandingo, Fulani, Gbandi and more.",
    heroTagline: "Broadcasting Faith, Hope and Love in Christ across the Makona River Region",
    
    // Common Actions
    learnMore: "Learn More",
    getInvolved: "Get Involved",
    volunteerToday: "Volunteer Today",
    donate: "Donate",
    programs: "Programs",
    contact: "Contact Us",
    readMore: "Read More",
    backToTop: "Back to Top",
    
    // About Page
    aboutTitle: "About Kioo Radio",
    aboutSubtitle: "Broadcasting Faith, Hope and Love in Christ",
    ourVision: "Our Vision",
    ourMission: "Our Mission",
    ourTeam: "Our Team",
    ourStory: "Our Story",
    
    // Programs
    programsTitle: "Our Programs",
    programsSubtitle: "Diverse content that serves our community",
    programSchedule: "Program Schedule",
    livePrograms: "Live Programs",
    preRecorded: "Pre-recorded",
    
    // Impact
    impactTitle: "Our Impact",
    impactSubtitle: "Making a difference across the Makona River Region",
    impactCoverage: "Our Coverage at a Glance",
    testimonials: "Testimonials",
    
    // Donate
    donateTitle: "Support Kioo Radio",
    donateSubtitle: "Your donation helps us continue broadcasting Hope and Faith",
    donateBlurb: "Your donation helps us continue broadcasting Hope, Faith, and give vital information across the Makona River Region. Every contribution makes a difference in someone's life.",
    generalGiving: "General Giving",
    majorGifts: "Major Gifts",
    donateNow: "Donate Now",
    
    // Contact
    contactTitle: "Contact Us",
    contactSubtitle: "Get in touch with the Kioo Radio team",
    name: "Name",
    email: "Email",
    phone: "Phone",
    subject: "Subject", 
    message: "Message",
    sendMessage: "Send Message",
    
    // Footer
    footerTagline: "Broadcasting Faith, Hope and Love in Christ across the Makona River Region",
    quickLinks: "Quick Links",
    followUs: "Follow Us",
    contactInfo: "Contact Information",
    copyright: "© 2025 Kioo Radio 98.1 FM. All rights reserved.",
    
    // Partner Churches
    partnersTitle: "Our Partner Churches",
    partnersSubtitle: "Working together to spread the Gospel",
    churchPartners: "Church Partners",
    
    // Media Gallery
    mediaTitle: "Media Gallery",
    mediaSubtitle: "Photos and videos from our ministry",
    photos: "Photos",
    videos: "Videos",
    
    // Volunteer
    volunteerTitle: "Volunteer with Us",
    volunteerSubtitle: "Join our mission to reach hearts with the Gospel",
    
    // News
    newsTitle: "Latest News",
    newsSubtitle: "Stay updated with Kioo Radio",
    
    // Presenters Dashboard
    dashboardTitle: "Presenters Dashboard",
    weather: "Weather",
    schedule: "Schedule",
    presenters: "Presenters",
    social: "Social Media",
    testimony: "Testimony Log",
    callLog: "Call Log",
    export: "Export",
    
    // Forms
    required: "Required",
    optional: "Optional",
    submit: "Submit",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    close: "Close",
    
    // Status Messages
    loading: "Loading...",
    error: "Error",
    success: "Success",
    noData: "No data available",
    comingSoon: "Coming Soon",
    
    // Time & Date
    today: "Today",
    yesterday: "Yesterday",
    tomorrow: "Tomorrow",
    thisWeek: "This Week",
    thisMonth: "This Month",
    
    // Countries
    liberia: "Liberia",
    sierraLeone: "Sierra Leone", 
    guinea: "Guinea",
    
    // Days of Week
    monday: "Monday",
    tuesday: "Tuesday", 
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
    
    // Broadcasting
    live: "LIVE",
    onAir: "On Air",
    offAir: "Off Air",
    nowPlaying: "Now Playing",
    upNext: "Up Next",
    
    // CRM (if needed in public pages)
    contacts: "Contacts",
    dashboard: "Dashboard",
    statistics: "Statistics",
    
    // Launch Related
    launchCountdown: "Launching Kioo Radio in",
    launchDate: "November 13, 2025",
    broadcastingInto: "Broadcasting into 3 nations",
    reachingRegion: "Reaching the Makona River Region",
    
    // Language Switch
    switchToEnglish: "Switch to English",
    switchToFrench: "Switch to French",
    
    // Dashboard
    dashboardAccess: "Dashboard Access",
    dashboardAccessDesc: "Please enter your credentials to access the admin dashboard",
    username: "Username",
    password: "Password",
    accessDashboard: "Access Dashboard",
    kiooRadioDashboard: "Kioo Radio Dashboard",
    adminOverview: "Administrative Overview",
    lastUpdated: "Last updated",
    refreshing: "Refreshing...",
    refresh: "Refresh",
    logout: "Logout",
    visitorsThisMonth: "Visitors This Month",
    donationsThisMonth: "Donations This Month",
    netIncome: "Net Income",
    openReminders: "Open Reminders",
    approvedStories: "Approved Stories",
    incomeVsExpenses: "Income vs Expenses",
    income: "Income",
    expenses: "Expenses",
    donationsByProject: "Donations by Project"
  },
  
  fr: {
    // Header Navigation
    navHome: "Accueil",
    navAbout: "À propos",
    navPrograms: "Programmes", 
    navChurches: "Églises Partenaires",
    navImpact: "Impact",
    navDonate: "Faire un don",
    listen: "Écouter en direct",
    
    // Hero Section
    heroTitle: "Toucher les cœurs dans la région de la rivière Makona",
    heroSubtitle: "Notre signal couvre plus de 150 miles, apportant la Foi et l'Espérance aux Kissi, Mandingo, Peuls, Gbandi, et d'autres.",
    heroTagline: "Diffuser la Foi, l'Espérance et l'Amour en Christ dans la région de la rivière Makona",
    
    // Common Actions
    learnMore: "En savoir plus",
    getInvolved: "S'impliquer",
    volunteerToday: "Devenir bénévole",
    donate: "Faire un don",
    programs: "Programmes",
    contact: "Nous contacter",
    readMore: "Lire la suite",
    backToTop: "Retour en haut",
    
    // About Page
    aboutTitle: "À propos de Kioo Radio",
    aboutSubtitle: "Diffuser la Foi, l'Espérance et l'Amour en Christ",
    ourVision: "Notre Vision",
    ourMission: "Notre Mission", 
    ourTeam: "Notre Équipe",
    ourStory: "Notre Histoire",
    
    // Programs
    programsTitle: "Nos Programmes",
    programsSubtitle: "Contenu diversifié qui sert notre communauté",
    programSchedule: "Grille des Programmes",
    livePrograms: "Programmes en direct",
    preRecorded: "Pré-enregistré",
    
    // Impact
    impactTitle: "Notre Impact",
    impactSubtitle: "Faire la différence dans la région de la rivière Makona",
    impactCoverage: "Notre Couverture en un Coup d'Œil",
    testimonials: "Témoignages",
    
    // Donate
    donateTitle: "Soutenir Kioo Radio",
    donateSubtitle: "Votre don nous aide à continuer de diffuser l'Espérance et la Foi",
    donateBlurb: "Votre don nous aide à continuer de diffuser la Foi, l'Espérance et des informations essentielles dans la région de la rivière Makona. Chaque contribution change une vie.",
    generalGiving: "Don Général",
    majorGifts: "Grands Dons",
    donateNow: "Faire un don maintenant",
    
    // Contact
    contactTitle: "Nous Contacter",
    contactSubtitle: "Entrez en contact avec l'équipe de Kioo Radio",
    name: "Nom",
    email: "Email",
    phone: "Téléphone",
    subject: "Sujet",
    message: "Message",
    sendMessage: "Envoyer le message",
    
    // Footer
    footerTagline: "Diffuser la Foi, l'Espérance et l'Amour en Christ dans la région de la rivière Makona",
    quickLinks: "Liens Rapides",
    followUs: "Suivez-nous",
    contactInfo: "Informations de Contact",
    copyright: "© 2025 Kioo Radio 98.1 FM. Tous droits réservés.",
    
    // Partner Churches
    partnersTitle: "Nos Églises Partenaires",
    partnersSubtitle: "Travailler ensemble pour répandre l'Évangile",
    churchPartners: "Partenaires Églises",
    
    // Media Gallery
    mediaTitle: "Galerie Média",
    mediaSubtitle: "Photos et vidéos de notre ministère",
    photos: "Photos",
    videos: "Vidéos",
    
    // Volunteer
    volunteerTitle: "Faire du bénévolat avec nous",
    volunteerSubtitle: "Rejoignez notre mission pour toucher les cœurs avec l'Évangile",
    
    // News
    newsTitle: "Dernières Nouvelles",
    newsSubtitle: "Restez informé avec Kioo Radio",
    
    // Presenters Dashboard
    dashboardTitle: "Tableau de bord des Présentateurs",
    weather: "Météo",
    schedule: "Horaire",
    presenters: "Présentateurs",
    social: "Réseaux Sociaux",
    testimony: "Journal des Témoignages",
    callLog: "Journal des Appels",
    export: "Exporter",
    
    // Forms
    required: "Requis",
    optional: "Optionnel",
    submit: "Soumettre",
    cancel: "Annuler",
    save: "Sauvegarder",
    delete: "Supprimer",
    edit: "Modifier",
    close: "Fermer",
    
    // Status Messages
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
    noData: "Aucune donnée disponible",
    comingSoon: "Bientôt disponible",
    
    // Time & Date
    today: "Aujourd'hui",
    yesterday: "Hier",
    tomorrow: "Demain",
    thisWeek: "Cette semaine",
    thisMonth: "Ce mois-ci",
    
    // Countries
    liberia: "Libéria",
    sierraLeone: "Sierra Leone",
    guinea: "Guinée",
    
    // Days of Week
    monday: "Lundi",
    tuesday: "Mardi",
    wednesday: "Mercredi", 
    thursday: "Jeudi",
    friday: "Vendredi",
    saturday: "Samedi",
    sunday: "Dimanche",
    
    // Broadcasting
    live: "EN DIRECT",
    onAir: "À l'antenne",
    offAir: "Hors antenne", 
    nowPlaying: "En cours",
    upNext: "À suivre",
    
    // CRM (if needed in public pages)
    contacts: "Contacts",
    dashboard: "Tableau de bord",
    statistics: "Statistiques",
    
    // Launch Related
    launchCountdown: "Lancement de Kioo Radio dans",
    launchDate: "13 novembre 2025",
    broadcastingInto: "Diffusion dans 3 nations",
    reachingRegion: "Atteindre la région de la rivière Makona",
    
    // Language Switch
    switchToEnglish: "Passer à l'anglais",
    switchToFrench: "Basculer en français",
    
    // Dashboard
    dashboardAccess: "Accès au Tableau de Bord",
    dashboardAccessDesc: "Veuillez entrer vos identifiants pour accéder au tableau de bord administrateur",
    username: "Nom d'utilisateur",
    password: "Mot de passe",
    accessDashboard: "Accéder au Tableau de Bord",
    kiooRadioDashboard: "Tableau de Bord Kioo Radio",
    adminOverview: "Aperçu Administratif",
    lastUpdated: "Dernière mise à jour",
    refreshing: "Actualisation...",
    refresh: "Actualiser",
    logout: "Déconnexion",
    visitorsThisMonth: "Visiteurs ce Mois",
    donationsThisMonth: "Dons ce Mois",
    netIncome: "Revenu Net",
    openReminders: "Rappels Ouverts",
    approvedStories: "Histoires Approuvées",
    incomeVsExpenses: "Revenus vs Dépenses",
    income: "Revenus",
    expenses: "Dépenses",
    donationsByProject: "Dons par Projet"
  }
};

// Current language state
let currentLang = 'en';

// Initialize language from localStorage or browser preference
export const initializeLanguage = () => {
  const saved = localStorage.getItem('kioo_lang');
  if (saved && (saved === 'en' || saved === 'fr')) {
    currentLang = saved;
    return saved;
  }
  
  // Auto-detect based on browser language
  const nav = (navigator.language || 'en').toLowerCase();
  const browserLang = nav.startsWith('fr') ? 'fr' : 'en';
  currentLang = browserLang;
  localStorage.setItem('kioo_lang', browserLang);
  return browserLang;
};

// Get current language
export const getCurrentLanguage = () => currentLang;

// Switch language and update localStorage
export const switchLanguage = (lang) => {
  if (lang === 'en' || lang === 'fr') {
    currentLang = lang;
    localStorage.setItem('kioo_lang', lang);
    updateAllLabels();
    
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: lang } 
    }));
    
    return lang;
  }
  return currentLang;
};

// Get translated label
export const t = (key, fallback = '') => {
  return labels[currentLang]?.[key] || labels.en?.[key] || fallback || key;
};

// Update all labels on the page without reload
export const updateAllLabels = () => {
  // Update data-i18n attributes
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = t(key);
    
    if (translation && translation !== key) {
      element.textContent = translation;
    }
  });
  
  // Update data-i18n-placeholder attributes for form inputs
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    const translation = t(key);
    
    if (translation && translation !== key) {
      element.placeholder = translation;
    }
  });
  
  // Update data-i18n-title attributes for tooltips
  document.querySelectorAll('[data-i18n-title]').forEach(element => {
    const key = element.getAttribute('data-i18n-title');
    const translation = t(key);
    
    if (translation && translation !== key) {
      element.title = translation;
    }
  });
  
  // Update aria-label attributes
  document.querySelectorAll('[data-i18n-aria]').forEach(element => {
    const key = element.getAttribute('data-i18n-aria');
    const translation = t(key);
    
    if (translation && translation !== key) {
      element.setAttribute('aria-label', translation);
    }
  });
};

// React hook for using translations in components
export const useTranslation = () => {
  const [language, setLanguage] = useState(getCurrentLanguage());
  
  useEffect(() => {
    const handleLanguageChange = (event) => {
      setLanguage(event.detail.language);
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);
  
  return {
    t: (key, fallback) => t(key, fallback),
    language,
    switchLanguage,
    isEnglish: language === 'en',
    isFrench: language === 'fr'
  };
};

// Initialize the system
export const initI18n = () => {
  const lang = initializeLanguage();
  
  // Set up global functions for backward compatibility
  window.t = t;
  window.switchLanguage = switchLanguage;
  window.getCurrentLanguage = getCurrentLanguage;
  window.updateAllLabels = updateAllLabels;
  
  // Initial label update
  setTimeout(updateAllLabels, 100);
  
  return lang;
};

export default {
  labels,
  t,
  switchLanguage,
  getCurrentLanguage,
  initializeLanguage,
  updateAllLabels,
  useTranslation,
  initI18n
};