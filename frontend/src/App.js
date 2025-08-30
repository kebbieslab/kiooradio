import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ListenLive from "./pages/ListenLive";
import Programs from "./pages/Programs";
import Impact from "./pages/Impact";
import Donate from "./pages/Donate";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProgramsLineup from "./pages/ProgramsLineup";
import ChurchPartners from "./pages/ChurchPartners";
import { TranslationProvider } from "./hooks/useTranslation";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);

  return (
    <TranslationProvider>
      <div className="App min-h-screen bg-white">
        <Router>
          <Header setIsPlayerVisible={setIsPlayerVisible} />
          
          <main className="flex-1">
            <Routes>
              {/* Default English routes */}
              <Route path="/" element={<Home />} />
              <Route path="/listen-live" element={<ListenLive />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/impact" element={<Impact />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/programs-lineup" element={<ProgramsLineup />} />
              <Route path="/church-partners" element={<ChurchPartners />} />
              
              {/* French localized routes */}
              <Route path="/fr" element={<Home />} />
              <Route path="/fr/listen-live" element={<ListenLive />} />
              <Route path="/fr/programs" element={<Programs />} />
              <Route path="/fr/impact" element={<Impact />} />
              <Route path="/fr/donate" element={<Donate />} />
              <Route path="/fr/about" element={<About />} />
              <Route path="/fr/contact" element={<Contact />} />
              <Route path="/fr/programs-lineup" element={<ProgramsLineup />} />
              <Route path="/fr/church-partners" element={<ChurchPartners />} />
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
                    <source src="https://radio.galcom.org/?station=VOXRadio" type="audio/mpeg" />
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
    </TranslationProvider>
  );
}

export default App;