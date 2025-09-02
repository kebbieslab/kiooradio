import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ListenLive from "./pages/ListenLive";
import Programs from "./pages/Programs";
import Impact from "./pages/Impact";
import Donate from "./pages/Donate";
import MajorGiftsPage from "./pages/MajorGiftsPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProgramsLineup from "./pages/ProgramsLineup";
import ChurchPartners from "./pages/ChurchPartners";
import MediaGallery from "./pages/MediaGallery";
import PresentersDashboard from "./pages/PresentersDashboard";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const STREAM_URL = process.env.REACT_APP_STREAM_URL || "https://radio.galcom.org/?station=VOXRadio";

function App() {
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);

  useEffect(() => {
    // Initialize i18n system
    window.I18N = {
      en: {
        heroTitle: "Reaching Hearts across the Makona River Region",
        heroSub: "Our signal covers over 150 miles, bringing Faith and Hope to the Kissi, Mandingo, Fulani, Gbandi and more.",
        navHome: "Home", navListen: "Listen", navPrograms: "Programs",
        navChurchPartners: "Partner Churches", navImpact: "Impact", navDonate: "Donate", navAbout: "About",
        listen: "Listen Live", programs: "Programs", donate: "Donate",
        donateBlurb: "Your donation helps us continue broadcasting Hope, Faith, and give vital information across the Makona River Region. Every contribution makes a difference in someone's life.",
        impactTitle: "Our Coverage at a Glance",
        contact: "Contact Us",
        partnersTitle: "Our Partners"
      },
      fr: {
        heroTitle: "Toucher les cœurs dans la région de la rivière Makona",
        heroSub: "Notre signal couvre plus de 150 miles, apportant la Foi et l'Espérance aux Kissi, Mandingo, Peuls, Gbandi, et d'autres.",
        navHome: "Accueil", navListen: "Écouter", navPrograms: "Programmes",
        navChurchPartners: "Églises Partenaires", navImpact: "Impact", navDonate: "Don", navAbout: "À propos", 
        listen: "Écouter en direct", programs: "Programmes", donate: "Faire un don",
        donateBlurb: "Votre don nous aide à continuer de diffuser la Foi, l'Espérance et des informations essentielles dans la région de la rivière Makona. Chaque contribution change une vie.",
        impactTitle: "Notre Couverture en un Coup d'Œil",
        contact: "Nous Contacter",
        partnersTitle: "Nos partenaires"
      }
    };

    let currentLang = 'en';

    function pickLang() {
      const saved = localStorage.getItem('lang');
      if (saved) return saved;
      const nav = (navigator.language || 'en').toLowerCase();
      const browserDefault = nav.startsWith('fr') ? 'fr' : 'en';
      return browserDefault;
    }

    function applyI18n() {
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const value = window.I18N[currentLang]?.[key];
        if (value) el.textContent = value;
      });
    }

    function setLang(lang) {
      currentLang = lang;
      localStorage.setItem('lang', lang);
      applyI18n();
    }

    async function initLang() {
      currentLang = pickLang();
      applyI18n();
    }

    // Make functions global for header component
    window.setLang = setLang;
    window.applyI18n = applyI18n;

    initLang();
  }, []);

  return (
    <HelmetProvider>
      <div className="App min-h-screen bg-white">
        <Router>
        <Header setIsPlayerVisible={setIsPlayerVisible} />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listen-live" element={<ListenLive />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/donate/major-gifts" element={<MajorGiftsPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/programs-lineup" element={<ProgramsLineup />} />
            <Route path="/church-partners" element={<ChurchPartners />} />
            <Route path="/media" element={<MediaGallery />} />
            <Route path="/kioo-presenters-dashboard-1981" element={<PresentersDashboard />} />
          </Routes>
        </main>

        <Footer />

        {/* Global Audio Player */}
        {isPlayerVisible && (
          <div className="fixed bottom-0 left-0 right-0 bg-kioo-primary text-white p-4 shadow-lg z-50">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-kioo-secondary rounded-full w-3 h-3 animate-pulse"></div>
                <span className="text-sm">🔴 LIVE: Kioo Radio 98.1 FM</span>
              </div>
              <div className="flex items-center space-x-4">
                <audio controls autoPlay className="h-8">
                  <source src={STREAM_URL} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                <button 
                  onClick={() => setIsPlayerVisible(false)}
                  className="text-white hover:text-green-200 transition-colors ml-2"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}
      </Router>
      </div>
    </HelmetProvider>
  );
}

export default App;