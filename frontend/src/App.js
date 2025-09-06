import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import ReactGA from 'react-ga4';
import "./App.css";
import { initI18n } from "./utils/i18n";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ContactPopup from "./components/ContactPopup";
import useVisitorTracking from "./hooks/useVisitorTracking";
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
import Volunteer from "./pages/Volunteer";
import Visitors from "./pages/Visitors";
import Donations from "./pages/Donations";
import CRM from "./pages/CRM";
import Dashboard from "./pages/Dashboard";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const STREAM_URL = process.env.REACT_APP_STREAM_URL || "https://radio.galcom.org/?station=VOXRadio";

function App() {
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);

  // Initialize Google Analytics
  useEffect(() => {
    // Initialize new i18n system
    initI18n();
    
    // Initialize Google Analytics
    const gaId = process.env.REACT_APP_GA4_MEASUREMENT_ID;
    if (gaId && gaId !== 'G-PLACEHOLDER123') {
      ReactGA.initialize(gaId);
      console.log('Google Analytics initialized with ID:', gaId);
    } else {
      console.log('Google Analytics not initialized - please set REACT_APP_GA4_MEASUREMENT_ID');
    }
    
    // Make contact popup function global
    window.openContactPopup = () => setIsContactPopupOpen(true);
  }, []);

  // Component for tracking page views with GA
  const GoogleAnalyticsTracker = () => {
    const location = useLocation();
    
    useEffect(() => {
      const gaId = process.env.REACT_APP_GA4_MEASUREMENT_ID;
      if (gaId && gaId !== 'G-PLACEHOLDER123') {
        ReactGA.send({ 
          hitType: 'pageview', 
          page: location.pathname + location.search 
        });
      }
    }, [location]);

    return null;
  };

  // Create a component to handle visitor tracking inside Router
  const VisitorTracker = () => {
    useVisitorTracking();
    return null;
  };

  return (
    <HelmetProvider>
      <div className="App min-h-screen bg-white">
        <Router>
        <GoogleAnalyticsTracker />
        <VisitorTracker />
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
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/visitors" element={<Visitors />} />
            <Route path="/crm" element={<CRM />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin-dashboard" element={<Dashboard />} />
            <Route path="/dashboard" element={<PresentersDashboard />} />
            <Route path="/kioo-presenters-dashboard-1981" element={<PresentersDashboard />} />
          </Routes>
        </main>

        <Footer />

        {/* Contact Popup */}
        <ContactPopup 
          isOpen={isContactPopupOpen} 
          onClose={() => setIsContactPopupOpen(false)} 
        />

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