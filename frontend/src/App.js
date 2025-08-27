import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ListenLive from "./pages/ListenLive";
import Programs from "./pages/Programs";
import Impact from "./pages/Impact";
import News from "./pages/News";
import Donate from "./pages/Donate";
import About from "./pages/About";
import Contact from "./pages/Contact";
import GetInvolved from "./pages/GetInvolved";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);

  const languages = {
    en: 'English',
    fr: 'Français',
    kr: 'Krio',
    ki: 'Kissi'
  };

  return (
    <div className="App min-h-screen bg-white">
      <Router>
        <Header 
          currentLanguage={currentLanguage}
          setCurrentLanguage={setCurrentLanguage}
          languages={languages}
          setIsPlayerVisible={setIsPlayerVisible}
        />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listen-live" element={<ListenLive />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/news" element={<News />} />
            <Route path="/get-involved" element={<GetInvolved />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <Footer />

        {/* Global Audio Player */}
        {isPlayerVisible && (
          <div className="fixed bottom-0 left-0 right-0 bg-kioo-primary text-white p-4 shadow-lg z-50">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-kioo-secondary rounded-full w-3 h-3 animate-pulse"></div>
                <span className="text-sm">🔴 LIVE: Good Morning Kioo</span>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-white hover:text-green-200 transition-colors">
                  🔊
                </button>
                <button 
                  onClick={() => setIsPlayerVisible(false)}
                  className="text-white hover:text-green-200 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}
      </Router>
    </div>
  );
}

export default App;