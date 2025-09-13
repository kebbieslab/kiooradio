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
    
    // Authentication & Access
    username: "Username",
    password: "Password",
    login: "Login",
    logout: "Logout",
    loading: "Loading...",
    saving: "Saving...",
    cancel: "Cancel",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    add: "Add",
    update: "Update",
    
    // AI Program Assistant
    "AI Program Assistant": "AI Program Assistant",
    "AI Program Assistant Access": "AI Program Assistant Access", 
    "Sign in to access the AI-powered program management system": "Sign in to access the AI-powered program management system",
    "Intelligent program analysis and management": "Intelligent program analysis and management",
    "Sign In": "Sign In",
    "Refresh": "Refresh",
    "Programs": "Programs",
    "Search": "Search",
    "Analytics": "Analytics",
    "Add Program": "Add Program",
    "Program Archive": "Program Archive",
    "AI-Powered Program Search": "AI-Powered Program Search",
    "Search programs by content, keywords, or themes...": "Search programs by content, keywords, or themes...",
    "Search Results": "Search Results",
    "Program Analytics": "Program Analytics",
    "Total Programs": "Total Programs",
    "AI Summary Coverage": "AI Summary Coverage",
    "Highlights Coverage": "Highlights Coverage",
    "Keywords Coverage": "Keywords Coverage",
    "Programs by Language": "Programs by Language",
    "Programs by Type": "Programs by Type",
    "Unspecified": "Unspecified",
    "Add New Program": "Add New Program",
    "Presenter": "Presenter",
    "Date": "Date",
    "Summary": "Summary",
    "Highlights": "Highlights",
    "Keywords": "Keywords",
    "View Details": "View Details",
    "Analyze": "Analyze",
    "View": "View",
    "Program Title": "Program Title",
    "Language": "Language",
    "Program Type": "Program Type",
    "Select Type": "Select Type",
    "Devotion": "Devotion",
    "Music": "Music",
    "News": "News",
    "Discussion": "Discussion",
    "Prayer": "Prayer",
    "Testimony": "Testimony",
    "Date Aired": "Date Aired",
    "Duration (minutes)": "Duration (minutes)",
    "Description": "Description",
    "Program Content": "Program Content",
    "Enter program transcript, notes, or content for AI analysis...": "Enter program transcript, notes, or content for AI analysis...",
    "Audio URL": "Audio URL",
    "Clear": "Clear",
    "Creating...": "Creating...",
    "Create Program": "Create Program",
    "AI Analysis": "AI Analysis",
    "Once created, the program will be automatically analyzed to generate summaries, extract highlights, and identify keywords.": "Once created, the program will be automatically analyzed to generate summaries, extract highlights, and identify keywords.",
    "Duration": "Duration",
    "minutes": "minutes",
    "Type": "Type",
    "AI Summary": "AI Summary",
    "Key Highlights": "Key Highlights",
    "Generate Summary": "Generate Summary",
    "Extract Highlights": "Extract Highlights",
    "Translate": "Translate",
    "Analysis Type": "Analysis Type",
    "Start AI Analysis": "Start AI Analysis",
    "AI is analyzing the program...": "AI is analyzing the program...",
    "Analysis Complete": "Analysis Complete",
    "Processing time": "Processing time",
    "Results": "Results",
    "Translation": "Translation",
    
    // CRM Merge & SSO Status
    "Merge & SSO Status": "Merge & SSO Status",
    "CRM Module Integration Analysis & Consolidation Dashboard": "CRM Module Integration Analysis & Consolidation Dashboard",
    "Back to CRM": "Back to CRM",
    "Running Diagnostics...": "Running Diagnostics...",
    "Re-run Diagnostics": "Re-run Diagnostics",
    "Total Modules": "Total Modules",
    "Fully Integrated": "Fully Integrated",
    "External/Standalone": "External/Standalone",
    "Unknown/Missing": "Unknown/Missing",
    "CRM Modules Status": "CRM Modules Status",
    "Module": "Module",
    "Path": "Path",
    "Auth": "Auth",
    "Route": "Route",
    "Data": "Data",
    "JWT": "JWT",
    "Lang": "Lang",
    "Priority": "Priority",
    "Actions": "Actions",
    "Fix Plan": "Fix Plan",
    "Merge Playbook": "Merge Playbook",
    "Step 1: Authentication": "Step 1: Authentication",
    "Integrate with central AuthService and JWT cookies": "Integrate with central AuthService and JWT cookies",
    "Step 2: Data Layer": "Step 2: Data Layer",
    "Migrate to UnifiedDataService for consistent CRUD operations": "Migrate to UnifiedDataService for consistent CRUD operations",
    "Step 3: Routing": "Step 3: Routing",
    "Mount as internal CRM routes instead of standalone pages": "Mount as internal CRM routes instead of standalone pages",
    "Step 4: Localization": "Step 4: Localization",
    "Use global i18n system for EN/FR language support": "Use global i18n system for EN/FR language support",
    "Step 5: Testing": "Step 5: Testing",
    "Verify integrated functionality and remove duplicates": "Verify integrated functionality and remove duplicates",
    "Last Check": "Last Check",
    "Fix Plan for": "Fix Plan for",
    "Current Status": "Current Status",
    "Auth Mode": "Auth Mode",
    "Route Status": "Route Status",
    "Data Source": "Data Source",
    "Integration Steps": "Integration Steps",
    "Fix Authentication": "Fix Authentication",
    "Integrate with CRM AuthService using JWT httpOnly cookies": "Integrate with CRM AuthService using JWT httpOnly cookies",
    "Mount Internal Route": "Mount Internal Route",
    "Add route to CRM internal routing": "Add route to CRM internal routing",
    "Migrate Data Layer": "Migrate Data Layer",
    "Replace standalone API calls with UnifiedDataService": "Replace standalone API calls with UnifiedDataService",
    "Add Global i18n": "Add Global i18n",
    "Use global translation system for EN/FR support": "Use global translation system for EN/FR support",
    "Close": "Close",
    "Start Auto-Fix": "Start Auto-Fix",
    "Auto-fix functionality coming soon!": "Auto-fix functionality coming soon!",
    "Analyzing": "Analyzing",
    "Performing comprehensive integration analysis...": "Performing comprehensive integration analysis...",
    "Integrated": "Integrated",
    "External": "External",
    "Unknown": "Unknown",
    
    // Visitors Management
    visitorsManagement: "Visitors Management",
    visitorsAccess: "Visitors Access",
    visitorsAccessDescription: "Please enter your credentials to access the Visitors Management system",
    accessVisitors: "Access Visitors",
    visitorsTestimonies: "Visitors & Testimonies",
    manageVisitorRecords: "Manage visitor records and testimonies",
    addVisitorTestimony: "Add Visitor/Testimony",
    editVisitor: "Edit Visitor",
    updateVisitor: "Update Visitor",
    addVisitor: "Add Visitor",
    visitorsList: "Visitors List",
    noVisitorsFound: "No visitors found",
    
    // Form Fields
    date: "Date",
    name: "Name",
    phone: "Phone",
    email: "Email",
    country: "Country",
    countyPrefecture: "County/Prefecture",
    cityTown: "City/Town",
    program: "Program",
    language: "Language",
    testimony: "Testimony",
    testimonyPlaceholder: "Share how Kioo Radio has impacted your life...",
    source: "Source",
    consent: "Consent",
    actions: "Actions",
    
    // Filter Options
    filters: "Filters",
    month: "Month",
    allCountries: "All Countries",
    allPrograms: "All Programs",
    allSources: "All Sources",
    clearFilters: "Clear Filters",
    
    // Select Options
    selectCountry: "Select Country",
    selectProgram: "Select Program",
    other: "Other",
    
    // Programs
    morningDevotion: "Morning Devotion",
    frenchGospel: "French Gospel",  
    eveningPrayer: "Evening Prayer",
    youthHour: "Youth Hour",
    sundayService: "Sunday Service",
    bibleStudy: "Bible Study",
    
    // Sources
    website: "Website",
    phoneCall: "Phone Call",
    inPerson: "In Person",
    
    // Consent
    yes: "Yes",
    no: "No",
    yesConsent: "Yes - Consent given",
    noConsent: "No - Consent not given",
    
    // Export
    exportCsv: "Export CSV",
    exportXlsx: "Export XLSX",
    
    // Messages
    invalidCredentials: "Invalid username or password",
    failedToLoadVisitors: "Failed to load visitors",
    failedToSaveVisitor: "Failed to save visitor",
    failedToDeleteVisitor: "Failed to delete visitor",
    failedToExport: "Failed to export data",
    confirmDeleteVisitor: "Are you sure you want to delete this visitor?",
    
    // Donations Management
    donationsManagement: "Donations Management",
    donationsAccess: "Donations Access", 
    donationsAccessDescription: "Please enter your credentials to access the Donations Management system",
    accessDonations: "Access Donations",
    manageDonationRecords: "Manage donation records and track contributions",
    addDonation: "Add Donation",
    editDonation: "Edit Donation",
    updateDonation: "Update Donation",
    donationsList: "Donations List",
    noDonationsFound: "No donations found",
    
    // Donation Fields
    donorName: "Donor Name",
    paymentMethod: "Payment Method",
    amount: "Amount",
    amountCurrency: "Currency",
    projectCode: "Project Code",
    note: "Note",
    receiptNo: "Receipt Number",
    anonymous: "Anonymous",
    
    // Payment Methods
    orangeMoney: "Orange Money",
    lonestar: "Lonestar",
    paypal: "PayPal",
    bank: "Bank Transfer",
    
    // Donation Filters
    allProjects: "All Projects",
    allMethods: "All Methods",
    allAnonymous: "All (Anonymous)",
    anonymousYes: "Anonymous Only",
    anonymousNo: "Public Only",
    
    // Donation Totals
    thisMonth: "This Month",
    yearToDate: "Year to Date",
    totalDonations: "Total Donations",
    usdTotal: "USD Total",
    lrdTotal: "LRD Total",
    runningTotals: "Running Totals",
    
    // Validation Messages
    amountMustBeGreaterThanZero: "Amount must be greater than 0",
    invalidAmount: "Please enter a valid amount",
    invalidCurrency: "Currency must be USD or LRD",
    invalidPaymentMethod: "Please select a valid payment method",
    
    // Donation Messages  
    failedToLoadDonations: "Failed to load donations",
    failedToSaveDonation: "Failed to save donation",
    failedToDeleteDonation: "Failed to delete donation",
    confirmDeleteDonation: "Are you sure you want to delete this donation?",
    donationSavedSuccessfully: "Donation saved successfully",
    donationDeletedSuccessfully: "Donation deleted successfully",
    
    // Projects Management
    projectsManagement: "Projects Management",
    projectsAccess: "Projects Access",
    projectsAccessDescription: "Please enter your credentials to access the Projects Management system",
    accessProjects: "Access Projects",
    manageProjectRecords: "Manage project records and track progress",
    addProject: "Add Project",
    editProject: "Edit Project", 
    updateProject: "Update Project",
    projectsList: "Projects List",
    noProjectsFound: "No projects found",
    projectDetails: "Project Details",
    
    // Project Fields
    projectCode: "Project Code",
    projectName: "Project Name",
    description: "Description",
    descriptionShort: "Short Description",
    startDate: "Start Date",
    endDate: "End Date",
    status: "Status",
    budgetCurrency: "Budget Currency",
    budgetAmount: "Budget Amount",
    manager: "Manager",
    tags: "Tags",
    
    // Project Status Options
    planned: "Planned",
    active: "Active", 
    completed: "Completed",
    onHold: "On Hold",
    cancelled: "Cancelled",
    
    // Project Filters
    allStatuses: "All Statuses",
    allManagers: "All Managers",
    
    // Project Details
    projectDonations: "Project Donations",
    recentDonations: "Recent Donations",
    projectStories: "Project Stories",
    recentStories: "Recent Stories",
    donationsTotals: "Donations Totals",
    totalProjectDonations: "Total Project Donations",
    
    // Validation Messages
    projectCodeRequired: "Project code is required",
    projectCodeExists: "Project code already exists",
    projectNameRequired: "Project name is required",
    invalidBudgetAmount: "Budget amount must be positive",
    invalidDateRange: "End date must be after start date",
    
    // Project Messages
    failedToLoadProjects: "Failed to load projects",
    failedToSaveProject: "Failed to save project",
    failedToDeleteProject: "Failed to delete project",
    confirmDeleteProject: "Are you sure you want to delete this project?",
    projectSavedSuccessfully: "Project saved successfully",
    projectDeletedSuccessfully: "Project deleted successfully",
    failedToLoadProjectDetails: "Failed to load project details",
    
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
    donationsByProject: "Donations by Project",
    
    // Weather
    weatherForecast: "Weather Forecast",
    currentWeather: "Current Weather",
    twoDayForecast: "2-Day Weather Predictions",
    updated: "Updated",
    
    // Interactive Programming Clocks
    "clocks.title": "Interactive Weekly Programming Clocks",
    "clocks.subtitle": "View Kioo Radio's weekly programming schedule with interactive clocks showing live broadcasts and upcoming shows",
    "clocks.currentTime": "Current Time (Liberia)",
    "clocks.liveNow": "LIVE NOW",
    "clocks.nextUp": "NEXT UP",
    "clocks.noLiveProgram": "No live program currently",
    "clocks.filterByLanguage": "Filter by Language",
    "clocks.searchPrograms": "Search programs...",
    "clocks.clearFilters": "Clear Filters",
    "clocks.weeklySchedule": "Weekly Programming Schedule",
    "clocks.weeklyTotals": "Weekly Totals",
    "clocks.programDetails": "Program Details",
    "clocks.detailTitle": "Title",
    "clocks.language": "Language",
    "clocks.day": "Day",
    "clocks.time": "Time",
    "clocks.hourlyBreakdown": "Hourly Breakdown",
    "clocks.addToCalendar": "Add to Calendar",
    "clocks.copyLink": "Copy Link",
    "clocks.addToCalendarSoon": "Add to Calendar feature coming soon!",
    "clocks.linkCopied": "Link copied to clipboard!",
    "clocks.loadingSchedule": "Loading programming schedule...",
    "clocks.totalHours": "Total Hours",
    "clocks.hoursAbbrev": "h",
    "clocks.ofWeek": "of week",
    "clocks.target": "Target",
    "clocks.fromTarget": "from target",
    
    // Days of week for clocks
    "clocks.mon": "Monday",
    "clocks.tue": "Tuesday", 
    "clocks.wed": "Wednesday",
    "clocks.thu": "Thursday",
    "clocks.fri": "Friday",
    "clocks.sat": "Saturday",
    "clocks.sun": "Sunday",
    
    // Languages for clocks
    "clocks.kissi": "Kissi",
    "clocks.english": "English",
    "clocks.french": "French",
    "clocks.evangelistic": "Evangelistic"
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
    
    // Authentication & Access
    username: "Nom d'utilisateur",
    password: "Mot de passe",
    login: "Connexion",
    logout: "Déconnexion",
    loading: "Chargement...",
    saving: "Enregistrement...",
    cancel: "Annuler",
    save: "Enregistrer",
    edit: "Modifier",
    delete: "Supprimer",
    add: "Ajouter",
    update: "Mettre à jour",
    
    // AI Program Assistant  
    "AI Program Assistant": "Assistant de Programme IA",
    "AI Program Assistant Access": "Accès Assistant de Programme IA",
    "Sign in to access the AI-powered program management system": "Connectez-vous pour accéder au système de gestion de programmes alimenté par l'IA",
    "Intelligent program analysis and management": "Analyse et gestion intelligente des programmes",
    "Sign In": "Se connecter",
    "Refresh": "Actualiser",
    "Programs": "Programmes",
    "Search": "Rechercher",
    "Analytics": "Analytiques",
    "Add Program": "Ajouter un Programme",
    "Program Archive": "Archive des Programmes",
    "AI-Powered Program Search": "Recherche de Programmes Alimentée par l'IA",
    "Search programs by content, keywords, or themes...": "Rechercher des programmes par contenu, mots-clés ou thèmes...",
    "Search Results": "Résultats de Recherche",
    "Program Analytics": "Analytiques des Programmes",
    "Total Programs": "Total des Programmes",
    "AI Summary Coverage": "Couverture des Résumés IA",
    "Highlights Coverage": "Couverture des Points Forts",
    "Keywords Coverage": "Couverture des Mots-clés",
    "Programs by Language": "Programmes par Langue",
    "Programs by Type": "Programmes par Type",
    "Unspecified": "Non spécifié",
    "Add New Program": "Ajouter un Nouveau Programme",
    "Presenter": "Présentateur",
    "Date": "Date",
    "Summary": "Résumé",
    "Highlights": "Points Forts",
    "Keywords": "Mots-clés",
    "View Details": "Voir les Détails",
    "Analyze": "Analyser",
    "View": "Voir",
    "Program Title": "Titre du Programme",
    "Language": "Langue",
    "Program Type": "Type de Programme",
    "Select Type": "Sélectionner le Type",
    "Devotion": "Dévotion",
    "Music": "Musique",
    "News": "Actualités",
    "Discussion": "Discussion",
    "Prayer": "Prière",
    "Testimony": "Témoignage",
    "Date Aired": "Date de Diffusion",
    "Duration (minutes)": "Durée (minutes)",
    "Description": "Description",
    "Program Content": "Contenu du Programme",
    "Enter program transcript, notes, or content for AI analysis...": "Entrez la transcription, les notes ou le contenu du programme pour l'analyse IA...",
    "Audio URL": "URL Audio",
    "Clear": "Effacer",
    "Creating...": "Création en cours...",
    "Create Program": "Créer un Programme",
    "AI Analysis": "Analyse IA",
    "Once created, the program will be automatically analyzed to generate summaries, extract highlights, and identify keywords.": "Une fois créé, le programme sera automatiquement analysé pour générer des résumés, extraire les points forts et identifier les mots-clés.",
    "Duration": "Durée",
    "minutes": "minutes",
    "Type": "Type",
    "AI Summary": "Résumé IA",
    "Key Highlights": "Points Forts Clés",
    "Generate Summary": "Générer un Résumé",
    "Extract Highlights": "Extraire les Points Forts",
    "Translate": "Traduire",
    "Analysis Type": "Type d'Analyse",
    "Start AI Analysis": "Démarrer l'Analyse IA",
    "AI is analyzing the program...": "L'IA analyse le programme...",
    "Analysis Complete": "Analyse Terminée",
    "Processing time": "Temps de traitement",
    "Results": "Résultats",
    "Translation": "Traduction",
    
    // CRM Merge & SSO Status
    "Merge & SSO Status": "Statut Fusion & SSO",
    "CRM Module Integration Analysis & Consolidation Dashboard": "Tableau de Bord d'Analyse et Consolidation des Modules CRM",
    "Back to CRM": "Retour au CRM",
    "Running Diagnostics...": "Diagnostics en cours...",
    "Re-run Diagnostics": "Relancer les Diagnostics",
    "Total Modules": "Total des Modules",
    "Fully Integrated": "Entièrement Intégrés",
    "External/Standalone": "Externes/Autonomes",
    "Unknown/Missing": "Inconnus/Manquants",
    "CRM Modules Status": "Statut des Modules CRM",
    "Module": "Module",
    "Path": "Chemin",
    "Auth": "Auth",
    "Route": "Route",
    "Data": "Données",
    "JWT": "JWT",
    "Lang": "Lang",
    "Priority": "Priorité",
    "Actions": "Actions",
    "Fix Plan": "Plan de Correction",
    "Merge Playbook": "Guide de Fusion",
    "Step 1: Authentication": "Étape 1: Authentification",
    "Integrate with central AuthService and JWT cookies": "Intégrer avec AuthService central et cookies JWT",
    "Step 2: Data Layer": "Étape 2: Couche de Données",
    "Migrate to UnifiedDataService for consistent CRUD operations": "Migrer vers UnifiedDataService pour des opérations CRUD cohérentes",
    "Step 3: Routing": "Étape 3: Routage",
    "Mount as internal CRM routes instead of standalone pages": "Monter comme routes CRM internes au lieu de pages autonomes",
    "Step 4: Localization": "Étape 4: Localisation",
    "Use global i18n system for EN/FR language support": "Utiliser le système i18n global pour le support EN/FR",
    "Step 5: Testing": "Étape 5: Tests",
    "Verify integrated functionality and remove duplicates": "Vérifier la fonctionnalité intégrée et supprimer les doublons",
    "Last Check": "Dernière Vérification",
    "Fix Plan for": "Plan de Correction pour",
    "Current Status": "Statut Actuel",
    "Auth Mode": "Mode Auth",
    "Route Status": "Statut Route",
    "Data Source": "Source de Données",
    "Integration Steps": "Étapes d'Intégration",
    "Fix Authentication": "Corriger l'Authentification",
    "Integrate with CRM AuthService using JWT httpOnly cookies": "Intégrer avec CRM AuthService utilisant des cookies JWT httpOnly",
    "Mount Internal Route": "Monter Route Interne",
    "Add route to CRM internal routing": "Ajouter route au routage interne CRM",
    "Migrate Data Layer": "Migrer Couche de Données",
    "Replace standalone API calls with UnifiedDataService": "Remplacer les appels API autonomes par UnifiedDataService",
    "Add Global i18n": "Ajouter i18n Global",
    "Use global translation system for EN/FR support": "Utiliser le système de traduction global pour le support EN/FR",
    "Close": "Fermer",
    "Start Auto-Fix": "Démarrer Auto-Correction",
    "Auto-fix functionality coming soon!": "Fonctionnalité d'auto-correction bientôt disponible!",
    "Analyzing": "Analyse en cours",
    "Performing comprehensive integration analysis...": "Exécution d'une analyse d'intégration complète...",
    "Integrated": "Intégré",
    "External": "Externe",
    "Unknown": "Inconnu",
    
    // Visitors Management
    visitorsManagement: "Gestion des Visiteurs",
    visitorsAccess: "Accès Visiteurs",
    visitorsAccessDescription: "Veuillez saisir vos identifiants pour accéder au système de gestion des visiteurs",
    accessVisitors: "Accéder aux Visiteurs",
    visitorsTestimonies: "Visiteurs et Témoignages",
    manageVisitorRecords: "Gérer les dossiers des visiteurs et témoignages",
    addVisitorTestimony: "Ajouter Visiteur/Témoignage",
    editVisitor: "Modifier le Visiteur",
    updateVisitor: "Mettre à jour le Visiteur",
    addVisitor: "Ajouter un Visiteur",
    visitorsList: "Liste des Visiteurs",
    noVisitorsFound: "Aucun visiteur trouvé",
    
    // Form Fields
    date: "Date",
    name: "Nom",
    phone: "Téléphone",
    email: "Email",
    country: "Pays",
    countyPrefecture: "Comté/Préfecture",
    cityTown: "Ville/Village",
    program: "Programme",
    language: "Langue",
    testimony: "Témoignage",
    testimonyPlaceholder: "Partagez comment Kioo Radio a impacté votre vie...",
    source: "Source",
    consent: "Consentement",
    actions: "Actions",
    
    // Filter Options
    filters: "Filtres",
    month: "Mois",
    allCountries: "Tous les Pays",
    allPrograms: "Tous les Programmes",
    allSources: "Toutes les Sources",
    clearFilters: "Effacer les Filtres",
    
    // Select Options
    selectCountry: "Sélectionner le Pays",
    selectProgram: "Sélectionner le Programme",
    other: "Autre",
    
    // Programs
    morningDevotion: "Dévotion Matinale",
    frenchGospel: "Évangile Français",
    eveningPrayer: "Prière du Soir",
    youthHour: "Heure des Jeunes",
    sundayService: "Service Dominical",
    bibleStudy: "Étude Biblique",
    
    // Sources
    website: "Site Web",
    phoneCall: "Appel Téléphonique",
    inPerson: "En Personne",
    
    // Consent
    yes: "Oui",
    no: "Non",
    yesConsent: "Oui - Consentement donné",
    noConsent: "Non - Consentement non donné",
    
    // Export
    exportCsv: "Exporter CSV",
    exportXlsx: "Exporter XLSX",
    
    // Messages
    invalidCredentials: "Nom d'utilisateur ou mot de passe invalide",
    failedToLoadVisitors: "Échec du chargement des visiteurs",
    failedToSaveVisitor: "Échec de l'enregistrement du visiteur",
    failedToDeleteVisitor: "Échec de la suppression du visiteur",
    failedToExport: "Échec de l'exportation des données",
    confirmDeleteVisitor: "Êtes-vous sûr de vouloir supprimer ce visiteur?",
    
    // Donations Management
    donationsManagement: "Gestion des Dons",
    donationsAccess: "Accès Dons",
    donationsAccessDescription: "Veuillez saisir vos identifiants pour accéder au système de gestion des dons",
    accessDonations: "Accéder aux Dons",
    manageDonationRecords: "Gérer les dossiers de dons et suivre les contributions",
    addDonation: "Ajouter un Don",
    editDonation: "Modifier le Don",
    updateDonation: "Mettre à jour le Don",
    donationsList: "Liste des Dons",
    noDonationsFound: "Aucun don trouvé",
    
    // Donation Fields
    donorName: "Nom du Donateur",
    paymentMethod: "Méthode de Paiement",
    amount: "Montant",
    amountCurrency: "Devise",
    projectCode: "Code Projet",
    note: "Note",
    receiptNo: "Numéro de Reçu",
    anonymous: "Anonyme",
    
    // Payment Methods
    orangeMoney: "Orange Money",
    lonestar: "Lonestar",
    paypal: "PayPal",
    bank: "Virement Bancaire",
    
    // Donation Filters
    allProjects: "Tous les Projets",
    allMethods: "Toutes les Méthodes",
    allAnonymous: "Tous (Anonyme)",
    anonymousYes: "Anonyme Seulement",
    anonymousNo: "Public Seulement",
    
    // Donation Totals
    thisMonth: "Ce Mois",
    yearToDate: "Année à ce Jour",
    totalDonations: "Total des Dons",
    usdTotal: "Total USD",
    lrdTotal: "Total LRD",
    runningTotals: "Totaux Cumulés",
    
    // Validation Messages
    amountMustBeGreaterThanZero: "Le montant doit être supérieur à 0",
    invalidAmount: "Veuillez saisir un montant valide",
    invalidCurrency: "La devise doit être USD ou LRD",
    invalidPaymentMethod: "Veuillez sélectionner une méthode de paiement valide",
    
    // Donation Messages
    failedToLoadDonations: "Échec du chargement des dons",
    failedToSaveDonation: "Échec de l'enregistrement du don",
    failedToDeleteDonation: "Échec de la suppression du don",
    confirmDeleteDonation: "Êtes-vous sûr de vouloir supprimer ce don?",
    donationSavedSuccessfully: "Don enregistré avec succès",
    donationDeletedSuccessfully: "Don supprimé avec succès",
    
    // Projects Management
    projectsManagement: "Gestion des Projets",
    projectsAccess: "Accès Projets",
    projectsAccessDescription: "Veuillez saisir vos identifiants pour accéder au système de gestion des projets",
    accessProjects: "Accéder aux Projets",
    manageProjectRecords: "Gérer les dossiers de projets et suivre les progrès",
    addProject: "Ajouter un Projet",
    editProject: "Modifier le Projet",
    updateProject: "Mettre à jour le Projet",
    projectsList: "Liste des Projets",
    noProjectsFound: "Aucun projet trouvé",
    projectDetails: "Détails du Projet",
    
    // Project Fields
    projectCode: "Code Projet",
    projectName: "Nom du Projet",
    description: "Description",
    descriptionShort: "Description Courte",
    startDate: "Date de Début",
    endDate: "Date de Fin",
    status: "Statut",
    budgetCurrency: "Devise du Budget",
    budgetAmount: "Montant du Budget",
    manager: "Gestionnaire",
    tags: "Étiquettes",
    
    // Project Status Options
    planned: "Planifié",
    active: "Actif",
    completed: "Terminé",
    onHold: "En Attente",
    cancelled: "Annulé",
    
    // Project Filters
    allStatuses: "Tous les Statuts",
    allManagers: "Tous les Gestionnaires",
    
    // Project Details
    projectDonations: "Dons du Projet",
    recentDonations: "Dons Récents",
    projectStories: "Histoires du Projet",
    recentStories: "Histoires Récentes",
    donationsTotals: "Totaux des Dons",
    totalProjectDonations: "Total des Dons du Projet",
    
    // Validation Messages
    projectCodeRequired: "Le code projet est requis",
    projectCodeExists: "Le code projet existe déjà",
    projectNameRequired: "Le nom du projet est requis",
    invalidBudgetAmount: "Le montant du budget doit être positif",
    invalidDateRange: "La date de fin doit être après la date de début",
    
    // Project Messages
    failedToLoadProjects: "Échec du chargement des projets",
    failedToSaveProject: "Échec de l'enregistrement du projet",
    failedToDeleteProject: "Échec de la suppression du projet",
    confirmDeleteProject: "Êtes-vous sûr de vouloir supprimer ce projet?",
    projectSavedSuccessfully: "Projet enregistré avec succès",
    projectDeletedSuccessfully: "Projet supprimé avec succès",
    failedToLoadProjectDetails: "Échec du chargement des détails du projet",
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
    donationsByProject: "Dons par Projet",
    
    // Weather
    weatherForecast: "Prévisions Météorologiques",
    currentWeather: "Météo Actuelle",
    twoDayForecast: "Prédictions Météo 2 Jours",
    updated: "Mis à jour",
    
    // Interactive Programming Clocks
    "clocks.title": "Horloges de Programmation Hebdomadaire",
    "clocks.subtitle": "Consultez la grille de programmation hebdomadaire de Kioo Radio avec des horloges interactives montrant les émissions en direct et à venir",
    "clocks.currentTime": "Heure Actuelle (Libéria)",
    "clocks.liveNow": "EN DIRECT",
    "clocks.nextUp": "SUIVANT",
    "clocks.noLiveProgram": "Aucun programme en direct actuellement",
    "clocks.filterByLanguage": "Filtrer par Langue",
    "clocks.searchPrograms": "Rechercher des programmes...",
    "clocks.clearFilters": "Effacer les Filtres",
    "clocks.weeklySchedule": "Grille de Programmation Hebdomadaire",
    "clocks.weeklyTotals": "Totaux Hebdomadaires",
    "clocks.programDetails": "Détails du Programme",
    "clocks.title": "Titre",
    "clocks.language": "Langue",
    "clocks.day": "Jour",
    "clocks.time": "Heure",
    "clocks.hourlyBreakdown": "Répartition Horaire",
    "clocks.addToCalendar": "Ajouter au Calendrier",
    "clocks.copyLink": "Copier le Lien",
    "clocks.addToCalendarSoon": "Fonction Ajouter au Calendrier bientôt disponible!",
    "clocks.linkCopied": "Lien copié dans le presse-papiers!",
    "clocks.loadingSchedule": "Chargement de la grille de programmation...",
    "clocks.totalHours": "Total des Heures",
    "clocks.hoursAbbrev": "h",
    "clocks.ofWeek": "de la semaine",
    "clocks.target": "Objectif",
    "clocks.fromTarget": "de l'objectif",
    
    // Days of week for clocks
    "clocks.mon": "Lun",
    "clocks.tue": "Mar",
    "clocks.wed": "Mer",
    "clocks.thu": "Jeu",
    "clocks.fri": "Ven",
    "clocks.sat": "Sam",
    "clocks.sun": "Dim",
    
    // Languages for clocks
    "clocks.kissi": "Kissi",
    "clocks.english": "Anglais",
    "clocks.french": "Français",
    "clocks.evangelistic": "Évangélique"
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